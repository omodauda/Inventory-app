const axios = require('axios');

module.exports = {
    initPayment: async(email, plan_code) => {
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
    },
    verifyPayment: async(reference) => {
        try{
            const data = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    //configs
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}`
                    },
                    port: 443
                }
            );
            const {status, plan_object:{name: plan_name}} = data.data.data;
            
            return {status, paidAt, plan_name}
        }catch(error){
            return error.message;
        }
    }
};