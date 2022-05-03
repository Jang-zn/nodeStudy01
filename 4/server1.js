const http = require('http');

http.createServer((req, res)=>{
    res.write('<h1>Hello Node</h1>');
    res.write('<p>Hello Http</p>');

})
//8888포트에 연결하고 대기중인 상태로 만들어줌
.listen(8080, ()=>{
    console.log('8080 port waiting');
});