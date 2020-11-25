const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
      return (req, res, next) => {
        const result = schema.validate(req.body);
        if (result.error) {
          //if result contains an error message property
          const errorMessage = result.error.details[0].message;
          return res
          .status(400)
          .json({
            status: 'fail',
            error: {
              message: errorMessage
            }
          });
        }
  
        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;
        next();
      }
    },
  
    schemas: {
      //registration
      userSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string(),

      }),
      //login
      loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      }),
      //verify user
      verifySchema: Joi.object().keys({
        email: Joi.string().email().required(),
        confirmToken: Joi.string().required()
      }),
      
      updateUserSchema: Joi.object().keys({
        phone: Joi.string(),
        location: Joi.string(),
        firstName: Joi.string(),
        lastName: Joi.string()
      }),

      createMobileSchema: Joi.object().keys({
        brand: Joi.string().required(),
        model: Joi.string().required(),
        location: Joi.string().required(),
        condition: Joi.string().required(),
        secondCondition: Joi.string(),
        ram: Joi.string().required(),
        rom: Joi.string().required(),
        screenSize: Joi.string().required(),
        colour: Joi.string().required(),
        os: Joi.string().required(),
        battery: Joi.number().required(),
        price: Joi.string().required(),
        description: Joi.string().required()
      }),

      editMobileSchema: Joi.object().keys({
        brand: Joi.string(),
        model: Joi.string(),
        location: Joi.string(),
        condition: Joi.string(),
        secondCondition: Joi.string(),
        ram: Joi.string(),
        rom: Joi.string(),
        screenSize: Joi.string(),
        colour: Joi.string(),
        os: Joi.string(),
        battery: Joi.number(),
        price: Joi.string(),
        description: Joi.string()
      }),

      createLaptop: Joi.object().keys({
        type: Joi.string().required(), 
        brand: Joi.string().required(), 
        model: Joi.string().required(), 
        location: Joi.string().required(), 
        condition: Joi.string().required(), 
        price: Joi.string().required(), 
        processor: Joi.string().required(), 
        numberOfCores: Joi.string().required(), 
        ram: Joi.string().required(), 
        storageCapacity: Joi.string().required(),
        storageType: Joi.string().required(), 
        graphicCard: Joi.string().required(), 
        graphicCardMemory: Joi.string().required(), 
        os: Joi.string().required(), 
        description: Joi.string().required()
      }),

      editLaptop: Joi.object().keys({
        type: Joi.string(), 
        brand: Joi.string(), 
        model: Joi.string(), 
        location: Joi.string(), 
        condition: Joi.string(), 
        price: Joi.string(), 
        processor: Joi.string(), 
        numberOfCores: Joi.string(), 
        ram: Joi.string(), 
        storageCapacity: Joi.string(),
        storageType: Joi.string(), 
        graphicCard: Joi.string(), 
        graphicCardMemory: Joi.string(), 
        os: Joi.string(), 
        description: Joi.string()
      }),

      promoteAdSchema: Joi.object().keys({
        plan_code: Joi.string().required()
      })
    }
}