const router = require('express').Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const isAdmin = require('../middleware/is-admin');
const auth = require('../middleware/auth');
const { create, get } = require('../controllers/map.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../', '/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
      ? path.extname(file.originalname)
      : '.png';
    cb(
      null,
      `${Date.now()}${crypto
        .randomBytes(64)
        .toString('hex')
        .substring(0, 10)}${ext}`,
    );
  },
});

const upload = multer({ storage });

router.post(
  '/',
  auth(),
  isAdmin(),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  create,
);

router.get('/', get);

module.exports = router;
