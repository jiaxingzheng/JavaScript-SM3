# JavaScript SM3

## 简介
国密SM3密码杂凑算法的JavaScript实现。目前只能在服务器端环境Node.js使用。

## 使用
直接下载源代码将sm3.js拷贝到你的项目中，或者使用[npm](https://www.npmjs.org/)安装：

```sh
npm install sm3
```

```js
const sm3 = require('sm3');
const hash = sm3('值');
```

## 要求
没有依赖，但Node.js版本需>=6.0.0，或使用sm3-babel.js文件（Node.js版本>=1.0.0），
也可自行使用[Babel](http://babeljs.io/)对sm3.js文件进行转化
```sh
babel sm3.js --out-file sm3-babel.js
```

## 接口

```js
const hash = sm3('值');
```

## 参考
[SM3密码杂凑算法](http://www.sca.gov.cn/sca/xwdt/2010-12/17/1002389/files/302a3ada057c4a73830536d03e683110.pdf)

## License
[MIT license](http://www.opensource.org/licenses/MIT).
