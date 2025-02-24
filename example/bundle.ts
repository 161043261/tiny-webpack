export interface IFileId_To_fnAndDepPath2DepId {
  [key: number]: /** fileId */ [
    (
      require: (filepath: string) => object,
      module: { exports: object },
      exports: object,
    ) => void,
    {
      [key: string]: number;
    }?,
  ]; // fnAndDeps
}

(function (fileId_To_fnAndDepPath2DepId: IFileId_To_fnAndDepPath2DepId) {
  function require(fileId: number): object {
    const [fn, depPath2depId /** filepath2fileId */] =
      fileId_To_fnAndDepPath2DepId[fileId];
    const module = {
      exports: {},
    };

    const use2 = (depPath: string): object => {
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
      // main.js

      // import foo from "./foo.js";
      const { foo } = require("./foo.js") as { foo: any };
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
      // foo.js

      /** export */ function foo() {
        console.log("foo");
      }
      module.exports = {
        foo,
      };
    },
  ],
});
