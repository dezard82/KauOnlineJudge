const fs = require('fs')
const request = require('request')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

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
    const login = {
        uri: 'http://dofh.iptime.org:8000/api/login/',
        form: {
            username: post.username,
            email: post.username,
            password: post.password
        }
    }

    //request를 이용해 로그인 정보를 백엔드에 전송
    request.post(login, function (err, serverRes, body) {
        if (err) { }    //로그인 요청에 실패한 경우 

        console.log(body)
        //body는 json 형태의 파일이므로 이를 해석 가능하게끔 파싱
        body = JSON.parse(body)

        if (body.error == null) {   //로그인에 성공한 경우
            //콘솔에 로그를 찍고
            console.log(`${username} logged in`)
            //세션에 username을 저장한 뒤
            req.session.username = username
            req.session.save(function () {
                if (req.headers.cookie !== undefined) {     //리다이렉트 할 경로가 있는 경우
                    //저장된 리다이렉트 경로를 삭제한 뒤 리다이렉트한다
                    var redir = router.cookie.parse(req.headers.cookie).redirect
                    res.clearCookie('redirect')
                    res.redirect(redir)
                } else res.redirect('/?id=login_success')   //리다이렉트 할 경로가 없는 경우 메인페이지로 리다이렉트
            })
        } else {                    //로그인에 실패한 경우
            //에러메세지를 표시한 뒤 이전 페이지로 이동해야 함
            console.error(body.data)
            res.redirect('back')
        }
    })
})

module.exports = router
/*
    //request를 이용해 로그인 정보를 백엔드에 전송
    request.post(login, function (err, serverRes, body) {
        if (err) { }    //로그인 요청에 실패한 경우 

        console.log(body)
        //body는 json 형태의 파일이므로 이를 해석 가능하게끔 파싱
        body = JSON.parse(body)

        if (body.error == null) {   //로그인을 성공적으로 완료했다면
            console.log(`${username} has logged in!`)

            //세션에 아이디를 기록함
            req.session.username = username
        
            //리다이렉트 할 경로가 있는 경우
            if (req.headers.cookie !== undefined) {
                //로그인 시 리다이렉트 경로를 삭제한 뒤 리다이렉트
                var redir = router.cookie.parse(req.headers.cookie).redirect
                res.clearCookie('redirect')
                res.redirect(redir)
            }
            //리다이렉트 할 경로가 없는 경우 메인페이지로 리다이렉트
            else res.redirect('/')
        } else {                    //로그인에 실패한 경우
            //에러메세지를 표시한 뒤 이전 페이지로 이동해야 함
            console.error(body.data)
            res.redirect('back')
        }
    }) 
*/