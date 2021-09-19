"use strict";

var Canvas = function(dom) {
	this.dom = dom;
	this.ctx = dom.getContext("2d");
	this.backupWidth;
	this.backupHeight;
	this.backupStyle;
}

Canvas.prototype.backup = function() {
	this.backupWidth = this.dom.parentNode.clientWidth;
	this.backupHeight = this.dom.parentNode.clientHeight;
	this.backupStyle = this.dom.parentNode.style;
}

Canvas.prototype.zoomControl = function(father, colorLight, colorBold, fontSize, custom) {
	this.zoomouted = false;
	this.textX = "时间";
	this.backup();

	let object = this;
	this.dom.onclick = function() {
		this.parentNode.style.position = "fixed";
		this.parentNode.style.top = "0px";
		this.parentNode.style.left = "0px";
		this.parentNode.style.zIndex = "1";

		let width = document.body.clientWidth;
		this.parentNode.style.width = width + "px";
		this.parentNode.style.height = width * 9 / 25 + "px";
		this.width = parseInt(this.parentNode.style.width);
		this.height = parseInt(this.parentNode.style.height);

		father.resize(this);
		father.draw(colorLight, colorBold, fontSize, custom);

		let that = this;
		this.nextElementSibling.style.display = "block";
		this.nextElementSibling.onclick = function() {
			this.parentNode.style = object.backupStyle;
			this.style.display = "none";
			console.log(object.backupWidth);
			console.log(object.backupHeight);
			this.parentNode.style.width = object.backupWidth + "px";
			this.parentNode.style.height = object.backupHeight + "px";
			that.width = parseInt(this.parentNode.style.width);
			that.height = parseInt(this.parentNode.style.height);
			father.resize(that);
			father.draw(colorLight, colorBold, fontSize, custom);
		}
	}
}

var Polygon = function(dom, peroid, point) {
	this.p = {};
	this.object = new Canvas(dom);
	this.moveData = [];
	this.peroid = peroid;
	this.resize(dom);
	this.point = point;
}

Polygon.prototype.resize = function(dom) {
	this.startX = dom.width * 10 / 100;
	this.startY = dom.height - dom.height * 5 / 100;
	this.coordinateWidth = dom.width * 80 / 100;
	this.coordinateHeight = dom.height * 80 / 100;
	this.unitWidth = this.coordinateWidth / 24;
	this.unitHeight = this.coordinateHeight / 10;
	this.periodUnitWidth = this.unitWidth / this.peroid;
}

Polygon.prototype.draw = function(colorLight, colorBold, fontSize, custom) {
	this.object.ctx.strokeStyle = colorLight;
	this.object.ctx.font = fontSize;
	this.object.ctx.fillStyle = colorBold;
	this.object.ctx.beginPath();

	this.object.ctx.moveTo(this.startX, this.startY);
	this.object.ctx.lineTo(this.startX + this.coordinateWidth, this.startY);

	this.object.ctx.moveTo(this.startX, this.startY);
	this.object.ctx.lineTo(this.startX, this.startY - this.coordinateHeight);

	let width = this.startX;
	for(let i = 0; i < 23; i++) {
		width += this.unitWidth;
		this.object.ctx.moveTo(width, this.startY + 2);
		this.object.ctx.lineTo(width, this.startY - 2);
	}
	width += this.unitWidth;
	this.object.ctx.fillText("时间", width + 4, this.startY + 4);

	let height = this.startY;
	for(let i = 0; i < 9; i++) {
		height -= this.unitHeight;
		this.object.ctx.moveTo(this.startX + 2, height);
		this.object.ctx.lineTo(this.startX - 2, height);
	}
	height -= this.unitHeight;
	this.object.ctx.stroke();

	this.object.ctx.fillText(this.object.dom.dataset.text, this.startX - 14, height - 4);

	width = this.startX;
	this.object.ctx.font = fontSize;
	this.object.ctx.fillStyle = colorBold;
	for(let i = 0; i < 10; i++) {
		this.object.ctx.fillText(i + "", width - 3, this.startY + 10);
		width += this.unitWidth;
	}

	for(let i = 10; i < 24; i++) {
		this.object.ctx.fillText(i + "", width - 6, this.startY + 10);
		width += this.unitWidth;
	}

	custom(this);
}
