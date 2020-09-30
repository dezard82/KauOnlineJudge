const fs = require('fs')
const request = require('request')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

function register_post_test (req, res) {
    const filelist = fs.readdirSync(__dirname + '/BE_test/users')
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
            __dirname + `/BE_test/users/${username}.json`, 
            JSON.stringify(user) ,'utf8'
        )
        //로그를 표시하고 로그인 페이지로 리다이렉트
        console.log(`${username} has registered!`)
        res.redirect('/login')
    }
}

function register_post (req, res) {
    //form에서 받아온 정보의 집합
    var post = req.body

    if (post.password != post.password_check) {
        //비밀번호와 비밀번호 확인이 일치하지 않는다면
        //경고창을 표시한 뒤 다시 회원가입 페이지로 이동
        console.error('Password not matched!')
        res.redirect('back')
    } else if (post.agree != 'on') {
        //이용약관에 동의하지 않는다면
        //경고창을 표시한 뒤 다시 회원가입 페이지로 이동
        console.error('Please Agree to the Terms of Use!')
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

        if (body.error == null) {   //회원가입을 성공적으로 완료했다면
            //유저가 회원 가입을 완료했음을 알린 뒤 login으로 리다이렉트
            console.log(`${post.username} has registered!`)
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
}

router.get('/', function(req, res) {    //회원가입 페이지
    let user = router.build.param.user

    router.build = {
        code: 200,
        page: __dirname + '/../views/page/register',
        message: 'register',
        param: {
            title: 'Register',
            user: user
        }
    }

    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    router.show(res)
    //myRouter.show(res, router.build)
})

router.post('/', register_post_test)

module.exports = router