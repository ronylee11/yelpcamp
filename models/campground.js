const mongoose = require("mongoose");
const { Schema, model: Model } = mongoose;
const Review = require("./review");

//https://res.cloudinary.com/dylbylzma/image/upload/w_300/v1657004978/YelpCamp/wimsva7mgc0mnjlrj7sy.jpg

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema(
  {
    title: String,
    images: [imageSchema],
    geometry: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  //return "POP UP !!!";
  return `<strong><a href="/campgrounds/${
    this._id
  }" target="_blank">${this.title}</a></strong><p>${this.description.substring(0, 30)}...</p>`;
});

campgroundSchema.post("findOneAndDelete", async function (campground) {
  //console.log("DELETED REVIEWS!!!");
  if (campground) {
    await Review.remove({
      _id: { $in: campground.reviews },
    });
  }
});

module.exports = Model("Campground", campgroundSchema);
