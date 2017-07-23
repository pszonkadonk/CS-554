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

        console.log(settings);
  
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
        
        console.log("Event Name");
        console.log(eventName);

        if (settings.expectsResponse) {
            let successEventName = `${eventName}:success:${messageId}`;
            let failedEventName = `${eventName}:failed:${messageId}`;

            console.log('Sucess Event name');
            console.log(successEventName);

            let success = redisConnection.on(successEventName, (response, channel) => {
                console.log("success got called");
                fulfill(response.data);
                endMessageLifeCycle();
            });

            let error = redisConnection.on(failedEventName, (response, channel) => {
                console.log("failure got called");
                reject(response.data);
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
