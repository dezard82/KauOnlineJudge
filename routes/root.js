const fs = require('fs')
const express = require('express')

const router = express.Router()

//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'));

var code = 404, body = '404 Not Found!', title = 'KAU Online Judge'
var message = ''

router.get('/', function(req, res, next) {  //메인 페이지
    if (req.query.id === undefined) req.query.id = `index`;
    message = req.query.id

    try {                                   //`id`.html이 존재할 경우
        code = 200;
        body = fs.readFileSync(__dirname + `/../html/${req.query.id}.html`, 'utf-8');
    } catch (err) {                         //       　 존재하지 않을 경우
        code = 404;
        body = `Error! Page ${req.query.id} Not Found!`
        title = '404 Error'
        message += '.html not found'
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