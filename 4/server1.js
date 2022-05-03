const http = require('http');
const fs = require('fs').promises;

http.createServer(async (req, res)=>{
    try{
    //기본 세팅.. 헤더 설정 ( html / utf-8 설정)
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        const data = await fs.readFile('./server1.html');
        res.end(data);
    }catch(error){
        console.error(error);
        res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
        res.end(error.message);
    }
})
//8080포트에 연결하고 대기중인 상태로 만들어줌
.listen(8080, ()=>{
    console.log('8080 port waiting');
});