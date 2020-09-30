const request = require('request')

const myRouter = require('../lib/myRouter')
const router = myRouter.Router()

function logout_test (req, res) {
    req.session.destroy(function (err) {
        console.log('logout')
        res.redirect('back')
    })
}

function logout (req, res) {
    const logout = {
        uri: 'http://dofh.iptime.org:8000/api/logout/'//,
    }
    req.session.destroy(function (err) {
        request.get(logout)
        console.log('logout')
        res.redirect('back')
    })
}

router.get('/', logout_test)

module.exports = router