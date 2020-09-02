const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

//서드 파티 미들웨어
router.use(bodyParser.urlencoded({ extended: false }))
//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'));

var code = 404, body = '404 Not Found!', title = 'KAU Online Judge'
var message = ''


router.get('/', function(req, res, next) {    //로그인 페이지
    code = 200;
    body = fs.readFileSync(__dirname + `/../html/register.html`, 'utf-8');
    title = 'register'
    message = 'register'
    
    next()
})

router.post('/login', function(req, res) {
    var post = req.body

    const register = {
        uri: 'http://dofh.iptime.org:8000/api/register/',
        method: 'POST',
        form: {
            username: post.username,
            email: post.email,
            password: post.password,
            password_check: post.password_check
        }
    }
})

//각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
router.get('*', function (req, res) {
    //에러가 발생하지 않았다면 console에 log를, 발생했다면 error를 출력
    if (code == 200) console.log(message)
    else console.error(message)
    
    res.status(code).render('page', {
        title: title, 
        body: body
    });
})

module.exports = router