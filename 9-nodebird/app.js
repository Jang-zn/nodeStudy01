const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const {sequelize} = require('./models');
const app = express();
app.set('port', process.env.PORT || 3001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
  });

//force, alter 옵션으로 모델 수정하고 db 연결시 테이블 수정되도록 할순 있음
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie : {
        httpOnly:true,
        secure:false,
    }
}));


//Router 연결전에 passport 미들웨어 연결해줘야 한다.
//이때 passport는 Express의 session보다 아래에 위치해야 함 -> Express Session에다가 인증정보를 저장하니까.
app.use(passport.initialize());
app.use(passport.session());
//이렇게 해주면 알아서 passport index의 deserialize 실행함

app.use('/', pageRouter);
app.use('/auth', authRouter);


app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next)=>{
    res.locals.message = err.message;

    //개발시에만 stackTrace 보이도록 설정하는 코드
    res.locals.error = process.env.NODE_ENV !=='production'?err:{};
    
    res.status(err.status||500).render('error');
});

  app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
  });