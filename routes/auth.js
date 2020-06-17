const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/register', controller.postRegister);
router.post('/login', controller.postLogin);
router.post('/tokenIsValid', controller.tokenIsValid);
router.get('/',verifyToken ,controller.index);
module.exports = router;