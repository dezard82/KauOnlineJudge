const request = require('request')

const myRouter = require('../lib/myRouter')
const router = myRouter.Router()

function logout_test (req, res) {
    console.log('logout')

    req.logout()
    req.user = undefined
    req.session.save((err) => {
        res.redirect('back')
    })
}

function logout (req, res) {
    console.log('logout')

    const logout = {
        uri: 'http://dofh.iptime.org:8000/api/logout/'//,
    }
    request.get(logout)
    req.logout()
    req.session.save((err) => {
        res.redirect('back')
    })
}

router.get('/', logout_test)

module.exports = router