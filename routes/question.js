const fs = require('fs')
const request = require('request')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

// 문제 리스트, 문제 생성, 문제 제출 화면은 라우팅을 이용해 다른 파일에 정의
router.use('/',             require('./question/list'))
router.use('/create',       require('./question/create'))
router.use('/submission',  require('./question/submission'))
//router.use('/:id',          require('./question/question'))

// 파일 분리를 시도했으나 에러가 발생하여 부득이하게 이 파일에 삽입함
function question (req, res) {  // 한 문제의 정보 및 해답 제출란
    let id = req.params.id
    router.build.message = `question id: ${id}`

    request.get({
        uri: `http://dofh.iptime.org:8000/api/problem?problem_id=${id}`
    }, (err, serverRes, body) => {
        body = JSON.parse(body)
        
        if (err || body.error) {
            console.error('err: ' + err)
            console.error('body.error: ' + body.error)
            res.redirect('/question')
        } else {
            try {                
                // 문제 정보를 question.pug에 넘겨 문제 페이지를 생성
                router.build.page = 'question'
                router.build.param.title = `${id}. ${body.data.title}`
                router.build.param.q = body.data
                // router.build.param.submit = ''/* router.submit[_id] */
            } catch (err) { // 문제 페이지가 없는 경우
                console.error(err)
                router.build.code = 404;
                router.build.param.title = 'Question id Error'
                router.build.message += ' not found'
            }
    
            //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
            router.show(req, res)
        }
    })
}

function question_post (req, res) {
    let id = req.params.id
    //form에서 받아온 정보의 집합
    const post = req.body

    if (req.user === undefined) res.redirect('/login')

    //request로 전송할 문제풀이 정보
    const question_create = {
        uri: 'http://dofh.iptime.org:8000/api/submission',
        headers: {
            'X-Csrftoken': req.user.csrftoken,
            Cookie: `sessionid=${req.user.sessionid};csrftoken=${req.user.csrftoken};`,
            'Content-Type': 'application/json'
        },
        json: post
    }

    request.post(question_create, (err, serverRes, body) => {
        if (err || body.error) {
            console.error('err       : ' + err)
            console.error('body.error: ' + body.data)
            res.redirect(`/question/${id}`)
        } else {
            //제출한 문제의 id와 사용자 이름을 쿼리로 넘기면서 제출 목록을 확인
            // res.redirect(`/question/submission/${body.data.submission_id}`)
            res.redirect(`/question/submission?id=${id}&username=${req.user.username}`)
        }
    })
}

router.get('/:id', question)
router.post('/:id', question_post)

module.exports = router