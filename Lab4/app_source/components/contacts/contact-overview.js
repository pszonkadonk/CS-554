const ContactOverview = ({ person }) => {
    return (
        <div>
            <h1>{person.first_name}</h1>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">First Name: {person.first_name}</li>
                    <li className="list-group-item">Last Name: {person.last_name}</li>
                    <li className="list-group-item">Company: {person.company}</li>
                </ul>
                <button className="btn btn-primary" onClick={this.props.getContactDetails}>More Info</button>
        </div>
    );
};