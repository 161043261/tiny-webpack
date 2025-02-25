export class ChangeOutputPath {
  apply(hooks) {
    hooks.emitFile.tap("change-output-path", (pluginContext) => {
      pluginContext.changeOutputPath("./dist/bundle2.js");
    });
  }
}
