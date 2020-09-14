const express = require('express')
const request = require('request')

const router = express.Router()

router.get('/', function(req, res) {
    const logout = {
        uri: 'http://dofh.iptime.org:8000/api/logout/',
    }
    request.get(logout)
    console.log('logout')
    res.redirect('http://115.136.47.152/')
})

module.exports = router