require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',

    databaseUrl: {
        development: 
            process.env.DEV_DATABASE_URL ||
            'mongodb://localhost/inventory',
        production: 
            process.env.PRODUCTION_DATABASE_URL ||
            '',
        test:
            process.env.TEST_DATABASE_URL ||
            'mongodb://localhost/inventory_test'
    },

    jwtSecret: process.env.JWT_SECRET,
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production',
    test: process.env.NODE_ENV === 'test'
}