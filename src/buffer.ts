//编码格式转换
namespace format {
  const buf = Buffer.from('hellow world', 'utf8');
  console.log(buf); //[104, 101, 108, 108, 111, 119, 32, 119, 111, 114, 108, 100]
  console.log(buf.toString('hex')); //68656c6c6f7720776f726c64
  console.log(buf.toString('ascii')); //hellow world
  console.log(buf.toString('utf-8')); //hellow world
  //Buffer.from将按照一定的编码格式将字符串转换为字节数组
  //比如上面用例 buf 缓冲区里面的内容 [104, 101, 108, 108, 111, 119, 32, 119, 111, 114, 108, 100]  每个单词都能转换为一个字节
  //当按照'hex'格式转换时,每个字节转换为2个16进制数 我拿104举例  104二进制表示 01101000  十六进制表示68  因此转换结果是68656c6c6f7720776f726c64
  //转换为'ascii'和'buf-8'  都和原本没变化,这是因为测试字符串都是英文  此时编码格式ascii,utf-8转换结果一致

  const cbuf = Buffer.from('测试用例', 'utf8');
  console.log(cbuf); //[230, 181, 139, 232, 175, 149, 231, 148, 168, 228, 190, 139]
  console.log(cbuf.toString('hex')); //e6b58be8af95e794a8e4be8b
  console.log(cbuf.toString('ascii')); //f5h/g(d>
  console.log(cbuf.toString('utf-8')); //测试用例

  //此时 '测试用例' 字符串被转换为12个字节  这是因为utf-8编码是一个扩展编码  他的字节数是不固定的 一般1-6字节 中文一般3字节 只需要按照一定的编码规则,就可以表示任意的字符
  //'hex' 格式编码和上面一致 每个字节转换为2个16进制数
  //'ascii' 编码出现乱码  这是因为'ascii'编码的内容范围是0-127,使用这个编码格式时,一个字节的最高位是0 因此不能表示码值大于127的字符
  //'utf-8编码'为原始值 230 181 139 为什么表示 '测'?  => 11100110 10110101 10001011 utf-8编码规则:第一个字节前面多少个1表示多少个字节 后续字节开头10表示是后续字节 如果只有一个字节 则0开头
}
//定型数组
namespace TypeArray {
  //将buf传给定型数组 赋值不共享
  const buf = Buffer.from([1, 2, 3, 4]);
  const uint32array = new Uint32Array(buf);
  console.log(uint32array);
  buf[0] = 10;
  console.log(uint32array);

  //共享内存
  const uint16array = new Uint16Array(
    buf.buffer,
    buf.byteOffset,
    buf.length / Uint16Array.BYTES_PER_ELEMENT);

  console.log(uint16array); //[522, 1027]
  //解释为什么会输出[522,1027]
  //buffer是一个定型数组 长度是8192 Buffer.poolSize 1024*8 8kb的大小 分配内存部分详解
  //通常情况下 我们的数据不会这么大 因此只用到了部分内存 所以需要设置偏移和长度来确定我们的数据在这段内存中到底是哪部分 [......,10,2,3,4,....]
  //这个buffer终究是以8位来存储的，当转为Uint16Array时 会进行合并操作 因为Uint16Array是16位的 10的二进制 10,2,3,4 => [00001010 00000010 00000011 00000100]
  //默认情况下buffer字节里面的存储是小端排序的 低字节地址存放低有效字节 因此,读取的结果是 [0000001000001010 0000010000000011] => [522,1027]

  buf[0] = 1;
  console.log(uint16array); // [513,1027];
  //可以看到 共享一块内存区

  const arr = new Uint16Array(10);
  const buf2 = Buffer.from(arr.buffer, 0, 8);
  console.log(buf2); //[0, 0, 0, 0, 0, 0, 0, 0]
  arr[0] = 10;
  console.log(buf2); //[10, 0, 0, 0, 0, 0, 0, 0] 前两位10 0
  arr[1] = 257;
  console.log(buf2); //[10, 0, 1, 1, 0, 0, 0, 0] 前四位 10 0 1 1
  //上面用例也是共享一个内存区  但区别在于 每修改原始数组的一个值  Buffer数组里面的值是变化2位  这是因为一个Uint16Array占据2个字节16位  而Buffer是一个8位数组类型
}
//常用API
namespace API {
  //alloc 分配内存
  {
    let buf = Buffer.alloc(10); //全部以0填充
    buf = Buffer.alloc(10, 'a'); //不指定编码格式 默认以utf-8格式编码
    console.log(buf);
    buf = Buffer.alloc(10, "我", 'utf16le')
    console.log(buf);
  }
  //allocUnsafe allocUnsafeSlow 不安全的分配内存
  {
    const buf = Buffer.allocUnsafe(3000);
    console.log(buf.byteOffset); //2648 不固定
    const buf1 = Buffer.allocUnsafe(1000);
    console.log(buf1.byteOffset); //5656 不固定
    console.log(buf.buffer === buf1.buffer);  //true 不固定
    const buf2 = Buffer.allocUnsafe(2000);
    console.log(buf2.byteOffset); //0 不固定
    console.log(buf2.buffer === buf1.buffer);  //false 不固定

    //Buffer模块内存有一个8192大小的预分配的内存池 这个大小就是Buffer.poolSize 当使用快速分配内存  即allocUnsafe,from和concat方法创建Buffer实例时 会根据当前内存池的内存空间快速创建实例。
    //但当分配空间的大小大于4kb时，不会选择从池中分配,而是new一个Buffer实例，单独分配一个不共享的内存空间。简单点说就是这几个Buffer实例可能会共用同一块内存空间 各自存在一个偏移值和长度来定位
    //自己的内存内容。当不断的分配内存，而内存池上没有足够的空间啦，此时就又会开辟一个新的内存池来分配。由于是预先分配了内存池，因此比起alloc会快一些 但存在没有格式化的数据 因此需要手动格式化
    const buf3 = Buffer.allocUnsafeSlow(10); //缓慢的不安全分配
    //通过allocUnsafeSlow分配的内存和allocUnsafe大于4kb的情况一下,是单独分配的内存空间,不是使用的共享空间
  }
  //byteLength 字节长度
  {
    const str = '\u00bd + \u00bc = \u00be';

    console.log(`${str}: ${str.length} characters, ` +   //9
      `${Buffer.byteLength(str, 'utf8')} bytes`);   //12
    //字符串的长度不会考虑编码 因此是9的长度,转码后一个字符可能占用几个字节 因此字节长度会大于字符长度
  }
  //concat buffer连接 快速分配内存
  {
    const buf = Buffer.alloc(10, 1);  //独立内存
    const buf1 = Buffer.alloc(10, 2);  //独立内存
    const newBuf = Buffer.concat([buf, buf1]);  //共享内存
    //这个方法返回的buffer实例是使用了共享的内存池,快速分配内存。
  }
  //from
  {
    const buf = Buffer.from("hello world");
    const buf1 = Buffer.from(buf);
    //都是快速分配内存，根据内存池里面的剩余容量大小，可能共享同一片内存，但不共享同一个内存区域
    const arr = new Uint16Array(2);
    arr[0] = 5000;
    arr[1] = 4000;
    const buf2 = Buffer.from(arr.buffer);
    console.log(buf2.buffer === arr.buffer);
    //此时,buffer实例对象不会从内存池里面分配空间，而是直接将传入的ArrayBuffer作为底层的内存空间使用
  }
  //subarray
  {
    const buf1 = Buffer.from('hello world');
    console.log(buf1.byteOffset);
    const buf2 = buf1.subarray(3,buf1.length-1);
    console.log(buf2.byteOffset); //buf1.byteOffset + 3
    console.log(buf1.buffer === buf2.buffer);  //true
    //共享同一片内存区，偏移位置根据传入的start调整
  }
  //swap16
  {
    const buf = Buffer.from([0,1,2,3,4,5,6,7,8,9]);
    buf.swap16();
    console.log(buf); // ===> [1,0,3,2,5,4,7,6,9,8];  //每2位交换顺序
    //由于存在2位交换的特性 因此可以快速的进行UTF-16小端序和大端序的转换
  }
  //toJSON
  {
    const buf = Buffer.from([1,2,3,4]);
    const json = JSON.stringify(buf);
    console.log(json);  //{"type":"Buffer","data":[1,2,3,4]}
    let jsonObj = JSON.parse(json);
    console.log(Buffer.from(jsonObj.data));
  }
  //write
  {
    const buf = Buffer.alloc(256);
    const len = buf.write('测试用例'); //默认utf-8格式,偏移0
    console.log(len);  //12 一个中文3个字节
  }
}
