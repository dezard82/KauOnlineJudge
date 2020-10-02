const fs = require('fs')
const request = require('request')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },  login_post_test
))

function login_post_test (username, password, done) {
    //로그인 시 id값으로 email을 받았을 경우 이를 username으로 변환함
    username = username.split('@')[0]

    //임시 BE 폴더에 존재하는 사용자 데이터 집합
    const filelist = fs.readdirSync(__dirname + '/BE_test/users')
    //입력받은 사용자 정보가 fiellist에 존재하는 경우 사용자 정보, 없다면 undefined
    const user_BE = (filelist.includes(`${username}.json`)) ? 
        JSON.parse(fs.readFileSync(__dirname + `/BE_test/users/${username}.json`).toString())
      : undefined

    if (user_BE == undefined) {                 //사용자 정보를 찾지 못한 경우
        return done(null, false, { message: 'Incorrect username.' })
    } else if (password != user_BE.password){   //비밀번호가 일치하지 않는 경우
        return done(null, false, { message: 'Incorrect password.' })
    } 

    //위의 모든 경우를 통과하였다면 사용자를 정상적으로 로그인시킨다
    return done(null, user_BE)
}

function login_post (username, password, done) {
    //request로 전송할 데이터 집합
    const login = {
        uri: 'http://dofh.iptime.org:8000/api/login/',
        form: {
            username: username,
            email: username,
            password: password
        }
    }
    //아이디 혹은 이메일에서 사용자의 username에 해당하는 부분을 추출해 냄
    const username = post.username.split('@')[0]

    //request를 이용해 로그인 정보를 백엔드에 전송
    request.post(login, function (err, serverRes, body) {
        if (err) {                  //로그인 요청에 실패한 경우 
            console.error(err)
            return done(null, false, { message: 'unknown Error!' })
        }

        //body는 json 형태의 파일이므로 이를 해석 가능하게끔 파싱
        body = JSON.parse(body)

        if (body.error != null) {   //로그인에 실패한 경우
            //에러메세지를 표시한 뒤 이전 페이지로 이동해야 함
            console.error(body.data)
            return done(null, false, { message: 'username or password incorrect' })
        } 

        //로그인에 성공했으므로 콘솔에 로그를 찍고
        console.log(body.data)
        console.log(`${username} logged in`)
        
        //정상적으로 로그인을 실행
        return done(null, login.form)
    })
}

router.get('/', (req, res) => {    //로그인 페이지
    //이전 페이지가 로그인 혹은 회원가입이 아니었다면
    //로그인 직후 해당 페이지로 리다이렉트
    if (!['login', 'register'].includes(req.headers.referer.split('/')[3])) 
        router.redirect = req.headers.referer

    router.build = {
        code: 200,
        page: __dirname + '/../views/page/login',
        message: 'login',
        param: {
            title: 'Login',
            flash: req.flash()
        }
    }

    console.log(router.build.param.flash)

    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시
    router.show(req, res)
})

router.post('/',                        //passport로 로그인한 뒤 미리 지정한 경로로 리다이렉트
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {
        //세션을 저장하지 않으면 로그인 반영이 늦어짐
        req.session.save(() => {
            res.redirect((router.redirect != undefined) ? router.redirect : '/')
        })
    }
)

module.exports = router
/*
function login_post_test (req, res) {
    const filelist = fs.readdirSync(__dirname + '/BE_test/users')
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
    const user_BE = JSON.parse(fs.readFileSync(__dirname + `/BE_test/users/${username}.json`).toString())

    //입력받은 정보와 백엔드의 정보를 비교하여 로그인 가부를 판단
    if ((user.username == user_BE.username || user.email == user_BE.email) && user.password == user_BE.password) {
        //로그인에 성공한 경우 콘솔에 로그를 찍고
        console.log(`${username} logged in`)
        //세션에 username을 저장한 뒤
        req.session.username = username
        req.session.save(function () {
            if (req.headers.cookie !== undefined) { //쿠키가 생성이 되었다면
                //쿠키에 저장된 리다이렉트 경로를 가져온 뒤
                let redirect = cookie.parse(req.headers.cookie).redirect
                //쿠키에 리다이렉트 경로가 있다면 그곳으로, 없다면 메인으로 이동
                res.redirect((redirect != undefined) ? redirect : '/')
            } else res.redirect('/')                //쿠키가 없는 경우 메인으로 리다이렉트
        })
    } else {    //로그인 실패
        console.error(`user name or email or password is invalid!`)
        res.redirect('back')
    }
} 
function login_post (req, res) {
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

        //body는 json 형태의 파일이므로 이를 해석 가능하게끔 파싱
        body = JSON.parse(body)

        if (body.error == null) {   //로그인에 성공한 경우
            //콘솔에 로그를 찍고
            console.log(body.data)
            console.log(`${username} logged in`)
            
            req.session.username = username             //세션에 username을 저장한 뒤
            req.session.save(function () {              //세션을 저장하면서 리다이렉션을 시도
                if (req.headers.cookie !== undefined) { //쿠키가 생성이 되었다면
                    //쿠키에 저장된 리다이렉트 경로를 가져온 뒤
                    let redirect = cookie.parse(req.headers.cookie).redirect
                    //쿠키에 리다이렉트 경로가 있다면 그곳으로, 없다면 메인으로 이동
                    res.redirect((redirect == undefined) ? redirect : '/')
                } else res.redirect('/')                //쿠키가 없는 경우 메인으로 리다이렉트
            })
        } else {                    //로그인에 실패한 경우
            //에러메세지를 표시한 뒤 이전 페이지로 이동해야 함
            console.error(body.data)
            res.redirect('back')
        }
    })
} 
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