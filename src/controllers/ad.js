const Ad = require('../models/ad');
const User = require('../models/user');

const {initPayment} = require('../helpers/payment');

module.exports = {

    promoteAd: async(req, res)=>{
        //get ad id
        const {id} = req.params;
        const {plan_code} = req.body;
        try{
            //get user
            const user = await User.findOne({userId: req.user.id});
            const {email} = user;
            //get ad
            const ad = await Ad.findById(id);
            //verify ownership
            if(user.id != ad.user){
                return res
                .status(400)
                .json({
                    status: 'fail',
                    message: "You don't have permission to perform this action"
                })
            }
            //initialize payment
            const response = await initPayment(email, plan_code);
            // console.log(response)
            const {authorization_url, reference} = response;
            //save payment ref
            await Ad.findByIdAndUpdate(id, {"promotion.ref": reference});

            res
            .status(201)
            .json({
                status: 'success',
                message: "payment initialization successful",
                data:{
                    authorization_url
                }
            })
        }catch(error){
            res
            .status(500)
            .json({
                status: "fail",
                error: {
                    message: error
                }
            })
        }
    }
};