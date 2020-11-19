const request = require('request')

const myRouter = require('../../lib/myRouter')

const router = myRouter.Router()

router.use('/', require('./submission/list'))

router.get('/:id', (req, res) => {
    //사용자가 로그인하지 않았다면 이 페이지에 접근할 수 없으므로 /question으로 리다이렉트
    if (req.user === undefined) res.redirect('/question')

    let id = req.params.id
    router.build.message = `submission id: ${id}`

    request.get({
        uri: `http://dofh.iptime.org:8000/api/submission?id=${id}`,
        headers: {
            'X-Csrftoken': req.user.csrftoken,
            Cookie: `sessionid=${req.user.sessionid};csrftoken=${req.user.csrftoken};`,
            'Content-Type': 'application/json'
        }
    }, (err, serverRes, body) => {
        body = JSON.parse(body)
        
        if (err || body.error) {
            console.error('err: ' + err)
            console.error('body.error: ' + body.error)
            res.redirect('/question/submission')
        } else {
            try {                
                // 문제 정보를 submission.pug에 넘겨 문제 페이지를 생성
                router.build.page = 'question/submission'
                router.build.param.title = `${id}. ${body.data.title}`
                router.build.param.q = body.data
                // router.build.param.submit = ''/* router.submit[_id] */
            } catch (err) { // 문제 페이지가 없는 경우
                console.error(err)
                router.build.code = 404;
                router.build.param.title = 'Submission id Error'
                router.build.message += ' not found'
            }
    
            //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
            router.show(req, res)
        }
    })




    // //페이지의 쿼리 상태에 따라 uri에 여러 쿼리를 추가한다
    // if (req.query.id)       submission.uri += `&problem_id=${req.query.id}`
    // if (req.query.username) submission.uri += `&username=${req.query.username}`

    // //request를 이용해 가져오고자 할 제출 목록 정보를 백엔드에 전송
    // request.get(submission, (err, serverRes, body) => {
    //     if (err || body.error) {
    //         console.error('err:        ' + err)
    //         console.error('body.error: ' + body.data)
    //     } else {
    //         //백엔드로부터 받아온 정보를 json 형태로 파싱
    //         body = JSON.parse(body)
            
    //         router.build.page = 'question/submission'
    //         router.build.message = 'question/submission' 
    //             + ((req.query.id)       ? ` id=${req.query.id}`             : '') 
    //             + ((req.query.username) ? ` username=${req.query.username}` : '')
    //         router.build.param.title = `submission`
    //         router.build.param.results = body.data.results

    //         router.show(req, res)
    //     }
    // })
})

module.exports = router