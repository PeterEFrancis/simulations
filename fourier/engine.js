


const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

const RIGHT_SIDE = 350;



var dt;
var delay;

var updateID;

var num_circles = 0;
var radius = [];
var theta = [];
var d_theta = [];
var past_heights = [];


reset();


function reset() {
  num_circles = 0;
  radius = [];
  theta = [];
  d_theta = [];
  past_heights = [];
}


function get_settings() {

  dt = Number(document.getElementById('dt').value);
  delay = Number(document.getElementById('delay').value);

  var text = document.getElementById('list').value;
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() != '') {
      var info = lines[i].split(',');
      radius[i] = Number(info[0].trim());
      theta[i] = 0;
      d_theta[i] = 2 * Math.PI * Number(info[1].trim()) * dt;
      num_circles++;
    }
  }

}

function get_xy_coordinates(theta, r) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  };
}



function step() {

  var x = canvas.height / 2;
  var y = canvas.height / 2;

  ctx.strokeStyle = "black";

  // for each circle
  for (var i = 0; i < num_circles; i++) {
    // draw the circle
    ctx.beginPath();
    ctx.arc(x, y, radius[i] , 0, 2 * Math.PI);
    ctx.stroke();
    // find the radius point
    var r_point = get_xy_coordinates(theta[i], radius[i]);
    // draw the radius
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + r_point.x, y - r_point.y);
    ctx.stroke();
    // add to x and y
    x = x + r_point.x;
    y = y - r_point.y;
    // step theta
    theta[i] = (theta[i] + d_theta[i]) % (2 * Math.PI);
  }

  // add y to past heights
  past_heights.push(y);
  if (past_heights.length > RIGHT_SIDE) {
    past_heights.shift();
  }

  // draw line to graph
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(canvas.width - RIGHT_SIDE, y);
  ctx.stroke();

  // draw divider line
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(canvas.width - RIGHT_SIDE, 0);
  ctx.lineTo(canvas.width - RIGHT_SIDE, canvas.height);
  ctx.stroke();

  // draw past heights
  ctx.strokeStyle = 'red';
  for (var i = 0; i < past_heights.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(canvas.width - RIGHT_SIDE + i, past_heights[past_heights.length - i]);
    ctx.lineTo(canvas.width - RIGHT_SIDE + i + 1, past_heights[past_heights.length - i - 1]);
    ctx.stroke();
    // ctx.fillRect(canvas.width - RIGHT_SIDE + i, , 1, 1);
  }

}



function play() {
  reset();
  get_settings();
  pause();
  updateID = setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    step();
  }, delay);
}


function pause() {
  clearInterval(updateID);
}
