import { Hook } from "./index";

export class ChangeOutputPath {
  apply(hooks: Hook) {
    // 在 emitFile 上注册一个 change-output-path 事件
    hooks.emitFile.tap("change-output-path", (pluginContext) => {
      pluginContext.changeOutputPath("./dist/bundle2.js");
    });
  }
}
