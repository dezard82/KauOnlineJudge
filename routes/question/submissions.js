const request = require('request')

const myRouter = require('../../lib/myRouter')

const router = myRouter.Router()

router.get('/', (req, res) => {
    //사용자가 로그인하지 않았다면 이 페이지에 접근할 수 없으므로 /question으로 리다이렉트
    if (req.user === undefined) res.redirect('/question')

    //request로 전송할 데이터 집합
    const submissions = {
        uri: 'http://dofh.iptime.org:8000/api/submissions?limit=10',
        headers: {
            'X-Csrftoken': req.user.csrftoken,
            Cookie: `sessionid=${req.user.sessionid};csrftoken=${req.user.csrftoken};`,
            'Content-Type': 'application/json'
        }
    }

    //페이지의 쿼리 상태에 따라 uri에 여러 쿼리를 추가한다
    if (req.query.id)       submissions.uri += `&problem_id=${req.query.id}`
    if (req.query.username) submissions.uri += `&username=${req.query.username}`

    //request를 이용해 가져오고자 할 제출 목록 정보를 백엔드에 전송
    request.get(submissions, (err, serverRes, body) => {
        if (err || body.error) {
            console.error('err:        ' + err)
            console.error('body.error: ' + body.data)
        } else {
            //백엔드로부터 받아온 정보를 json 형태로 파싱
            body = JSON.parse(body)
            
            router.build.page = 'question/submissions'
            router.build.message = 'question/submissions' 
                + ((req.query.id)       ? ` id=${req.query.id}`             : '') 
                + ((req.query.username) ? ` username=${req.query.username}` : '')
            router.build.param.title = `Submissions`
            router.build.param.results = body.data.results

            router.show(req, res)
        }
    })
})

module.exports = router