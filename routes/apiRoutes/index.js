const router = require('express').Router();
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');

router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);

module.exports = router;
