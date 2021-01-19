import "../_snowpack/pkg/bootstrap/dist/css/bootstrap.min.css.proxy.js";
document.getElementById("start").onclick = onClickStart;
function onClickStart() {
  if (!worker)
    worker = new Worker("/dist/worker.js", {type: "module"});
  worker.onmessage = (ev) => {
    const data = ev.data.data;
    render(data);
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
let worker = new Worker("/dist/worker.js", {type: "module"});
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
