const fs = require('fs')
const ejs = require('ejs')
const express = require('express')
const bodyParser = require('body-parser')
const js = require('./lib/KAUOnlineJudge.js')

const port = 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('lib'));

//ejs
app.set('view engine', 'ejs')
app.set('views', './views');

//문제의 리스트
function question_list(filelist) {
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
    return ejs.render(
        fs.readFileSync(__dirname + '/views/question_list.ejs', 'utf-8'), {
            list: list
        }
    )
}
//한 문제의 정보 및 해답 제출란
function question(num) {
    const q = JSON.parse(fs.readFileSync(__dirname + `/question/${num}.json`).toString());
    title = `${num}. ${q.name}`
    
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

    return ejs.render(
        fs.readFileSync(__dirname + '/views/question.ejs', 'utf-8'), {
            q: q, tags: js.tags, 
            examples: examples
        }
    )
}

var code = 404, file = '404 Not Found!', title = 'KAU Online Judge';

app.get('/', function(req, res) {               //메인 페이지
    if (req.query.id === undefined) req.query.id = `index`;

    filelist = fs.readdirSync(__dirname + '/html');
    if (filelist.includes(`${req.query.id}.html`)) {    //미리 준비한 페이지라면
        code = 200;
        file = fs.readFileSync(__dirname + `/html/${req.query.id}.html`, 'utf-8');
        console.log(`${req.query.id}.html`)
    } else {                                            //준비하지 못한 페이지라면
        code = 404;
        file = `Error! ${req.query.id} Not Found!`
        title = 'Error'
    }
    
    res.status(code).render('page', {
        title: title, 
        body: file
    });
})
app.get('/question', function(req, res) {       //문제 페이지
    //문제 정보가 들어있는 폴더를 가져옴
    var filelist = fs.readdirSync(__dirname + `/question`);

    if (req.query.num == undefined) {           //문제의 리스트
        code = 200;
        file = question_list(filelist);
    } else {                                    //한 문제의 정보 및 해답 제출란
        if (filelist.includes(`${req.query.num}.json`)) {   //정보가 있는 문제를 띄울 경우
            code = 200;
            file = question(req.query.num);
        } else {                                            //정보가 없는 문제를 띄울 경우
            code = 404;
            file = `Error! Question no.${req.query.num} Not Found!`;
        }
    }
    
    res.status(code).render('page', {
        title: title, 
        body: file
    });
})

//이하 미구현
app.get('/login', function(req, res) {          //로그인 페이지
    code = 200;
    file = fs.readFileSync(__dirname + `/html/login.html`, 'utf-8');
    title = 'login'
    
    res.status(code).render('page', {
        title: title, 
        body: file
    });
})
app.get('/register', function(req, res) {        //회원가입 페이지
    code = 200;
    file = fs.readFileSync(__dirname + `/html/register.html`, 'utf-8');
    title = 'register'
    
    res.status(code).render('page', {
        title: title, 
        body: file
    });
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

app.listen(port, function() {
    //console.log('Example app listening on port 3000!')
});