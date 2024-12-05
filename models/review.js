const mongoose = require("mongoose");
const { Schema, model: Model } = mongoose;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  //campground: { // for 'infinite amount of reviews'
  //type: Schema.Types.ObjectId,
  //ref: "Campground",
  //},
});

module.exports = Model("Review", reviewSchema);
