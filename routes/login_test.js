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
router.use(express.static('lib'));
//로그인 기능을 위한 세션 관리
router.use(session({
    secret: 'KAUOnlineJudge',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}))
    js.show(
        res, 200, 'login', '로그인',
        fs.readFileSync(__dirname + `/../html/login.html`, 'utf-8'), 
        'login'
    )
 */

router.get('/', function(req, res) {    //로그인 페이지
    //로그인 이전 페이지를 redirect 쿠키에 저장
    if (router.cookie.parse(req.headers.cookie).redirect === undefined) 
        res.cookie('redirect', req.headers.referer)
        
    router.build = {
        code: 200,
        body: fs.readFileSync(__dirname + `/../html/login.html`, 'utf-8'),
        title: 'login',
        message: 'login',
        user: router.build.user
    }

    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시
    myRouter.show(res, router.build)
})

router.post('/', function(req, res) {
    //form에서 받아온 정보의 집합
    const post = req.body
    //아이디 혹은 이메일에서 사용자의 username에 해당하는 부분을 추출해 냄
    const username = post.username.split('@')[0]
    //request로 전송할 데이터 집합
    const user = {
        username: post.username,
        email: post.username,
        password: post.password
    }

    //username에 해당하는 유저 정보가 존재하지 않는다면
    if (!filelist.includes(`${username}.json`)) {
        console.error(`${username} doesn't exists!`)
        res.redirect('back')
    }

    //username의 유저 정보를 가져온다
    const user_BE = JSON.parse(fs.readFileSync(__dirname + `/BE_test/${username}.json`).toString())

    //입력받은 정보와 백엔드의 정보를 비교하여 로그인 가부를 판단
    if ((user.username == user_BE.username || user.email == user_BE.email) && user.password == user_BE.password) {
        //로그인에 성공한 경우 콘솔에 로그를 찍고
        console.log(`${username} logged in`)
        //세션에 username을 저장한 뒤
        req.session.username = username
        req.session.save(function () {
            //리다이렉트 할 경로가 있는 경우
            if (req.headers.cookie !== undefined) {
                //저장된 리다이렉트 경로를 삭제한 뒤 리다이렉트한다
                var redir = router.cookie.parse(req.headers.cookie).redirect
                res.clearCookie('redirect')
                res.redirect(redir)
            }
            //리다이렉트 할 경로가 없는 경우 메인페이지로 리다이렉트
            else res.redirect('/?id=login_success')
        })
    } else {    //로그인 실패
        console.error(`user name or email or password is invalid!`)
        res.redirect('back')
    }
})

module.exports = router