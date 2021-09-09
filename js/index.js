"use strict";

var key = sessionStorage.getItem("Bb_key");
var account = sessionStorage.getItem("Bb_account");

var xmlhttp;
var sse;


function checkSignIn(e) {
	if (e.target.readyState == 4 && e.target.status == 200) {
		console.log(e.target.responseText);
		let response = JSON.parse(e.target.responseText);
		console.log(response);

		if(!response.success){
			if(response.message == "not auth") {
				sessionStorage.clear();
				window.location.href = "/signin.html";
				return;
			}
			return;
		}

		sseProcess();
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
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("POST", network + "checksignin?account=" + account + "&key=" + key);
	xmlhttp.send();
	xmlhttp.onreadystatechange = checkSignIn;
}

function sseProcess() {
	sse =  new EventSource(network + "sse");
	console.log(sse);

	sse.onopen = function(e) {
		console.log("onopen", e);
	}

	sse.onmessage = function(e) {
		console.log("onmessage", e);
	}

	sse.addEventListener("getcapitalb", function(e) {
		let response = JSON.parse(e.data);
		console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("lockedB").innerText = response.data.locked;
		document.getElementById("unlockedB").innerText = response.data.unlocked;
	})

	sse.addEventListener("getlowcaseb", function(e) {
		let response = JSON.parse(e.data);
		console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("b").innerText = response.data;
	})

	sse.addEventListener("totalputin", function(e) {
		let response = JSON.parse(e.data);
		console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("totalPutIn").innerText = response.data;
	})

	sse.addEventListener("settled", function(e) {
		let response = JSON.parse(e.data);
		console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("settled").innerText = response.data;
	})

	sse.addEventListener("rewarded", function(e) {
		let response = JSON.parse(e.data);
		console.log(response);

		if(!response.success) {
			return;
		}

		document.getElementById("rewarded").innerText = response.data;
	})

	sse.addEventListener("filprice", function(e) {
		let response = JSON.parse(e.data);
		console.log(response);

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

window.onload = main;
