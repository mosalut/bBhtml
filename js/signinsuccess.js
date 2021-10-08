"use strict";

function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

function main() {
	let key = GetQueryString("key");
	let account = GetQueryString("account");
	let name = GetQueryString("name");
	if(key == null || account == null) {
		window.location.href = "/signin.html";
		return;
	}

	sessionStorage.setItem("Bb_key", key);
	sessionStorage.setItem("Bb_account", account);
	sessionStorage.setItem("Bb_name", name);

	let success = document.getElementsByTagName("input")[0];
	success.value = "sign in success";
}

window.onload = main;
