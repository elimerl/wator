import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap';
import { Chart } from 'chart.js';
const chart = new Chart(document.getElementById('chart') as HTMLCanvasElement, {
  type: 'line',
  data: {
    datasets: [
      { label: 'Sharks', backgroundColor: 'green' },
      { label: 'Fish', backgroundColor: 'blue' },
    ],
  },
  options: {
    elements: { line: { fill: false } },
    responsive: false,
    scales: {
      xAxes: [
        {
          type: 'linear',
        },
      ],
    },
    animation: { duration: 0.1 },
  },
});
(document.getElementById('start') as HTMLButtonElement).onclick = onClickStart;
function onClickStart() {
  chart.data = {
    datasets: [
      { label: 'Sharks', backgroundColor: 'green' },
      { label: 'Fish', backgroundColor: 'blue' },
    ],
  };
  if (!worker) worker = new Worker('/dist/worker.js', { type: 'module' });
  worker.onmessage = (ev) => {
    const data: (Swimmer | null)[][] = ev.data.data;
    const ticks: number = ev.data.ticks;
    render(data);
    //@ts-expect-error
    const fish: Fish[] = data.flat(1).filter((v) => v?.isFish).length;
    //@ts-expect-error
    const sharks: Shark[] = data.flat(1).filter((v) => v?.isShark).length;
    //@ts-expect-error
    chart.data.datasets[0].data?.push({ x: ticks, y: sharks });
    //@ts-expect-error
    chart.data.datasets[1].data?.push({ x: ticks, y: fish });
    chart.update();
  };
  start();
  (document.getElementById('start') as HTMLButtonElement).innerText = 'Stop';
  (document.getElementById('start') as HTMLButtonElement).onclick = onClickStop;
}
function onClickStop() {
  worker.terminate();
  //@ts-expect-error
  worker = undefined;
  (document.getElementById('start') as HTMLButtonElement).innerText = 'Start';

  (document.getElementById(
    'start',
  ) as HTMLButtonElement).onclick = onClickStart;
}
let worker = new Worker('./dist/worker.js', { type: 'module' });
function start() {
  worker.postMessage({
    msg: 'start',
    parameters: {
      nfish: parseInt(
        (document.getElementById('nfish') as HTMLInputElement).value,
      ),
      nshark: parseInt(
        (document.getElementById('nshark') as HTMLInputElement).value,
      ),
      fbreed: parseInt(
        (document.getElementById('fbreed') as HTMLInputElement).value,
      ),
      sbreed: parseInt(
        (document.getElementById('sbreed') as HTMLInputElement).value,
      ),
      starve: parseInt(
        (document.getElementById('starve') as HTMLInputElement).value,
      ),
    },
  });
}
document.getElementById;

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.scale(4, 4);
function render(data: (Swimmer | null)[][]) {
  console.log('rendering');
  //@ts-expect-error
  const fishArr: Fish[] = data.flat(1).filter((v) => v?.isFish);
  //@ts-expect-error
  const sharks: Shark[] = data.flat(1).filter((v) => v?.isShark);
  //@ts-expect-error
  document.getElementById('counts').innerText = `${fishArr.length} fish
  ${sharks.length} sharks`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  data.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val?.isFish) {
        ctx.fillStyle = 'blue';
      } else if (val?.isShark) {
        ctx.fillStyle = 'green';
      } else {
        ctx.fillStyle = 'black';
      }
      ctx.fillRect(x, y, 1, 1);
    });
  });
}
interface Swimmer {
  age: number;
  x: number;
  y: number;
  isFish?: true;
  isShark?: true;
}
