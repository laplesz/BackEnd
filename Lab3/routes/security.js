const express = require('express');

const router = express.Router();
const controller = require('../controllers/security.controller');

router.get('/', controller.getSecurities);
router.post('/', controller.addSecurity);
router.delete('/:id', controller.deleteSecurity);

module.exports = router;
