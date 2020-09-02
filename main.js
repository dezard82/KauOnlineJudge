const fs = require('fs')
const ejs = require('ejs')
const express = require('express')
const bodyParser = require('body-parser')
const js = require('./lib/KAUOnlineJudge.js')

const port = 3000
const app = express()

//서드 파티 미들웨어
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('lib'));

//ejs
app.set('view engine', 'ejs')
app.set('views', './views');

var code = 404, file = '404 Not Found!', title = 'KAU Online Judge';
var message = ''

app.get('/', function(req, res, next) {                     //메인 페이지
    if (req.query.id === undefined) req.query.id = `index`;
    message = req.query.id

    filelist = fs.readdirSync(__dirname + '/html');
    if (filelist.includes(`${req.query.id}.html`)) {        //미리 준비한 페이지라면
        code = 200;
        file = fs.readFileSync(__dirname + `/html/${req.query.id}.html`, 'utf-8');
    } else {                                                //준비하지 못한 페이지라면
        code = 404;
        file = `Error! ${req.query.id} Not Found!`
        title = 'Error'
        message += 'not found'
    }

    next()
})
app.get('/question', function(req, res, next) {             //문제 페이지
    //문제 정보가 들어있는 폴더를 가져옴
    var filelist = fs.readdirSync(__dirname + `/question`);
    message = 'question'

    if (req.query.num == undefined) {                       //문제의 리스트
        
        //문제의 리스트에서 각 레코드를 list 변수에 더함
        list = '';
        filelist.forEach(function (file) {
            /*이 부분에 태그 검색 기능 추가해야 함*/
    
            list += ejs.render(
                fs.readFileSync(__dirname + '/views/question_list_item.ejs', 'utf-8'), {
                    num: file.split('.')[0],
                    q: JSON.parse(fs.readFileSync(__dirname + `/question/${file}`).toString()),
                    tags: js.tags
                }
            )
        })
    
        //모든 레코드를 저장한 list 변수를 이용해 question_list를 완성
        file = ejs.render(fs.readFileSync(__dirname + '/views/question_list.ejs', 'utf-8'), { list: list })
        code = 200;
        message += ' list'
    } else {                                                //한 문제의 정보 및 해답 제출란
        if (filelist.includes(`${req.query.num}.json`)) {   //정보가 있는 문제를 띄울 경우
            //문제의 정보를 담은 json 파일을 객체로 저장
            const q = JSON.parse(fs.readFileSync(__dirname + `/question/${num}.json`).toString());
            
            //현재 문제의 각 예제를 examples 변수에 더함
            var examples = '', i = 1
            q.example.forEach(function(ex) {
                examples += ejs.render(
                    fs.readFileSync(__dirname + '/views/example.ejs', 'utf-8'), {
                        i: i, example: ex,
                        copyToClipboard: js.copyToClipboard
                    }
                )
                i += 1
            })
        
            //문제 정보를 question.ejs에 넘겨 문제 페이지를 생성
            file = ejs.render(
                fs.readFileSync(__dirname + '/views/question.ejs', 'utf-8'), {
                    q: q, tags: js.tags, examples: examples
                }
            )
            
            title = `${req.query.num}. ${q.name}`
            code = 200;
        } else {                                            //정보가 없는 문제를 띄울 경우
            code = 404;
            file = `Error! Question no.${req.query.num} Not Found!`;
            message += ' not found'
        }

        message += ` ${req.query.num}`
    }

    next()
})

//-----------------------------미구현-----------------------------
app.get('/login', function(req, res, next) {                //로그인 페이지
    code = 200;
    file = fs.readFileSync(__dirname + `/html/login.html`, 'utf-8');
    title = 'login'
    message = 'login'
    
    next()
})
app.get('/register', function(req, res, next) {             //회원가입 페이지
    code = 200;
    file = fs.readFileSync(__dirname + `/html/register.html`, 'utf-8');
    title = 'register'
    message = 'register'
    
    next()
})
app.post('/login', function(req, res) {
    var post = req.body

    const login = {
        uri: 'http://dofh.iptime.org:8000/api/login/',
        method: 'POST',
        form: {
            username: post.username,
            email: post.email,
            password: post.password
        }
    }
})
app.post('/register', function(req, res) {
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
//-----------------------------미구현-----------------------------

//각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
app.get('*', function(req, res) {
    console.log(message)
    
    res.status(code).render('page', {
        title: title, 
        body: file
    });
})

app.listen(port, function() {});