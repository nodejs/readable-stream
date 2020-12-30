import Stream from "./_readable-deno.js";

//TODO
//Add typings for module here

const {
  Duplex,
  finished,
  PassThrough,
  pipeline,
  Readable,
  Transform,
  Writable,
} = Stream;

export default Stream;
export {
  Duplex,
  finished,
  PassThrough,
  pipeline,
  Readable,
  Stream,
  Transform,
  Writable,
};