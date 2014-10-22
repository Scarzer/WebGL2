/**
 * Created by scarzer on 10/19/14.
 */
var Page = function(xStart, yStart, width, length){
    this.squareBuffer = gl.createBuffer();
    this.width = width;
    this.length = length;
    this.xStart = xStart;
    this.yStart = yStart;

    this.square = new Float32Array([
            xStart-width, yStart+length,
            xStart+width, yStart+length,
            xStart+width, yStart-length,
            xStart-width, yStart-length
    ]);
    this.refreshPage()
};


Page.prototype.refreshPage = function refreshPage(){

    var vPosition = gl.getAttribLocation(gl.program, 'vPosition');
    if (vPosition < 0){
        console.log("Can't get the location for vPosition");
        return -1;
    }

    // Buffer stuffing and sending and drawing
    gl.bindBuffer( gl.ARRAY_BUFFER, this.squareBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, this.square, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
};

Page.prototype.cornerUpdate = function cornerUpdate(x, y){

    // Case when the mouse is to the far right of the square
    if( x > (this.xStart+this.width) || x < (this.xStart - this.width) ){
        console.log("OUUTTT");
    }
    // Case for when the mouse is inside the square
    else if( y > this.yStart+this.length|| y < this.yStart-this.length){
        console.log("WE ARE OUTSIDE!!!");
    }
    else{
        console.log("We're inside the square")
    }

};

var canvas = document.getElementById("pageFlip");
var rect = canvas.getBoundingClientRect();
var gl = canvas.getContext("webgl");


compileShaders(gl, "pageFlip-vertex", "pageFlip-fragment");

gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);
var flipPage = new Page(0, 0,.3,.3);

canvas.onmousemove = function(e){
    var x, y;

    x = ( (e.x - canvas.offsetLeft) - canvas.width/2 ) / (canvas.width/2);
    y = (canvas.height/2 - (e.y - canvas.offsetTop) ) / (canvas.height/2);


    flipPage.cornerUpdate(x, y);

    document.getElementById('mouseXID').innerText=(x);
    document.getElementById('mouseYID').innerText=(y);

};

// WebGL Stuff
//drawSquare(0.15,-0.15);


// My own convience function :D
function compileShaders(ctx, vShaderID, fShaderID){

    var vShaderSrc = document.getElementById(vShaderID).innerHTML;if(!vShaderSrc) return console.error("Error getting vShader");

    var fShaderSrc = document.getElementById(fShaderID).innerHTML;
    if(!fShaderSrc) return console.error("Error getting fShader");

    initShaders(ctx, vShaderSrc, fShaderSrc)
}

