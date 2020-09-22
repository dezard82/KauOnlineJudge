const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

router.get('/', function (req, res) {
    if (req.session.username === undefined) res.redirect('/login')
    else res.redirect('/logout')
    return true
})

module.exports = router