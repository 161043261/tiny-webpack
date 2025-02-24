//! tsconfig.json: "allowSyntheticDefaultImports": true
import fs from "node:fs";
import parser from "@babel/parser";
import path from "node:path";
import ejs from "ejs";
//! pnpm i @babel/core -D
//! pnpm i @babel/preset-env -D
import { transformFromAst, transformFromAstSync } from "@babel/core";

// import traverse from "@babel/traverse";

import _traverse from "@babel/traverse";
// @ts-ignore
const traverse: typeof _traverse = _traverse.default;

let fileId = 0;

interface IAsset {
  filepath: string;
  cjsCode: string;
  deps: string[];
  fileId: number;
  depPath2depId?: { [key: string]: number };
}

function createAsset(filepath: string): IAsset {
  // 1. 获取文件内容
  const sourceCode: string = fs.readFileSync(filepath, {
    encoding: "utf8",
  });
  // console.log(source /** .toString() */);

  // 2. 生成 AST 抽象语法树
  //! pnpm i @babel/parser -D
  const ast = parser.parse(sourceCode, {
    sourceType: "module",
  });

  const deps: string[] = [];

  // 3. 遍历 AST 抽象语法树, 获取依赖关系
  //! pnpm i @babel/traverse -D
  traverse(ast, {
    ImportDeclaration({ node }) {
      // console.log(node.source.value); //! .foo
      deps.push(node.source.value);
    },
  });

  const { code: cjsCode } = transformFromAstSync(ast, undefined, {
    presets: ["@babel/preset-env"],
  });

  // cjsCode = sourceCode;

  return {
    filepath,
    cjsCode,
    deps,
    fileId: fileId++,
    depPath2depId: {},
  };
}

// const assets = createAsset();
// console.log(assets)

//! 二叉树先序遍历: 深度优先搜索
//! 二叉树层序遍历: 广度优先搜索
function createGraph(mainPath: string): IAsset[] {
  const mainAsset = createAsset(mainPath.replaceAll("\\", "/"));
  //! 广度优先搜索
  const queue = [mainAsset];
  for (const asset of queue) {
    for (const relativePath of asset.deps) {
      const depAsset = createAsset(path.resolve("./example", relativePath));
      asset.depPath2depId[relativePath.replaceAll("\\", "/")] = depAsset.fileId;
      // console.log(depAsset);
      queue.push(depAsset);
    }
  }
  return queue;
}

const graph = createGraph("./example/main.js");
// console.log(graph);

function build(graph: IAsset[]) {
  const template = fs.readFileSync("./bundle.ejs", {
    encoding: "utf8",
  });
  const data = graph.map((asset) => {
    return {
      fileId: asset.fileId,
      // filepath: asset.filepath.replaceAll("\\", "/"),
      cjsCode: asset.cjsCode,
      depPath2depId: asset.depPath2depId,
    };
  });
  // console.log(data);
  const code = ejs.render(template, { data });
  // console.log(code);
  fs.writeFileSync("./dist/bundle.js", code);
}

build(graph);
