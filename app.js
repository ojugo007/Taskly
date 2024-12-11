const express = require("express");
require("dotenv").config()
const session = require("express-session")
const passport = require("passport")
const passportLocal = require("passport-local").Strategy
const User = require("./models/users")
const Task = require("./models/tasks")
const taskRoute = require("./routes/tasks")
const connectEnsureLogin = require("connect-ensure-login")
const path = require("path")
const PORT = process.env.PORT;
// const methodOverride = require('method-override');


const app = express()
require("./db").connectToMongoDB()
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
// app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookies: {maxAge: 60 * 60 * 1000}
}));

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser((user, done)=>{
    done(null, user.id)
})
passport.deserializeUser(async(id, done)=>{
    const user = await User.findById(id)
    done(null, user)
})

app.set('views', path.join(__dirname, 'views'));  
app.set("view engine", "ejs")

//Middleware to Make req.user globally available in EJS views
app.use((req, res, next) => {
    res.locals.user = req.user;  
    next();
});


app.get("/", (req, res)=>{
    res.render("index")
})

app.get("/login", (req, res)=>{
    res.render("login")
})

app.get("/signup", (req, res)=>{
    res.render("signup")
})



app.use("/task", connectEnsureLogin.ensureLoggedIn("/login"), taskRoute)


app.post("/signup" , (req, res)=>{
    const {username ,email ,password} = req.body
    if(!username || !email || !password){
        res.status(400).json({message:"all fields are required"})
    }

    const newUser = new User({
        username,
        email
    })
    console.log(req.user)

    User.register(newUser , password, (err, user)=>{
        if(err){
            console.log(err)
            res.status(400).send(err)
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect("/task")
            })
        }
    
    })

})

// login function
app.post("/login", passport.authenticate('local',
{
    successRedirect:"/task",
    failureRedirect: "/login"
 }), 
 (req, res)=>{
    res.redirect("/task")
})

app.post("/logout", (req, res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err)
            res.status(500).json({message:"unable to logout of account", error: err.message || err})
        }else{
            res.status(200).redirect("/")
        }
    })
})


// error handler
app.use((err, req, res, next)=>{
    console.log(err)
    res.status(500).json({
        message:err.message
    })
})

app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})

