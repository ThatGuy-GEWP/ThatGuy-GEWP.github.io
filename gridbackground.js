var can = document.getElementById('cn')
var ctx = can.getContext("2d");

can.width = window.innerWidth;
can.height = window.innerHeight;

ctx.fillStyle = "rgb(0,0,0,1)";
ctx.fillRect(0, 0, can.width, can.height);

let splitSpaceX = 65
let splitSpaceY = 65

let countX = 500
let countY = 500

let realLimitX = 0
let realLimitY = 0

let cursor_x = -1;
let cursor_y = -1;

let realCursor_x = -1
let realCursor_y = -1

document.onmousemove = function(event) {
  realCursor_x = event.pageX;
  realCursor_y = event.pageY;
}

function resized() {
  can.width = window.innerWidth;
  can.height = window.innerHeight;
  ctx.fillStyle = "rgb(0,0,0,1)";
  ctx.fillRect(0, 0, can.width, can.height);

  genGrid()
}

function fadeResize() {
  ctx.fillStyle = "rgb(0,0,0,0.25)";
  ctx.fillRect(0, 0, can.width, can.height);

  genGrid()
}


function genGrid() {
  for (let x = 0; x < countX; x++) {
    if (x * splitSpaceX > window.innerWidth) { // cull stuff that wont be seen.
      realLimitX = x
      break;
    }

    for (let y = 0; y < countY; y++) {
      if (y * splitSpaceY > window.innerHeight) { // cull stuff that wont be seen.
        realLimitY = y
        break;
      }
      ctx.fillStyle = "rgb(255,255,255,1)"
      ctx.fillRect(x * splitSpaceX, y * splitSpaceY, 1, 1);
    }
  }
}

let gridTime = 0;


function gridLines() {
  let pointsX = []
  let pointsY = []

  pointsX.push(
    Math.floor(cursor_x / splitSpaceX) * splitSpaceX,
    Math.floor(cursor_x / splitSpaceX) * splitSpaceX,
    Math.ceil(cursor_x / splitSpaceX) * splitSpaceX,
    Math.ceil(cursor_x / splitSpaceX) * splitSpaceX,
  )

  pointsY.push(
    Math.floor(cursor_y / splitSpaceY) * splitSpaceY,
    Math.ceil(cursor_y / splitSpaceY) * splitSpaceY,
    Math.floor(cursor_y / splitSpaceY) * splitSpaceY,
    Math.ceil(cursor_y / splitSpaceY) * splitSpaceY,
  )

	for (let i = 0; i < 4; i++) {
  	ctx.strokeStyle = "rgb(255, 255, 255, 0.1)"

		let x = pointsX[i] 
    let y = pointsY[i]

    ctx.beginPath()
    ctx.moveTo(0, y + Math.sin(gridTime * 25) * 2)
    ctx.lineTo(window.innerWidth, y + Math.cos(gridTime * 50) * 2)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(x + Math.sin(gridTime * 26) * 2, 0)
    ctx.lineTo(x + Math.cos(gridTime * 51) * 2, window.innerHeight)
    ctx.stroke()
  }

}

function lerp(A, B, T){
	return A + (B - A) * T;
}

function lerpToMouse(){
	cursor_x = lerp(cursor_x, realCursor_x, 0.25)
  cursor_y = lerp(cursor_y, realCursor_y, 0.25)
}


function mouseLines() {
  gridTime += 0.03

  lerpToMouse()
  fadeResize()
  
  let pointsX = []
  let pointsY = []

  let cols = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0,0,255)", "rgb(255,255,0)"]


  pointsX.push(
    Math.floor(cursor_x / splitSpaceX) * splitSpaceX,
    Math.floor(cursor_x / splitSpaceX) * splitSpaceX,
    Math.ceil(cursor_x / splitSpaceX) * splitSpaceX,
    Math.ceil(cursor_x / splitSpaceX) * splitSpaceX,
  )

  pointsY.push(
    Math.floor(cursor_y / splitSpaceY) * splitSpaceY,
    Math.ceil(cursor_y / splitSpaceY) * splitSpaceY,
    Math.floor(cursor_y / splitSpaceY) * splitSpaceY,
    Math.ceil(cursor_y / splitSpaceY) * splitSpaceY,
  )

  ctx.lineWidth = 1

  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = cols[i]

    ctx.beginPath()
    ctx.moveTo(realCursor_x, realCursor_y)
    ctx.lineTo(
        pointsX[i] + Math.sin(gridTime) * 3,
        pointsY[i] + Math.cos(gridTime) * 3
    )
    ctx.stroke()
  }
  
  gridLines()
  
  //ctx.fillStyle = "rgb(0,0,0,0.65)"
  //ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

genGrid()

setInterval(mouseLines, 30)
