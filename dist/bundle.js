/** Do NOT modify this file */

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
  ["0"]: [
    function (require, module, exports) {
      "use strict";

      var _foo = require("./foo.js");
      var _baz = _interopRequireDefault(require("./baz.json"));
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e };
      }
      console.log(_baz["default"]);
      (0, _foo.foo)();
      console.log("main.js");
    },
    { "./foo.js": 1, "./baz.json": 2 },
  ],

  ["1"]: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.foo = foo;
      var _bar = _interopRequireDefault(require("./bar.js"));
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e };
      }
      (0, _bar["default"])();
      function foo() {
        console.log("foo");
      }
    },
    { "./bar.js": 3 },
  ],

  ["2"]: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports["default"] = void 0;
      var _default = (exports["default"] =
        '{\n  "name": "baz",\n  "age": 22\n}\n');
    },
    {},
  ],

  ["3"]: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports["default"] = bar;
      function bar() {
        console.log("bar");
      }
    },
    {},
  ],
});
