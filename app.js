process.removeAllListeners('warning');
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");

//const Mongo_
const dbUrl=process.env.ATLASDB_URL;

main()
  .then(()=>{
    console.log("connected to DB");
  })
  .catch((err)=>{
    console.error("err",err);
  })
  async function main() {
    await mongoose.connect(dbUrl);
  }

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const store =MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 1000,
    maxAge:7 * 24 * 60 * 1000,
    httpOnly:true,
  },
};

// app.get("/",(req,res)=>{
//   res.send("Hi im root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success =req.flash("success");
  res.locals.error =req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demo",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"delta-student1"
//   });
//  let registeredUser=await User.register(fakeUser,"helloWorld");
//  res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)
//this down code is new change for home page
app.get("/", (req, res) => {
  res.render("home");
});


// app.use((req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

app.all("*", (req, res, next) => {
  return next(new ExpressError(404, "Page Not Found!"));
});//it was crashing nodemon because express of new version has some bugs so i installed express@4.18.2

app.use((err,req,res,next)=>{
  let{statusCode=500,message="something is wromgg"}=err;
  res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message)
});

app.listen(3000,()=>{
    console.log("server is listening on port 3000")
})