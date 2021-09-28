"use strict";

var networking = "http://47.98.204.151:8887/"

function floatNumberProcess(number) {
	number /= 1e18;
	return number.toFixed(4);
}

function loading(dom) {
	let t = setInterval(function() {
		switch(dom.innerText) {
			case "": 
			case "/":
				dom.innerText = "-";
				break;
			case "-":
				dom.innerText = "\\";
				break;
			case "\\":
				dom.innerText = "|";
				break;
			case "|":
				dom.innerText = "/";
				break;
			default:
				clearInterval(t);
		}
	}, 100);
}
