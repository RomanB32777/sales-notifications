const Router = require('express')
const router = new Router()

const transactionController = require('../controllers/transaction.controller')

router.post('/', transactionController.createTransaction)
router.get('/', transactionController.getTransactions)
router.get('/:id', transactionController.getTransaction)
router.put('/', transactionController.editTransaction)
router.delete('/:id', transactionController.deleteTransaction)

module.exports = router
