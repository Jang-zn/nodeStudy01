const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
// const cors = require('cors');

dotenv.config();
const authRouter = require('./routes/auth');
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');
const indexRouter = require('./routes');
const {sequelize} = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8002);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express:app,
    watch:true,
});

sequelize.sync({force:false}).then(
    ()=>{
        console.log("DB Connecting");
    }).catch((e)=>{
        console.error(e);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// //이러면 전체 라우터에 cors가 적용되는데, 원하는 라우터에만 미들웨어처럼 넣어줘도 된다.
// //라우터 단위로 걸어주는것을 권장함 

// app.use(cors({
//     //credential 같은 옵션 넣으면 origin:'*' 못씀. 공식문서 확인    
// }));


app.use('/v1', v1Router);
app.use('/v2', v2Router);
app.use('/auth', authRouter);
app.use('/', indexRouter);

app.use((req, res, next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next)=>{
    res.local.message = err.message;
    res.local.error = process.env.NODE_ENV !=='production' ? err : {};
    res.status(err.status||500);
    res.render('error');
});


app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중')
});
