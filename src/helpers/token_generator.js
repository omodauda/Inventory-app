const generate_token = async () => {

    // Generate a confirmation token, save it in the database
    const confirmToken = Math.floor(10000 + Math.random() * 9000);
    //set token expiration time to 10mins
    const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000);

    return {confirmToken, tokenExpiration};
};

module.exports = generate_token;