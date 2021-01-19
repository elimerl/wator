import "../_snowpack/pkg/bootstrap/dist/css/bootstrap.min.css.proxy.js";
import {Chart} from "../_snowpack/pkg/chartjs.js";
const chart = new Chart(document.getElementById("chart"), {
  type: "line",
  data: {
    datasets: [
      {label: "Sharks", backgroundColor: "green"},
      {label: "Fish", backgroundColor: "blue"}
    ]
  },
  options: {
    elements: {line: {fill: false}},
    responsive: false,
    scales: {
      xAxes: [
        {
          type: "linear"
        }
      ]
    },
    animation: {duration: 0.1}
  }
});
document.getElementById("start").onclick = onClickStart;
function onClickStart() {
  chart.data = {
    datasets: [
      {label: "Sharks", backgroundColor: "green"},
      {label: "Fish", backgroundColor: "blue"}
    ]
  };
  if (!worker)
    worker = new Worker("/dist/worker.js", {type: "module"});
  worker.onmessage = (ev) => {
    const data = ev.data.data;
    const ticks = ev.data.ticks;
    render(data);
    const fish = data.flat(1).filter((v) => v?.isFish).length;
    const sharks = data.flat(1).filter((v) => v?.isShark).length;
    chart.data.datasets[0].data?.push({x: ticks, y: sharks});
    chart.data.datasets[1].data?.push({x: ticks, y: fish});
    chart.update();
  };
  start();
  document.getElementById("start").innerText = "Stop";
  document.getElementById("start").onclick = onClickStop;
}
function onClickStop() {
  worker.terminate();
  worker = void 0;
  document.getElementById("start").innerText = "Start";
  document.getElementById("start").onclick = onClickStart;
}
let worker = new Worker("./dist/worker.js", {type: "module"});
function start() {
  worker.postMessage({
    msg: "start",
    parameters: {
      nfish: parseInt(document.getElementById("nfish").value),
      nshark: parseInt(document.getElementById("nshark").value),
      fbreed: parseInt(document.getElementById("fbreed").value),
      sbreed: parseInt(document.getElementById("sbreed").value),
      starve: parseInt(document.getElementById("starve").value)
    }
  });
}
document.getElementById;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.scale(4, 4);
function render(data) {
  console.log("rendering");
  const fishArr = data.flat(1).filter((v) => v?.isFish);
  const sharks = data.flat(1).filter((v) => v?.isShark);
  document.getElementById("counts").innerText = `${fishArr.length} fish
  ${sharks.length} sharks`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  data.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val?.isFish) {
        ctx.fillStyle = "blue";
      } else if (val?.isShark) {
        ctx.fillStyle = "green";
      } else {
        ctx.fillStyle = "black";
      }
      ctx.fillRect(x, y, 1, 1);
    });
  });
}
