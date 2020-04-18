const shamir= require('../shamir');
const bigInt= require('big-integer');
const encrypt=(req,res,next)=>{ 
    let minimum=+req.body.minimum;
    let tshares=+req.body.shares;
    let shares=shamir.generateSecret(minimum,tshares);
    shares['shares']=shares['shares'].map(v=>{v[0]=v[0].toString();v[1]=v[1].toString();return v;});
    res.jsonp(shares);
}
const decrypt=(req,res,next)=>{
    let shares=req.body.shares;
    let xp=[]
    let yp=[]
    for(share of shares){
        
        share=share.split(',');
        xp.push(bigInt(share[0].trim()));
        yp.push(bigInt(share[1].trim()));
    }
    res.jsonp({'secret':shamir.retreivefromShares(bigInt(0),xp,yp,bigInt(2).pow(127).subtract(1))})
}
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;