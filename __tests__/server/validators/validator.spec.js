/* 
    @jest-environment node
*/

const {validateBody, schemas} = require('../../../src/helpers/validator');

class Response {

    status(status){
        this.status = status;
        return this
    }

    json(data){
        return data;
    }
};


describe('The validtor middleware', () => {

    describe('The userSchma validator', () => {
        
        it('should call the next function on successful validation', async() => {

            const req = {
                body: {
                    email: 'test@user.com',
                    password: 'password',
                    firstName: 'test',
                    lastName: 'test'
                }
            };

            const res = {};

            /* spy on the next function */
            const next = jest.fn();

            await validateBody(schemas.userSchema)(req, res,next);

            expect(next).toHaveBeenCalled();
        });

        it('should return a 400 if validation fails', async() =>{

            const req = {
                body: {
                    email: 'test@user.com',
                    password: 'password',
                    firstName: 'test',
                }
            };

            const res = new Response();

            const next = jest.fn();

            const statusSpy = jest.spyOn(res, 'status');

            const jsonSpy = jest.spyOn(res, 'json');

            await validateBody(schemas.userSchema)(req, res, next);

            expect(statusSpy).toHaveBeenCalledWith(400);

            expect(jsonSpy).toHaveBeenCalledWith({
                status: 'fail',
                error: {
                   "message": "\"lastName\" is required"
                }
            })
        })
    });

    describe('The login validator', () => {
        
        it('should call the next func on successful validation', async() =>{

            const req = {
                body:{
                    email: 'test@user.com',
                    password: 'password'
                }
            };

            const res = {};

            const next = jest.fn();

            await validateBody(schemas.loginSchema)(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return a 400 if validation fails', async () => {
            
            const req = {
                body:{
                    email: 'test@user.com'
                }
            };

            const res = new Response();

            const next = jest.fn();

            const statusSpy = jest.spyOn(res, 'status');

            const jsonSpy = jest.spyOn(res, 'json');

            await validateBody(schemas.loginSchema)(req, res, next);

            expect(statusSpy).toHaveBeenCalledWith(400);

            expect(jsonSpy).toHaveBeenCalledWith({
                status: 'fail',
                error: {
                    message: "\"password\" is required"
                }
            });
            
        });
    });
    
});