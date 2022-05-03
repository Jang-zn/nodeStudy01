const express = require('express');
const path = require('path');
const app = express();

app.set('port',8080);
app.use((req, res, next)=>{
    console.log('모든 요청에 실행');
    next();
});


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/about',(req,res)=>{
    res.send("hello about");
});

app.get('/:name',(req,res)=>{
    res.send(`hello ${req.params.name}`);
});



app.listen(app.get('port'), ()=>{
    console.log('express start');
})