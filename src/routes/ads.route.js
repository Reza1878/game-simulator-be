const router = require('express').Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/is-admin');
const adsController = require('../controllers/ads.controller');
const Validator = require('../middleware/validator');
const { adsPostSchema, adsPutSchema } = require('../validators/ads.validator');

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

router.get('/', auth(), adsController.findAll);
router.get('/:id', auth(), adsController.findById);
router.post(
  '/',
  auth(),
  isAdmin(),
  Validator(adsPostSchema),
  upload.single('image'),
  adsController.create,
);
router.put(
  '/:id',
  auth(),
  isAdmin(),
  Validator(adsPutSchema),
  upload.single('image'),
  adsController.update,
);
router.delete('/:id', auth(), isAdmin(), adsController.delete);

module.exports = router;
