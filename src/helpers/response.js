function product(data, req, res){
    userRole = req.user.role;
    const newData = data.filter(d => d.status ==="Active");
    if(userRole === 'user'){
        res
        .status(200)
        .json({
            status: "success",
            count: newData.length,
            data: newData
        })
    }else{
        res
        .status(200)
        .json({
            status: "success",
            count: data.length,
            data
        })
    }
};

function sellerPage(profile, ads, req, res){
    
    const publicData = ads.filter(d => d.status ==="Active");
    
    if(req.user.id == profile.userId){
       res
       .status(200)
       .json({
           status: 'success',
           data: {
               profile,
               adverts: ads
           }
       })
    } else{
        res
       .status(200)
       .json({
           status: 'success',
           data: {
               profile,
               adverts: publicData
           }
       })
    }
};

module.exports= {product, sellerPage};