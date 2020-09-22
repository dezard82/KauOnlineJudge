const fs = require('fs')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()
const filelist = fs.readdirSync(__dirname + '/BE_test')

/*
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')

const js = require('../lib/KAUOnlineJudge.js')

const router = express.Router()

//서드 파티 미들웨어
router.use(bodyParser.urlencoded({ extended: false }))
//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'))

    js.show(
        res, 200, 'register', '로그인',
        fs.readFileSync(__dirname + `/../html/register.html`, 'utf-8'), 
        'register'
    )
 */

router.get('/', function(req, res) {    //회원가입 페이지
    router.build = {
        code: 200,
        body: fs.readFileSync(__dirname + `/../html/register.html`, 'utf-8'),
        title: 'register',
        message: 'register',
        user: router.build.user
    }

    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    myRouter.show(res, router.build)
})

router.post('/', function(req, res) {
    var post = req.body
    var username = post.username
    //임시 백엔드에 저장할 사용자 정보
    const user = {
        "username": username,
        "email": post.email,
        "password": post.password
    }

    //이미 회원정보가 존재한다면 회원가입 거부
    if (filelist.includes(`${username}.json`)) {
        console.error(`${username} already exists!`)
        res.redirect('back')
    } else {    //회원정보가 존재하지 않는다면
        //회원 정보를 임시 백엔드에 저장한 뒤
        fs.writeFileSync(
            __dirname + `/BE_test/${username}.json`, 
            JSON.stringify(user) ,'utf8'
        )
        //로그를 표시하고 로그인 페이지로 리다이렉트
        console.log(`${username} has registered!`)
        res.redirect('/login')
    }
})

module.exports = router