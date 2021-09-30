"use strict";

function drawPolygon(polygon) {
	let values = [];
	for(let i = 0; i < polygon.p.data.length; i++) {
		values[i] = polygon.p.data[i].value;
	}
	let max = Math.max(...values);
	let min = Math.min(...values);
	console.log(max, min);

	let percent10 = max / 9;

	polygon.object.ctx.beginPath();
	polygon.object.ctx.fillStyle = "#ffffff";

	let width = polygon.startX;
	for(let i = 0; i < 24; i++) {
		let date = new Date(polygon.p.data[i].createtime)
		console.log(date.getMinutes());
		let hour = new Date(polygon.p.data[i].createtime).getMinutes();
		if(hour < 10) {
			polygon.object.ctx.fillText(hour + "", width - 3, polygon.startY + 10);
		} else {
			polygon.object.ctx.fillText(hour + "", width - 6, polygon.startY + 10);
		}
		width += polygon.unitWidth;
	}

	let height = polygon.startY;
	let heightLabel = 0;
	for(let i = 0; i < 9; i++) {
		height -= polygon.unitHeight;
		heightLabel += percent10;
		let fixedHeightLabel = heightLabel.toFixed(2);
		polygon.object.ctx.fillText(fixedHeightLabel + "", polygon.startX - 48, height);
	}

	polygon.object.ctx.strokeStyle = polygon.point.color;

	width = polygon.startX;
	height = polygon.startY - (polygon.coordinateHeight - polygon.unitHeight) / max * polygon.p.data[0].value;
	polygon.object.ctx.beginPath();
	polygon.object.ctx.arc(width, height, polygon.point.r, 0, Math.PI * 2, true);
	polygon.object.ctx.fill();
	polygon.moveData[0] = {width: width, height: height, data: polygon.p.data[0].value};
	for(let i = 0; i < polygon.p.data.length - 1; i++) {
		polygon.object.ctx.beginPath();
		polygon.object.ctx.moveTo(width, height);
		console.log(polygon.periodUnitWidth);
		width += polygon.periodUnitWidth;
		height = polygon.startY - (polygon.coordinateHeight - polygon.unitHeight) / max * polygon.p.data[i + 1].value;
	//	console.log(height, max, polygon.p.data[i + 1].value);
		polygon.object.ctx.lineTo(width, height);
		polygon.object.ctx.stroke();
		polygon.object.ctx.beginPath();
		polygon.object.ctx.arc(width, height, polygon.point.r, 0, Math.PI * 2, true);
		polygon.object.ctx.fill();
		polygon.moveData[i + 1] = {width: width, height: height, data: polygon.p.data[i + 1].value};
	}

	let imgData = polygon.object.ctx.getImageData(0, 0, polygon.object.dom.width, polygon.object.dom.height);
	polygon.object.dom.onmousemove = function(e) {
		let dom = this;
		let rect = dom.getBoundingClientRect();
		let x = e.clientX - rect.left * (dom.width / rect.width);
		let y = e.clientY - rect.top * (dom.height / rect.height);

	//	let imgData = polygon.object.ctx.createImageData(canvas
	//	let clear = false;
		for(let i = 0; i < polygon.moveData.length; i++) {
			if(Math.abs(x - polygon.moveData[i].width) <= 4) {
				polygon.object.ctx.putImageData(imgData, 0, 0);
				polygon.object.ctx.fillText(polygon.moveData[i].data, polygon.moveData[i].width, polygon.startY - polygon.coordinateHeight);
				polygon.object.ctx.beginPath();
				polygon.object.ctx.moveTo(polygon.startX + i * polygon.periodUnitWidth, polygon.startY);
				polygon.object.ctx.lineTo(polygon.startX + i * polygon.periodUnitWidth, polygon.startY - polygon.coordinateHeight);
				polygon.object.ctx.stroke();
				continue;
			}
		}
	}
}
