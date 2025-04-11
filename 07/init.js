//! our state holds the village's current location and the leftover parcels 
const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else graph[from] = [to];
    if (to in graph) {
      graph[to].push(from);
    } else graph[to] = [from];
  }

  for (const edge of edges) {
    const [from, to] = edge.split("-");
    addEdge(from, to);
  }
  return graph;
}
const roadGraph = buildGraph(roads);

const randomPick = (array) => array[Math.floor(Math.random() * array.length)]
// creating a village state -> robot location, parcels{loc, address}
class VillageState {
  constructor(robotLoc, parcels) {
    this.robotLoc = robotLoc;
    this.parcels = parcels
  }

  move(nextLoc) {
    if (this.robotLoc == nextLoc) return this

    const parcels = this.parcels.map(({ currentLoc, address }) => {
      if (this.robotLoc === currentLoc) return { currentLoc: nextLoc, address };
      return { currentLoc, address }
    })
    const newParcels = parcels.filter(parcel => parcel.currentLoc !== parcel.address)
    console.log("robot's loc ", this.robotLoc, " next location ", nextLoc, "parcels", newParcels)
    return new VillageState(nextLoc, newParcels)
  }

  static random(startingLoc, numberOfPackages) {
    const parcels = []
    for (let i = 0; i < numberOfPackages; i++) {
      const currentLoc = randomPick(Object.keys(roadGraph))
      let address;
      do {
        address = randomPick(Object.keys(roadGraph))
      } while (address === currentLoc);
      parcels.push({ currentLoc, address })
    }
    console.log('starting from ', startingLoc, 'parcels created', parcels)
    return (new VillageState(startingLoc, parcels))
  }
}


//! robot determines next direction
//! what about the entire next route
function goalOrientedBot({ robotLoc, parcels }, route = []) {
  if (!route.length) {
    const nextParcel = parcels[0]
    if (robotLoc === nextParcel.currentLoc)
      route = findRoute(roadGraph, robotLoc, nextParcel.address)

    else route = findRoute(roadGraph, robotLoc, nextParcel.currentLoc)
  }

  return { direction: route[0], routes: route.slice(1) }
}

function goLazyBot({ robotLoc, parcels }, route = []) {
  if (!parcels.length) return { direction: robotLoc, routes: [] }
  if (!route.length) {
    const nextParcel = parcels.find(p => p.currentLoc !== robotLoc) ?? parcels[0]

    route = robotLoc === nextParcel.currentLoc ? findRoute(roadGraph, robotLoc, nextParcel.address) :
      findRoute(roadGraph, robotLoc, nextParcel.currentLoc)
  }

  return { direction: route[0], routes: route.slice(1) }
}
function tspRobot({ robotLoc, parcels }, route = []) {
  console.log('called tsp ', robotLoc, parcels)
  if (parcels.length == 0) return { direction: robotLoc, routes: [] }
  if (!route.length) {
    const destinations = []
    for (const parcel of parcels) {
      if (parcel.currentLoc === robotLoc) destinations.push(parcel.address) //if parcel is with bot, push it's delivery point else
      else destinations.push(parcel.currentLoc)
    }

    const trail = new Set(destinations)
    let sortedTrail = [robotLoc]
    console.log('early trail', trail, sortedTrail)
    while (trail.size > 0) {
      let nearest = null;
      let minDist = Number.POSITIVE_INFINITY
      for (const dest of trail) {
        const routeToDest = findRoute(roadGraph, sortedTrail[sortedTrail.length - 1], dest);
        const distance = routeToDest?.length - 1
        if (Number.isFinite(distance) && distance < minDist) { minDist = distance; nearest = dest }
      }

      sortedTrail = sortedTrail.concat(findRoute(roadGraph, sortedTrail[sortedTrail.length - 1], nearest))
      trail.delete(nearest)

    }
    console.log('final trail', sortedTrail)

    return { direction: sortedTrail[1], routes: sortedTrail.slice(2) }
  }


  return { direction: route[0], routes: route.slice(1) };
}

function findRoute(graph, from, to) {
  const visitedRoutes = [{ place: from, route: [] }]
  for (let step = 0; step < visitedRoutes.length; step++) {
    const { place: currentPlace, route } = visitedRoutes[step]
    console.log('current placce ,visited, step', currentPlace, visitedRoutes, step)
    for (const thisPlace of graph[currentPlace]) {
      if (thisPlace == to) return route.concat(thisPlace)
      if (!visitedRoutes.some(route => route.place === thisPlace))
        visitedRoutes.push({ place: thisPlace, route: route.concat(thisPlace) })
    }
  }
}
// automation loops
function runBot(villageState, robot, memory = []) {

  for (let turn = 0; ; turn++) {
    if (villageState.parcels.length == 0) {
      console.log(`All delivered on the ${turn}th`)
      return turn
    }

    let { direction, routes } = robot(villageState, memory)
    memory = routes
    villageState = villageState.move(direction)
  }
}

// console.log(runBot(VillageState.random("Cabin", 10), goalOrientedBot))
// compareRobots function
function compareRobots(robot1, memory1, robot2, memory2) {
  const tasks = [];
  const robot1Steps = [];
  const robot2Steps = [];

  // Generate 100 identical tasks
  for (let i = 0; i < 100; i++) {
    tasks.push(VillageState.random("Post Office", 5)); // 5 parcels per task
  }

  // Run each robot on all tasks
  for (const task of tasks) {
    const steps1 = runBot(task, robot1, [...memory1]);
    const steps2 = runBot(task, robot2, [...memory2]);
    robot1Steps.push(steps1);
    robot2Steps.push(steps2);
  }

  // Calculate averages
  const avgSteps1 = robot1Steps.reduce((sum, steps) => sum + steps, 0) / 100;
  const avgSteps2 = robot2Steps.reduce((sum, steps) => sum + steps, 0) / 100;

  // Output results
  console.log(`Robot 1 (${robot1.name || "Unnamed"}) average steps: ${avgSteps1.toFixed(2)}`);
  console.log(`Robot 2 (${robot2.name || "Unnamed"}) average steps: ${avgSteps2.toFixed(2)}`);

  return { avgSteps1, avgSteps2 };
}


// Test the comparison
compareRobots(tspRobot, [], goLazyBot, [])
