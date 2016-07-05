/* global d3 */
// Run after scene has loaded.
var scene = document.querySelector('a-scene');
if (scene.hasLoaded) {
  run();
} else {
  scene.addEventListener('loaded', run);
}

function run () {
  // Setup event listeners for buttons
  var randomDistButton = d3.select('#random');
  randomDistButton.on('click', click);

  var poissonDiscButton = d3.select('#sample');
  poissonDiscButton.on('click', click);

  var resetButton = d3.select('#reset');
  resetButton.on('click', click);

  var groundLevelButton = d3.select('#ground');
  groundLevelButton.on('click', click);

  var skyLevelButton = d3.select('#sky');
  skyLevelButton.on('click', click);
}

// Button event switchboard
function click (id) {
  var selectedElId;

  // This allows voice-control.js to activate events
  if (id) {
    selectedElId = id;
  } else {
    selectedElId = this.getAttribute('id');
  }

  switch (selectedElId) {
    case 'random':
      console.log('randomDist');
      randomDist();
      break;

    case 'sample':
      console.log('sample');
      poissonDisc();
      break;

    case 'reset':
      console.log('reset');
      reset();
      break;

    case 'ground':
      console.log('ground');
      groundLevel();
      break;

    case 'sky':
      console.log('sky');
      skyLevel();
      break;
  }
}

/* Remove all generated trees in the #forest */
function reset () {
  var forest = d3.select('#forest');
  // Geometry count does not seem to go down...
  forest.selectAll('*').remove();
}

/* Send camera to ground level */
function groundLevel () {
  var camera = d3.select('#camera');
  camera.attr('position', '0 2 -2');
}

/* Send camera to sky level */
function skyLevel () {
  var camera = d3.select('#camera');
  camera.attr('position', '0 41 15');
}

/* Generate a forest with random X/Z coordinates */
function randomDist () {
  var dataset = [];
  var forest = d3.select('#forest');

  // Generate 18 X/Z positions within the interval 0, 40
  for (var i = 0; i < 105; i++) {
    var x = getRandomIntInclusive(0, 100);
    var z = getRandomIntInclusive(0, 100);

    dataset.push([x, z]);
  }

  // Append trees to the scene
  forest.selectAll('a-entity')
      .data(dataset)
      .enter()
      .append('a-entity')
      .attr('collada-model', '#tree')
      .attr('scale', '2.5 2.5 2.5')
      .attr('position', function (d) {
        return d[0] + ' 0.2 ' + d[1];
      });
}

/* Generate a forest with Poisson Disc-Sampling
 * Adapted from Mike Bostock's D3 example: http://bl.ocks.org/mbostock/19168c663618b7f07158
 */
function poissonDisc () {
  var width = 100;
  var height = 100;

  var scene = d3.select('#forest');

  var sample = poissonDiscSampler(width, height, 8);

  d3.timer(function () {
    for (var i = 0; i < 10; ++i) {
      var s = sample();
      if (!s) return true;
      scene.append('a-entity')
            .attr('scale', '2.5 2.5 2.5')
            .attr('position', s[0] + ' 0.2 ' + s[1])
            .attr('collada-model', '#tree');
    }
  });

  // Based on https://www.jasondavies.com/poisson-disc/
  function poissonDiscSampler (width, height, radius) {
    var k = 30, // maximum number of samples before rejection
        radius2 = radius * radius,
        R = 3 * radius2,
        cellSize = radius * Math.SQRT1_2,
        gridWidth = Math.ceil(width / cellSize),
        gridHeight = Math.ceil(height / cellSize),
        grid = new Array(gridWidth * gridHeight),
        queue = [],
        queueSize = 0,
        sampleSize = 0;

    return function () {
      if (!sampleSize) return sample(Math.random() * width, Math.random() * height);

      // Pick a random existing sample and remove it from the queue.
      while (queueSize) {
        var i = Math.random() * queueSize | 0,
            s = queue[i];

        // Make a new candidate between [radius, 2 * radius] from the existing sample.
        for (var j = 0; j < k; ++j) {
          var a = 2 * Math.PI * Math.random(),
              r = Math.sqrt(Math.random() * R + radius2),
              x = s[0] + r * Math.cos(a),
              y = s[1] + r * Math.sin(a);

          // Reject candidates that are outside the allowed extent,
          // or closer than 2 * radius to any existing sample.
          if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) return sample(x, y);
        }

        queue[i] = queue[--queueSize];
        queue.length = queueSize;
      }
    };

    function far (x, y) {
      var i = x / cellSize | 0,
          j = y / cellSize | 0,
          i0 = Math.max(i - 2, 0),
          j0 = Math.max(j - 2, 0),
          i1 = Math.min(i + 3, gridWidth),
          j1 = Math.min(j + 3, gridHeight);

      for (j = j0; j < j1; ++j) {
        var o = j * gridWidth;
        for (i = i0; i < i1; ++i) {
          if (s = grid[o + i]) {
            var s,
                dx = s[0] - x,
                dy = s[1] - y;
            if (dx * dx + dy * dy < radius2) return false;
          }
        }
      }

      return true;
    }

    function sample (x, y) {
      var s = [x, y];
      queue.push(s);
      grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
      ++sampleSize;
      ++queueSize;
      return s;
    }
  }

}


/* Helper Functions */

// Returns a random integer between min (included) and max (included)
// from MDN
function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
