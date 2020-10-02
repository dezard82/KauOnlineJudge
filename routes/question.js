const fs = require('fs')

const js = require('../lib/KAUOnlineJudge.js')
const myRouter = require('../lib/myRouter.js')

const router = myRouter.Router()
const filelist = fs.readdirSync(__dirname + `/BE_test/question`)

router.get('*', (req, res, next) => {
    let user = req.user
    //현재 로그인 한 사용자의 문제 제출 리스트
    router.submit = (user === undefined) ? 
        {} 
      : JSON.parse(fs.readFileSync(__dirname + `/BE_test/users/${user.username}.json`).toString()).submit
    next()
})

router.get('/', (req, res) => {      //문제의 리스트
    //페이지에 표시할 문제의 정보를 담은 json
    let q_list = {}
    //디렉토리에서 가져온 문제에 대해
    filelist.forEach(q => {
        //각 json 파일을 읽은 뒤
        const q_file = JSON.parse(fs.readFileSync(__dirname + `/BE_test/question/${q}`).toString())
        
        //문제 태그로 검색 시 tag를 가지고 있지 않은 문제는 넘어감
        if ((req.query.tag != undefined) && !(q_file.table.tag.includes(req.query.tag))) return false

        //표시할 문제 정보를 json 형태로 q_list에 push
        let num = q.split('.')[0]
        q_list[num] = {
            num: num,
            name: q_file.name,
            tags: q_file.table.tag,
            submit: (router.submit[num] == undefined ? '' : router.submit[num]),
            cnt: q_file.table.cnt,   //count
            pcnt: q_file.table.pcnt  //percent
        }
    })

    router.build.page = __dirname + '/../views/page/question_list'
    router.build.message = 'question list'
    if (req.query.tag != undefined) 
        router.build.message += `: ${req.query.tag}`

    router.build.param.q_list = q_list

    router.show(req, res)
})

router.get('/:num', (req, res) => {  //한 문제의 정보 및 해답 제출란
    var num = req.params.num
    router.build.message = `question no.${num}`
    console.log(router.submit)
    console.log(router.submit[num])
    
    try {           //`num`.json이 있는 경우
        //문제의 정보를 담은 json 파일을 객체로 저장
        const q = JSON.parse(fs.readFileSync(__dirname + `/BE_test/question/${req.params.num}.json`).toString());
        
        //문제 정보를 question.ejs에 넘겨 문제 페이지를 생성
        router.build.page = __dirname + '/../views/page/question'
        router.build.param.title = `${num}. ${q.name}`
        router.build.param.q = q
        router.build.param.submit = router.submit[num]
    } catch (err) { //          　 없는 경우
        router.build.code = 404;
        router.build.param.title = 'Question no. Error'
        router.build.message += ' not found'
    }
    
    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    router.show(req, res)
})

module.exports = router