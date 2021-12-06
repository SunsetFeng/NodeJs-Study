
学习文档基于v16.13.1,只记录重要且稳定的特性。
# NodeJs-Study
## 一.assets -- 断言 重要程度:低  有点类似Jest单元测试
- AssertionError -- 断言错误
- assert --断言  期待一个"真值" assert.ok的别名
- assert.deepStrictEqual --测试actual和expected参数的深度相等,深度意味着自身属性会递归比较
- assert.doesNotMatch -- 非正则断言
- assert.ifError -- 是否错误断言
- assert.match -- 正则断言

## 二.buffer --缓冲区 重要程度:中-高
**buffer是Unit8Array的子类 因此里面每个元素的取值范围是0-127,默认使用utf-8的编码格式**
- format  -- 编码规则
- TypeArray  -- 定型数组转换与共享内存
- API --常用API
  1. alloc  --分配空间
  2. allocUnsafe,allocUnsafeSlow --不安全的快速分配内存
  3. byteLength --字节长度
  4. concat --buffer连接 共享内存 快速分配
  5. from --buffer创建 共享内存 快速分配
  6. subarray --内存裁剪 同slice 效果一致
  7. swap16,swap32,swap64 --字节内部交换顺序(2,4,8个一组)
  8. toJSON  --转换为json字符串
  9. write --写入字节