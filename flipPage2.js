/**
 * Created by Scarz_000 on 10/28/2014.
 */
// My own convience function :D


// Globals
var canvas = document.getElementById("pageFlip");
var rect = canvas.getBoundingClientRect();
var gl = canvas.getContext("webgl");

compileShaders(gl, "pageFlip-vertex", "pageFlip-fragment");

gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);

var Width2 = canvas.width   / 2;
var Height2 = canvas.height / 2;

canvas.onmousedown = getMousePosition;

var PointsBuffer = gl.createBuffer();

function getMousePosition(){
    document.onmousemove = function(){
        posX = (window.event.clientX - Width2) / Width2;
        posY = (Height2 - window.event.clientY) / Height2;
        document.getElementById("mouseXID").innerHTML = posX.toFixed(3);
        document.getElementById("mouseYID").innerHTML = posY.toFixed(3);
    }

    document.onmouseup = function(){
        document.onmousemove = null;
    }
}

function drawCorner1(){};
function drawCorner2(){};

function compileShaders(ctx, vShaderID, fShaderID){

    var vShaderSrc = document.getElementById(vShaderID).innerHTML;
    if(!vShaderSrc) return console.error("Error getting vShader");

    var fShaderSrc = document.getElementById(fShaderID).innerHTML;
    if(!fShaderSrc) return console.error("Error getting fShader");

    initShaders(ctx, vShaderSrc, fShaderSrc)
};