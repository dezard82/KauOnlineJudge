const fs = require('fs')
const cookie = require('cookie')
const express = require('express')
const request = require('request')
const session = require('express-session')
const bodyParser = require('body-parser')
const js = require('../lib/KAUOnlineJudge.js')

const router = express.Router()

//서드 파티 미들웨어
router.use(bodyParser.urlencoded({ extended: false }))
//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'));

var code = 404, body = '404 Not Found!', title = 'KAU Online Judge'
var message = ''


router.get('/', function(req, res) {    //로그인 페이지
    code = 200;
    body = fs.readFileSync(__dirname + `/../html/login.html`, 'utf-8');
    title = 'login'
    message = 'login'

    //로그인 이전 페이지를 redirect 쿠키에 저장
    res.cookie('redirect', req.headers.referer)
    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    js.show(res, code, title, body, message)
})

router.post('/', function(req, res) {
    //쿠키에 저장된 정보를 cookies 변수에 저장
    var cookies = {};
    if (req.headers.cookie !== undefined) cookies = cookie.parse(req.headers.cookie)

    var post = req.body
    //res.redirect(cookies.redirect)

    var username = post.username
    var email = post.email
    var password = post.password
})

module.exports = router