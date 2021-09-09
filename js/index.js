"use strict";

var getCapitalBXmlhttp;
var getLowcaseBXmlhttp;
var getCirculationXmlhttp;

function getCData(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		console.log(e.target.responseText);
		let response = JSON.parse(e.target.responseText);
		console.log(response, "C");
		let locked = document.getElementById("lockedB");
		let unlocked = document.getElementById("unlockedB");

		if(!response.success){
			if(response.message == "not auth") {
				sessionStorage.clear();
				window.location.href = "/signin.html";
				return;
			}
			locked.innerText = "unknown";
			unlocked.innerText = "unknown";
			return;
		}

		locked.innerText = response.data.locked;
		unlocked.innerText = response.data.unlocked;
	}
}

function getLData(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		console.log(e.target.responseText);
		let response = JSON.parse(e.target.responseText);
		console.log(response, "L");
		let b = document.getElementById("b");

		if(!response.success){
			b.innerText = "unknown";
			return;
		}

		b.innerText = response.data;
	}
}

function getCirculation {
}

var key = sessionStorage.getItem("Bb_key");
var account = sessionStorage.getItem("Bb_account");
function main() {
	console.log(key);
	console.log(account);
	if(key == null || account == null) {
		window.location.href = "/signin.html";
		return;
	}

	if (window.XMLHttpRequest) {
		getCapitalBXmlhttp = new XMLHttpRequest();
		getLowcaseBXmlhttp = new XMLHttpRequest();
	} else {
		getCapitalBXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		getLowcaseBXmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	getCapitalBXmlhttp.open("GET", "http://47.98.204.151:8888/getcapitalb?account=" + account + "&key=" + key);
	getLowcaseBXmlhttp.open("GET", "http://47.98.204.151:8888/getlowcaseb?account=" + account + "&key=" + key);

	getCapitalBXmlhttp.send();
	getLowcaseBXmlhttp.send();

	getCapitalBXmlhttp.onreadystatechange = getCData;
	getLowcaseBXmlhttp.onreadystatechange = getLData;
}

window.onload = main;
