const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, 
    async (payload, done) => {
        //find user specified in the token
        try{
            const user = await User.findById(payload.sub);
            //if !user return
            if(!user){
                return done(null, false);
            }
            //if user, send user
            done(null, user)
        }
        catch(error){
            return done(new Error('Unauthorized to perform this action'), false)
        }
    })
);

//local strategy
passport.use( new LocalStrategy(
    {
        usernameField: 'email'
    }, 
    async(email, password, done) => {
        try{
            const user = await User.findOne({'local.email': email});

            if(!user){
                return done(new Error('Invalid email'), false);
            }

            //check if the password is correct
            const isMatch = user.isValidPassword(password);
            //if password is invalid return error
            if(!isMatch){
                return done(new Error('Invalid password'), false);
            }
            //if password is valid, return user
            done(null, user)
        }
        catch(error){
            done(error, false);
        }
    }
));
