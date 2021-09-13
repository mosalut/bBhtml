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

		if(successed(response)) {
			let polygen = new Polygon(document.querySelectorAll("#curve canvas")[0]);
			polygen.p = {clear: false, cirulations: response.data}; 
			polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
			polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		}
	}
}

function getWorthDeposits(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(successed(response)) {
			let polygen = new Polygon(document.querySelectorAll("#curve canvas")[1]);
			polygen.p = {clear: false, cirulations: response.data}; 
			polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
			polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		}
	}
}

function getDrawns(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(successed(response)) {
			let polygen = new Polygon(document.querySelectorAll("#curve canvas")[2]);
			polygen.p = {clear: false, cirulations: response.data}; 
			polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
			polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		}
	}
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

	sse.onmessage = function(e) {
	//	console.log("onmessage", e);
	}

	let sync = 2;
	
	// APY%
	sse.addEventListener("apyrate", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("apy_rate").innerText = response.data.toFixed(4);
	})
	
	// CFIL:FIL
	sse.addEventListener("cfiltofil", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("cfil_to_fil").innerText = response.data.toFixed(4);
	})
	
	// 可流通量b
	sse.addEventListener("lowcaseb", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			sync--
			return;
		}

		document.getElementById("lowcase_b").innerText = response.data.toFixed(4);
		sync--

		syncOver(sync);
	})

	// 锁仓量B
	sse.addEventListener("capitalb", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			sync--
			return;
		}

		document.getElementById("capital_b").innerText = response.data.toFixed(4);
		sync--

		syncOver(sync);
	})

	// 损耗值
	sse.addEventListener("loss", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("loss").innerText = response.data.toFixed(4);
	})

	// B锁仓量投资FIL节点
	sse.addEventListener("lockedfilnode", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("locked_fil_node").innerText = response.data.toFixed(4);
	})

	// 已提取CFIL
	sse.addEventListener("drawncfil", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("drawn_cfil").innerText = response.data.toFixed(4);
	})

	// 已奖励Faci
	sse.addEventListener("rewardedfaci", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("rewarded_faci").innerText = response.data.toFixed(4);
	})

	// Faci总发行量
	sse.addEventListener("facitotal", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("faci_total").innerText = response.data.toFixed(4);
	})

	sse.onerror = function(e) {
		console.log("onerror", e);
		sse.close()
	}
}

window.onload = main;
