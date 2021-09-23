"use strict";

const COLORLIGHT = "#eeeeee";
const COLORBOLD = "#ffffff";
const FONTSIZE = "12px";
const filNodeColumns = {"address":"所有者", "balance":"账户总余额", "qualityadjpower":"有效算力", "availableBalance": "可用余额", "pledge": "扇区抵押", "vestingFunds": "存储服务锁仓", "singlet": "单T"};

var key = sessionStorage.getItem("Bb_key");
var account = sessionStorage.getItem("Bb_account");

var xmlhttpInit
var xmlhttpCirulations; 
var xmlhttpWorthdeposits; 
var xmlhttpFilDrawns; 
var xmlhttpCfilDrawns; 
var sse;

function checkSignIn(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(successed(response)) {
			xmlhttpInit.open("GET", networking + "?account=" + account + "&key=" + key);
			xmlhttpInit.send();
			xmlhttpInit.onreadystatechange = initData;

			xmlhttpCirulations.open("GET", networking + "cirulations?account=" + account + "&key=" + key);
			xmlhttpCirulations.send();
			xmlhttpCirulations.onreadystatechange = getCirulations;

			xmlhttpWorthdeposits.open("GET", networking + "worthdeposits?account=" + account + "&key=" + key);
			xmlhttpWorthdeposits.send();
			xmlhttpWorthdeposits.onreadystatechange = getWorthDeposits;

			xmlhttpFilDrawns.open("GET", networking + "fildrawns?account=" + account + "&key=" + key);
			xmlhttpFilDrawns.send();
			xmlhttpFilDrawns.onreadystatechange = getFilDrawns;

			xmlhttpCfilDrawns.open("GET", networking + "cfildrawns?account=" + account + "&key=" + key);
			xmlhttpCfilDrawns.send();
			xmlhttpCfilDrawns.onreadystatechange = getCfilDrawns;

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

function initData(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		{
			let dom = document.getElementById("apy_rate");
			if(!response.success) {
				dom.innerText = response.message;
				return;
			}
			dom.innerText = floatNumberProcess(parseFloat(response.data.apyrate));
		}

		{
			let dom = document.getElementById("cfil_to_fil");
			if(!response.success) {
				dom.innerText = response.message;
				return;
			}
			dom.innerText = "1:" + floatNumberProcess(parseFloat(response.data.cfiltofil));
		}

		{
			let dom = document.getElementById("lowcase_b");
			if(!response.success) {
				dom.innerText = response.message;
				return;
			}
			dom.innerText = floatNumberProcess(parseFloat(response.data.lowcaseb));
		}

		{
			let dom = document.getElementById("loss");
			if(!response.success) {
				dom.innerText = response.message;
				return;
			}
			dom.innerText = floatNumberProcess(parseFloat(response.data.loss));
		}

		{
			let dom = document.getElementById("drawn_fil");
			if(!response.success) {
				dom.innerText = response.message;
				return;
			}
			dom.innerText = floatNumberProcess(parseFloat(response.data.drawnfil));
		}

		{
			let dom = document.querySelector("#lockedFilNode>ul");
			if(!response.success) {
				dom.innerText = response.message;
				return;
			}

			let totalBalance = renderFilNode(dom, response.data.filNodes);

			let domb = document.getElementById("capital_b");
			domb.innerText = totalBalance;
		}

		syncOver();
	}
}

function getCirulations(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
	//	console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		let polygen = new Polygon(document.querySelectorAll("#curve canvas")[0], 1, {color: "#09c271", r: 4});
		polygen.p = {clear: false, cirulations: response.data}; 
		polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
	}
}

function getWorthDeposits(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
	//	console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		let polygen = new Polygon(document.querySelectorAll("#curve canvas")[1], 1, {color: "#09c271", r: 4});
		polygen.p = {clear: false, cirulations: response.data}; 
		polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
	}
}

function getFilDrawns(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
	//	console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		let polygen = new Polygon(document.querySelectorAll("#curve canvas")[2], 1, {color: "#09c271", r: 4});
		polygen.p = {clear: false, cirulations: response.data}; 
		polygen.object.zoomControl(polygen, COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
		polygen.draw(COLORLIGHT, COLORBOLD, FONTSIZE, drawCirulations);
	}
}

function getCfilDrawns(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(!successed(response)) {
			console.log(response.message);
			return;
		}

		let polygen = new Polygon(document.querySelectorAll("#curve canvas")[3], 12, {color: "#770000", r: 1});
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

	let xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
		xmlhttpInit = new XMLHttpRequest();
		xmlhttpCirulations = new XMLHttpRequest();
		xmlhttpWorthdeposits = new XMLHttpRequest();
		xmlhttpFilDrawns = new XMLHttpRequest();
		xmlhttpCfilDrawns = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpInit = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpCirulations = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpWorthdeposits = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpFilDrawns = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttpCfilDrawns = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("POST", networking + "checksignin");
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("account=" + account + "&key=" + key);
	xmlhttp.onreadystatechange = checkSignIn;
}

function syncOver() {
	let lowcaseb = parseFloat(document.getElementById("lowcase_b").innerText); 
	let capitalb = parseFloat(document.getElementById("capital_b").innerText); 
	document.getElementById("total_put_in").innerText = lowcaseb + capitalb; // 最新总资产

	let lrr = (lowcaseb / (lowcaseb + capitalb) * 100)
	let dom = document.getElementById("lrr");
	if(isNaN(lrr)) {
		dom.innerText = 0 + "%";
		return
	}
	dom.innerText = lrr.toFixed(4) + "%"; // 准备金率
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

	// APY%
	sse.addEventListener("apyrate", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("apy_rate");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}
		dom.innerText = floatNumberProcess(parseFloat(response.data));
	})
	
	// CFIL:FIL
	sse.addEventListener("cfiltofil", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let dom = document.getElementById("cfil_to_fil");
		if(!response.success) {
			dom.innerText = response.message;
			return;
		}
		dom.innerText = "1:" + floatNumberProcess(parseFloat(response.data));
	})
	
	// 可流通量b
	sse.addEventListener("lowcaseb", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		let domLowcase = document.getElementById("lowcase_b");

		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		console.log(response.data);
		domLowcase.innerText = floatNumberProcess(parseFloat(response.data));

		syncOver();
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
		dom.innerText = floatNumberProcess(parseFloat(response.data));
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
		dom.innerText = floatNumberProcess(parseFloat(response.data));
	})
	
	// B锁仓量投资FIL节点
	sse.addEventListener("filNodes", function(e) {
		let response = JSON.parse(e.data);
	//	console.log(response);

		if(!response.success) {
			dom.innerText = response.message;
			return;
		}

		let dom = document.querySelector("#lockedFilNode>ul");
		while(dom.firstChild) {
			dom.removeChild(dom.firstChild);
		}

		let totalBalance = renderFilNode(dom, response.data);
	})
}

function renderFilNode(dom, data) {
	let totalBalance = 0;
	for(let key in data) {
		let li = document.createElement("li");
		let details = document.createElement("details");
		let summary = document.createElement("summary");
		summary.innerText = key;
		details.setAttribute("open", true);
		details.append(summary);
		let aside = document.createElement("aside");
		for(let k in data[key]) {
			let div = document.createElement("div");
			let h6 = document.createElement("h6");
			h6.innerText = filNodeColumns[k];
			let divInner = document.createElement("div");
			let v = data[key][k];
			let value;
			switch(k) {
				case "address":
					value = v.slice(0, 8) + "......" + v.slice(v.length - 9, v.length - 1);
					break;
				case "singlet":
					value = floatNumberProcess(v) + "FIL/T";
					break;
				case "qualityadjpower":
					value = floatNumberProcess(v) + "BiP";
					break;
				case "balance":
					value = floatNumberProcess(parseFloat(v) / 1000000000000000000) + "FIL";
					totalBalance += parseFloat(v);
				default:
					value = floatNumberProcess(parseFloat(v) / 1000000000000000000) + "FIL";
			}
			divInner.innerText = value;
			div.append(h6);
			div.append(divInner);
			aside.append(div);
		}

		details.append(aside);
		li.append(details);
		dom.append(li);
	}

	return floatNumberProcess(totalBalance / 1000000000000000000);
}

window.onload = main;
