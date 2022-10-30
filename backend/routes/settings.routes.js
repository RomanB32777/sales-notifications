const Router = require('express')
const router = new Router()

const settingsController = require('../controllers/settings.controller')

router.get('/', settingsController.getSettings)
router.put('/', settingsController.editSettings)

module.exports = router