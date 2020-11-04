

const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');


var r;
var w;
var dt;
var delay;
var updateID;
var theta;
var d_theta;




function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  theta = [0,0];
}


function get_settings() {

  var ra = Number(document.getElementById('ra').value);
  var rb = Number(document.getElementById('rb').value);

  r = [Math.min(ra, rb), Math.max(ra, rb)];

  var wa = Number(document.getElementById('wa').value);
  var wb = Number(document.getElementById('wb').value);

  w = r[0] == ra ? [wa, wb] : [wb, wa];

  dt = Number(document.getElementById('dt').value);
  delay = Number(document.getElementById('delay').value);

  r = [r[0] / r[1], 1];

  d_theta = [
    dt * w[0],
    dt * w[1]
  ];

}

function get_canvas_coordinates(theta, r) {
  return {
    x: canvas.width / 2 + r * canvas.width * 0.4 * Math.cos(theta),
    y: canvas.height / 2 - r * canvas.height * 0.4 * Math.sin(theta)
  };
}



function step() {
  ctx.strokeStyle = "white";
  ctx.beginPath();
  var a = get_canvas_coordinates(theta[0], r[0]);
  var b = get_canvas_coordinates(theta[1], r[1]);
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();

  for (var i = 0; i < 2; i++){
    theta[i] = (theta[i] + d_theta[i]) % (Math.PI * 2);
  }
}


function play() {
  clear();
  pause();
  get_settings();
  ctx.strokeStyle = "blue";
  for (var i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * r[i] * 0.4 , 0, 2 * Math.PI);
    ctx.stroke();
  }
  updateID = setInterval(step, delay);
}


function pause() {
  clearInterval(updateID);
}
