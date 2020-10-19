const fs = require('fs')
const request = require('request')

const myRouter = require('../../lib/myRouter')

const router = myRouter.Router()
const filelist = fs.readdirSync(__dirname + `/../BE_test/question`)

function question_test (req, res) {  //한 문제의 정보 및 해답 제출란
    var id = req.params.id
    router.build.message = `question no.${id}`
    
    try {           //`_id`.json이 있는 경우
        //문제의 정보를 담은 json 파일을 객체로 저장
        const q = JSON.parse(fs.readFileSync(__dirname + `/../BE_test/question/${id}.json`).toString());
        
        //문제 정보를 question.ejs에 넘겨 문제 페이지를 생성
        router.build.page = 'question'
        router.build.param.title = `${id}. ${q.title}`
        router.build.param.q = q
        router.build.param.submit = ''/* router.submit[_id] */
    } catch (err) { //          　 없는 경우
        router.build.code = 404;
        router.build.param.title = 'Question no. Error'
        router.build.message += ' not found'
    }
    
    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    router.show(req, res)
}

function question (req, res) {  //한 문제의 정보 및 해답 제출란
    let id = req.params.id
    router.build.message = `question id: ${id}`

    request.get({
        uri: `http://dofh.iptime.org:8000/api/problem?problem_id=${id}`
    }, (err, serverRes, body) => {
        if (err || body.error) {
            console.error('err: ' + err)
            console.error('body.error: ' + body.error)
            res.redirect('/question')
        } else {
            try {
                body = JSON.parse(body)
                
                //문제 정보를 question.pug에 넘겨 문제 페이지를 생성
                router.build.page = 'question'
                router.build.param.title = `${id}. ${body.data.title}`
                router.build.param.q = body.data
                //router.build.param.submit = ''/* router.submit[_id] */
            } catch (err) { //          　 없는 경우
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
            res.redirect(`/question/submissions?id=${id}&username=${req.user.username}`)
        }
    })
}

router.get('/:id', question)
router.post('/:id', question_post)

module.exports = router