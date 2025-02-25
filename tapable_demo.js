import { SyncHook, AsyncParallelHook } from "tapable";
class List {
  routes = ["", ""];
  setRoutes(routes) {
    this.routes = routes;
  }
  getRoutes() {
    return this.routes;
  }
}
class Car {
  hooks = {
    accelerate: new SyncHook(["newSpeed"]),
    calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"]),
  };
  constructor() {}
  setSpeed(newSpeed) {
    this.hooks.accelerate.call(newSpeed);
  }
  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes
      .promise(source, target, routesList)
      .then((res) => {
        console.log("useNavigationSystemPromise");
        console.log(res);
      });
  }
  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, callback);
  }
}
const car = new Car();
car.hooks.accelerate.tap("eventNameSync", (newSpeed) => {
  console.log("eventNameSync:", newSpeed);
});
car.hooks.accelerate.tap("eventNameSync2", (newSpeed) => {
  console.log("eventNameSync2:", newSpeed);
});
car.hooks.calculateRoutes.tapPromise(
  "eventNamePromise",
  (source, target, routesList) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("eventNamePromise:", source, target);
        routesList.setRoutes([source, target]);
        resolve();
      }, 3000);
    });
  },
);
car.hooks.calculateRoutes.tapAsync(
  "eventNameAsync",
  async (source, target, routesList) => {
    console.log("eventNameAsync:", source, target);
    routesList.setRoutes([source, target]);
  },
);
car.setSpeed(10);
car.useNavigationSystemPromise("Xian", "Nanjing");
