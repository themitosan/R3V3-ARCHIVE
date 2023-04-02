/*
	*******************************************************************************
	R3ditor V3 - modules.js
	By TheMitoSan

	This file is responsible for initializing nw / external modules and variables 
	for post-usage.
	*******************************************************************************
*/
tempFn_R3_MODULES = {
	// Variables
	initError: !1,

	// Modules
	fs: void 0,
	os: void 0,
	gui: void 0,
	win: void 0,
	path: void 0,
	discord: void 0,
	memoryjs: void 0,
	childProcess: void 0,

	// Functions
	init: function(){
		try {
			
			// Check for browser
			if (typeof nw === 'undefined'){
				document.title = 'BRUTAL ERROR!!!';
				window.alert('ALERT: You are trying to run this app on browser!\nThis only runs on nw.js (node-webkit) app.');
				location.replace('https://themitosan.github.io/');
			}

			// Require modules
			this.fs = require('fs');
			this.os = require('os');
			this.win = nw.Window.get();
			this.path = require('path');
			this.gui = require('nw.gui');
			this.memoryjs = require('memoryjs');
			this.discord = require('discord-rpc');
			this.childProcess = require('child_process');

			// Post
			this.gui.Screen.Init();

		} catch (err) {
			this.initError = !0;
			console.error(err);
			R3.system.log.add(err);
		}
	}
}