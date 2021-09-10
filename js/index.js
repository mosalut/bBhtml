"use strict";

var key = sessionStorage.getItem("Bb_key");
var account = sessionStorage.getItem("Bb_account");

var xmlhttp;
var sse;


function checkSignIn(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(successed(response)) {
			xmlhttp.open("GET", networking + "cirulations?account=" + account + "&key=" + key);
			xmlhttp.send();
			xmlhttp.onreadystatechange = getCirulations;

			sseProcess();
		}
	}
}

function successed(response) {
	if(!response.success){
		if(response.message == "not auth") {
			sessionStorage.clear();
			window.location.href = "/signin.html";
			return false;
		}
		return false;
	}

	return true;
}

function getCirulations(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(successed(response)) {
			initCirulations(response.data);
		}
	}
}

function initCirulations(cirulations) {
	let max = Math.max(...cirulations);
	let min = Math.min(...cirulations);
	console.log(max, min);
}

function main() {
	console.log(key);
	console.log(account);
	if(key == null || account == null) {
		window.location.href = "/signin.html";
		return;
	}

	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("POST", networking + "checksignin");
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("account=" + account + "&key=" + key);
	xmlhttp.onreadystatechange = checkSignIn;

	canvasControl();
}

function sseProcess() {
	sse =  new EventSource(networking + "sse");
	console.log(sse);

	sse.onopen = function(e) {
		console.log("onopen", e);
	}

	sse.onmessage = function(e) {
	//	console.log("onmessage", e);
	}

	sse.addEventListener("capitalb", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("lockedB").innerText = response.data.locked;
		document.getElementById("unlockedB").innerText = response.data.unlocked;
	})

	sse.addEventListener("lowcaseb", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("b").innerText = response.data;
	})

	sse.addEventListener("totalputin", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("totalPutIn").innerText = response.data;
	})

	sse.addEventListener("settled", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("settled").innerText = response.data;
	})

	sse.addEventListener("rewarded", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("rewarded").innerText = response.data;
	})

	sse.addEventListener("filprice", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("filPrice").innerText = response.data;
	})

	sse.onerror = function(e) {
		console.log("onerror", e);
		sse.close()
	}
}

function canvasControl() {
	let canvases = document.querySelectorAll("#curve canvas");
	let ctxes = new Array();

	for(let i = 0; i < canvases.length; i++) {
		ctxes[i] = initCanvas(canvases[i]);
	}

	for (let i = 0; i < canvases.length; i++) {
		canvases[i].onclick = function() {
			let parentNode = this.parentNode;
			let backupStyle = parentNode.style;

			parentNode.style.position = "fixed";
			parentNode.style.top = "0px";
			parentNode.style.left = "0px";
			parentNode.style.zIndex = "1";
			let width = document.body.clientWidth;
			parentNode.style.width = width + "px";
			parentNode.style.height = width * 9 / 25 + "px";
			this.style.width = "100%";
			this.style.height = "100%";
			this.nextElementSibling.style.display = "block";
			this.nextElementSibling.onclick = function() {
				parentNode.style = backupStyle;
				this.style.display = "none";
				this.style.width = parentNode.style.width;
				this.style.height = parentNode.style.height;
			}
		}
	}
}

window.onload = main;
