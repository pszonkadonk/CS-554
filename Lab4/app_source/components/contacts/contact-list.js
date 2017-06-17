// const ContactList = ({ contacts }) => {
//     return (
//         <ul className="list-unstyled">
//             {contacts.map(contactData => 
//                 <li>[{contactData.first_name}] : {contactData.last_name}</li>
//             )}
//         </ul>
//     );
// };

const ContactList = ({ contacts }) => {
    
    return (
        <div>
            {contacts.map((info) => {
                return <ContactContainer contactInfo={info} />
            })}
        </div>

    )

}

