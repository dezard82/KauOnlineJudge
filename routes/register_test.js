const fs = require('fs')
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const js = require('../lib/KAUOnlineJudge.js')

const router = express.Router()

//서드 파티 미들웨어
router.use(bodyParser.urlencoded({ extended: false }))
//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'));

var code = 404, body = '404 Not Found!', title = 'KAU Online Judge'
var message = ''


router.get('/', function(req, res) {    //회원가입 페이지
    code = 200;
    body = fs.readFileSync(__dirname + `/../html/register.html`, 'utf-8');
    title = 'register'
    message = 'register'
    
    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    js.show(res, code, title, body, message)
})

router.post('/', function(req, res) {
    var post = req.body

    if (post.password != post.password_check) {
        console.error('password not match!')
        res.redirect('back')
    } else if (post.agree != 'on') {
        console.error('you didn\'t agree!')
        res.redirect('back')
    }

    
    var username = post.username
    var email = post.email
    var password = post.password
    var password_check = post.password_check
})

module.exports = router