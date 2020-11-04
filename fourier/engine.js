


const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

const SIDE = 350;



var dt;
var delay;

var updateID;

var num_circles = 0;
var radius = [];
var theta = [];
var d_theta = [];

var past_y = [];
var past_x = [];

reset();


function reset() {
  num_circles = 0;
  radius = [];
  theta = [];
  d_theta = [];
  past_x = [];
  past_y = [];
}


function interpret(string, rep) {
  var s = string;
  for (var k in rep) {
    s = s.replace(k, rep[k]);
  }
  return eval(s.trim());
}


function get_settings() {

  dt = Number(document.getElementById('dt').value);
  delay = Number(document.getElementById('delay').value);

  var mode = $("input:radio[name='mode']:checked").val();

  if (mode == "list") {
    var text = document.getElementById('list').value;
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() != '') {
        var info = lines[i].split(',');
        radius[i] = interpret(info[0], {'pi':'Math.PI'}) * 100;
        theta[i] = 0;
        d_theta[i] = 2 * Math.PI * interpret(info[1]) * dt;
        num_circles++;
      }
    }
  } else {
    var rule = document.getElementById('rule').value.split(',');
    for (var i = 1; i < 100; i++) {
      radius[i-1] = interpret(rule[0], {'pi':'Math.PI', 'n': String(i)}) * 100;
      theta[i-1] = 0;
      d_theta[i-1] = 2 * Math.PI * interpret(rule[1], {'pi':'Math.PI', 'n': String(i)}) * dt;
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

  var x = (canvas.width - SIDE) / 2;
  var y = SIDE + (canvas.height - SIDE) / 2;

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

  // add x and y to past
  past_x.push(x);
  past_y.push(y);
  if (past_y.length > SIDE) {
    past_y.shift();
  }
  if (past_x.length > SIDE) {
    past_x.shift();
  }

  // draw lines to x and y graph
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(canvas.width - SIDE, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, SIDE);
  ctx.stroke();

  // draw divider lines
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(canvas.width - SIDE, 0);
  ctx.lineTo(canvas.width - SIDE, canvas.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, SIDE);
  ctx.lineTo(canvas.width, SIDE);
  ctx.stroke();

  // draw past x and y graphs
  ctx.strokeStyle = 'red';
  for (var i = 0; i < SIDE; i++) {
    ctx.beginPath();
    ctx.moveTo(past_x[past_x.length - i], SIDE - i);
    ctx.lineTo(past_x[past_x.length - i - 1], SIDE - i - 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width - SIDE + i, past_y[past_y.length - i]);
    ctx.lineTo(canvas.width - SIDE + i + 1, past_y[past_y.length - i - 1]);
    ctx.stroke();
  }

  // draw past loop
  if (document.getElementById('loop').checked) {
    ctx.strokeStyle = 'green';
    for (var i = 0; i < past_x.length; i++) {
      ctx.beginPath();
      ctx.moveTo(past_x[past_x.length - i], past_y[past_y.length - i]);
      ctx.lineTo(past_x[past_x.length - i - 1], past_y[past_y.length - i - 1]);
      ctx.stroke();
    }
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
