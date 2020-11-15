module.exports = {
    Success: (res, data ) => {
       return ( 
            res
            .status(200)
            .json({
                status: "success",
                count: data.length,
                data
            })
        )
    },
    Error: (res, err) => {
        return (
            res
            .status(400)
            .json({
                error: {
                    message: err.message
                }
            })
        )
    },
    Message: (res, message) => {
        return (
            res
            .status(400)
            .json({
                status: 'success',
                message
            })
        )
    }
}