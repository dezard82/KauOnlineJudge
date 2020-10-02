const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const rootRouter = require('./routes/root')
const questionRouter = require('./routes/question')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const registerRouter = require('./routes/register')
const userRouter = require('./routes/user')

const port = 8080
const app = express()

//pug
app.set('view engine', 'pug')
app.set('views', './views')

//페이지에서 사용할 세션의 정보
app.use(session({
    //secure: true,
    HttpOnly: true,
    secret: 'KAUOnlineJudge',
    resave: false,
    saveUninitialized: false,
    store: new FileStore()
}))
//routes 폴더 안의 가나다 순으로 정렬해야 하는 것으로 보임
app.use('/login', loginRouter)          /*로그인 페이지, 사용자에게 메세지 띄우지 않음*/
app.use('/logout', logoutRouter)        /*로그아웃 페이지, 사용자에게 메세지 띄우지 않음*/
app.use('/question', questionRouter)    //문제 페이지
app.use('/register', registerRouter)    /*회원가입 페이지, 사용자에게 메세지 띄우지 않음*/
app.use('/', rootRouter)                //기본 페이지
app.use('/user', userRouter)            /*사용자 정보 페이지, 사용자 통계를 표시하지 못함*/

app.listen(port, function() {})