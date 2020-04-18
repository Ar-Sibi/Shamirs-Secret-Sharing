let rootRouter=require('express').Router();
let encryptController = require('../controllers/encrypt.controller');

rootRouter.post('/encrypt',encryptController.encrypt)
rootRouter.post('/decrypt',encryptController.decrypt)
rootRouter.get('/',(req,res)=>{
    return res.render('index.html');
})


module.exports= rootRouter;