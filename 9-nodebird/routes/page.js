// const express = require('express');
// const { renderProfile, renderJoin, renderMain } = require('../controllers/auth');

// const router = express.Router();

// router.use((req, res, next) => {
//   res.locals.user = null;
//   res.locals.followerCount = 0;
//   res.locals.followingCount = 0;
//   res.locals.followingIdList = [];
//   next();
// });

// router.get('/profile', renderProfile);

// router.get('/join', renderJoin);

// router.get('/', renderMain);

// module.exports = router;

const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
  });

router.get('/profile', (req,res)=>{
    res.render('profile', {title:'내 정보 - NodeBird'});
});


router.get('/join',(req, res)=>{
    res.render('join',{title:'회원가입 - NodeBird'});
});

router.get('/', (req, res, next)=>{
    console.log("here!!!!!!");
    const twits = [];
    res.render('main',{
        title:'NodeBird',
        twits,
    });
});


module.exports = router;