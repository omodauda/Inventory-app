const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-token').Strategy;
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
            const isMatch = await user.isValidPassword(password);
            //if password is invalid return error
            if(!isMatch){
                return done(new Error('Invalid password'), false);
            }
            //if password is valid, return user
            done(null, user)
        }
        catch(error){
           return done(error, false);
        }
    }
));

passport.use(
    "google",
    new GoogleStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret
    }, 
    async(accessToken, refreshToken, profile, done) => {
        try{
            //destructure user google profile
            const {id, email, verified_email, given_name: firstName, family_name: lastName} = profile._json;

            //check if user already exist. If yes, return the user
            const existingUser = await User.findOne({'google.id': profile.id});
            if(existingUser){
                return done(null, existingUser)
            }

            /*check if user is gmail verified. If yes, auto verify the user otherwise set status to not verified */
            const status = verified_email ? "Verified" : "Not verified";

            //create user object
            const user = new User({
                method: 'google',
                google: {
                    id,
                    email
                },
                status,
                firstName,
                lastName
            });
            //save user doc
            await user.save();
            //return saved user
            return done(null, user);
        }
        catch(error){
            return done(error, false);
        }
    })
)
