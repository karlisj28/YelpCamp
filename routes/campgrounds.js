const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const Middleware = require("../middleware");

router.get("/", function(req, res){
	
	Campground.find({}, function(err, allCampgrounds){
		if(err || !allCampgrounds){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
	
	// res.render("campgrounds", {campgrounds: campgrounds});
})

router.post("/", Middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: description, author: author};
	Campground.create(newCampground, function(err, newCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
	
});

//NEW ROUTE
router.get("/new", Middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
        } else {
			 // console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", Middleware.checkCampgroundOwnership, function(req, res){	
Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground})			
		});
});

//UPDATE CAMPGROUND ROUTE

router.put("/:id", Middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err || !updatedCampground){
			console.log(err);
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND

router.delete("/:id", Middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	})
});


module.exports = router;