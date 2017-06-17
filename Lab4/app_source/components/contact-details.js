const ContactDetails = ({ person }) => {
    return (
    <div>
        <h1>{person.first_name}</h1>
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Email: {person.email}</li>
            <li className="list-group-item">Gender: {person.gender}</li>
            <li className="list-group-item">Language: {person.language}</li>
            <li className="list-group-item">Car: {person.car}</li>
            <li className="list-group-item">Undergraduate: {person.undergrad}</li>
            <li className="list-group-item">Graduate: {person.graduate}</li>
            <li className="list-group-item">PHD: {person.phd}</li>
            <li className="list-group-item">Avatar: {person.avatar}</li>
        </ul>
    </div>
    )
}