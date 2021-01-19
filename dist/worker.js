const ctx = self;
function mod(a, n) {
  return (a % n + n) % n;
}
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
class Simulation {
  constructor(parameters, width, height) {
    this.width = width;
    this.height = height;
    this.parameters = parameters;
    this.data = Array.from({length: height}, () => Array(width).fill(null));
    while (this.data.flat().filter((v) => v?.isFish).length < parameters.nfish) {
      const pos = [
        Math.floor(Math.random() * this.width),
        Math.floor(Math.random() * this.height)
      ];
      const fish = new Fish(pos[0], pos[1]);
      fish.age = Math.floor(Math.random() * parameters.fbreed);
      this.set(pos[0], pos[1], fish);
    }
    while (this.data.flat().filter((v) => v?.isShark).length < parameters.nshark) {
      const pos = [
        Math.floor(Math.random() * this.width),
        Math.floor(Math.random() * this.height)
      ];
      const shark = new Shark(pos[0], pos[1]);
      shark.breedAge = Math.floor(Math.random() * parameters.sbreed);
      this.set(pos[0], pos[1], shark);
    }
  }
  tick() {
    console.log("Running tick");
    const fishArr = this.data.flat(1).filter((v) => v?.isFish);
    const sharks = this.data.flat(1).filter((v) => v?.isShark);
    fishArr.forEach((fish) => {
      fish.age++;
      const possiblePositions = this.neighbors(fish.x, fish.y).filter((pos) => this.get(pos[0], pos[1]) === null);
      if (possiblePositions.length < 1) {
        return;
      }
      const newPos = sample(possiblePositions);
      const oldPos = [fish.x, fish.y];
      fish.x = newPos[0];
      fish.y = newPos[1];
      this.move(oldPos[0], oldPos[1], newPos[0], newPos[1]);
      if (fish.age >= this.parameters.fbreed) {
        const baby = new Fish(oldPos[0], oldPos[1]);
        this.set(baby.x, baby.y, baby);
      }
    });
    sharks.forEach((shark) => {
      let oldPos;
      shark.lastEaten++;
      shark.breedAge++;
      if (shark.lastEaten >= this.parameters.starve) {
        this.set(shark.x, shark.y, null);
        return;
      }
      const fishPositions = this.neighbors(shark.x, shark.y).filter((pos) => this.get(pos[0], pos[1])?.isFish);
      if (fishPositions.length < 1) {
        const possiblePositions = this.neighbors(shark.x, shark.y).filter((pos) => this.get(pos[0], pos[1]) === null);
        if (possiblePositions.length < 1) {
          return;
        }
        const newPos = sample(possiblePositions);
        oldPos = [shark.x, shark.y];
        shark.x = newPos[0];
        shark.y = newPos[1];
        this.move(oldPos[0], oldPos[1], newPos[0], newPos[1]);
      } else {
        const newPos = sample(fishPositions);
        oldPos = [shark.x, shark.y];
        this.set(newPos[0], newPos[1], null);
        shark.x = newPos[0];
        shark.y = newPos[1];
        this.move(oldPos[0], oldPos[1], newPos[0], newPos[1]);
        shark.lastEaten = 0;
      }
      if (shark.breedAge === this.parameters.sbreed) {
        const baby = new Shark(oldPos[0], oldPos[1]);
        this.set(baby.x, baby.y, baby);
      }
    });
  }
  neighbors(x, y) {
    return [
      this.inBounds(x + 1, y),
      this.inBounds(x - 1, y),
      this.inBounds(x, y + 1),
      this.inBounds(x, y - 1)
    ];
  }
  set(x, y, val) {
    this.data[mod(y, this.height)][mod(x, this.width)] = val;
  }
  get(x, y) {
    return this.data[mod(y, this.height)][mod(x, this.width)];
  }
  inBounds(x, y) {
    return [mod(y, this.height), mod(x, this.height)];
  }
  move(x, y, newX, newY) {
    const item = this.get(x, y);
    this.set(x, y, null);
    this.set(newX, newY, item);
  }
}
class Swimmer {
  constructor(x, y) {
    this.age = 0;
    this.x = x;
    this.y = y;
  }
}
class Fish extends Swimmer {
  constructor(x, y) {
    super(x, y);
    this.isFish = true;
  }
}
class Shark extends Swimmer {
  constructor(x, y) {
    super(x, y);
    this.isShark = true;
    this.lastEaten = 0;
    this.breedAge = 0;
  }
}
let sim;
onmessage = (ev) => {
  sim = new Simulation(ev.data.parameters, 200, 200);
  setTimeout(handle, 20);
};
function handle() {
  sim.tick();
  postMessage(sim);
  setTimeout(handle, 20);
}
