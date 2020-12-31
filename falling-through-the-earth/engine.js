


const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

const SIDE = 250;



var dt;
var delay;

var updateID;

var num_layers;
var num_particles_per_layer;
var particle_mass;
var body_mass;
var hole_size;

var past_y = [];

reset();


function reset() {
  past_y = [0.1 * SIDE];
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
  num_layers = Number(document.getElementById('layers').value);
  num_particles_per_layer = Number(document.getElementById('num-per-layer').value);
  particle_mass = Number(document.getElementById('particle-mass').value);
  body_mass = Number(document.getElementById('body-mass').value);
  hole_size = Number(document.getElementById('hole-size').value);

}


function get_xy_coordinates(theta, r) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  };
}



function step() {

  var y = past_y[past_y.length - 1];

  var force = 0;

  ctx.fillStyle = "black";
  // for each layer
  for (var i = 0; i < num_layers; i++) {
    var r = SIDE * 0.9 * i / num_layers;
    // for each hemisphere
    for (var h = 0; h < 2; h++) {
      // for each particle in layer
      for (var j = 0; j <= num_particles_per_layer; j++) {
        var xy = get_xy_coordinates(j * Math.PI / num_particles_per_layer + (h == 0 ? -1 : 1) * Math.PI / 2, r);
        var part_x = SIDE + xy.x + SIDE * hole_size * (h == 0 ? 1 : -1);
        var part_y = SIDE - xy.y;
        // draw the particle
        ctx.beginPath();
        ctx.arc(part_x, part_y, 2, 0, 2 * Math.PI);
        ctx.fill();
        // add force
        var d = Math.sqrt(Math.pow(part_x - SIDE,2) + Math.pow(part_y - y,2));
        var F = particle_mass * body_mass / Math.pow(d,2);
        force += F * (part_y - y) / d;
      }
    }
  }


  // change position of body
  y += force * Math.pow(dt,2) / body_mass;

  // draw body
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(SIDE, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  // add y to past
  past_y.push(y);
  if (past_y.length > SIDE * 2) {
    past_y.shift();
  }

  // draw lines to x and y graph
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(SIDE, y);
  ctx.lineTo(canvas.width - 2 * SIDE, y);
  ctx.stroke();

  // draw divider lines
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(canvas.width - 2 * SIDE, 0);
  ctx.lineTo(canvas.width - 2 * SIDE, canvas.height);
  ctx.stroke();

  // draw past x and y graphs
  ctx.strokeStyle = 'red';
  for (var i = 0; i < 2 * SIDE; i++) {
    ctx.beginPath();
    ctx.moveTo(canvas.width - 2 * SIDE + i, past_y[past_y.length - i]);
    ctx.lineTo(canvas.width - 2 * SIDE + i + 1, past_y[past_y.length - i - 1]);
    ctx.stroke();
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
