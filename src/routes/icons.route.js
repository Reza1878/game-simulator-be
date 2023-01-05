const router = require('express').Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/is-admin');
const Validator = require('../middleware/validator');
const iconsController = require('../controllers/icons.controller');
const {
  iconsPostSchema,
  iconsPutSchema,
} = require('../validators/icons.validator');

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

router.get('/', auth(), iconsController.findAll);
router.get('/:id', auth(), iconsController.findById);
router.post(
  '/',
  auth(),
  isAdmin(),
  upload.single('image'),
  Validator(iconsPostSchema),
  iconsController.create,
);
router.put(
  '/:id',
  auth(),
  isAdmin(),
  upload.single('image'),
  Validator(iconsPutSchema),
  iconsController.update,
);
router.delete('/:id', auth(), isAdmin(), iconsController.delete);

module.exports = router;
