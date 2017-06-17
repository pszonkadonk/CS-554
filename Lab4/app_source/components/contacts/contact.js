const ContactContainer = ({ contactInfo }) => {
    return (
        <div>
            <div>
                {contactInfo.first_name} : {contactInfo.last_name}
            </div>
        </div>
    );
};