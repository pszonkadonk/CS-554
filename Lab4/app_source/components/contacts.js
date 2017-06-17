const ContactListContainer = React.createClass({
    getInitialState() {
        return {
            contacts: [],
            newContact: {}
        };
    },

    loadContacts() {
        return $.get("/contacts");
    },

    addContact(id, first_name, last_name, email, gender, language, car,
                company, undergrad, graduate, phd, avatar) {
        return $.ajax({
            url: "/contacts",
            dataType: "json",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({
                contact: {
                    first_name,
                    last_name,
                    email,
                    gender,
                    language,
                    car,
                    company,
                    undergrad,
                    graduate,
                    phd,
                    avatar
                }
            })
        });
    },

    componentDidMount() {
        this.loadContacts().then(contactList => {
            this.setState({contacts: contactList});
        });
    },

    handleContactSubmission(newContact) {
        if(!newContact) {
            this.setState({error: "No comment provided"});
            return;
        }
        let contactList = this.state.contatcs;

        this.addContact(newContact).then(
            newContactObject => {
                this.setState({
                    contacts: this.state.contacts.push(newContact)
                });
            },
            error => {
                this.setState({error: JSON.stringify(error)});
            }
        );
    },

    render() {
        return (
            <div>
                {this.state.contacts.map((info) => {
                    return <ContactContainer contactInfo={info} />
                })}
            </div>
        );
    }





});