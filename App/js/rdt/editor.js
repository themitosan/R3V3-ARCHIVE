/*
	*******************************************************************************
	R3ditor V3 - editor.js
	By TheMitoSan

	This file is responsible for loading Room Data Table (RDT) files on it's
	editor
	*******************************************************************************
*/

tempFn_rdtEditor = {

	// File Metadata
	metadata: {

		mapFile: '', 	 // Map File (Example: R100)
		mapName: '',	 // Map Name
		mapLocation: '', // Map Location
		mapGameMode: '', // Game mode (Easy / Hard)

		fileSize: '',	 // File Size
		filePath: ''	 // File Path

	},

	/*
		Functions
	*/

	// Open file
	open: function(){

		R3.system.loadFile('.rdt', 'hex', function(post){
			R3.RDT.editor.processFile(post.path);
		});
	
	},

	// Start loading process
	processFile: function(path){

		// Clear all variables
		this.close();

		// Close window list (Including itself!)
		R3.design.miniwindow.closeList(['mapList', 'msgEditor', 'rdtEditor']);

		// Read file from path
		const hexData = R3.modules.fs.readFileSync(path, 'hex');

		// Set latest file
		R3.settings.setLatestFile(path, 'rdt', 'RDT Editor');

		// Set Metadata
		this.metadata.filePath	  = path;
		this.metadata.mapFile	  = R3.tools.getFileName(path);
		this.metadata.fileSize	  = R3.tools.getFileSize(path, 'kb') + ' KB';

		this.metadata.mapName	  = R3.database.rdtMetadata[this.metadata.mapFile].name;
		this.metadata.mapLocation = R3.database.rdtMetadata[this.metadata.mapFile].location;

		// Game Mode
		this.metadata.mapGameMode = 'Unknown';
		R3.database.easyGamePrefix.forEach(function(data){
			if (path.indexOf(data) !== -1){
				R3.RDT.editor.metadata.mapGameMode = 'Easy';
			}
		});
		R3.database.hardGamePrefix.forEach(function(data){
			if (path.indexOf(data) !== -1){
				R3.RDT.editor.metadata.mapGameMode = 'Hard';
			}
		});

		// Log
		console.clear();
		console.table(this.metadata);
		R3.system.log.add('separator');
		R3.system.log.add('RDT: Loading ' + this.metadata.mapFile + '\nName: ' + this.metadata.mapName + ', ' + this.metadata.mapLocation + '\nPath: ' + path);
		R3.system.log.add('separator');

		// Set tab actions
		const rdtTabActions = {

			// Main window data
			animTime: 510,
			mainWindowName: 'rdtEditor',
			bezier: 'cubic-bezier(0, 1, 0, 1) 0s',
	
			// Tab changes
			tabs: {

				// General
				0: {
					nWidth: 832,
					nHeight: 160,
					hideMaximize: !0,
					restoreWindow: !0,
					position: 'center'
				},
				// MSG Editor
				1: {
					nWidth: R3.MSG.editor.formWidth,
					nHeight: R3.MSG.editor.formHeight,
					position: 'center'
				},
				// SCD Editor
				2: {
					nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				3: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				4: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				5: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				6: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				7: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				8: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				9: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				},
				10: {nWidth: 832,
					nHeight: 400,
					position: 'center'
				}

			}
		}

		// Open main form
		R3.design.miniwindow.openForm({
			width: 832,
			height: 160,
			isEditor: !0,
			disableMax: !0,
			showMaximize: !0,
			path: 'RDT/main',
			position: 'center',
			domName: 'rdtEditor',
			tabActions: rdtTabActions,
			openShortcut: 'rdtEditor',
			spawnLocation: 'R3_APP_HOLDER',
			title: 'RDT Editor - ' + this.metadata.mapFile,

			// Functions
			postAction: function(){
				
				// Append main data to general tab
				document.getElementById('R3V3_rdtEditor_lbl_mapName').innerHTML = R3.RDT.editor.metadata.mapName;
				document.getElementById('R3V3_rdtEditor_lbl_fileSize').innerHTML = R3.RDT.editor.metadata.fileSize;
				document.getElementById('R3V3_rdtEditor_lbl_filePath').innerHTML = R3.RDT.editor.metadata.filePath;
				document.getElementById('R3V3_rdtEditor_lbl_gameMode').innerHTML = R3.RDT.editor.metadata.mapGameMode;
				document.getElementById('R3V3_rdtEditor_lbl_mapLocation').innerHTML = R3.RDT.editor.metadata.mapLocation;

				// Push all other editors to their tabs
				var formPath;
				Object.keys(R3.RDT.map.sections).forEach(function(sectionName, formIndex){
				
					console.info('Appending form: ' + sectionName);
					
					formPath = R3.system.paths.forms + '/' + sectionName + '/main.htm';
				
					if (R3.modules.fs.existsSync(formPath) === !0){
						document.getElementById('tabList_rdtEditor_form_' + parseInt(formIndex + 1)).innerHTML = R3.modules.fs.readFileSync(formPath, 'utf-8');
					}
				
				});

				/*
					MSG Editor
				*/
				document.getElementById('R3V3_msgEditor_iconBar_open').disabled = 'disabled';
				document.getElementById('R3V3_msgEditor_iconBar_save').disabled = 'disabled';
				document.getElementById('R3V3_msgEditor_iconBar_saveAs').disabled = 'disabled';
				document.getElementById('R3V3_msgEditor_iconBar_newFile').disabled = 'disabled';
				document.getElementById('R3V3_msgEditor_iconBar_openInHex').disabled = 'disabled';
				
				// Get random cam for current map
				if (R3.mod.loaded === !0){
					const getRandomCam = R3.design.tools.getRandomCam(R3.RDT.editor.metadata.mapFile);
					TMS.css('R3V3_rdtEditor_firstTabBg', {'background-image': 'url(\'' + getRandomCam.path + '\')'});
				}

				/*
					End
					Redirect hex data to RDT decompiler
				*/
				R3.RDT.readFile(hexData);

			},
			// Close action
			onClose: function(){
				R3.RDT.editor.close();
			}
		});

	},

	// Save map
	save: function(){
		R3.system.wip();
	},

	// Close map
	close: function(){

		// Original file
		R3.RDT.originalFile = '';

		// Map Sections
		Object.keys(R3.RDT.map.sections).forEach(function(cSection){
			R3.RDT.map.sections[cSection] = '';
		});

		// Headers
		R3.RDT.map.headers = [];

		// Metadata
		Object.keys(this.metadata).forEach(function(cVariable){
			R3.RDT.editor.metadata[cVariable] = '';
		});

		// Backup sections
		R3.RDT.map.backupSections = {};

		// MSG Editor
		R3.MSG.clean();

		// Update menubar
		R3.design.menuBar.updateMainMenu();

	}
	
}