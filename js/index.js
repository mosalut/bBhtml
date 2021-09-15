"use strict";

const COLORLIGHT = "#eeeeee";
const COLORBOLD = "#ffffff";
const FONTSIZE = "12px";

var key = sessionStorage.getItem("Bb_key");
var account = sessionStorage.getItem("Bb_account");

var xmlhttp;
var xmlhttpCirulations; 
var xmlhttpWorthdeposits; 
var xmlhttpDrawns; 
var sse;

function checkSignIn(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(successed(response)) {
			xmlhttpCirulations.open("GET", networking + "cirulations?account=" + account + "&key=" + key);
			xmlhttpCirulations.send();
			xmlhttpCirulations.onreadystatechange = getCirulations;

			xmlhttpWorthdeposits.open("GET", networking + "worthdeposits?account=" + account + "&key=" + key);
			xmlhttpWorthdeposits.send();
			xmlhttpWorthdeposits.onreadystatechange = getWorthDeposits;

			xmlhttpDrawns.open("GET", networking + "drawns?account=" + account + "&key=" + key);
			xmlhttpDrawns.send();
			xmlhttpDrawns.onreadystatechange = getDrawns;

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

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		let polygen = new Polygon(document.querySelectorAll("#curve canvas")[0]);
		polygen.p = {clear: false, cirulations: response.data}; 
		polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
	}
}

function getWorthDeposits(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		let polygen = new Polygon(document.querySelectorAll("#curve canvas")[1]);
		polygen.p = {clear: false, cirulations: response.data}; 
		polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
	}
}

function getDrawns(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		let polygen = new Polygon(document.querySelectorAll("#curve canvas")[2]);
		polygen.p = {clear: false, cirulations: response.data}; 
		polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
	}
}

function responseSignout(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		sessionStorage.clear();
		window.location.href = "/signin.html";
	}
}

function signout(e) {
	let xmlhttp; 
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET", networking + "signout?account=" + account + "&key=" + key);
	xmlhttp.send();
	xmlhttp.onreadystatechange = responseSignout;
}

function main() {
	console.log(key);
	console.log(account);
	if(key == null || account == null) {
		window.location.href = "/signin.html";
		return;
	}

	let accountName = document.querySelector("header #account");
	accountName.value = account;

	let signoutButton = document.querySelector("header #signout");
	signoutButton.onclick = signout

	let dataContainers = document.querySelectorAll(".center>div");
	for(let i = 0; i < dataContainers.length; i++) {
		loading(dataContainers[i]);
	}

	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
		xmlhttpCirulations = new XMLHttpRequest();
		xmlhttpWorthdeposits = new XMLHttpRequest();
		xmlhttpDrawns = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpCirulations = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpWorthdeposits = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpDrawns = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("POST", networking + "checksignin");
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("account=" + account + "&key=" + key);
	xmlhttp.onreadystatechange = checkSignIn;
}

function syncOver(sync) {
	if(sync == 0) {
		let lowcaseb = parseFloat(document.getElementById("lowcase_b").innerText); 
		let capitalb = parseFloat(document.getElementById("capital_b").innerText); 
		console.log("lowcaseb:", lowcaseb);
		console.log("capitalb:", capitalb);
		document.getElementById("total_put_in").innerText = lowcaseb + capitalb; // 最新总资产
		document.getElementById("lrr").innerText = (lowcaseb / (lowcaseb + capitalb) * 100).toFixed(4) + "%"; // 准备金率
	}
}

function sseProcess() {
	sse =  new EventSource(networking + "sse");
	console.log(sse);

	sse.onopen = function(e) {
		console.log("onopen", e);
	}

	sse.onerror = function(e) {
		console.log("onerror", e);
	}

	sse.onmessage = function(e) {
	//	console.log("onmessage", e);
	}

	let sync = 2;
	
	// APY%
	sse.addEventListener("apyrate", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("apy_rate");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		document.getElementById("apy_rate").innerText = floatNumberProcess(response.data);
	})
	
	// CFIL:FIL
	sse.addEventListener("cfiltofil", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);
		console.log(e);

		let dom = document.getElementById("cfil_to_fil");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		dom.innerText = "1:" + floatNumberProcess(response.data);
	})
	
	// 可流通量b
	sse.addEventListener("lowcaseb", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("lowcase_b");
		if(!response.success) {
			dom.innerText = response.message;
			sync--
			return;
		}

		dom.innerText = floatNumberProcess(response.data);
		sync--

		syncOver(sync);
	})

	// 锁仓量B
	sse.addEventListener("capitalb", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("capital_b");
		if(!response.success) {
			dom.innerText = response.message;
			sync--
			return;
		}

		dom.innerText = floatNumberProcess(response.data);
		sync--

		syncOver(sync);
	})

	// 损耗值
	sse.addEventListener("loss", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("loss");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		dom.innerText = floatNumberProcess(response.data);
	})

	// 已提取CFIL
	sse.addEventListener("drawnfil", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("drawn_fil");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		dom.innerText = floatNumberProcess(response.data);
	})

	/*
	// 已提取CFIL
	sse.addEventListener("drawncfil", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("drawn_cfil");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		dom.innerText = floatNumberProcess(response.data);
	})

	// 已奖励Faci
	sse.addEventListener("rewardedfaci", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("rewarded_faci");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		dom.innerText = floatNumberProcess(response.data);
	})

	// Faci总发行量
	sse.addEventListener("facitotal", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("faci_total");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		dom.innerText = floatNumberProcess(response.data);
	})
	*/
}

window.onload = main;
