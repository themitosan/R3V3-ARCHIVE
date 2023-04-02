/*
	*******************************************************************************
	R3ditor V3 - settings.js
	By TheMitoSan

	This file is responsible for handling all user settings and more
	*******************************************************************************
*/

tempFn_SETTINGS = {

	// R3V3 Settings
	list: {

		// Misc Settings
		mainDisplayId: 0,
		enableDiscord: !1,
		maximizeOnLoad: !1,
		checkForUpdates: !0,
		openLastProject: !0,
		openLogAtStartup: !0,

		// Show Last file opened
		showLastFile: !0,
		
		// Last mod path
		lastProjectPath: '',

		// Last file settings
		lastFileExtension: '',
		lastFileOpenedPath: '',
		lastFileOpenedEditor: '',

		// External paths
		paths: {

			// Main game executables
			re3Path: '',
			mercePath: '',

			// Tools paths
			hexEditor_path: '',

			// Leo2236 tools
			leo2236_re3mv: '',
			leo2236_re3slde: '',
			leo2236_re3plwe: ''

		},

		// RE3 Livestatus
		livestatus: {

			updateSpeed: 60,
			displayPosAsInt: !1,
			enableGameDetection: !0

		},

		// MSG Editor
		msgEditor: {

			// Compile message as you type
			compileMessageOnType: !0,

			// Show function names on preview
			showFunctionsOnPreview: !1

		}

	},

	/*
		Functions
	*/
	
	// Save settings
	save: function(closeSettings){

		// Check if needs to close settings window
		if (closeSettings === !0){

			/*
				Parse values from settings form
			*/

			// General
			R3.settings.list.showLastFile = R3.design.tools.parseCheckbox('R3_settings_showLatestFile');
			R3.settings.list.enableDiscord = R3.design.tools.parseCheckbox('R3_settings_enableDiscord');
			R3.settings.list.openLastProject = R3.design.tools.parseCheckbox('R3_settings_openLastProject');
			R3.settings.list.checkForUpdates = R3.design.tools.parseCheckbox('R3_settings_checkForUpdates');
			R3.settings.list.openLogAtStartup = R3.design.tools.parseCheckbox('R3_settings_openLogStartup');

			// RE3 Livestatus
			R3.settings.list.livestatus.displayPosAsInt = R3.design.tools.parseCheckbox('R3_settings_livestausPosHexInt');
			R3.settings.list.livestatus.enableGameDetection = R3.design.tools.parseCheckbox('R3_settings_enableGameDetection');
			R3.settings.list.livestatus.updateSpeed = parseInt(document.getElementById('R3_settings_livestausUpdateFrenquency').value);

			// Window
			R3.settings.list.maximizeOnLoad = R3.design.tools.parseCheckbox('R3_settings_maximizeOnLoad');

			// MSG Editor
			R3.settings.list.msgEditor.compileMessageOnType = R3.design.tools.parseCheckbox('R3_settings_msgEditor_compileOnType');
			R3.settings.list.msgEditor.showFunctionsOnPreview = R3.design.tools.parseCheckbox('R3_settings_msgEditor_showFunctionsOnPreview');

			// Close window
			R3.design.miniwindow.close('appSettings');

		}
		
		// End
		localStorage.setItem('R3V3_SETTINGS', JSON.stringify(this.list));

	},

	// Load settings
	load: function(){
		
		// Get save data
		const tempSave = localStorage.getItem('R3V3_SETTINGS');
		if (tempSave !== null){
			R3.settings.list = JSON.parse(tempSave);
		} else {
			// Make settings at first startup
			R3.settings.save();
		}

		// Update main menu
		R3.design.menuBar.updateMainMenu();
	},

	// Reset settings
	reset: function(){
		localStorage.clear();
		chrome.runtime.reload();
	},

	// Render settings on form
	renderSettings: function(){

		// Check if settings window is open
		if (R3.design.miniwindow.isActive('appSettings') === !0){

			// General
			document.getElementById('R3_settings_enableDiscord').checked = JSON.parse(R3.settings.list.enableDiscord);
			document.getElementById('R3_settings_showLatestFile').checked = JSON.parse(R3.settings.list.showLastFile);
			document.getElementById('R3_settings_openLogStartup').checked = JSON.parse(R3.settings.list.openLogAtStartup);
			document.getElementById('R3_settings_checkForUpdates').checked = JSON.parse(R3.settings.list.checkForUpdates);
			document.getElementById('R3_settings_openLastProject').checked = JSON.parse(R3.settings.list.openLastProject);

			// Paths
			Object.keys(R3.settings.list.paths).forEach(function(cPath){
				var res = 'ok';
				if (R3.modules.fs.existsSync(R3.settings.list.paths[cPath]) === !1){
					res = 'err';
				}
				R3.design.svg.setCustomIcon('R3_settings_status_' + cPath, res);
			});

			// RE3 Livestatus
			document.getElementById('R3_settings_livestausPosHexInt').checked = JSON.parse(R3.settings.list.livestatus.displayPosAsInt);
			document.getElementById('R3_settings_enableGameDetection').checked = JSON.parse(R3.settings.list.livestatus.enableGameDetection);
			document.getElementById('R3_settings_livestausUpdateFrenquency').value = parseInt(R3.settings.list.livestatus.updateSpeed);
			R3.design.tools.updateHtmlFromValue('R3_settings_livestausUpdateFrenquencyLbl', 'R3_settings_livestausUpdateFrenquency');

			// Window
			document.getElementById('R3_settings_maximizeOnLoad').checked = JSON.parse(R3.settings.list.maximizeOnLoad);

			// MSG Editor
			document.getElementById('R3_settings_msgEditor_showFunctionsOnPreview').checked = JSON.parse(R3.settings.list.msgEditor.showFunctionsOnPreview);
			document.getElementById('R3_settings_msgEditor_compileOnType').checked = JSON.parse(R3.settings.list.msgEditor.compileMessageOnType);

		}

	},

	// Update range values
	updateRanges: function(){

		// GUI
		R3.design.tools.updateHtmlFromValue('R3_settings_livestausUpdateFrenquencyLbl', 'R3_settings_livestausUpdateFrenquency');

		// Variables
		R3.settings.list.livestatus.updateSpeed = parseInt(document.getElementById('R3_settings_livestausUpdateFrenquency').value);

	},

	// Select file
	selectFile: function(pathId){

		// Check if settings window is open
		if (R3.design.miniwindow.isActive('appSettings') === !0){

			// Load file window
			R3.system.loadFile('.exe', 'utf-8', function(res){

				// Set variables
				R3.settings.list.paths[pathId] = res.path;
				R3.settings.save();

				// Update settings GUI
				R3.settings.renderSettings();
				
			});
		
		}
	
	},

	// Set latest file opened
	setLatestFile: function(filePath, extension, editor){

		// Set variables
		this.list.lastFileExtension = extension;
		this.list.lastFileOpenedPath = filePath;
		this.list.lastFileOpenedEditor = editor;

		// Save settings
		this.save();

	},

	// Reset latest file opened
	resetLatestFile: function(){
		this.list.lastFileExtension = '';
		this.list.lastFileOpenedPath = '';
		this.list.lastFileOpenedEditor = '';
	}
}