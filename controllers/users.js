const User = require('../models/user');
const Photagram = require('../models/photagram');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Photagram!!');
            res.redirect('/photo');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/photo';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/photo');
}

module.exports.renderProfile = async (req, res) => {
    //get all photagram created by user
    const allPhoto = await Photagram.find({ author: req.user._id }).sort({ _id: -1 });
    const userInfo = await User.findById(req.user._id);
    res.render('users/profile', { allPhoto,userInfo });
}
// module.exports.renderFollower = async (req, res) => {
//     //get all followers of current user
//     const userInfo = await User.findById(req.user._id);
//
//     res.render('users/follower', { userInfo });
// }