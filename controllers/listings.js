
const Listing = require("../models/listing"); 


module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({})
    res.render ("listings/index.ejs", {allListings});
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "review", 
            populate: { path: "author"}})
        .populate("owner");
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res, next) => {
    try {
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
  
      if (req.file) {
        newListing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      } else {
        // ✅ Set default image if no file was uploaded
        newListing.image = {
          url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
          filename: "default_image",
        };
      }
  
      await newListing.save();
      req.flash("success", "New listing created!");
      res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
      console.log("Error creating listing:", err.message);
      next(err);
    }
  };
  



module.exports.renderEditForm = async (req, res ) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
 
    let originalImageUrl = listing.image.url; 
        originalImageUrl= originalImageUrl.replace("upload", "/upload/w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path; 
        let filename = req.file.filename;  
        listing.image = { url, filename }; 
        await listing.save();    
    }
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};