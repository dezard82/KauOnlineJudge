const fs = require('fs')
const request = require('request')

const myRouter = require('../lib/myRouter')

const router = myRouter.Router()

router.get('/', (req, res) => {
    if (req.user == undefined) res.redirect('/question')

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
})

module.exports = router