const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


//suppose user want to add new listing and it is not login, then we will not allow
//to user to create  new list.  This req.isAuthenticated do this for us
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ 
        //store a orignal URL
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you must be logged in to create listing");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next ) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//this is for checking owner is equal to currUser or not for listing
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//this is for checking owner is equal to currUser or not for review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById( reviewId );
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not Author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// func for validation for schema
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body); //take a only error from req.body
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//review validation for server side
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body); //take a only error from req.body
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};