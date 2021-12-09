import { Console } from "console";
import fs from "fs";


const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// 自定义的简单记录器
const logger = new Console({ stdout: output, stderr: errorOutput });
// 像控制台一样使用它
const count = 5;
logger.log('count: %d', count);
// 在 stdout.log 中：count 5

console.time('100-elements');
for (let i = 0; i < 100; i++) {}
console.timeEnd('100-elements');