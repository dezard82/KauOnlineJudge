const request = require('request')

const myRouter = require('../../lib/myRouter')

const router = myRouter.Router()

router.get('/', (req, res) => {
    if (req.user === undefined) res.redirect('/question')

    let uri = 'http://dofh.iptime.org:8000/api/submissions?limit=10'

    if (req.query.id) uri += `&problem_id=${req.query.id}`
    if (req.query.username) uri += `&username=${req.query.username}`

    const test = {
        uri: uri,
        headers: {
            'X-Csrftoken': req.user.csrftoken,
            Cookie: `sessionid=${req.user.sessionid};csrftoken=${req.user.csrftoken};`,
            'Content-Type': 'application/json'
        }
    }

    request.get(test, (err, serverRes, body) => {
        if (err || body.error) {
            console.error('err: ' + err)
            console.error('body.error: ' + body.data)
        } else {
            body = JSON.parse(body)
            const results = body.data.results

            console.log(body)
            
            router.build.page = 'question/submissions'
            router.build.message = 'question/submissions' 
                + ((req.query.id)       ? ` id=${req.query.id}`             : '') 
                + ((req.query.username) ? ` username=${req.query.username}` : '')
            router.build.param.title = `Submissions`
            router.build.param.results = results

            router.show(req, res)
        }
    })
})

module.exports = router