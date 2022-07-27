const router = require('express').Router();
const employeeRoutes = require('./employeeRoutes');

router.use('/employee', employeeRoutes);

module.exports = router;
