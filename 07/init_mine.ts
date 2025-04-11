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

interface Parcel {
  status: "delivered" | "in-transit" | "at_src";
  name: string;
  src: string;
  current: string;
  dest: string;
}

interface VillageMap {
  [key: string]: string[];
}
class Village {
  constructor(public _landmarks: string[], public parcels: Parcel[]) {}

  private _buildGraph(edges: string[]): VillageMap {
    let graph = Object.create(null);
    function addEdge(from: string, to: string) {
      if (from in graph && Array.isArray(graph[from])) {
        graph[from].push(to);
      } else graph[from] = [to];
      if (to in graph && Array.isArray(graph[to])) {
        graph[to].push(from);
      } else graph[to] = [from];
    }

    for (const edge of edges) {
      const [from, to] = edge.split("-");
      addEdge(from, to);
    }
    return graph;
  }
  get landmarks() {
    return this._buildGraph(this._landmarks);
  }
}

class Robot {
  private _nextLocation = "";
  private nextLocationIsSet = false;
  private parcels;
  private villageMap;
  constructor(public currentLocation: string, public village: Village) {
    this.parcels = village.parcels;
    this.villageMap = village.landmarks;
  }
  move() {
    const nextLocations = this.undeliveredParcelsLocations;
    if (!nextLocations.length) {
      console.log("all parcels delivered");
      return;
    }

    this.nextLocationIsSet = false;
    this._nextLocation = "";
    this.findNextMove(nextLocations, this.currentLocation);
    if (this.currentLocation !== this._nextLocation && this._nextLocation)
      this.currentLocation = this._nextLocation;
    this.deliverPackages();
    console.log("left over deliveries", this.undeliveredParcelsLocations);
  }
  deliverPackages() {
    this.parcels
      .filter((parcel) => parcel.dest === this.currentLocation)
      .forEach((parcel) => (parcel.status = "delivered"));
  }
  findNextMove(
    parcelLocations: string[],
    currentLocation: string,
    locationName: string = "",
    trace: Set<string> = new Set(),
    level: number = 1
  ) {
    //*breadth or depth first search through graph
    console.log("heays", currentLocation, locationName, trace);
    if (
      this.nextLocationIsSet ||
      !currentLocation ||
      trace.has(currentLocation)
    )
      return;

    console.log("above: ", this.undeliveredParcelsLocations);
    if (this.undeliveredParcelsLocations.includes(currentLocation)) {
      console.log("foundd location ", currentLocation, locationName);
      this._nextLocation = locationName;
      this.nextLocationIsSet = true;
      return;
    }

    // current location's edges
    const nextLocations = this.villageMap[currentLocation];
    if (!nextLocations || (nextLocations && !nextLocations.length)) return;
    for (const location of nextLocations) {
      this.findNextMove(
        parcelLocations,
        location,
        level === 1 ? location : locationName,
        new Set(trace.add(currentLocation)),
        level + 1
      );
    }
  }

  get undeliveredParcelsLocations() {
    return this.parcels
      .filter((parcel) => parcel.status !== "delivered")
      .map((parcel) => parcel.dest);
  }
}

const meadowsVille = new Village(roads, [
  {
    status: "at_src",
    src: "Alice's House",
    dest: "Shop",
    name: "pencil",
    current: "Alice's House",
  },
]);
const ernieBot = new Robot("Alice's House", meadowsVille);
ernieBot.move();
