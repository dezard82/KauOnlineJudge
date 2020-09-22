const fs = require('fs')

const myRouter = require('../lib/myRouter')

/*
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const js = require('../lib/KAUOnlineJudge.js')

const router = express.Router()
//lib 폴더를 static으로 지정해 css, js, image 등을 사용할 수 있음
router.use(express.static('lib'))
 */

const router = myRouter.Router()


router.get('/', function(req, res) {  //메인 페이지
    //대문에 표시할 페이지 찾기
    if (req.query.id === undefined) req.query.id = `index`;
    router.build.message = req.query.id

    try {           //`id`.html이 존재할 경우
        router.build.code = 200;
        router.build.body = fs.readFileSync(__dirname + `/../html/${req.query.id}.html`, 'utf-8');
    } catch (err) { //         　 존재하지 않을 경우
        router.build.code = 404;
        router.build.body = `Error! Page ${req.query.id} Not Found!`
        router.build.title = '404 Error'
        router.build.message += '.html not found'
    }

    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    myRouter.show(res, router.build)
})

module.exports = router