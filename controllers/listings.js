const Listing = require("../models/listing.js");

//index router
module.exports.index = async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res) => {
    return res.render("listings/new.ejs");
};

//show route
module.exports.showListing = async (req, res)=>{
    let { id } = req.params; //populate review means now reviews are showing on page
    const listing = await Listing.findById(id)
       .populate({path: "reviews", populate: {path: "author"}})
       .populate("owner"); 
    if(!listing){ //create a falsh for error
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

//create route
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

//edit form
module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")

    res.render("listings/edit.ejs", { listing , originalImageUrl});
};

//update route
module.exports.updateListing = async (req, res)=> {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    //update a file while editing time
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//delete route
module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};