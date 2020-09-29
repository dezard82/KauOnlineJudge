module.exports.Router = function() {
    const express = require('express')
    const session = require('express-session')
    const FileStore = require('session-file-store')(session)
    const bodyParser = require('body-parser')

    const router = express.Router()
    
    //lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
    router.use(express.static('lib'))
    //서드 파티 미들웨어
    router.use(bodyParser.urlencoded({ extended: false }))
    router.use(session({
        //secure: true,
        HttpOnly: true,
        secret: 'KAUOnlineJudge',
        resave: false,
        saveUninitialized: true,
        store: new FileStore()
    }))

    //페이지에서 사용할 쿠키
    router.cookie = require('cookie')
    //페이지를 만들 때 사용할 변수들
    router.build = {
        code: 404,
        body: '404 Not Found!',
        title: 'KAU Online Judge',
        message: '',
        user: '내 정보'
    }

    router.get('*', function (req, res, next) {
        //로그인 된 세션이 존재한다면 router에 표시
        if (req.session.username !== undefined) router.build.user = req.session.username
        next()
    })
    
    return router
}

module.exports.show = function (res, build) {
    var log = `${new Date()}: ${build.message}`
    //에러가 발생하지 않았다면 console에 log를, 발생했다면 error를 출력
    if (build.code < 400)   console.log(log)
    else                    console.error(log)

    res.status(build.code).render('page', {
        title: build.title,
        user: build.user,
        body: build.body
    })
}