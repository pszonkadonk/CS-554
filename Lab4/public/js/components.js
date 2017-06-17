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

var ContactDetails = function ContactDetails(_ref) {
    var person = _ref.person;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            null,
            person.first_name
        ),
        React.createElement(
            "ul",
            { className: "list-group list-group-flush" },
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Email: ",
                person.email
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Gender: ",
                person.gender
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Language: ",
                person.language
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Car: ",
                person.car
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Undergraduate: ",
                person.undergrad
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Graduate: ",
                person.graduate
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "PHD: ",
                person.phd
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Avatar: ",
                person.avatar
            )
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
        var contactList = this.state.contatcs;

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
            this.state.contacts.map(function (info) {
                return React.createElement(ContactContainer, { contactInfo: info });
            })
        );
    }
});
// const ContactList = ({ contacts }) => {

//     return (
//         <div>
//             {contacts.map((info) => {
//                 return <ContactContainer contactInfo={info} />
//             })}
//         </div>

//     )

// }


// const ContactList = React.createClass({
//     getInitialState() {
//         return {
//             getContactDetail: false
//         }

//     getContactDetail()

//     }
// })
"use strict";
"use strict";

var ContactOverview = function ContactOverview(_ref) {
    var person = _ref.person;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            null,
            person.first_name
        ),
        React.createElement(
            "ul",
            { className: "list-group list-group-flush" },
            React.createElement(
                "li",
                { className: "list-group-item" },
                "First Name: ",
                person.first_name
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Last Name: ",
                person.last_name
            ),
            React.createElement(
                "li",
                { className: "list-group-item" },
                "Company: ",
                person.company
            )
        ),
        React.createElement(
            "button",
            { clasName: "btn btn-primary" },
            "More Info"
        )
    );
};
"use strict";

// const ContactContainer = ({ contactInfo } ) => {
//     return (
//         <div>
//             <div className="card">
//                 <ContactOverview person={contactInfo} />
//             </div>
//         </div>
//     );
// };

var ContactContainer = React.createClass({
    displayName: "ContactContainer",
    getInitialState: function getInitialState(props) {
        return {
            contact: this.props.contactInfo
        };
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "card" },
                React.createElement(ContactOverview, { person: this.state.contact })
            )
        );
    }
});
'use strict';

ReactDOM.render(React.createElement(AppComponent, null), document.getElementById('content'));