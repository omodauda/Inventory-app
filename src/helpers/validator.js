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
            data: {
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
      userSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string(),

      }),
      loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
    }
}