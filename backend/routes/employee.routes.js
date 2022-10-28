const Router = require('express')
const router = new Router()

const employeeController = require('../controllers/employee.controller')

router.post('/', employeeController.createEmployee)
router.get('/', employeeController.getEmployees)
router.get('/:id', employeeController.getEmployee)
router.put('/', employeeController.editEmployee)
router.delete('/:id', employeeController.deleteEmployee)

module.exports = router