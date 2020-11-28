const accessControl = (...allowedRoles) => {
    return (req, res, next) => {
        // console.log(req.user.role)
        if(!allowedRoles.includes(req.user.role)){
            return(
                res
                .status(401)
                .json({
                    status: 'fail',
                    error: 'You are not permitted to perform this action'
                })
            );
        }
        next();
    }

}

module.exports = accessControl;