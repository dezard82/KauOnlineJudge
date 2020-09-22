const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

/*
const express = require('express')
const request = require('request')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const js = require('../lib/KAUOnlineJudge.js')

const router = express.Router()
*/

router.get('/', function(req, res) {
    req.session.destroy(function (err) {
        console.log('logout')
        res.redirect('/')
    })
})

module.exports = router