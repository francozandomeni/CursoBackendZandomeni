import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/Users.models.js";
import {createHash, validatePassword} from "../utils.js";
import GitHubStrategy from "passport-github2"
import { cartService, userService } from "../repository/index.js";
// import {CustomError} from "../services/customError.service.js"
// import {generateUserErrorInfo} from "../services/UserErrorInfo.js"
// import {EError} from "../enums/EError.js"

const LocalStrategy = local.Strategy;



const inicializePassport = () => {

    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"},
        async ( req, username, password, done ) => {


        const { first_name, last_name, email, age } = req.body;
        try {

            let user = await userModel.findOne({email:username});
            if(user){
                console.log('Usuario ya registrado');
                return done(null,false)
            }


            const newCart = await cartService.createCart({ products: [] });
            await newCart.save();

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart._id,
                role: "user",
            }
            const result = await userService.createUser(newUser);
            console.log(result)
            return done (null, result);

        } catch (error) {
            return done(error)
        }

    }));

    passport.use("login", new LocalStrategy(
    {usernameField:"email"},
    async (username, password, done)=>{
        try {
            const user = await userModel.findOne({email:username})
            if(!user){
                console.log("no existe el usuario")
                return done(null, false);
            }
            if(!validatePassword(password, user)){
                console.log("contrasena desconocida")
                return done(null, false);
            }
            return done(null,user)
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user,done)=>{
        try{
            // console.log(user)
            done(null, user._id)
            // console.log("serialize",user)

        } catch (error) {
            console.error(error)
            done(error)
        }
    });

    passport.deserializeUser(async (id,done)=>{
        let user = await userService.getUserById(id);
        done(null, user);
        // console.log("deserialize",user)
    });

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.e8ccfbc76ce39116",
        clientSecret:"a6f91eaa9f22b6a479f9680bbdb473b05e7b8dcc",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken,profile, done)=>{
        try {
            console.log(profile._json.name);
            const first_name = profile._json.name
            let email;
            if(!profile._json.email){
                email = profile.username;
            }

            let user = await userModel.findOne({email:profile._json.email});
            if(user){
                console.log('Usuario ya registrado');
                return done(null,false)

            }

            const newUser = {
                first_name,
                last_name: "",
                email,
                age: 18,
                password: ""
            }
            const result = await userService.createUser(newUser);
            return done (null, result);

        } catch (error) {
            return done(error)
        }

    }))

    


}




export default inicializePassport;