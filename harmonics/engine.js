

const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

ctx.strokeStyle = 'white';
ctx.fillStyle = 'white';


const FORWARD = 1;
const BACKWARD = -1;

const NUMBER_OF_CELLS = 7;

const PADDING = 30;
const SQUARE_SIZE = (canvas.width - (NUMBER_OF_CELLS + 2) * PADDING) / (NUMBER_OF_CELLS + 1);

const RADIUS = SQUARE_SIZE / 2;

const dt = 0.02;

const delay = 20;


var hist = {x: [], y:[]};
var theta = [];
var d_theta = [];

var direction = 1;

var updateID;



for (var i = 0; i < NUMBER_OF_CELLS; i++) {
  // build all history arrays
  hist.x.push([]);
  hist.y.push([]);
  // build theta array
  theta.push(0);
  // build d_theta array
  d_theta.push((i + 1) * dt);
}

// start animations
clearInterval(updateID);
updateID = setInterval(function() {
  if (theta[0] >= 2 * Math.PI) {
    direction = BACKWARD;
  } else if (theta[0] <= 0) {
    direction = FORWARD;
  }
  // move time step and update history
  for (var i = 0; i < NUMBER_OF_CELLS; i++) {
    theta[i] = theta[i] + direction * d_theta[i];
    if (direction == FORWARD) {
      hist.x[i].push(RADIUS * Math.cos(theta[i]));
      hist.y[i].push(RADIUS * Math.sin(theta[i]));
    } else {
      hist.x[i].pop();
      hist.y[i].pop();
    }
  }
  // clear and replot
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw lines
  ctx.beginPath();
  ctx.moveTo(PADDING * 1.5 + 2 * RADIUS, PADDING * 1.5 + 2 * RADIUS);
  ctx.lineTo(canvas.width, PADDING * 1.5 + 2 * RADIUS);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(PADDING * 1.5 + 2 * RADIUS, PADDING * 1.5 + 2 * RADIUS);
  ctx.lineTo(PADDING * 1.5 + 2 * RADIUS, canvas.height);
  ctx.stroke();

  var h = hist.x[0].length;

  // draw sides
  for (var i = 0; i < NUMBER_OF_CELLS; i++) {
    var x = 2 * PADDING + 3 * RADIUS + (2 * RADIUS + PADDING) * i;
    var y = PADDING + RADIUS;
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + hist.x[i][h - 1], y - hist.y[i][h - 1], 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(y, x, RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(y + hist.x[i][h - 1], x - hist.y[i][h - 1], 5, 0, 2 * Math.PI);
    ctx.fill();
  }


  for (var i = 0; i < NUMBER_OF_CELLS; i++) {
    for (var j = 0; j < NUMBER_OF_CELLS; j++) {
      var x = 2 * PADDING + 3 * RADIUS + (2 * RADIUS + PADDING) * i;
      var y = 2 * PADDING + 3 * RADIUS + (2 * RADIUS + PADDING) * j;
      for (var k = 0; k < h - 1; k++) {
        ctx.beginPath();
        ctx.moveTo(x + hist.x[i][k], y - hist.y[j][k]);
        ctx.lineTo(x + hist.x[i][k + 1], y - hist.y[j][k + 1]);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x + hist.x[i][h - 1], y - hist.y[j][h - 1], 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

}, delay);
