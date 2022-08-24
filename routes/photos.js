const express = require('express');
const router = express.Router();
const photagram = require('../controllers/photos');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePhotagram } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Photagram = require('../models/photagram');

router.route('/')
    .get(catchAsync(photagram.index))
    .post(isLoggedIn, upload.array('image'), validatePhotagram, catchAsync(photagram.createPhotagram))


router.get('/new', isLoggedIn, photagram.renderNewForm)



router.route('/:id')
    .get(catchAsync(photagram.showPhotagram))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePhotagram, catchAsync(photagram.updatePhotagram))
    .delete(isLoggedIn, isAuthor, catchAsync(photagram.deletePhotagram));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(photagram.renderEditForm))

router.get('/:id/like', isLoggedIn, photagram.addLike)


module.exports = router;