"use strict";


function initCanvas(canvas) {
	let coordinateWidth = canvas.width * 80 / 100;
	let coordinateHeight = canvas.height * 80 / 100;
	let unitWidth = coordinateWidth / 24;
	let unitHeight = coordinateHeight / 10;
	let startX = canvas.width * 10 / 100;
	let startY = canvas.height - canvas.height * 5 / 100;

	let ctx = canvas.getContext("2d");
//	ctx.strokeStyle = "#09c271";
	ctx.strokeStyle = "#eeeeee";
	ctx.beginPath();

	ctx.moveTo(startX, startY);
	ctx.lineTo(startX + coordinateWidth, startY);

	ctx.moveTo(startX, startY);
	ctx.lineTo(startX, startY - coordinateHeight);

	let width = startX;
	for(let i = 0; i < 23; i++) {
		width += unitWidth;
		ctx.moveTo(width, startY + 2);
		ctx.lineTo(width, startY - 2);
	}

	let height = startY;
	for(let i = 0; i < 9; i++) {
		height += unitHeight;
		ctx.moveTo(startY, height + 2);
		ctx.lineTo(startY, height - 2);
	}

	ctx.stroke();
}
