const fs = require('fs')

const js = require('../lib/KAUOnlineJudge')
const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

router.get('/:id', function (req, res) {
    //없는 유저의 유저 페이지를 확인하려 하면 에러 메세지를 출력해야 함
    if (!fs.readdirSync(__dirname + `/BE_test/users`).includes(`${req.params.id}.json`))
        res.redirect('/login')

    //사용자가 푼 문제들의 정보를 가져온 뒤
    let list = {}
    const user = JSON.parse(
        fs.readFileSync(__dirname + `/BE_test/users/${req.params.id}.json`)
    )

    //문제풀이 정보를 같은 결과끼리 모음
    for (q in user.submit) {
        if (list[user.submit[q]] == undefined) list[user.submit[q]] = []
        list[user.submit[q]].push(q)
    }
    router.build.param.list = list
    router.build.param.id = req.params.id

    //페이지 빌드
    router.build.param.title = `${req.params.id}의 정보`
    router.build.message = `${req.params.id} info`
    router.build.page = __dirname + '/../views/page/user'

    router.show(res)
})

module.exports = router