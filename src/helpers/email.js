const axios = require('axios');

const sendMail = async (recipient, subject, text) => {
   try{
        axios.post('https://omodauda-email-dispatcher.herokuapp.com/api/v1/sendmail', {
            recipient, 
            subject, 
            text
            }
        )
   }
   catch(error){
       new Error("unable to send confirmation token")
   }
};

module.exports = sendMail;