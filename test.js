// var sm3 = require('./sm3-babel');
const sm3 = require('./sm3');
console.log(sm3('abc'));// 66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0

/* len: 192
 * k:   255
 * SM3: d670c7f027fd5f9f0c163f4bfe98f9003fe597d3f52dbab0885ec2ca8dd23e9b
 */
console.log(sm3('abcdefghABCDEFGH12345678'));

/* len: 448
 * k:   511
 * SM3: 1cf3bafec325d7d9102cd67ba46b09195af4e613b6c2b898122363d810308b11
 */
console.log(sm3('abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefgh'));

/* len: 480
 * k:   479
 * SM3: b8ac4203969bde27434ce667b0adbf3439ee97e416e73cb96f4431f478a531fe
 */
console.log(sm3('abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCD'));

/* len: 512
 * k:   447
 * SM3: 5ef0cdbe0d54426eea7f5c8b44385bb1003548735feaa59137c3dfe608aa9567
 */
console.log(sm3('abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCDEFGH'));

/* len: 576
 * k:   383
 * SM3: b160d66fc3011571d74958c79b710486649049261c01a8f75818059bf64c2e78
 */
console.log(sm3('abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCDEFGH'));
