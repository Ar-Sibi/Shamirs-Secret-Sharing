const crypto = require('crypto');
var biformat = require('biguint-format');
const bigInt = require('big-integer')
var biformat = require('biguint-format');
let p = bigInt(2);
p = p.pow(127).subtract(1);
function generateBigRandom(max){
    var seed = biformat(crypto.randomBytes(16), 'dec');
    return bigInt(seed).mod(max);
}
function eval_at(poly, x, prime){
    let    accum = bigInt(0);
    poly.reverse();

    for (coeff of poly){
        accum=accum.multiply(x)
        accum =accum.add(coeff)
        accum =accum.mod( prime);
    }
    return accum
}
let generate_keys=(minimum,shares,prime=p)=>{
    if (minimum > shares)
        throw new Error("Pool secret would be irrecoverable.")
    let poly = [...Array(minimum).keys()].map(v=>generateBigRandom(prime));
    let points = [...Array(shares).keys()].map(v=>bigInt(v+1)).map(i=> [i, eval_at(poly.map(v=>v), i, prime)]);
    return {'secret':poly[0], shares:points}
}
function lagrange(x, x_s, y_s, p) {
    k = x_s.length
    m = {}
    x_s.forEach((v) => m[v] = 1);
    if (Object.keys(m).length != k) {
        throw new Error("Unique Keys are needed");
    }
    let PI = (vals) => {
        let accum = bigInt(1);
        for (v of vals) {
            accum = accum.multiply(v);
        }
        return accum;
    }
    let nums = []
    let dens = []
    for (i of [...Array(k).keys()]) {
        let others = x_s.slice();
        let curr = others.splice(i, 1);
        curr = curr[0];
        nums.push(PI(others.map(o =>  x.subtract(o))))
        dens.push(PI(others.map(o => curr.subtract(o))))
    }
    let den = PI(dens)
    let sums=nums.map((v, i) => ((v.multiply(den).multiply(y_s[i])).mod(p).multiply(dens[i].modInv(p))))
    let num = 
       sums .reduce((a, b) => { return a.add(b) }).mod(p);

    return (num.multiply(den.modInv(p)).mod(p).add(p)).mod(p);

}
module.exports.generateSecret=generate_keys;
module.exports.retreivefromShares=lagrange;