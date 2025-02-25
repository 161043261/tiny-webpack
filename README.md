# tiny-webpack

## loader

webpack 只能理解 JS (和 JSON), loader 使得 webpack 可以处理其他类型的文件

babel 只能理解 JS

## plugin

plugin 是一个有 apply 方法的 JS 对象, apply 方法由 webpack 编译器调用, 可以访问整个编译生命周期

webpack 在不同的编译阶段派发不同的事件, 插件可以监听这些事件, 获取 webpack 派发的事件参数, 改变打包行为

webpack 事件库 [tapable](https://github.com/webpack/tapable)
