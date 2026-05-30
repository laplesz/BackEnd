const express = require('express');
const {
    getEnterprises,
    addEnterprise,
    deleteEnterprise,
} = require('../controllers/enterprise.controller');

const router = express.Router();

router.get('/', getEnterprises);
router.post('/new', addEnterprise);
router.delete('/:id', deleteEnterprise);

module.exports = router;
