const Campground = require('../models/campground');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const allPhoto = await Campground.find({});
    res.render('photagram/index', { allPhoto })
}

module.exports.renderNewForm = (req, res) => {
    res.render('photagram/new');
}

module.exports.createCampground = async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    campground.like = 0
    var nowDate = new Date();
    campground.date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();

    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully Posted!');
    res.redirect(`/photo/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const photo = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!photo) {
        req.flash('error', 'Cannot find!');
        return res.redirect('/photo');
    }
    res.render('photagram/show', { photo });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const photagram = await Campground.findById(id)
    if (!photagram) {
        req.flash('error', 'Cannot find!');
        return res.redirect('/photo');
    }
    res.render('photagram/edit', { photagram });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated!');
    res.redirect(`/photo/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted')
    res.redirect('/photo');
}

module.exports.addLike = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);
    campground.like += 1;
    campground.likeduser.push(req.user._id);
    await campground.save();
    res.redirect(`/photo/${campground._id}`)
}