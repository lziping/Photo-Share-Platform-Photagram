const Photagram = require('../models/photagram');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const allPhoto = await Photagram.find({}).sort({ _id: -1 });
    res.render('photagram/index', { allPhoto })
}


module.exports.renderNewForm = (req, res) => {
    res.render('photagram/new');
}

module.exports.createPhotagram = async (req, res, next) => {

    const photagram = new Photagram(req.body.photagram);
    photagram.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    photagram.author = req.user._id;
    photagram.like = 0
    var nowDate = new Date();
    photagram.date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();

    await photagram.save();
    console.log(photagram);
    req.flash('success', 'Successfully Posted!');
    res.redirect(`/photo/${photagram._id}`)
}

module.exports.showPhotagram = async (req, res,) => {
    const photo = await Photagram.findById(req.params.id).populate({
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
    const photagram = await Photagram.findById(id)
    if (!photagram) {
        req.flash('error', 'Cannot find!');
        return res.redirect('/photo');
    }
    res.render('photagram/edit', { photagram });
}

module.exports.updatePhotagram = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const photagram = await Photagram.findByIdAndUpdate(id, { ...req.body.photagram });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    photagram.images.push(...imgs);
    await photagram.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await photagram.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated!');
    res.redirect(`/photo/${photagram._id}`)
}

module.exports.deletePhotagram = async (req, res) => {
    const { id } = req.params;
    await Photagram.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted')
    res.redirect('/photo');
}

module.exports.addLike = async (req, res) => {

    const { id } = req.params;
    const photagram = await Photagram.findById(id);
    photagram.like += 1;
    photagram.likeduser.push(req.user._id);
    await photagram.save();
    res.redirect(`/photo/${photagram._id}`)
}