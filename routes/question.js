const fs = require('fs')
const ejs = require('ejs')

const js = require('../lib/KAUOnlineJudge.js')
const myRouter = require('../lib/myRouter.js')

const router = myRouter.Router()
const filelist = fs.readdirSync(__dirname + `/BE_test/question`)

/*
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const router = express.Router()

//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'))

var code = 404, body = '404 Not Found!', title = 'KAU Online Judge'
var message = '', user = '로그인'
*/

router.get('*', function (req, res, next) {
    //현재 로그인 한 사용자의 문제 제출 리스트
    router.submit = (router.build.user === '내 정보') ? {} : JSON.parse(fs.readFileSync(__dirname + `/BE_test/users/${router.build.user}.json`).toString()).submit
    next()
})

router.get('/', function (req, res) {      //문제의 리스트
    //문제의 리스트에서 각 파일을 list 변수에 더함
    list = '';
    //문제 정보가 들어있는 폴더를 가져옴
    filelist.forEach(function (file) {
        //폴더 안의 문제에 대해 문제 정보를 가져옴
        const q = JSON.parse(fs.readFileSync(__dirname + `/BE_test/question/${file}`).toString())
        //문제 태그로 검색 시 tag를 가지고 있지 않은 문제는 넘어감
        if ((req.query.tag != undefined) && !(q.table.tag.includes(req.query.tag))) return false

        //문제 정보를 list 변수에 추가
        list += ejs.render(
            fs.readFileSync(__dirname + '/../views/question_list_item.ejs', 'utf-8'), {
                num: file.split('.')[0],
                q: q, 
                submit: (router.submit[file.split('.')[0]] == undefined ? '' : router.submit[file.split('.')[0]]),
                tags: js.tags
            }
        )
    })

    //모든 레코드를 저장한 list 변수를 이용해 question_list를 완성
    router.build.body = ejs.render(fs.readFileSync(__dirname + '/../views/question_list.ejs', 'utf-8'), { list: list })
    router.build.code = 200;
    router.build.message = 'question list'
    if (req.query.tag != undefined) 
        router.build.message += `: ${req.query.tag}`
    
    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    //js.show(res, code, title, user, body, message)
    myRouter.show(res, router.build)
})
router.get('/:num', function (req, res) {  //한 문제의 정보 및 해답 제출란
    var num = req.params.num
    router.build.message = `question no.${num}`

    try {           //`num`.json이 있는 경우
        //문제의 정보를 담은 json 파일을 객체로 저장
        const q = JSON.parse(fs.readFileSync(__dirname + `/BE_test/question/${req.params.num}.json`).toString());
        
        //문제 정보를 question.ejs에 넘겨 문제 페이지를 생성
        router.build.body = ejs.render(
            fs.readFileSync(__dirname + '/../views/question.ejs', 'utf-8'), {
                q: q, tags: js.tags,
                submit: (router.submit[num] == undefined ? '' : router.submit[num]),
                copyToClipboard: js.copyToClipboard
            }
        )
        
        router.build.title = `${req.params.num}. ${q.name}`
        router.build.code = 200;
    } catch (err) { //          　 없는 경우
        router.build.code = 404;
        router.build.title = 'Question no. Error'
        router.build.body = `Error! Question no.${req.params.num} Not Found!`;
        router.build.message += ' not found'
    }
    
    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    //js.show(res, code, title, user, body, message)
    myRouter.show(res, router.build)
})

module.exports = router