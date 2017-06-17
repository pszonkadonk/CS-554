// const ContactContainer = ({ contactInfo } ) => {
//     return (
//         <div>
//             <div className="card">
//                 <ContactOverview person={contactInfo} />
//             </div>
//         </div>
//     );
// };

const ContactContainer = React.createClass({
    getInitialState(props) {
        return {
            contact: this.props.contactInfo,
            contactDetail: false
        }
    },

    getContactDetails() {
        alert("hello");
        // e.preventDefault();
        // if (this.state.contactDetail === false) {
        //     this.state.contactDetail = true;
        // } else if(this.state.contactDetail === true) {
        //     this.state.contactDetail = false;
        // }
    },
    
    render() {
        return (
            <div>
                <div className="card">
                    <ContactOverview person={this.state.contact} onClick={getContactDetails} />
                </div>
            </div>
            )
        }
});