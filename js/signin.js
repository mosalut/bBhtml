"use strict"

window.onload = function() {
	let codeB = document.getElementById("codeB")
	let xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	let account = document.getElementsByName("account")[0];

	codeB.onclick = function(e) {
		xmlhttp.open("POST", networking + "code")
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		console.log(account.value);
		xmlhttp.send("account=" + account.value);
		xmlhttp.onreadystatechange = function(e) {
			if (e.target.readyState == 4 && e.target.status == 200) {
				let response = JSON.parse(e.target.responseText);
				console.log(response);

				if(response.success) {
					codeB.setAttribute("disabled", true);
					let seconds = 60;
					let t = window.setInterval(function() {
						codeB.value = seconds--;
						if(seconds == 0) {
							codeB.value = "get code";
							window.clearInterval(t);
							codeB.setAttribute("disabled", false);
							return;
						}
					}, 1000);
				} else {
					console.log(response.message);
				}
			}
		}
	}
}
