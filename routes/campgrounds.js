const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campground = require("../controllers/campgrounds");
const multer = require("multer");
//const upload = multer({ dest: "uploads/" });
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// MVC // Models, Views, Controllers // Architectural Pattern

router
  .route("/")
  .get(catchAsync(campground.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campground.createCampground)
  );
//.post(upload.single("image"), (req, res) => {
//console.log(req.body, req.file);
//res.send("lol");
//});
//.post(upload.array("image"), (req, res) => {
//console.log(req.body, req.files);
//res.send("lol");
//});

router.get("/new", isLoggedIn, campground.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campground.showCampground))
  .patch(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campground.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campground.renderEditForm)
);

module.exports = router;
