const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
//const helmet = require('helmet')

const rootRouter = require('./routes/root')
const questionRouter = require('./routes/question')
const sessionRouter = require('./routes/session')
/*
//백엔드 없이 회원가입/로그인 테스트
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const registerRouter = require('./routes/register')
 */
const loginRouter = require('./routes/login_test')
const logoutRouter = require('./routes/logout_test')
const registerRouter = require('./routes/register_test')

const port = 8080
const app = express()

//app.use(helmet())

//ejs
app.set('view engine', 'ejs')
app.set('views', './views')

//routes 폴더 안의 가나다 순으로 정렬해야 하는 것으로 보임
app.use('/login', loginRouter)          /*로그인 페이지, 사용자에게 메세지 띄우지 않음*/
app.use('/logout', logoutRouter)        /*로그아웃 페이지, 사용자에게 메세지 띄우지 않음*/
app.use('/question', questionRouter)    //문제 페이지
app.use('/register', registerRouter)    /*회원가입 페이지, 사용자에게 메세지 띄우지 않음*/
app.use('/', rootRouter)                //기본 페이지
app.use('/session', sessionRouter)      //ejs로 구현하는 법을 몰라 만든 세션 관리 페이지

app.listen(port, function() {})