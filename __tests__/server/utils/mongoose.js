const mongoose = require('mongoose');

module.exports = {

    connect: () => {
      return  mongoose.connect(
            'mongodb://localhost/inventory_test',
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }
        )
    },

    disconnect: () => {
       return mongoose.connection.close();
    }
};