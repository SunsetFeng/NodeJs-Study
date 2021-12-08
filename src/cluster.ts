import cluster from "cluster";
import { createServer } from "http";
import path from "path";
//测试Worker类上的事件
{
  if (cluster.isPrimary) {
    //当前是主进程
    // 新建一个文件worker.ts作为工作进程的入口文件
    // let workerPath = path.resolve(__dirname,"worker.ts");
    // cluster.setupPrimary({
    //   exec: workerPath
    // })
    let work = cluster.fork();  //创建一个工作进程
    work.on('online', () => {
      //工作进程开始工作
      console.log('worker:online事件在创建后自动触发,表示工作进程开始工作');
    })
    work.on('disconnect', () => {
      //工作进程断开连接
      console.log('worker:disconnect事件在工作进程断开连接时触发');
    })
    work.on('error', () => {
      //工作进程错误
      console.log('worker:error事件在发生错误时触发')
    })
    work.on('exit', (code, signal) => {
      //工作进程退出
      if (signal) {
        console.log(`worker was killed by signal: ${signal}`);
      } else if (code !== 0) {
        console.log(`worker exited with error code: ${code}`);
      } else {
        console.log('worker success!');
      }
    })
    work.on('listening',() => {
      //工作进程监听时触发
      console.log('worker:listening事件在监听时触发');
    })
    work.on('message',(message,handle) => {
      console.log(message);
    })

  } else if (cluster.isWorker) {
    //当前是工作进程
    let server = createServer((req, res) => {
      console.log('接收请求');
      res.write('Hello');
      res.end();
    }).listen(8000);
    cluster.worker?.disconnect();
    //此时进程并不会退出
    cluster.worker?.on('disconnect',() => {
      server.close();
      // cluster.worker?.kill();
      //当server关闭后进程退出,这儿有个异步问题需要重点注意
      /*
      官方API关于disconnect的介绍如下:在工作者进程中调用,将关闭所有的服务器,等待服务器上的close事件,然后断开IPC通道。在主进程中调用，内部消息发送至工作进程，调用工作进程的disconnect
      如果文档没错的话,那么实际调用的都是工作进程的disconnect方法。但这儿有个问题需要注意,"将关闭所有的服务器"可能存在关闭不完全的情况,我猜测开启server是异步的,假如在server开启的过程中
      调用了disconnect,这个server实际上并没有被关闭。此时disconnect事件会触发,但不会触发exit事件。这里存在异步操作导致的问题，许多疑惑暂时还无法解惑,还需要后续学习。但这儿总结一个规则：
      如果想要确保disconnect能正常的关闭工作进程。要么保证所有的server都正常开启后再去disconnect，或者保证disconnect断开后再去关闭所有的server。因为这些操作应该都是异步的,在对这种有依赖
      关系的异步操作中，至少应该保证依赖的状态能固定,这样才能保证自己的操作准确性。
      */
    })
  } else {
    //这儿不可能 只是为了突出 cluster区分进程的标识
  }
}