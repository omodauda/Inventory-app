const axios = require('axios');

const initPayment = async(email, plan_code) => {
    try{
        const data =  await axios.post(
            'https://api.paystack.co/transaction/initialize', //url
            {//data
                email, 
                amount: "",
                plan: plan_code, 
                channels: ['card'],
                callback_url: 'http://localhost:3000/api/v1'
            }, 
            { //configs 
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}`,
                    'Content-Type': 'application/json'
                },
                port: 443
            }
        );
        const {authorization_url, reference} = data.data.data;
        return {authorization_url, reference};
    }catch(error){
        return error.message;
    }
};

module.exports = {initPayment};