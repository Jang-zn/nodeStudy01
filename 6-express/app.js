const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

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

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
});

app.get('/', (req, res, next) => {
  console.log('GET / 요청에서만 실행됩니다.');
  next();
}, (req, res) => {
  throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});