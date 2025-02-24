(function (fileId_To_fnAndDepPath2DepId) {
  function require(fileId) {
    const [fn, depPath2depId] = fileId_To_fnAndDepPath2DepId[fileId];
    const module = {
      exports: {},
    };
    const use2 = (depPath) => {
      const depId = depPath2depId[depPath];
      return require(depId);
    };
    fn(use2, module, module.exports);
    return module.exports;
  }
  require(0);
})({
  [0]: [
    function (require, module, exports) {
      const { foo } = require("./foo.js");
      foo();
      console.log("main.js");
      module.exports = {};
    },
    {
      ["./foo.js"]: 1,
    },
  ],
  [1]: [
    function (require, module, exports) {
      function foo() {
        console.log("foo");
      }
      module.exports = {
        foo,
      };
    },
  ],
});
export {};
