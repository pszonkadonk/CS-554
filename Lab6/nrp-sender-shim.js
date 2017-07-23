const uuid = require("node-uuid");
const NRP = require("node-redis-pubsub");

const nrpConfig = {
    port: 6379,
    scope: 'queue'
};

const defaultRedisConnection = new NRP(nrpConfig);

const defaultMessageConfig = {    
    data: {},
    timeout: 1000,
    eventName: "send",
    redis: defaultRedisConnection,
    expectsResponse: true
};

const sendMessage = (messageConfig = defaultMessageConfig) => {
    return new Promise((fulfill, reject) => {
        let settings = Object.assign({}, defaultMessageConfig, messageConfig);
  
        let messageId = uuid.v4();
        let killswitchTimeoutId = undefined;
        let redisConnection = settings.redis;
        let eventName = settings.eventName;
        let method = settings.method;
        let outgoingEventName = '';

        if(method === 'GET') {
            outgoingEventName = `${eventName}:get:${messageId}`
        }
        else if(method === 'POST') {
            outgoingEventName = `${eventName}:post:${messageId}`
        }
        else if(method === 'PUT') {
            outgoingEventName = `${eventName}:put:${messageId}`
        }
        else if(method === 'DELETE') {
            outgoingEventName = `${eventName}:delete:${messageId}`
        }
        
        if (settings.expectsResponse) {
            let successEventName = `${eventName}:success:${messageId}`;
            let failedEventName = `${eventName}:failed:${messageId}`;

            let success = redisConnection.on(successEventName, (response, channel) => {
                if(response.data === undefined || response.data === null) {
                    fulfill("Not a valid request");
                }
                fulfill(response.data);
                endMessageLifeCycle();
            });

            let error = redisConnection.on(failedEventName, (response, channel) => {
                fulfill(response.data);
                endMessageLifeCycle();
            });

            let shutoffEvents = [success, error];

            let endMessageLifeCycle = () => {
                shutoffEvents.forEach(shutOff => {
                    shutOff();
                });
                clearTimeout(killswitchTimeoutId);
            };

            if (settings.timeout >= 0) {
                killswitchTimeoutId = setTimeout(() => {
                    reject(new Error("timed out"));
                    endMessageLifeCycle();
                }, settings.timeout);
            }
        }

        redisConnection.emit(outgoingEventName, {
            requestId: messageId,
            data: settings.data,
            eventName: settings.eventName
        });

        if (!settings.expectsResponse) {
            fulfill();
        }

    });
};

module.exports = {
    sendMessage
};
