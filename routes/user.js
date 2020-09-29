const fs = require('fs')
const ejs = require('ejs')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

router.get('/:id', function (req, res) {
    //없는 유저의 유저 페이지를 확인하려 하면 에러 메세지를 출력해야 함
    if (!fs.readdirSync(__dirname + `/BE_test/users`).includes(`${req.params.id}.json`))
        res.redirect('/login')

    //사용자가 푼 문제들의 정보를 가져온 뒤 같은 결과끼리 모음
    let list = {}
    const user = JSON.parse(fs.readFileSync(__dirname + `/BE_test/users/${req.params.id}.json`))
    for (q in user.submit) {
        if (list[user.submit[q]] == undefined) list[user.submit[q]] = []
        list[user.submit[q]].push(q)
    } 

    //페이지 빌드
    router.build.title = `${req.params.id}의 정보`
    router.build.message = `${req.params.id} info`
    router.build.code = 200
    router.build.body = ejs.render(
        fs.readFileSync(__dirname + '/../views/user.ejs', 'utf-8'), { 
            user: req.params.id, 
            list: list
        }
    )
    myRouter.show(res, router.build)
})

module.exports = router