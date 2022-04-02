var canvas, ctx;

const DEBUG_RNG_SEED = null;
const DEBUG_CRASH_ON_ERROR = true;
const DEBUG_WARN_ON_ERROR = true;

var image = {};

var cubes = [];
var colorGrids = [];
var bgCircles = [];

function loadJSON(filename,callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filename, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
          }
    };
    xobj.send(null);
 }

function loadImage(filename, callback) {
    let img = document.createElement("img");
    img.onload = function() {callback(img)}
    img.src = filename;
}

function startImageLoad(name) {
    if (!image[name]) loadImage(`img/${name}.png`,function(img) {image[name] = img});
}

function loadFiles(loads, callback) {
    var result = [];
    var toLoad = loads.length;
    loads.forEach(function(load,i) {
        switch (load.type) {
            case "json":
                loadJSON(load.filename,function(res) {
                    result[i] = res;
                    if (--toLoad <= 0) {
                        callback(result);
                    }
                });
                break;
            case "img":
                loadImage(load.filename,function(res) {
                    result[i] = res;
                    if (--toLoad <= 0) {
                        callback(result);
                    }
                });
                break;
            default:
                console.log(`Load of file ${load.filename} failed: no type`);
                toLoad--;
                break;
        }
    });
}

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    startImageLoad("fish");
    startImageLoad("fishtext");
    startImageLoad("mememan");
    cubes.push(new RotateCube(250, 400, 1));
    cubes.push(new RotateCube(1300, 400, 1.1));
    colorGrids.push(new ColorGrid(150, 100));
    colorGrids.push(new RotatingColorGrid(130, -80));
    colorGrids.push(new SinusoidColorGrid(-60, 20));
    for (var i = 0; i < 10; i++) {
        bgCircles.push(new BackgroundCircle());   
    }
    requestAnimationFrame(updateAndRender);
}

var lastTime = 0;

function updateAndRender(time) {
    update(time - lastTime);
    render();
    lastTime = time;
    requestAnimationFrame(updateAndRender);
}

function update(dt) {
    for (var i = 0; i < cubes.length; i++) {
        cubes[i].update(dt);
    }
    for (var i = 0; i < colorGrids.length; i++) {
        colorGrids[i].update(dt);
    }
    for (var i = 0; i < bgCircles.length; i++) {
        bgCircles[i].update(dt);
    }
    if (memeTimer > 0) {
        memeTimer -= dt;
    } else if (memeOpacity < 1) {
        memeOpacity += dt/3000;
    }
}

var memeOpacity = 0;
var memeTimer = 3000;

function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //ctx.globalCompositeOperation = "exclusion";
    ctx.globalAlpha = 0.5;
    for (var i = 0; i < colorGrids.length; i++) {
        colorGrids[i].render(ctx);
    }
    
    for (var i = 0; i < bgCircles.length; i++) {
        bgCircles[i].render(ctx);
    }
    
    ctx.globalAlpha = 1;
    
    ctx.globalCompositeOperation = "source-over";
    
    /*ctx.font = "200px serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Fish", canvas.width/2, 500);
    ctx.strokeStyle = "#000";
    ctx.strokeText("Fish", canvas.width/2, 500);*/
    if (image.fishtext) {
        ctx.drawImage(image.fishtext, (canvas.width - image.fishtext.width)/2, (canvas.height - image.fishtext.height)/2);
    }
    for (var i = 0; i < cubes.length; i++) {
        cubes[i].render(ctx);
    }
    if (image.mememan) {
        ctx.globalAlpha = memeOpacity;
        ctx.drawImage(image.mememan, 0, canvas.height - image.mememan.height);
    }
}

function renderEntities(ctx) {
    entities.sort((a,b) => {return a.getRenderDepth() - b.getRenderDepth()});
    entities.forEach(entity => {
        entity.render(ctx);
    })
}

init();