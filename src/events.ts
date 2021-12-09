import EventEmitter from 'events';

//事件回调函数的箭头方法与常规方法
{
  //扩展Event对象
  class MyEmitter extends EventEmitter { }
  const myEmitter = new MyEmitter();
  myEmitter.on('event', (a, b) => {
    console.log('箭头函数的this引用不指向eventEmitter对象');
    console.log(a, b, this, this === myEmitter);
  });
  myEmitter.on('event', function (this: MyEmitter, a, b) {
    console.log('常规函数的this指向eventEmitter对象');
    console.log(a, b, this, this === myEmitter);
  });
  myEmitter.emit('event', 'a', 'b');
}
//once注册监听方法
{
  let num = 0;
  class MyEmitter extends EventEmitter { }
  const myEmitter = new MyEmitter();
  myEmitter.once('event', function (this: MyEmitter, a, b) {
    console.log('触发次数:', ++num);
    console.log(a, b, this, this === myEmitter);
  });
  myEmitter.emit('event', 'a', 'b');
  //只触发一次
  myEmitter.emit('event', 'a', 'b');
}
//error事件处理
{
  //默认情况下,当触发错误会退出Node.js进程，如果监听了error方法，则不会退出
  //errorMonitor是一个错误监听器,可以给我们监听错误回调,但不会消费错误,依旧退出Node.js进程
  class MyEmitter extends EventEmitter { }
  const myEmitter = new MyEmitter();
  myEmitter.on('error', err => {
    console.error('不会退出Node.js');
  });
  // myEmitter.on(errorMonitor, err => {
  //   console.error('依旧退出Node.js');
  // });
  myEmitter.emit('error', new Error('whoops!'));
  console.log('看到这行日志代表未退出');
}