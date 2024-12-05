const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  //res.send("YOU MADE IT!!!");
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  //console.log(review);
  campground.reviews.push(review);
  //console.log(campground);
  await campground.save();
  await review.save();
  req.flash("success", "Created New Review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, review_id } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: review_id },
  });
  await Review.findByIdAndDelete(review_id);
  req.flash("success", "Successfully Deleted Campground!");
  res.redirect(`/campgrounds/${id}`);
};
