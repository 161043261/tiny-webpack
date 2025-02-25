import fs from "node:fs";
import parser from "@babel/parser";
import path from "node:path";
import ejs from "ejs";
import { transformFromAstSync } from "@babel/core";
import { jsonLoader } from "./json_loader";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
const tinyConfig = {
  module: {
    rules: [
      {
        extRegExp: /\.json$/,
        loaderChain: [jsonLoader],
      },
    ],
  },
};
let fileId = 0;
function createAsset(filepath) {
  let sourceCode = fs.readFileSync(filepath, {
    encoding: "utf8",
  });
  const loaderRules = tinyConfig.module.rules;
  const loaderContext = {
    addDeps(dep) {
      console.log("loaderContext.addDeps:", dep);
    },
  };
  for (const loaderRule of loaderRules) {
    const { extRegExp, loaderChain } = loaderRule;
    if (extRegExp.test(filepath)) {
      if (Array.isArray(loaderChain)) {
        for (const loader of loaderChain) {
          sourceCode = loader.call(loaderContext, sourceCode);
        }
      } else {
        sourceCode = loaderChain.call(loaderContext, sourceCode);
      }
    }
  }
  const ast = parser.parse(sourceCode, {
    sourceType: "module",
  });
  const deps = [];
  traverse(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });
  const { code: cjsCode } = transformFromAstSync(ast, undefined, {
    presets: ["@babel/preset-env"],
  });
  return {
    filepath,
    cjsCode,
    deps,
    fileId: fileId++,
    depPath2depId: {},
  };
}
function createGraph(mainPath) {
  const mainAsset = createAsset(mainPath.replaceAll("\\", "/"));
  const queue = [mainAsset];
  for (const asset of queue) {
    for (const relativePath of asset.deps) {
      const depAsset = createAsset(path.resolve("./example", relativePath));
      asset.depPath2depId[relativePath.replaceAll("\\", "/")] = depAsset.fileId;
      queue.push(depAsset);
    }
  }
  return queue;
}
const graph = createGraph("./example/main.js");
function build(graph) {
  const template = fs.readFileSync("./bundle.ejs", {
    encoding: "utf8",
  });
  const data = graph.map((asset) => {
    return {
      fileId: asset.fileId,
      cjsCode: asset.cjsCode,
      depPath2depId: asset.depPath2depId,
    };
  });
  const code = ejs.render(template, { data });
  fs.writeFileSync("./dist/bundle.js", code);
}
build(graph);
