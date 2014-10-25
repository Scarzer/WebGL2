/**
 * Created by scarzer on 10/19/14.
 */
var Page = function(xStart, yStart, width, length) {
    this.leftPageBuffer = gl.createBuffer();
    this.rightPageBuffer = gl.createBuffer();
    this.rightPageVertexNum = 4;
    this.width = width;
    this.length = length;
    this.xStart = xStart;
    this.yStart = yStart;

};

Page.prototype.init = function initPage(){
    this.leftPage = new Float32Array([
        this.xStart, this.yStart+this.length,
        this.xStart -this.width, this.yStart+this.length,
        this.xStart -this.width, this.yStart-this.length,
        this.xStart, this.yStart-this.length
    ]);

    this.rightPage = new Float32Array([
        this.xStart, this.yStart +  this.length,
        this.xStart+ this.width,    this.yStart+this.length,
        this.xStart+ this.width,    this.yStart-this.length,
        this.xStart, this.yStart -  this.length
    ]);
    this.rightPageVertexNum = this.rightPage.length / 2;
    this.refreshPage()
};


Page.prototype.refreshPage = function refreshPage(){

    var vPosition = gl.getAttribLocation(gl.program, 'vPosition');
    if (vPosition < 0){
        console.log("Can't get the location for vPosition");
        return -1;
    }

    // Buffer stuffing and sending and drawing

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer( gl.ARRAY_BUFFER, this.leftPageBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, this.leftPage, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP,0,4);

    gl.bindBuffer( gl.ARRAY_BUFFER, this.rightPageBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, this.rightPage, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, this.rightPageVertexNum);

};

Page.prototype.cornerUpdate = function cornerUpdate(x, y){

    // Figure out where the mouse is!
    if(x >= this.xStart && x < this.xStart+this.width){
        if(y > this.yStart+this.length){
            console.log("We're above the page");
            this.init();
        }
        else if(y < this.yStart-this.length){
            console.log("We're below the page");
            this.init();
        }
        else{
            var dY = - ((this.yStart-this.length) - (this.length - y));
            var dX = ((this.width - x) - this.xStart+this.width) ;

            var b  = (Math.pow(dX, 2) + Math.pow(dY, 2))/ (2*dY) ;
            var a  = dY - b;
            console.log("dy: " + dY + " " + "dx: " + dX);

            this.rightPage = new Float32Array([
                this.xStart, this.yStart+this.length,
                this.xStart+this.width, this.yStart+this.length,
                this.xStart+this.width, (y+a),
                x - ( a/(dX*dY) ), this.yStart-this.length,
                this.xStart, this.yStart-this.length
            ]);
            this.rightPageVertexNum = this.rightPage.length/2;
            this.refreshPage();
        }
    }
    else if(x <= this.xStart && x > this.xStart-this.width){
        console.log("We're on the left side of the page");
        this.init()
    }

    else{
        console.log("I have NO IDEA why you would ever be in here O_O");
        this.init();
    }

};

var canvas = document.getElementById("pageFlip");
var rect = canvas.getBoundingClientRect();
var gl = canvas.getContext("webgl");


compileShaders(gl, "pageFlip-vertex", "pageFlip-fragment");

gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Create the page!
var flipPage = new Page(0, 0,.4,.3);

canvas.onmousemove = function(e){
    var x, y;

    x = ( (e.x - canvas.offsetLeft) - canvas.width/2 ) / (canvas.width/2);
    y = (canvas.height/2 - (e.y - canvas.offsetTop) ) / (canvas.height/2);


    flipPage.cornerUpdate(x, y);

    document.getElementById('mouseXID').innerText=(x);
    document.getElementById('mouseYID').innerText=(y);

};


// My own convience function :D
function compileShaders(ctx, vShaderID, fShaderID){

    var vShaderSrc = document.getElementById(vShaderID).innerHTML;if(!vShaderSrc) return console.error("Error getting vShader");

    var fShaderSrc = document.getElementById(fShaderID).innerHTML;
    if(!fShaderSrc) return console.error("Error getting fShader");

    initShaders(ctx, vShaderSrc, fShaderSrc)
};

