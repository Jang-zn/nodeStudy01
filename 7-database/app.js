const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const {sequelize} = require('./models');

//--------express 세팅
const app = express();
app.set('port', process.env.PORT ||3001);
app.set('view engine', 'html');
nunjucks.configure('views',{
    express : app,
    watch:true,
});
const indexRouter = require('./routes');
const userRouter = require('./routes/user');


//------------node - mysql 연결
sequelize.sync({force:false}).then(()=>{
    console.log("node - DB connected");
}).catch((err)=>{
    console.log(err);
});



//-------------------------미들웨어 추가
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));



//-------------------------라우터
app.use('/', indexRouter);



//------------------404처리
app.use((req,res, next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status=404;
    next(error);
});


//-----------------에러처리
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
  });
  
  app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
  });