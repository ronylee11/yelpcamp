const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/YelpCamp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  //const c = new Campground({ title: "Purple fields" });
  //await c.save();
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // YOUR USER ID
      author: "632e25ead9bb05d06de2c317",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      //image: "https://source.unsplash.com/collection/483251",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Consectetur tenetur deserunt dicta debitis quia? Cumque autem obcaecati praesentium.",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dylbylzma/image/upload/v1657004967/YelpCamp/f5t3vu9poj4jqmxcrjny.jpg",
          filename: "YelpCamp/arpyermwtvxecqo5u3jo",
        },
        {
          url: "https://res.cloudinary.com/dylbylzma/image/upload/v1657088159/YelpCamp/ipgqs46gczxewgehs4gg.jpg",
          filename: "YelpCamp/x9tohnve0orsiifhdemn",
        },
        {
          url: "https://res.cloudinary.com/dylbylzma/image/upload/v1657088166/YelpCamp/rksfhsvoc5sb3wgdezu8.jpg",
          filename: "YelpCamp/wimsva7mgc0mnjlrj7sy",
        },
      ],
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
