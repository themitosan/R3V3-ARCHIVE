/*
	*******************************************************************************
	R3ditor V3 - mod.js
	By TheMitoSan

	This file is responsible for storing mod configurations
	*******************************************************************************
*/

tempFn_MOD = {
	
	/*
		Variables
	*/

	// Mod loaded
	loaded: !1,

	// Map List
	mapList: {},

	// General
	modName: '',
	execName: '',
	settingsFile: '',
	originalSettingsFile: '',

	// Paths
	paths: {
		root: '',
		easy: '',
		hard: '',
		merce: '',
		assets: '',
		mainGame: ''
	},

	// Map Prefix
	prefix: {
		easy: '',
		hard: ''
	},


	/*
		Functions
	*/
	// Open Mod
	open: function(){
		R3.system.loadFile('.r3mod', 'utf-8', function(data){
			R3.mod.processModFile(data.path, !0);
		});
	},
	// Process mod file
	processModFile: function(filePath, logSucess, skipUpdateGui){
		this.loaded = !1;
		if (R3.modules.fs.existsSync(filePath) === !0){

			// Read and decrypt data
			const rawdata = R3.modules.fs.readFileSync(filePath, 'utf-8'),
				decrypt = JSON.parse(atob(rawdata));
	
			// Create backup of original file
			this.originalSettingsFile = decrypt;

			// Set variables
			this.settingsFile = filePath;
			this.modName = decrypt.modName;
			this.execName = decrypt.mainGame;
			this.paths.easy = decrypt.easyPath;
			this.paths.hard = decrypt.hardPath;
			this.paths.merce = decrypt.mercePath;
			this.paths.assets = decrypt.gameAssets;
			this.paths.mainGame = decrypt.gamePath;
			this.paths.root = R3.tools.getFilePath(filePath, '.r3mod');			

			// Get prefix
			R3.database.easyGamePrefix.forEach(function(cPrefix){
				if (R3.mod.paths.easy.indexOf(cPrefix) !== -1){
					R3.mod.prefix.easy = cPrefix;
				}
			});
			R3.database.hardGamePrefix.forEach(function(cPrefix){
				if (R3.mod.paths.hard.indexOf(cPrefix) !== -1){
					R3.mod.prefix.hard = cPrefix;
				}
			});

			// Settings
			R3.settings.list.lastProjectPath = filePath;

			// Set mod load status
			this.loaded = !0;

			// Map List
			this.updateMapList();

			// Update GUI
			setTimeout(function(){

				// Log status and open it'swindow if closed
				if (logSucess === !0){
					console.table(decrypt);
					R3.system.log.add('separator');
					R3.system.log.add('Mod: Load sucessfull!\n\nName: ' + R3.mod.modName + '\nPath: ' + R3.mod.paths.root);
					if (R3.design.miniwindow.isActive('appLog') === !1){
						R3.system.log.open();
					}
				}

				// Update GUI
				document.title = R3.build.appString + ' - ' + R3.mod.modName;
				if (skipUpdateGui !== !0){
					R3.design.mod.updateMainMenu();
				}

			}, 50);

		} else {
			this.close();
			R3.system.log.add('ERROR: Unable to load mod file!\nPath: ' + filePath + '\nReason: 404 - File not found!');
		}
		
		// Update main menu
		R3.design.menuBar.updateMainMenu();

		// Save settings
		R3.settings.save();
	},

	// Close mod
	close: function(logClose){

		// Clean variables
		this.loaded = !1;
		this.modName = '';
		this.mapList = {};
		this.execName = '';
		this.settingsFile = '';
		this.originalSettingsFile = '';

		// Paths
		Object.keys(this.paths).forEach(function(pathData){
			R3.mod.paths[pathData] = '';
		});

		// Prefix
		this.prefix.easy = '';
		this.prefix.hard = '';

		// R3V3 Settings
		R3.settings.list.lastProjectPath = '';

		// Clean GUI
		R3.design.mod.cleanMainMenu();

		// Save settings
		R3.settings.save();

		// End
		if (logClose === !0){
			R3.system.log.add('separator');
			R3.system.log.add('MOD: Mod was closed sucessfully!');
		}

	},

	// Update maplist
	updateMapList: function(){
		
		// Path
		var mapData, requestUpdate = !1, dataPath = R3.mod.paths.root + '/Database/maplist.r3data';
		
		// Check if file exists
		if (R3.modules.fs.existsSync(dataPath) === !1){
			R3.system.log.add('MOD: Maplist file does not exists! Creating a new one...');
			R3.modules.fs.writeFileSync(dataPath, btoa(JSON.stringify({easy: {}, hard: {}})), 'utf-8');
		}

		// Loading file
		mapData = JSON.parse(atob(R3.modules.fs.readFileSync(dataPath, 'utf-8')));

		// Update map list if mod is active
		if (this.loaded === !0){
			// Easy Mode
			if (Object.keys(mapData.easy).length === 0){
				requestUpdate = !0;
				R3.modules.fs.readdirSync(R3.mod.paths.easy).filter(function(cMap){
					if (cMap.toLowerCase().indexOf('.rdt') !== -1){
						mapData.easy[cMap.replace('.RDT', '')] = R3.mod.paths.easy + '/' + cMap;
					}
				});
			}
	
			// Hard Mode
			if (Object.keys(mapData.hard).length === 0){
				requestUpdate = !0;
				R3.modules.fs.readdirSync(R3.mod.paths.hard).filter(function(cMap){
					if (cMap.toLowerCase().indexOf('.rdt') !== -1){
						mapData.hard[cMap.replace('.RDT', '')] = R3.mod.paths.hard + '/' + cMap;
					}
				});
			}
		}
		
		// Request update
		if (requestUpdate === !0){
			R3.modules.fs.writeFileSync(dataPath, btoa(JSON.stringify(mapData)), 'utf-8');
		}

		// End
		this.mapList = mapData;
	},
	
	// Render Settings
	renderSettings: function(){
		document.getElementById('R3V3_modSettings_name').value = this.modName;
		// End
		document.getElementById('R3V3_modSettings_name').focus();
	},

	// Save Settings
	saveSettings: function(){
		// Check if can save
		if (this.loaded === !0 && R3.design.miniwindow.isActive('modSettings') === !0){

			// Mod Name
			if (document.getElementById('R3V3_modSettings_name').value !== ''){
				this.originalSettingsFile.modName = document.getElementById('R3V3_modSettings_name').value;
			}

			/*
				End
			*/

			// Save file
			R3.modules.fs.writeFileSync(this.settingsFile, btoa(JSON.stringify(this.originalSettingsFile)), 'utf-8');

			// Load mod again (No log / Gui update)
			this.processModFile(this.settingsFile, !1, !0);

			// Close form
			R3.design.miniwindow.close('modSettings');
		}
	}
}