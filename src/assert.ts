/**
 * 断言错误
 */
import assert from "assert";

//断言错误
namespace AssertionError {
  //配置属性描述了一个断言操作(实际值,期望值,断言操作) 以及错误提示等
  let assertError = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual',
  });

  let message = assertError.message;

  try {
    assert.strictEqual(1, 2);
  } catch (err) {
    assert(err instanceof assert.AssertionError);
    assert.strictEqual(err.message, message);
    assert.strictEqual(err.name, 'AssertionError');
    assert.strictEqual(err.actual, 1);
    assert.strictEqual(err.expected, 2);
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    assert.strictEqual(err.operator, 'strictEqual');
    assert.strictEqual(err.generatedMessage, true);
  }
}

//深度严格比较
namespace deepStrictEqual {
  const date = new Date();
  const object = {};
  const fakeDate = {};
  Object.setPrototypeOf(fakeDate,Date.prototype);
  //会比较原型对象
  try{
    assert.deepStrictEqual(object,fakeDate);
  }catch{
    console.log("比较原型对象失败");
  }
  // 会比较类型标签
  try{
    assert.deepStrictEqual(fakeDate,date);
  }catch{
    console.log("比较类型失败");
  }
  // 比较基于Object.is();
  assert.deepStrictEqual(NaN,NaN);
  console.log("NaN是否相等: === ", NaN === NaN);
  console.log("NaN是否相等: Object.is() ", Object.is(NaN,NaN));
}
//非正则断言匹配
namespace doesNotMatch {
  //匹配成功报错
  try{
    assert.doesNotMatch("I will fail",/fail/);
  }catch{
    console.log('正则匹配成功');
  }
}
// 是否错误
namespace ifError {
  //如果不是null或者undefined  则抛出error
  assert.ifError(null);
  assert.ifError(undefined);
  try{
    assert.ifError(0);
  }catch{
    console.log("ifError期待值不是null或者undefiend");
  }
  //此处看信息其实可以看到期待值是unll  expected:null,即传入值是和null比较
  //此处比较是个"弱相等",即不是严格比较
}
// 正则断言
namespace match {
  assert.match("I will fail",/fail/);
}
