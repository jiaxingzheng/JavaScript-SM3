'use strict';

/*
 * JavaScript SM3
 * https://github.com/jiaxingzheng/JavaScript-SM3
 *
 * Copyright 2017, Zheng Jiaxing
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Refer to
 * http://www.oscca.gov.cn/UpFile/20101222141857786.pdf
 */

// 左补0到指定长度
function leftPad(str, totalLength) {
  var len = str.length;
  return Array(totalLength > len ? totalLength - len + 1 : 0).join(0) + str;
}

// 二进制转化为十六进制
function binary2hex(binary) {
  var binaryLength = 8;
  var hex = '';
  for (var i = 0; i < binary.length / binaryLength; i += 1) {
    hex += leftPad(parseInt(binary.substr(i * binaryLength, binaryLength), 2).toString(16), 2);
  }
  return hex;
}

// 十六进制转化为二进制
function hex2binary(hex) {
  var hexLength = 2;
  var binary = '';
  for (var i = 0; i < hex.length / hexLength; i += 1) {
    binary += leftPad(parseInt(hex.substr(i * hexLength, hexLength), 16).toString(2), 8);
  }
  return binary;
}

// utf16码点值转化为utf8二进制
function utf16CodePoint2utf8Binary(ch) {
  var utf8Arr = [];
  var codePoint = ch.codePointAt(0);

  if (codePoint >= 0x00 && codePoint <= 0x7f) {
    utf8Arr.push(codePoint);
  } else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
    utf8Arr.push(192 | 31 & codePoint >> 6);
    utf8Arr.push(128 | 63 & codePoint);
  } else if (codePoint >= 0x800 && codePoint <= 0xd7ff || codePoint >= 0xe000 && codePoint <= 0xffff) {
    utf8Arr.push(224 | 15 & codePoint >> 12);
    utf8Arr.push(128 | 63 & codePoint >> 6);
    utf8Arr.push(128 | 63 & codePoint);
  } else if (codePoint >= 0x10000 && codePoint <= 0x10ffff) {
    utf8Arr.push(240 | 7 & codePoint >> 18);
    utf8Arr.push(128 | 63 & codePoint >> 12);
    utf8Arr.push(128 | 63 & codePoint >> 6);
    utf8Arr.push(128 | 63 & codePoint);
  }

  var binary = '';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = utf8Arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var utf8Code = _step.value;

      var b = utf8Code.toString(2);
      binary += leftPad(b, Math.ceil(b.length / 8) * 8);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return binary;
}

// 普通字符串转化为二进制
function str2binary(str) {
  var binary = '';
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = str[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var ch = _step2.value;

      binary += utf16CodePoint2utf8Binary(ch);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return binary;
}

// 循环左移
function rol(str, n) {
  return str.substring(n % str.length) + str.substr(0, n % str.length);
}

// 二进制运算
function binaryCal(x, y, method) {
  var a = x || '';
  var b = y || '';
  var result = [];
  var prevResult = void 0;
  // for (let i = 0; i < a.length; i += 1) { // 小端
  for (var i = a.length - 1; i >= 0; i -= 1) {
    // 大端
    prevResult = method(a[i], b[i], prevResult);
    result[i] = prevResult[0];
  }
  // console.log(`x     :${x}\ny     :${y}\nresult:${result.join('')}\n`);
  return result.join('');
}

// 二进制异或运算
function xor(x, y) {
  return binaryCal(x, y, function (a, b) {
    return [a === b ? '0' : '1'];
  });
}

// 二进制与运算
function and(x, y) {
  return binaryCal(x, y, function (a, b) {
    return [a === '1' && b === '1' ? '1' : '0'];
  });
}

// 二进制或运算
function or(x, y) {
  return binaryCal(x, y, function (a, b) {
    return [a === '1' || b === '1' ? '1' : '0'];
  }); // a === '0' && b === '0' ? '0' : '1'
}

// 二进制与运算
function add(x, y) {
  var result = binaryCal(x, y, function (a, b, prevResult) {
    var carry = prevResult ? prevResult[1] : '0' || '0';
    if (a !== b) return [carry === '0' ? '1' : '0', carry]; // a,b不等时,carry不变，结果与carry相反
    // a,b相等时，结果等于原carry，新carry等于a
    return [carry, a];
  });
  // console.log('x: ' + x + '\ny: ' + y + '\n=  ' + result + '\n');
  return result;
}

// 二进制非运算
function not(x) {
  return binaryCal(x, undefined, function (a) {
    return [a === '1' ? '0' : '1'];
  });
}

function calMulti(method) {
  return function () {
    for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
      arr[_key] = arguments[_key];
    }

    return arr.reduce(function (prev, curr) {
      return method(prev, curr);
    });
  };
}

// function xorMulti(...arr) {
//   return arr.reduce((prev, curr) => xor(prev, curr));
// }

// 压缩函数中的置换函数 P1(X) = X xor (X <<< 9) xor (X <<< 17)
function P0(X) {
  return calMulti(xor)(X, rol(X, 9), rol(X, 17));
}

// 消息扩展中的置换函数 P1(X) = X xor (X <<< 15) xor (X <<< 23)
function P1(X) {
  return calMulti(xor)(X, rol(X, 15), rol(X, 23));
}

// 布尔函数，随j的变化取不同的表达式
function FF(X, Y, Z, j) {
  return j >= 0 && j <= 15 ? calMulti(xor)(X, Y, Z) : calMulti(or)(and(X, Y), and(X, Z), and(Y, Z));
}

// 布尔函数，随j的变化取不同的表达式
function GG(X, Y, Z, j) {
  return j >= 0 && j <= 15 ? calMulti(xor)(X, Y, Z) : or(and(X, Y), and(not(X), Z));
}

// 常量，随j的变化取不同的值
function T(j) {
  return j >= 0 && j <= 15 ? hex2binary('79cc4519') : hex2binary('7a879d8a');
}

// 压缩函数
function CF(V, Bi) {
  // 消息扩展
  var wordLength = 32;
  var W = [];
  var M = []; // W'

  // 将消息分组B划分为16个字W0， W1，…… ，W15 （字为长度为32的比特串）
  for (var i = 0; i < 16; i += 1) {
    W.push(Bi.substr(i * wordLength, wordLength));
  }

  // W[j] <- P1(W[j−16] xor W[j−9] xor (W[j−3] <<< 15)) xor (W[j−13] <<< 7) xor W[j−6]
  for (var j = 16; j < 68; j += 1) {
    W.push(calMulti(xor)(P1(calMulti(xor)(W[j - 16], W[j - 9], rol(W[j - 3], 15))), rol(W[j - 13], 7), W[j - 6]));
  }

  // W′[j] = W[j] xor W[j+4]
  for (var _j = 0; _j < 64; _j += 1) {
    M.push(xor(W[_j], W[_j + 4]));
  }

  // 压缩
  var wordRegister = []; // 字寄存器
  for (var _j2 = 0; _j2 < 8; _j2 += 1) {
    wordRegister.push(V.substr(_j2 * wordLength, wordLength));
  }

  var A = wordRegister[0];
  var B = wordRegister[1];
  var C = wordRegister[2];
  var D = wordRegister[3];
  var E = wordRegister[4];
  var F = wordRegister[5];
  var G = wordRegister[6];
  var H = wordRegister[7];

  // 中间变量
  var SS1 = void 0;
  var SS2 = void 0;
  var TT1 = void 0;
  var TT2 = void 0;
  for (var _j3 = 0; _j3 < 64; _j3 += 1) {
    SS1 = rol(calMulti(add)(rol(A, 12), E, rol(T(_j3), _j3)), 7);
    SS2 = xor(SS1, rol(A, 12));

    TT1 = calMulti(add)(FF(A, B, C, _j3), D, SS2, M[_j3]);
    TT2 = calMulti(add)(GG(E, F, G, _j3), H, SS1, W[_j3]);

    D = C;
    C = rol(B, 9);
    B = A;
    A = TT1;
    H = G;
    G = rol(F, 19);
    F = E;
    E = P0(TT2);
  }

  return xor(Array(A, B, C, D, E, F, G, H).join(''), V);
}

// sm3 hash算法 http://www.oscca.gov.cn/News/201012/News_1199.htm
function sm3(str) {
  var binary = str2binary(str);
  // 填充
  var len = binary.length;
  // k是满足len + 1 + k = 448mod512的最小的非负整数
  var k = len % 512;
  // 如果 448 <= (512 % len) < 512，需要多补充 (len % 448) 比特'0'以满足总比特长度为512的倍数
  k = k >= 448 ? 512 - k % 448 - 1 : 448 - k - 1;
  var m = (binary + '1' + leftPad('', k) + leftPad(len.toString(2), 64)).toString(); // k个0

  // 迭代压缩
  var n = (len + k + 65) / 512;

  var V = hex2binary('7380166f4914b2b9172442d7da8a0600a96f30bc163138aae38dee4db0fb0e4e');
  for (var i = 0; i <= n - 1; i += 1) {
    var B = m.substr(512 * i, 512);
    V = CF(V, B);
  }
  return binary2hex(V);
}

module.exports = sm3;
