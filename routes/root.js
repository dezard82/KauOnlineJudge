const fs = require('fs')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

router.get('/', (req, res) => {  //메인 페이지
    //대문에 표시할 페이지 찾기
    if (req.query.id === undefined) req.query.id = `index`;
    router.build.message = req.query.id

    if (fs.readdirSync(__dirname + '/../views/page').includes(`${req.query.id}.pug`)) {
        router.build.page = __dirname + '/../views/page/' + req.query.id
        router.build.param.text = '아무 기능 없는 버튼'
    } else {
        router.build.code = 404;
        router.build.page = 'page'
        router.build.param.title = '404 Error'
        router.build.message += '.html not found'
    }

    //각 페이지에 해당하는 내용을 완성했으면 log와 함께 페이지를 표시한다
    router.show(req, res)
    //myRouter.show(res, router.build)
})

module.exports = router