"use strict";

var AppComponent = function AppComponent() {
  return React.createElement(
    "div",
    { className: "row" },
    React.createElement(
      "div",
      { className: "col-sm-8" },
      React.createElement(ContactListContainer, null)
    )
  );
};
"use strict";

var ContactListContainer = React.createClass({
    displayName: "ContactListContainer",
    getInitialState: function getInitialState() {
        return {
            contacts: [],
            newContact: {}
        };
    },
    loadContacts: function loadContacts() {
        return $.get("/contacts");
    },
    addContact: function addContact(id, first_name, last_name, email, gender, language, car, company, undergrad, graduate, phd, avatar) {
        return $.ajax({
            url: "/contacts",
            dataType: "json",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                contact: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    gender: gender,
                    language: language,
                    car: car,
                    company: company,
                    undergrad: undergrad,
                    graduate: graduate,
                    phd: phd,
                    avatar: avatar
                }
            })
        });
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        this.loadContacts().then(function (contactList) {
            _this.setState({ contacts: contactList });
        });
    },
    handleContactSubmission: function handleContactSubmission(newContact) {
        var _this2 = this;

        if (!newContact) {
            this.setState({ error: "No comment provided" });
            return;
        }
        var contactList = this.state.contats;

        this.addContact(newContact).then(function (newContactObject) {
            _this2.setState({
                contacts: _this2.state.contacts.push(newContact)
            });
        }, function (error) {
            _this2.setState({ error: JSON.stringify(error) });
        });
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(ContactList, { contacts: this.state.contacts })
        );
    }
});
"use strict";

// const ContactList = ({ contacts }) => {
//     return (
//         <ul className="list-unstyled">
//             {contacts.map(contactData => 
//                 <li>[{contactData.first_name}] : {contactData.last_name}</li>
//             )}
//         </ul>
//     );
// };

var ContactList = function ContactList(_ref) {
    var contacts = _ref.contacts;


    return React.createElement(
        "div",
        null,
        contacts.map(function (info) {
            return React.createElement(ContactContainer, { contactInfo: info });
        })
    );
};
"use strict";

var ContactContainer = function ContactContainer(_ref) {
    var contactInfo = _ref.contactInfo;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            contactInfo.first_name,
            " : ",
            contactInfo.last_name
        )
    );
};
'use strict';

ReactDOM.render(React.createElement(AppComponent, null), document.getElementById('content'));