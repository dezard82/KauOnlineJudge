const request = require('request')

const myRouter = require('../../lib/myRouter')

const router = myRouter.Router()

router.get('/', (req, res) => {
    if (req.user === undefined) res.redirect('/question')
    
    else {
        router.build = {
            code: 200,
            page: 'question/create',
            message: 'question create',
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
    
    //페이지에서 받아온 언어 집합 ','로 나눈 뒤 앞뒤 공백을 제거한다
    /* post.languages = post.languages.split(',')
    for (let i in post.languages) {
        post.languages[i] = post.languages[i].trim()
    } */

    //추가할 문제를 풀 수 있는 언어 종류를 배열로 전송
    post.languages = []
    //가능한 언어를 post.languages에 삽입
    if (post['C'] === 'on')         post.languages.push('C')
    if (post['C++'] === 'on')       post.languages.push('C++')
    if (post['Java'] === 'on')      post.languages.push('Java')
    if (post['Python2'] === 'on')   post.languages.push('Python2')
    if (post['Python3'] === 'on')   post.languages.push('Python3')
    //post[언어]는 백엔드 스키마에 없으므로 제거
    delete post['C']
    delete post['C++']
    delete post['Java']
    delete post['Python2']
    delete post['Python3']

    //추가할 문제의 예제를 객체의 배열로 전송
    post.samples = []

    //예제 입력의 배열과 예제 출력의 배열을 백엔드 스키마에 맞게 바꾼다
    for (let i in post.input) {
        post.samples.push({
            input: post.input[i],
            output: post.output[i]
        })
    }

    //백엔드에서 사용하지 않는 변수는 제거
    /* post.input = undefined
    post.output = undefined */
    delete post.input
    delete post.output

    //문제의 id는 항상 unique해야 하므로 생성 시간을 id로 지정
    post._id = new Date().getTime()

    //체크박스의 on, off를 true, false로 변경
    post.share_submission = post.share_submission === 'on'
    post.visible = post.visible === 'on'
    
    //request로 전송할 문제 정보
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
            console.error('err       : ' + err)
            console.error('body.error: ' + body.error)

            res.redirect('/question/create')
        } else {
            res.redirect('/question')
        }
    })
})

module.exports = router