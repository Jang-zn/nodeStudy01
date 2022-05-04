const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');


const nunjucks = require('nunjucks');
// --------------------------------------------서버 설정

const app = express();
app.set('port', process.env.PORT || 3000);

//템플릿엔진 설정
app.set('views',path.join(__dirname,'views'));
app.set('view engine','html');
nunjucks.configure('views',{
  express : app,
  watch:true
});



const indexRouter = require('./routes');
const userRouter = require('./routes/user');

//---------------------------------------------미들웨어 사용
//요청 / 응답정보를 기록하는 미들웨어
app.use(morgan('dev'));

// static 미들웨어
app.use('/', express.static(path.join(__dirname, 'public')));

//쿠키 제어를 쉽게 해주는 미들웨어
app.use(cookieParser(process.env.COOKIE_SECRET));

//body_parser 역할을 express에서 제공해줌 -> body data에 바로 접근 가능.
//거의 필수임
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //true면 qs, false면 querystring 사용
//form에서 이미지나 파일을 보내는경우 multer 사용해야된다..


app.use(session({
  resave: false,
  saveUninitialized: false,
  //비밀 키를 환경변수에 저장해서 관리
  secret: process.env.COOKIE_SECRET,
  //세션쿠키에 대한 설정
  cookie: {
    httpOnly: true,
    secure: false,
  },
  //name은 connect.sid 가 default값
  name: 'session-cookie',
}));

const multer = require('multer');
const fs = require('fs');

//업로드 폴더 확인후 없으면 생성
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

//multer 옵션
// storage : 업로드한 파일의 저장위치, multer S3 같은 aws용 패키지도 있다.
// limits : 최대 fileSize, file갯수 등..
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      //파일 확장자 추출
      const ext = path.extname(file.originalname);
      //파일이름과 이름 + 확장자 로 저장... Date.now()는 같은 이름의 파일 중복을 막기 위한 방식
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  //filesize 5mb 제한
  limits: { fileSize: 5 * 1024 * 1024 },
});

//이렇게 만든 업로드객체를 라우터에 장착


//------------------------------------------------------------라우터
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
});


app.get('/', indexRouter, (req, res) => {
  throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.get('/', userRouter);

//---------------------------------------------------------404 처리



//---------------------------------------------------------에러처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});