const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const flash = require("connect-flash");
const seedDB = require("./seeds");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");

const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");
const campRoutes = require("./routes/campgrounds");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Campground project",
	resave: false,
	saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Campground.create(
// 	{name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350",
// 	description: "This is Mountain Goat's Rest Campground"}, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("New Campground");
// 		console.log(campground);
// 	}
// });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	if(req.user){
			var UserName = req.user.username.charAt(0).toUpperCase() + req.user.username.slice(1);
	res.locals.UserName = UserName;
		
	}
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
// var campgrounds = [
// 		{name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name: "Granite Hill", image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 		{name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"}
		
// 	]

app.use(indexRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
	console.log("YelpCamp server has started!!!");
});