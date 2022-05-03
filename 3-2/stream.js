const fs = require('fs');

//highWaterMark : chunk 사이즈를 6byte로 줄여줌
const readStream = fs.createReadStream('./readme2.txt', {highWaterMark:6});
const data=[];

readStream.on('data',(chunk)=>{
    data.push(chunk);
    console.log(data.toString());
    console.log('data : ',chunk,chunk.length);
});
