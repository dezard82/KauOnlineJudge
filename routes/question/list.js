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
    let q_list = []

    request.get({
        uri: 'http://dofh.iptime.org:8000/api/problem?limit=10'
    }, (err, serverRes, body) => {
        if (err) {
            console.error(err)
            res.redirect('/question')
        }

        body = JSON.parse(body)

        if (body.error) {
            
        } else {
            body.data.results.forEach((q) => {
                q_list.push({
                    id: q._id,
                    title: q.title,
                    tags: q.tags,
                    languages: q.languages
                })
            })
    
            router.build.page = 'question_list'
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