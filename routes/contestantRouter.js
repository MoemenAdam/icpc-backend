const express = require('express');
const router = express.Router();
const contestantController = require('../controllers/contestantController.js');
const verifyAdmin = require('../middlewares/verifyAdminToken.js');

router.route('/')
        .get(verifyAdmin, contestantController.getAll)
        .post(verifyAdmin, contestantController.addContestant);

router.route('/pendings')
        .get(verifyAdmin, contestantController.getPendings);

router.route('/activated')
        .get(verifyAdmin, contestantController.getActivated);

router.route('/:id')
        .get(verifyAdmin, contestantController.getContestant)
        .put(verifyAdmin, contestantController.updateContestant)
        .delete(verifyAdmin, contestantController.deleteContestant);


router.route('/signup')
        .post(contestantController.signup);
router.route('/login')
        .post(contestantController.login);
        
module.exports = router;
