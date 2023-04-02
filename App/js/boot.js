/*
	*******************************************************************************
	R3ditor V3 - boot.js
	By TheMitoSan

	This file is responsible for creating main object (R3) and initialize all 
	systems
	*******************************************************************************
*/

const R3 = {
	
	// Build string
	build: {
		sha: 'Unknown',
		version: '0.0.1',
		status: 'DEV_VERSION'
	},

	// Pull general modules
	modules: tempFn_R3_MODULES,
	database: tempFn_DATABASE,
	settings: tempFn_SETTINGS,
	design: tempFn_DESIGN,
	system: tempFn_SYSTEM,
	wizard: tempFn_wizard,
	tools: tempFn_TOOLS,
	game: tempFn_GAME,
	mod: tempFn_MOD,

	// Pull R3V3 Editors
	INI: tempFn_INI,
	MSG: tempFn_MSG,
	RDT: tempFn_RDT,

	// App string
	appString: '',

	/*
		Functions
	*/

	// Create app string and first log
	logVersion: function(){

		// Set app string
		this.build.appString = 'R3V3 - Ver. ' + this.build.version + ' [' + this.build.status + ']';

		// Check flags
		var runFlags = nw.App.argv.toString().replace(RegExp(',', 'gi'), ' ');
		if (runFlags === ''){
			runFlags = 'No flags were added';
		}

		const versions = process.versions, osVersion = R3.modules.os,
			logData = ' - Guest Info -\nRunning on NW ' + versions.nw + ' [' + process.platform + '-' + versions['nw-flavor'] + '] under Chromium ' + versions.chromium +
			'\nOS: ' + osVersion.version() + ', Arch: ' + process.arch + '\nCPU: ' + R3.system.os.cpuName + ' with ' + R3.system.os.cpuCores +' cores\nRAM: ' + R3.system.os.totalRam +
			'\nRun Flags: ' + runFlags;

		// End
		R3.system.log.add(this.build.appString);
		R3.system.log.add('separator');
		R3.system.log.add(logData);
		R3.system.log.add('separator');

	},

	// Initialize app
	init: function(){

		try {

			// Initialize modules
			this.modules.init();
			this.system.init();
			this.system.cleanUtils.init();

			// Log version
			this.logVersion();

			// Load user settings
			this.settings.load();
			this.settings.resetLatestFile();

			// GUI Init
			this.design.init();

		} catch (err) {

			console.error('ERROR: Something went wrong on init process!\n' + err);
			
		} finally {

			// Post boot action
			this.postAction();

		}

	},

	// Post boot action
	postAction: function(){

		// Maximize window
		if (R3.settings.list.maximizeOnLoad === !0){
			R3.design.window.maximize();
		}

		// Create main shortcuts
		this.design.shortcuts.createMainShorcuts();

		setTimeout(function(){

			// Load mod on startup
			if (R3.settings.list.openLastProject === !0 && R3.settings.list.lastProjectPath !== ''){
				R3.mod.processModFile(R3.settings.list.lastProjectPath, !0);
			}

			// Open log at startup
			if (R3.settings.list.openLogAtStartup === !0){
				R3.system.log.open();
			}

			// Focus main window
			R3.modules.win.focus();

		}, 100);

	}
}

// Delete remaining modules
delete tempFn_R3_MODULES;
delete tempFn_SETTINGS;
delete tempFn_DATABASE;
delete tempFn_wizard;
delete tempFn_SYSTEM;
delete tempFn_DESIGN;
delete tempFn_TOOLS;
delete tempFn_GAME;
delete tempFn_MOD;

// Main editors
delete tempFn_INI;
delete tempFn_MSG;
delete tempFn_RDT;

/*
	Start R3V3
*/

window.onload = function(){
	R3.init();
};