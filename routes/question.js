const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

router.use('/',             require('./question/list'))
router.use('/create',       require('./question/create'))
router.use('/submissions',  require('./question/submissions'))
router.use('/:id',          require('./question/question'))

module.exports = router