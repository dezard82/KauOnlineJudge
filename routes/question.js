const fs = require('fs')
const ejs = require('ejs')
const express = require('express')
const js = require('../lib/KAUOnlineJudge.js')

const router = express.Router()

//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'));

var code = 404, body = '404 Not Found!', title = 'KAU Online Judge'
var message = 'question'

router.get('/', function(req, res, next) {      //문제의 리스트
    //문제 정보가 들어있는 폴더를 가져옴
    //문제의 리스트에서 각 파일을 list 변수에 더함
    list = '';
    var filelist = fs.readdirSync(__dirname + `/../question`)
    filelist.forEach(function (file) {
        /*이 부분에 태그 검색 기능 추가해야 함*/

        list += ejs.render(
            fs.readFileSync(__dirname + '/../views/question_list_item.ejs', 'utf-8'), {
                num: file.split('.')[0],
                q: JSON.parse(fs.readFileSync(__dirname + `/../question/${file}`).toString()),
                tags: js.tags
            }
        )
    })

    //모든 레코드를 저장한 list 변수를 이용해 question_list를 완성
    body = ejs.render(fs.readFileSync(__dirname + '/../views/question_list.ejs', 'utf-8'), { list: list })
    code = 200;
    message += ' list'
    
    next()
})
router.get('/:num', function(req, res, next) {  //한 문제의 정보 및 해답 제출란
    message += req.params.num

    try {                                       //`num`.json이 있는 경우
        //문제의 정보를 담은 json 파일을 객체로 저장
        const q = JSON.parse(fs.readFileSync(__dirname + `/../question/${req.params.num}.json`).toString());
        
        //현재 문제의 각 예제를 examples 변수에 더함
        var examples = '', i = 1
        q.example.forEach(function(ex) {
            examples += ejs.render(
                fs.readFileSync(__dirname + '/../views/example.ejs', 'utf-8'), {
                    i: i, example: ex,
                    copyToClipboard: js.copyToClipboard
                }
            )
            i += 1
        })
    
        //문제 정보를 question.ejs에 넘겨 문제 페이지를 생성
        body = ejs.render(
            fs.readFileSync(__dirname + '/../views/question.ejs', 'utf-8'), {
                q: q, tags: js.tags, examples: examples
            }
        )
        
        title = `${req.params.num}. ${q.name}`
        code = 200;
    } catch (err) {                             //없는 경우
        code = 404;
        title = 'Question no. Error'
        body = `Error! Question no.${req.params.num} Not Found!`;
        message += ' not found'
    }

    next()
})

//각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
router.get('*', function (req, res) {
    //에러가 발생하지 않았다면 console에 log를, 발생했다면 error를 출력
    if (code == 200) console.log(message)
    else console.error(message)
    
    res.status(code).render('page', {
        title: title, 
        body: body
    });
})

module.exports = router