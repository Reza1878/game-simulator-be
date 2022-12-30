const router = require('express').Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const auth = require('../middleware/auth');
const heroController = require('../controllers/heroes.controller');
const Validator = require('../middleware/validator');
const {
  heroesPostSchema,
  heroesPutSchema,
} = require('../validators/heroes.validator');

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

router.get('/', auth(), heroController.findAll);
router.get('/:id', auth(), heroController.findById);
router.post(
  '/',
  auth(),
  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  Validator(heroesPostSchema),
  heroController.create,
);
router.put(
  '/:id',
  auth(),
  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  Validator(heroesPutSchema),
  heroController.update,
);
router.delete('/:id', auth(), heroController.delete);

module.exports = router;
