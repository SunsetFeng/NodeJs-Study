
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

## 三.child_process --子进程 重要程度:低
child_process子进程主要结合Shell命令一起使用，对于编写自动化脚本会很有帮助。侧重工具的实现，如三方库打包时编写打包Node程序，执行不同的Shell命令等。暂且不做太多了解。
## 四.cluster --集群
**集群简单来说就是多个进程同时运行。主进程通过fork创建工作进程,主进程与工作进程之间通过IPC通道进行通信,需要注意的是,这里面的操作大多也许全部都是异步操作,需要确保流程的正确性。**
**尤其是disconnect和server创建之间的顺序关系,否则可能不会达到预期效果**
- Worker类  --进程封装类 内部实际核心应该是process对象
  1. disconnect事件  --断开连接
  2. exit事件  --退出进程
  3. listening事件  --监听服务
  4. message事件  --通道消息
  5. online事件  --开始工作
  6. 关键API
     1. disconnect --关闭连接
     2. kill  --杀死进程
     3. send  --发送IPC通道消息
- cluster  --集群 --事件几乎同Worker 可以理解为Worker的容器 Worker的事件触发cluster都有对应的事件类型
  1. fork事件 --创建事件  这个事件Worker不存在 
  2. 关键API
     1. fork  --创建工作进程
     2. disconnect  --调用所有Worker的断开连接事件
     3. setupPrimary --更改'fork'行为,设置的对象是cluster.settings 设置后,将更改这个对象,只会影响后面创建的工作进程,非常重要,主要可用用于更改工作进程的入口文件。
