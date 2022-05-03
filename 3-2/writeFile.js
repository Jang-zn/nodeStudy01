const fs = require('fs').promises; 

fs.writeFile('./writeMe2.txt','글이 작성됨')
.then(()=>{
    return fs.readFile('./writeMe2.txt');
})
.then((data)=>{
    console.log(data.toString());
})
.catch((err)=>{

})