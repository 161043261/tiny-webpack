import { SyncHook, AsyncParallelHook } from "tapable";

class List {
  routes: [source: string, target: string] = ["", ""] as const;
  setRoutes(routes: [source: string, target: string]) {
    this.routes = routes;
  }
  getRoutes() {
    return this.routes;
  }
}

class Car {
  hooks = {
    // 事件名, 事件参数
    accelerate: new SyncHook<number>(["newSpeed"] /** newSpeed: number */),
    calculateRoutes: new AsyncParallelHook<[string, string, List]>([
      "source", // source: string
      "target", // target: string
      "routesList", // routesList: List
    ]),
  };

  constructor() {}
  setSpeed(newSpeed: number) {
    // 触发 accelerate 上的所有事件
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source: string, target: string) {
    const routesList = new List();
    // 触发 calculateRoutes 上的所有事件
    return this.hooks.calculateRoutes
      .promise(source, target, routesList)
      .then((res) => {
        console.log("useNavigationSystemPromise");
        console.log(res);
      });
  }

  useNavigationSystemAsync(
    source: string,
    target: string,
    callback: (err: Error) => void,
  ) {
    const routesList = new List();
    // 触发 calculateRoutes 上的所有事件
    this.hooks.calculateRoutes.callAsync(source, target, routesList, callback);
  }
}

const car = new Car();
// 在 accelerate 上注册一个 eventNameSync 事件
car.hooks.accelerate.tap("eventNameSync", (newSpeed: number) => {
  console.log("eventNameSync:", newSpeed);
});

// 在 accelerate 上注册一个 eventNameSync2 事件
car.hooks.accelerate.tap("eventNameSync2", (newSpeed: number) => {
  console.log("eventNameSync2:", newSpeed);
});

// 在 calculateRoutes 上注册一个 eventNamePromise 事件
car.hooks.calculateRoutes.tapPromise(
  "eventNamePromise",
  (source: string, target: string, routesList: List) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("eventNamePromise:", source, target);
        routesList.setRoutes([source, target]);
        resolve();
      }, 3000);
    });
  },
);

// 在 calculateRoutes 上注册一个 eventNameAsync 事件
car.hooks.calculateRoutes.tapAsync(
  "eventNameAsync",
  async (source: string, target: string, routesList: List) => {
    console.log("eventNameAsync:", source, target);
    routesList.setRoutes([source, target]);
  },
);

// 触发 accelerate 上的所有事件: eventNameSync, eventNameSync2
car.setSpeed(10);

// 触发 calculateRoutes 上的所有事件: eventNamePromise, eventNameAsync
car.useNavigationSystemPromise("Xian", "Nanjing");

// 触发 calculateRoutes 上的所有事件: eventNamePromise, eventNameAsync
// car.useNavigationSystemAsync("Nanjing", "Shanghai", (err: Error) => {
//   console.log("useNavigationSystemAsync");
//   if (err) {
//     console.error(err);
//   }
// });
