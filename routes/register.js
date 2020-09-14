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

    const register = {
        url: 'http://dofh.iptime.org:8000/api/register/',
        form: { 
            username: post.username,
            email: post.email,
            password: post.password,
            password_check: post.password_check
        }
    }

    request.post(register, function (err, serverRes, body) {
        if (err) { }    //회원가입 요청에 실패한 경우 

        fs.writeFileSync('./body.txt', body, 'utf8')

        body = JSON.parse(body)

        if (body.error == null) {   //회원가입을 성공적으로 완료했다면
            console.log('success!')
            console.log(`id: ${post.username}`)
            console.log(`email: ${post.email}`)
            console.log(`password: ${post.password}`)
            console.log(`password_check: ${post.password_check}`)

            res.redirect('/login')
        } else {                    //회원가입에 실패한 경우
            //Username already exists
            //Email already exists
            //username: 이 필드의 글자 수가 32 이하인지 확인하십시오.
            //password: 이 필드의 글자 수가  적어도 6 이상인지 확인하십시오.
            console.error(body.data)
            res.redirect('back')
        }
    })
})

module.exports = router