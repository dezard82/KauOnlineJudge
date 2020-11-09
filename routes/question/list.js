const fs = require('fs')
const request = require('request')

const myRouter = require('../../lib/myRouter')

const router = myRouter.Router()
const filelist = fs.readdirSync(__dirname + `/../BE_test/question`)

function question_list_test (req, res) {
    //페이지에 표시할 문제의 정보를 담은 json
    let q_list = {}
    //디렉토리에서 가져온 문제에 대해
    filelist.forEach(q => {
        //각 json 파일을 읽은 뒤
        const q_file = JSON.parse(fs.readFileSync(__dirname + `/../BE_test/question/${q}`).toString())
        
        //문제 태그로 검색 시 tag를 가지고 있지 않은 문제는 넘어감
        if ((req.query.tag != undefined) && !(q_file.table.tag.includes(req.query.tag))) return false

        //표시할 문제 정보를 json 형태로 q_list에 push
        q_list[q_file._id] = {
            _id: q_file.id,
            title: q_file.title,
            tags: q_file.tags
            //submit: (router.submit[q_file._id] == undefined ? '' : router.submit[q_file._id])
        }
    })

    router.build.page = 'question_list'
    router.build.message = 'question list'
    if (req.query.tag != undefined) 
        router.build.message += `: ${req.query.tag}`

    router.build.param.q_list = q_list

    router.show(req, res)
}

function question_list (req, res) {
    //페이지에 표시할 문제의 집합을 배열로 저장
    let q_list = []

    request.get({ 
        uri: 'http://dofh.iptime.org:8000/api/problem?limit=10'
    }, (err, serverRes, body) => {
        //백엔드로부터 받아온 정보를 json 형태로 파싱
        body = JSON.parse(body)

        if (err || body.error) {
            console.error('err:        ' + err)
            console.error('body.error: ' + body.data)
            res.redirect('/')
        } else {
            //백엔드에서 받아온 문제 정보들 중 필요한 것만 가져옴
            body.data.results.forEach((q) => {
                if ( (req.query.tag !== undefined) && !(q.tags.includes(req.query.tag)) ) return
                q_list.push({
                    _id: q._id,
                    title: q.title,
                    tags: q.tags,
                    languages: q.languages
                })
            })
    
            router.build.page = 'question/list'
            router.build.message = 'question list'
            if (req.query.tag != undefined) 
                router.build.message += `: ${req.query.tag}`
        
            router.build.param.q_list = q_list
        
            router.show(req, res)
        }
    })
}

router.get('/', question_list)

module.exports = router