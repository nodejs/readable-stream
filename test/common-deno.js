import {strictEqual} from "assert";
import {deferred} from "async";

export function expectsError({code, type, message}){
  return function(error){
    strictEqual(error.code, code);
    strictEqual(error.type, type);
    strictEqual(error.message, message);
  }
}

export function mustCall(cb = () => {}, times = 1){
  const promise = deferred();

  const timeout = setTimeout(() => {
    promise.reject(new Error("Function call timeout"));
  }, 10000);

  let called = 0;
  return function(...args){
    cb.apply(this, args);
    called++;
    if(called === times){
      promise.resolve();
      clearTimeout(timeout);
    }
  };
}

export function mustNotCall(){
  return () => {
    throw new Error("Function call timeout")
  };
}

export default {
  expectsError,
  mustCall,
  mustNotCall,
};