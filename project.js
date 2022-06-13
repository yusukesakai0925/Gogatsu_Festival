let capture;
let poseNet;
let poses = [];
let textflag = 0;

function modelReady() {
	select('#status').html('Model Loaded');
  }

let circles = [];
let draw_num = 1200;

function setup(){
	createCanvas(windowWidth, windowHeight);
  	colorMode(HSB);
	capture = createCapture(VIDEO);
	pixelDensity(1);
	
	poseNet = ml5.poseNet(capture, modelReady);

	poseNet.on("pose", function(results){
		poses = results;
	})
	capture.hide();

	for(let i=0;i<draw_num;i++){
		let circle = new Circle(0, 0 , 0, 0);
		circles.push(circle);
	}

	textSize(100);
	//textFont("Sawarabi Mincho");
	textAlign(CENTER, CENTER);
}

class Circle{
	constructor(pos_x, pos_y, size, color){
		this.x = pos_x;
		this.y = pos_y;
		this.s = size;
		this.c = color;
	}
}

let resize_x = 1.0;
let resize_y = 1.0;

function draw(){
	scale(-1, 1);	//左右反転
  	background(255);
	let img = capture.get();
	resize_x = windowWidth/img.width;
	resize_y = windowHeight/img.height;
	img.resize(windowWidth, windowHeight);


	image(img, -width, 0);
	Collect_Circles();
	Draw_Circles();

	while(circles.length > draw_num){
		circles.shift();
	}

	if(textflag == 1){
		scale(-1, 1);
		fill(0);
		textFont("'Sawarabi Mincho', cursive");
		text("東 大 藝 大\n  交 流 会", windowWidth/2, windowHeight/2-100);
	}

}

let seed = 0;

function Collect_Circles(){
	//左手
	for (let i = 0; i < poses.length; i++) {
	  // For each pose detected, loop through all the keypoints
	  let left_hand = poses[i].pose;
	  //let keypoint_nose = nose.keypoints[0];
		let keypoint_left_hand = left_hand.keypoints[9];

	  if(keypoint_left_hand.score > 0.2){
		  seed++;
		  let col = color((noise(seed*0.05)*2+seed/3)%360, 100, 100, 1.0);
		  let circle = new Circle(keypoint_left_hand.position.x*resize_x, keypoint_left_hand.position.y*resize_y, 80, col);
		  circles.push(circle);
	  }
	}

	//右手
	for (let i = 0; i < poses.length; i++) {
		// For each pose detected, loop through all the keypoints
		let right_hand = poses[i].pose;
		  let keypoint_right_hand = right_hand.keypoints[10];
  
		if(keypoint_right_hand.score > 0.2){
			seed++;
			let col = color((noise(seed*0.05)+seed/3+180)%360, 100, 100, 1.0);
			//左右反転プラス画面サイズに拡大
			let circle = new Circle(keypoint_right_hand.position.x*resize_x, keypoint_right_hand.position.y*resize_y, 80, col);
			circles.push(circle);
		}
	  }
  }

function Draw_Circles(){
	for(let i = 0; i < circles.length;i++){
		fill(circles[i].c);
		noStroke();
		size = circles[i].s*i/draw_num;
		ellipse(circles[i].x-width, circles[i].y-(draw_num-i)/5, size, size);
	}
}

function mousePressed(){
	let fs = fullscreen();
	fullscreen(!fs);
}

function windowResized() {
	// print("ウィンドウサイズの変更");
	resizeCanvas(windowWidth, windowHeight);
}

//録画用
function keyPressed() {
	/*if (key === "c") {
	  const capture = P5Capture.getInstance();
	  if (capture.state === "idle") {
		capture.start({
			format: "gif",
			duration:100,
		});
	  } else {
		capture.stop();
	  }
	}*/
	if(key === "l"){
		if(textflag == 1){
			textflag = 0;
		}else{
			textflag =1;
		}
	}
}

