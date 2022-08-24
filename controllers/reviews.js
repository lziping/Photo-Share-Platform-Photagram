const Photagram = require('../models/photagram');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const photagram = await Photagram.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    photagram.reviews.push(review);
    await review.save();
    await photagram.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/photo/${photagram._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Photagram.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/photo/${id}`);
}
