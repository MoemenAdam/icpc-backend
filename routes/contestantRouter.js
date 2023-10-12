const express = require('express');
const router = express.Router();
const contestantController = require('../controllers/contestantController.js');
const verifyAdmin = require('../middlewares/verifyAdminToken.js');
const asyncWrapper = require('../middlewares/asyncWrapper.js')
const verifyContestant = require('../middlewares/verifyContestantToken.js');
router.route('/')
        .get(verifyAdmin, asyncWrapper(contestantController.getAll))
        .post(verifyAdmin, asyncWrapper(contestantController.addContestant));

router.route('/pendings')
        .get(verifyAdmin, asyncWrapper(contestantController.getPendings));

router.route('/level/:level')
        .get(verifyAdmin, asyncWrapper(contestantController.getContestantsByLevel));

router.route('/accept/:id')
        .get(verifyAdmin, asyncWrapper(contestantController.acceptPending));
router.route('/lower/:id')
        .get(verifyAdmin, asyncWrapper(contestantController.lower));
router.route('/raise/:id')
        .get(verifyAdmin, asyncWrapper(contestantController.raise));
router.route('/activated')
        .get(verifyAdmin, asyncWrapper(contestantController.getActivated));


router.route('/:id')
        .get(verifyAdmin, asyncWrapper(contestantController.getContestant))
        .put(verifyAdmin, asyncWrapper(contestantController.updateContestant))
        .delete(verifyAdmin, asyncWrapper(contestantController.deleteContestant));


router.route('/signup')
        .post(asyncWrapper(contestantController.signup));
router.route('/login')
        .post(asyncWrapper(contestantController.login));
        
module.exports = router;
