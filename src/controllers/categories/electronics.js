const Ad = require('../../models/ad');
const publicResponse = require('../../helpers/response');

module.exports = {
    getElectronics: async(req, res) => {
        try{
            const ads = await Ad.find(
                {category: "Electronics"}
            ).sort({"promotion.type": -1, createdAt: -1})
            .populate({path: 'product', select: '-itemImages.cloudinary_ids -_id -owner -__v'})
            .populate({path: 'user', select: '-_id -__v'});

            if(ads.length === 0){
                res
                .status(200)
                .json({
                    status: "success",
                    message: "No ads in Electronics"
                });
            }
            publicResponse.product(ads, req, res);
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
    }
}