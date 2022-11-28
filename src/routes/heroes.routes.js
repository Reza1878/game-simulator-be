const router = require('express').Router();
const path = require('path');
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
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', heroController.findAll);
router.get('/:id', heroController.findById);
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
