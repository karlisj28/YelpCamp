const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//==================================================
//COMMENTS ROUTES
//==================================================
//New Route
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else {
			res.render("comments/new", {campground: campground});
		}
	})
});

//POST Route

router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err || !campground){
			console.log(err);
			res.redirect("/campgrounds");
		}else {
			Comment.create(req.body.comment, function(err, comment){
				if(err || !comment){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Succesfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	//Create new comments
	
	//Connect new comment to campground
	
	//Redirect campground to show page
	
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "No campground found");
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
		}
	})
	
	
});
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findOneAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err || !updatedComment){
			req.flash("error", err.message);
			res.redirect("back");
		} else{
			req.flash("success", "Comment sucessfully edited");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

// COMMENTS DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findOneAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment sucessfully removed");
			res.redirect("back");
		}
	})
});


module.exports = router;