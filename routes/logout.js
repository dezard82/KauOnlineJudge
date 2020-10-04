const request = require('request')

const myRouter = require('../lib/myRouter')
const router = myRouter.Router()

router.get('/', (req, res) => {
    console.log(req.headers.referer)

    if(req.user == undefined) res.redirect('/')

    console.log(`${new Date()} ${req.user.username}\nlogout`)

    request.get({
        uri: 'http://dofh.iptime.org:8000/api/logout/'//,
    })
    
    req.logout()
    req.session.save((err) => {
        res.redirect('back')
    })
})

module.exports = router