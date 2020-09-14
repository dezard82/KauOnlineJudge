const express = require('express')
const request = require('request')
const js = require('../lib/KAUOnlineJudge.js')

const router = express.Router()

router.get('/', function(req, res) {
    console.log('logout')
    res.redirect('http://115.136.47.152/')
})

module.exports = router