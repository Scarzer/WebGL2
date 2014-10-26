function main() {

		//Init gl
	var canvas = document.getElementById('canv');
	gl = getWebGLContext(canvas);
	initShaders(gl,"twist2-vertex","twist2-fragment");


	//shader-tied variables
	theta=gl.getUniformLocation(gl.program, 'u_theta');
    gl.uniform1f(theta,0.0);

	twist=gl.getUniformLocation(gl.program, 'u_twist');
    gl.uniform1f(twist,0.0);

	//internal js side variables
	g_theta=0.0;
	g_divisions=0;
	g_twist=0.0;
	g_points=[];
	g_colors=[];

	//create callbacks
	//var thetaslider = document.getElementById('thetaslider');
	//thetaslider.onmousemove =thetaHandler(); //doesn't quite work


	//create and bind buffer
	vertexBuffer= gl.createBuffer();
		if(!vertexBuffer) {
			console.log('Failed to get a vertex buffer from webgl');
			return; }
	colorBuffer= gl.createBuffer();
		if(!colorBuffer) {
			console.log('Failed to get a color buffer from webgl');
			return; }

	//tie a_Position to shader variable
	a_Position= gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position<0) {
		console.log('Failed to get location of a_Position');
		return;
	}
	a_FragColor= gl.getAttribLocation(gl.program, 'a_FragColor');
	if(a_FragColor<0) {
		console.log('Failed to get location of a_FragColor');
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

function thetaHandler(event) {
	var thetaslider=document.getElementById('thetaslider');
	var intheta=thetaslider.value;

	if(g_theta==(intheta /180 *Math.PI)) 
		return;

	g_theta=(intheta /180 *Math.PI);
	gl.uniform1f(theta,g_theta);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES,0,(g_points.length));
}
function divHandler(event) {
	var divslider=document.getElementById('divisionslider');
	var indiv=divslider.value;
	if(indiv == g_divisions)
		return;
	g_divisions=indiv;
	makeDivide(g_divisions);
}
function twistHandler(event) {

	var twistbuttons=document.getElementById('twistbuttons');
	for (var i=0; i < twistbuttons.length; i++)//get checked value
	{
		if (twistbuttons[i].checked)
		{
			var read_val = twistbuttons[i].value;
		}
	}
	if(read_val == g_twist)
		return;

	g_twist=read_val;
	gl.uniform1f(twist,g_twist);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES,0,(g_points.length));
	return;
}

function makeDivide(nDiv) {
	g_points=[];
	g_colors=[];
	subDivide(nDiv,//[-0.5,-0.5],[0.0,0.5],[0.5,-0.5]); //center the triangle w/ trig
	[0.5*Math.cos(0.50*Math.PI),0.5*Math.sin(0.50*Math.PI)],
	[0.5*Math.cos(7.0/6.0*Math.PI),0.5*Math.sin(7.0/6.0*Math.PI)],
	[0.5*Math.cos(11.0/6.0*Math.PI),0.5*Math.sin(11.0/6.0*Math.PI)]);
	//console.log('g_points length (verts): ',g_points.length);
	//console.log('g_points #floats: ',flatten(g_points).length);
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(g_points)) , gl.STATIC_DRAW);
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false,0,0);
	gl.enableVertexAttribArray(a_Position); //required

	gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(g_colors) , gl.STATIC_DRAW);
	gl.vertexAttribPointer(a_FragColor, 4, gl.FLOAT, false,0,0);
	gl.enableVertexAttribArray(a_FragColor); //required

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//param 2,3 offset,n(verts)
	//console.log('g_colors length ((vals) should be 4/3 of verts),',g_colors.length);
	//console.log('g_colors #colors,',g_colors.length/4);
	gl.drawArrays(gl.TRIANGLES,0,(g_points.length));

}
function subDivide(n,a,b,c) {
	if (n<=0) {
		g_points.push(a,b,c);
		for(var i=0;i<3;i++) //so apparently each vertex needs a color, who knew?
		{
			//random blended colors prettier than monocolor
			g_colors.push(	Math.random(),
							Math.random(),
							Math.random(),
							1.0);
		}
		return;
	} else {
		subDivide(n-1,  a,
						[(a[0]+b[0])/2,(a[1]+b[1])/2],
						[(a[0]+c[0])/2,(a[1]+c[1])/2]);
		subDivide(n-1,  b,
						[(b[0]+a[0])/2,(b[1]+a[1])/2],
						[(b[0]+c[0])/2,(b[1]+c[1])/2]);
		subDivide(n-1,  c,
						[(c[0]+a[0])/2,(c[1]+a[1])/2],
						[(c[0]+b[0])/2,(c[1]+b[1])/2]);
		subDivide(n-1,  
						[(a[0]+b[0])/2,(a[1]+b[1])/2],
						[(a[0]+c[0])/2,(a[1]+c[1])/2],
						[(b[0]+c[0])/2,(b[1]+c[1])/2]);

	}

}

// Shader Compiler
function compileShaders(ctx, vShaderID, fShaderID){

	var vShaderSrc = document.getElementById(vShaderID).innerHTML;
	if(!vShaderSrc) return console.error("Error getting vShader");

	var fShaderSrc = document.getElementById(fShaderID).innerHTML;
	if(!fShaderSrc) return console.error("Error getting fShader");

	initShaders(ctx, vShaderSrc, fShaderSrc)
};


//shamelessly borrowed from internet
function flatten (toFlatten) {
  var isArray = Object.prototype.toString.call(toFlatten) === '[object Array]';

  if (isArray && toFlatten.length > 0) {
    var head = toFlatten[0];
    var tail = toFlatten.slice(1);

    return flatten(head).concat(flatten(tail));
  } else {
    return [].concat(toFlatten);
  }
}

