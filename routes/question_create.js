const fs = require('fs')
const request = require('request')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

router.get('/', (req, res) => {
    if (req.user == undefined) res.redirect('/question')
    
    else {
        router.build = {
            code: 200,
            page: 'question_create',
            message: 'question_create',
            param: {
                title: 'Question Create'
            }
        }

        //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시
        router.show(req, res)
    }
})

router.post('/', (req, res) => {
    //form에서 받아온 정보의 집합
    const post = req.body

    //페이지에서 받아온 태그를 ','로 나눈 뒤 앞뒤 공백을 제거한다
    post.tags = post.tags.split(',')
    for (let i in post.tags) {
        post.tags[i] = post.tags[i].trim()
    }

    post.samples = []

    for (let i in post.input) {
        post.samples.push({
            input: post.input[i],
            output: post.output[i]
        })
    }

    post.input = undefined
    post.output = undefined
    post._id = new Date().getTime()

    const question_create = {
        uri: 'http://dofh.iptime.org:8000/api/problem',
        headers: {
            'X-Csrftoken': req.user.csrftoken,
            Cookie: `sessionid=${req.user.sessionid};csrftoken=${req.user.csrftoken};`,
            'Content-Type': 'application/json'
        },
        json: post
    }

    request.post(question_create, (err, serverRes, body) => {
        if (err || body.error) {     //문제 작성 요청에 실패한 경우 
            console.error('err: ' + err)
            console.error('body.error: ' + body.error)

            res.redirect('/question/create')
        }
    })
    res.redirect('/question/create')
})

module.exports = router