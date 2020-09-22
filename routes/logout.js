const request = require('request')

const myRouter = require('../lib/myRouter')
const router = myRouter.Router()

/*
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const router = express.Router()
*/

router.get('/', function(req, res) {
    const logout = {
        uri: 'http://dofh.iptime.org:8000/api/logout/'//,
    }
    req.session.destroy(function (err) {
        request.get(logout)
        console.log('logout')
        res.redirect('/')
    })
})

module.exports = router