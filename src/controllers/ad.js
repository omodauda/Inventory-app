const Ad = require('../models/ad');
const User = require('../models/user');
const Tablet = require('../models/items/tablets');
const Mobile_Phone = require('../models/items/mobile_phones');
const LaptopAndComputer = require('../models/items/laptop_and_computer');

const {
    initPayment,
    verifyPayment
} = require('../helpers/payment');


//helper
const cloudinary = require('../helpers/cloudinary');

//delete item images from cloudinary func
const cloudinaryDelete = async(cloudinary_ids) => {
    cloudinary_ids.map(id =>{
        const deleteImages = async() => {
            await cloudinary.uploader.destroy(id);
        }
        deleteImages();
    })
}

module.exports = {

    acceptAd: async(req, res) =>{
        const {id} = req.params;
        try{
            const ad = await Ad.findById(id);
            if(!ad){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: `item with id ${id} not found`
                });
            }

            const data = await Ad.findByIdAndUpdate(id, {status: "Active"}, {new: true});

            res
            .status(200)
            .json({
                status: "success",
                message: "Acceptance successful",
                data
            })
        }catch(error){
            res
            .status(400)
            .json({
                status: "fail",
                error: {
                    message: error.message
                }
            })
        }

    },
    declineAd: async(req, res) => {
        const {id} = req.params;
        try{
            const ad = await Ad.findById(id);
            if(!ad){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: `item with id ${id} not found`
                });
            }

            const data = await Ad.findByIdAndUpdate(id, {status: "Declined"}, {new: true});

            res
            .status(200)
            .json({
                status: "success",
                message: "Ad successfully declined",
                data
            })
        }catch(error){
            res
            .status(400)
            .json({
                status: "fail",
                error: {
                    message: error.message
                }
            })
        }
    },
    closeAd: async(req, res) => {
        const {id} = req.params;
        try{
            const ad = await Ad.findById(id);
            if(!ad){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: `item with id ${id} not found`
                });
            }
            const user = await User.findOne({userId: req.user.id});
            const adOwner = ad.user.toString();
        
            if(adOwner !== user.id){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: "You don't have permission to perform this action"
                });
            };

            const data = await Ad.findByIdAndUpdate(id, {status: "Closed"}, {new: true});

            res
            .status(200)
            .json({
                status: "success",
                message: "Ad successfully closed",
                data
            })
        }catch(error){
            res
            .status(400)
            .json({
                status: "fail",
                error: {
                    message: error.message
                }
            })
        }
    },
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
                .status(401)
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
            .status(200)
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
    },
    verifyAdPayment: async(req, res) => {
        const {id} = req.params;
        try{
            const ad = await Ad.findById(id);

            if(ad.promotion.isVerified === true){
                return res
                .status(200)
                .json({
                    status: "success",
                    message: "This ad has already been verified"
                })
            };

            const reference = ad.promotion.ref;
            if(!reference){
                return res
                .status(200)
                .json({
                    status: "success",
                    message: "You haven't initiated any payment to promote this ad"
                })
            }
            
            const response = await verifyPayment(reference);
            const {status, plan_name} = response;
            
            if(status === 'failed' || status === 'abandoned'){
                return res
                .status(200)
                .json({
                    status: 'success',
                    message: `payment status: ${status}`
                })
            };

            /* mongoose can only compare dates stored in ISO(date-time) format, this come in handy when we want to 
                run a script to end the promotion on ads on their respective dueDates.
                whereas, JS date object is in number of milliseconds since 1970 (e.g: 1606215439828)*smiles*
                To deal with this we get time in js date object and convert it to ISO(e.g: 2020-11-24T10:57:19.828Z)
                before saving in the mongoose doc.

                Date.now() gets time as js date object
                new Date(date in milliseconds) converts it to ISO format

                1day = 86400000 milliseconds
                i.e 7days = 86400000 * 7

            */
           //get current time
            const startDate = Date.now()
            //convert it to ISO format
            const startDateIso = new Date(startDate)
            //set due dates
            let dueDate;
            let dueDateIso;

            if(plan_name === 'Top-week'){
                dueDate = Date.now() + 86400000 * 7;
                dueDateIso = new Date(dueDate);
            }else if(plan_name === 'Top-month'){
                dueDate = Date.now() + 86400000 * 30;
                dueDateIso = new Date(dueDate);
            }else if(plan_name === "Boost-premium"){
                dueDate = Date.now() + 86400000 * 30;
                dueDateIso = new Date(dueDate);
            };

            await Ad.findByIdAndUpdate(
                id, 
                {
                    'promotion.status': true,
                    'promotion.type': plan_name,
                    'promotion.isVerified': true,
                    'promotion.startDate': startDateIso,
                    'promotion.dueDate': dueDateIso
                }
            );

            res
            .status(200)
            .json({
                status: 'success',
                message: 'Payment verification was successful'
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
    },
    deleteAd: async(req, res) => {
        const {id} = req.params;
        try{
            const ad = await Ad.findById(id).populate('product');
            if(!ad){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: `No ad with id ${id} found`
                });
            };
            const user = await User.findOne({userId: req.user.id});
            const adOwner = ad.user.toString();
        
            if(adOwner !== user.id){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: "You don't have permission to perform this action"
                });
            };
            const adModel = ad.onModel;
            const productId = ad.product.id;
            
            switch(adModel){
                case 'Mobile_Phone':{
                    const phone = await Mobile_Phone.findById(productId);
                    //get item images cloudinary public_ids
                    const {itemImages:{cloudinary_ids}} = phone;
                    //delete item images on cloudinary
                    await cloudinaryDelete(cloudinary_ids);
                    //delete item
                    await Mobile_Phone.findByIdAndDelete(productId);
                    //delete ad
                    await Ad.findByIdAndDelete(id)
                    res
                    .status(200)
                    .json({
                        status: "success",
                        message: "Mobile phone ad successfully deleted"
                    });
                    break
                }
                case 'LaptopAndComputer':{
                    const item = await LaptopAndComputer.findById(productId);

                    const {itemImages: {cloudinary_ids}} = item;

                    await cloudinaryDelete(cloudinary_ids);

                    await LaptopAndComputer.findByIdAndDelete(productId);

                    await Ad.findByIdAndDelete(id)
                    res
                    .status(200)
                    .json({
                        status: "success",
                        message: "Mobile phone ad successfully deleted"
                    });
                    break
                }
                case 'Tablet':{
                    //get the item in its model
                    const tablet = await Tablet.findById(productId);
                    //get the item images cloudinary public_ids
                    const {itemImages:{cloudinary_ids}} = tablet;
                   //delete each item images on cloudinary
                    await cloudinaryDelete(cloudinary_ids);
                    //delete item
                    await Tablet.findByIdAndDelete(productId);
                    //delete ad
                    await Ad.findByIdAndDelete(id);
                    res
                    .status(200)
                    .json({
                        status: "success",
                        message: "Tablet ad successfully deleted"
                    });
                    break
                }
                default:{
                    return
                }
            }
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
    },
    checkPromotions: async(req, res) => {
        const currentTime = Date.now();
        const currentTimeIso = new Date(currentTime);
        
        try{
            const ads = await Ad.find({"promotion.dueDate": {$lte: currentTimeIso}});
            if(ads.length !== 0){
                ads.map(ad => {
                    const id = ad.id;
                   const expire = async() => {
                    await Ad.findByIdAndUpdate(
                        id, 
                        {
                            'promotion.status': false,
                            'promotion.type': undefined,
                            'promotion.isVerified': false
                        }, 
                        {new: true})
                   }
                   expire();
                })
                return res
                .status(200)
                .json({
                    status: "success",
                    message: `promotion on ${ads.length}ads has expired now`,
                })
            }else{
                res
                .status(200)
                .json({
                    status: "success",
                    message: "No ads with current time as due date "
                })
            }
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