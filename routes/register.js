const fs = require('fs')
const request = require('request')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

function register_post_test (req, res) {
    const filelist = fs.readdirSync(__dirname + '/BE_test/users')
    var post = req.body
    var username = post.username

    if (post.password != post.password_check) {
        //비밀번호와 비밀번호 확인이 일치하지 않는다면
        //경고창을 표시한 뒤 다시 회원가입 페이지로 이동
        req.flash('error', 'Password not matched!')
        console.log('password != password_check')
        
        req.session.save(() => {
            res.redirect('back')
        })
    
        return false
    } else if (post.agree != 'on') {
        //이용약관에 동의하지 않는다면
        //경고창을 표시한 뒤 다시 회원가입 페이지로 이동
        req.flash('error', 'Please Agree to the Terms of Use!')
        console.log('terms of use unchecked')
        
        req.session.save(() => {
            res.redirect('back')
        })
    
        return false
    }

    //임시 백엔드에 저장할 사용자 정보
    const user = {
        "username": username,
        "email": post.email,
        "password": post.password,
        "submit": {}
    }

    //이미 회원정보가 존재한다면 회원가입 거부
    if (filelist.includes(`${username}.json`)) {
        req.flash('error', `Username ${username} already exists!`)
        console.error(`${username} already exists`)
        
        req.session.save(() => {
            res.redirect('back')
        })
    
        return false
    } 
    
    //회원 정보를 임시 백엔드에 저장한 뒤
    fs.writeFileSync(
        __dirname + `/BE_test/users/${username}.json`, 
        JSON.stringify(user) ,'utf8'
    )
    //회원가입 메세지를 띄운 뒤 로그인 페이지로 리다이렉트
    req.flash('error', 'You have successfully registered!\nNow you can log in.')
    console.log(`${username} has registered!`)
    
    req.session.save(() => {
        res.redirect('/login')
    })
}

function register_post (req, res) {
    //form에서 받아온 정보의 집합
    var post = req.body

    if (post.password != post.password_check) {
        //비밀번호와 비밀번호 확인이 일치하지 않는다면
        //경고창을 표시한 뒤 다시 회원가입 페이지로 이동
        console.log('password != password_check')
        res.redirect('back')
    } else if (post.agree != 'on') {
        //이용약관에 동의하지 않는다면
        //경고창을 표시한 뒤 다시 회원가입 페이지로 이동
        console.log('terms of use unchecked')
        res.redirect('back')
    }

    //request로 전송할 데이터 집합
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

        //body는 json 형태의 파일이므로 이를 해석 가능하게끔 파싱
        body = JSON.parse(body)

        if (body.error) {   //백엔드에서 회원가입을 거부했다면
            //거부 사유가 담긴 body.data를 에러메세지로 띄운다
            req.flash('error', body.data)
            console.log(body.data)

            req.session.save(() => {
                res.redirect('back')
            })
        } 
        
        console.log(`${post.username} has registered!`)
        res.redirect('/login')
    })
}

router.get('/', (req, res) => {    //회원가입 페이지
    router.build = {
        code: 200,
        page: __dirname + '/../views/page/register',
        message: 'register',
        param: {
            title: 'Register',
            flash: req.flash()
        }
    }

    console.log(router.build.param.flash)

    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    router.show(req, res)
})

router.post('/', register_post_test)

module.exports = router
/* */