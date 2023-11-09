var can = document.getElementById('can')
var ctx = can.getContext("2d");

var chunks = [];
var FadeIn = 1.9;

const chunkSize = 256;
const pointsPerChunk = 6

var cSizeX = 5
var cSizeY = 5

function getPointsInChunk(x, y){
    return chunks[x][y]
}

function sandClicked(){
    window.location.href = "https://github.com/ThatGuy-GEWP/SandGen3/#what-is-this";
}

function getRandPoints(x, y, size, count){
    var out = []
    for(let i = 0; i < count; i++){
        out[i] = [
            (x * size) + Math.random() * size - 120, 
            (y * size) + Math.random() * size - 90,
            (Math.random() * 2) - 1,
            ((Math.random() * 2) - 1) * 0.5
        ]
    }
    return out
}

function createPoints(){
    clearAndResize()
    cSizeX = (can.width/chunkSize) + 1
    cSizeY = (can.height/chunkSize) + 1
    for(let x = 0; x < cSizeX; x++){
        chunks[x] = []
        for(let y = 0; y < cSizeY; y++){
            chunks[x][y] = getRandPoints(x, y, chunkSize, pointsPerChunk)
        }
    }
}

function clearAndResize() {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    ctx.clearRect(0, 0, can.width, can.height)
}

function connectTo(x, y, i, tx, ty, ti){
    // connect point at chunk x,y with index i to tx,ty with index ti
    var points
    var tPoints
    if(x == tx && y == ty)
    {
        points = getPointsInChunk(x, y)
        tPoints = points
    } 
    else 
    {
        points = getPointsInChunk(x, y)
        tPoints = getPointsInChunk(tx, ty)
    }
    ctx.beginPath()
    ctx.moveTo(points[i][0], points[i][1])
    ctx.lineTo(tPoints[ti][0], tPoints[ti][1])
    ctx.stroke()
}

function distTo(x, y, i, tx, ty, ti){
    // connect point at chunk x,y with index i to tx,ty with index ti
    var pointA = [getPointsInChunk(x,  y)[i ][0], getPointsInChunk(x,   y)[i ][1]]

    var pointB = [getPointsInChunk(tx,ty)[ti][0], getPointsInChunk(tx, ty)[ti][1]] 

    return Math.sqrt( Math.pow((pointB[0] - pointA[0]) + (pointB[1] - pointA[1]), 2) )
}

function connectChunk(x, y) {
    for(let i = 0; i < pointsPerChunk; i++){
        for(let s = 0; s < pointsPerChunk; s++){
            //if(s == i){continue;}
            var dist = distTo(x, y, s, x, y, i)
            dist = 1 - (dist / chunkSize)
            dist = dist - FadeIn
            ctx.strokeStyle = 'rgb(25,25,25,'.concat(dist).concat(')')
            connectTo(x, y, s, x, y, i)
        }
    }
}

function stepChunk(x, y, t) {
    for(let i = 0; i < pointsPerChunk; i++){
        var point = chunks[x][y][i]

        point[0] += Math.sin((t + point[2]) * 0.5) * point[3]
        point[1] += Math.cos((t + point[2]) * 0.5) * point[3]
    }
}

var time = 0

function draw(){
    ctx.strokeStyle = 'rgb(0,0,0,0.5)';

    for(let x = 0; x < cSizeX; x++){

        for(let y = 0; y < cSizeY; y++){
            connectChunk(x, y)
        }
    }

    for(let x = 0; x < cSizeX; x++){

        for(let y = 0; y < cSizeY; y++){
            stepChunk(x, y, time)
        }
    }

    time += 1/16

    if(FadeIn > 0){
        FadeIn -= 1/16
    } else {FadeIn = 0}
}


createPoints()
function loop(){
    clearAndResize()
    draw()
}

createPoints()
loop()


setInterval(loop, 16)
