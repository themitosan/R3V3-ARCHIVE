/*
	*******************************************************************************
	R3ditor V3 - wizard.js
	By TheMitoSan

	This file is responsible for main game assets extraction and generating mod
	data 
	*******************************************************************************
*/

tempFn_wizard = {

	// Variables
	running: !1,

	// Wizard settings
	settings: {

		// Checks
		keepRofs: !0,
		replaceWarning: !0,
		enableDoorLink: !0,
		autoFillSettings: !0,

		// Paths
		gameDir: 'Unknown',
		modPath: 'Unknown',
		gamePath: 'Unknown',
		gameName: 'Unknown'

	},

	// Open new mod dialog
	open: function(){
		R3.design.miniwindow.openForm({
			width: 416,
			height: 400,
			disableMax: !0,
			canMinimize: !1,
			showMinimize: !1,
			position: 'center',
			domName: 'appWizard',
			path: 'wizard/newMod',
			class: 'R3V3_WIZARD_BG', 
			title: 'New Mod (Wizard)',
			spawnLocation: 'R3_APP_HOLDER',
			postAction: function(){
				document.getElementById('R3V3_MOD_NAME').focus();
			},
			onClose: function(){
				R3.wizard.resetVars();
			}
		});
	},

	// Select files
	getPath: function(mode){

		// Check inserted paths
		const checkPaths = function(mode){

			// Executable
			if (mode === 0){
				const execName = 'ResidentEvil3';
				if (R3.tools.getFileName(R3.wizard.settings.gamePath) === execName){
					R3.design.svg.setCustomIcon('R3V3_WIZARD_svg_execName', 'ok');
				}
			}

			// Path
			if (mode === 1){
				if (R3.modules.fs.existsSync(R3.wizard.settings.modPath + '/Assets') === !1){
					R3.design.svg.setCustomIcon('R3V3_WIZARD_svg_modPath', 'ok');
				} else {
					R3.wizard.settings.modPath = '';
					R3.design.svg.setCustomIcon('R3V3_WIZARD_svg_modPath', 'err');
					window.alert('ERROR: This path already contains mod data!\nPlease, remove all files or select a new location.');
				}
			}
			
			// Focus mod name
			document.getElementById('R3V3_MOD_NAME').focus();
		}
		
		// Game Path
		if (mode === 0){
			R3.system.loadFile('.exe', 'hex', function(res){
				R3.wizard.settings.gamePath = res.path;
				R3.wizard.settings.gameName = R3.tools.getFileName(res.path);
				R3.wizard.settings.gameDir = R3.tools.getFilePath(res.path, '.exe');
				checkPaths(mode);
			});
		}

		// Extraction Path
		if (mode === 1){
			R3.system.loadPath(function(path){
				R3.wizard.settings.modPath = path;
				checkPaths(mode);
			});
		}
	},

	// Check if everything is ok before start
	checkVars: function(){
		// Variables
		var cStart = !0, reason = '';

		// Reject start
		const rejectInit = function(err){
			cStart = !1;
			reason = reason + err + '\n';
		}

		// Mod Name
		const modName = document.getElementById('R3V3_MOD_NAME').value;
		if (modName === ''){
			rejectInit('You must insert a mod name');
		}

		// Game Path
		if (R3.modules.fs.existsSync(this.settings.gamePath) !== !0){
			rejectInit('You must select your game executable');
		}

		// Mod Path
		if (R3.modules.fs.existsSync(this.settings.modPath) !== !0){
			rejectInit('You must select extraction folder');
		}

		// Check if already exists mods on current path
		if (R3.modules.fs.existsSync(this.settings.modPath + '/Assets') === !0){
			rejectInit('This location already contains mod files!');
		}

		// End
		if (cStart === !0){
			this.startProcess();
		} else {
			window.alert('ERROR: Unable to start Wizard Process!\n\n' + reason);
			document.getElementById('R3V3_MOD_NAME').focus();
		}
	},

	// Start process
	startProcess: function(){

		// Import user settings
		this.settings.modName = document.getElementById('R3V3_MOD_NAME').value;

		// Checks
		this.settings.keepRofs = R3.design.tools.parseCheckbox('R3_wizard_keepRofs11');
		this.settings.replaceWarning = R3.design.tools.parseCheckbox('R3_wizard_replaceWarn');
		this.settings.enableDoorLink = R3.design.tools.parseCheckbox('R3_wizard_enableDoorLink');
		this.settings.autoFillSettings = R3.design.tools.parseCheckbox('R3_wizard_autoFillPaths');

		/*
			Prepare GUI
		*/

		R3.design.menuBar.hide();
		R3.design.shortcuts.enabled = !1;
		R3.design.miniwindow.canDrag = !1;

		// Close all other windows
		R3.design.miniwindow.closeAll(['appLog', 'appWizard']);

		// Open / Adjust log window
		if (R3.design.miniwindow.isActive('appLog') === !1){
			R3.system.log.open();
		}

		R3.design.miniwindow.updateForm('appLog', {
			hideMax: !0,
			hideMin: !0,
			hideClose: !0,
			position: 'bottom-right',
			css: {
				'transition': 'all 0.6s cubic-bezier(0, 1, 0, 1) 0s'
			}
		});

		// Disable log buttons
		document.getElementById('R3V3_LOG_Save').disabled = 'disabled';
		document.getElementById('R3V3_LOG_Clear').disabled = 'disabled';

		// Update forms
		R3.design.miniwindow.updateForm('appWizard', {
			width: 700,
			height: 138,
			hideClose: !0,
			position: 'center',
			path: 'wizard/wizardProcess',
			title: 'R3V3 Wizard - Please wait',
			css: {
				'transition': 'all 0.6s cubic-bezier(0, 1, 0, 1) 0s'
			}
		});

		// Update windows positions on resize
		window.onresize = function(){
			R3.design.miniwindow.updateForm('appWizard', {	position: 'center' });
			R3.design.miniwindow.updateForm('appLog', {	position: 'bottom-right' });
		}

		// Close mod if open
		R3.mod.close();

		/*
			Start Process
		*/		

		console.clear();
		R3.system.log.add('separator');
		R3.system.log.add('Wizard: Starting process - Please wait!');

		console.table(this.settings);

		this.running = !0;
		var WIZARD_SEMAPHORE = !1;

		// Variables
		const wSettings = R3.wizard.settings,
			// Script
			WIZARD_SCRIPT = {
				'checkTools': 	 {label: 'Checking tools'},
				'checkPaths': 	 {label: 'Checking paths'},
				'copyGameFiles': {label: 'Copying essential game files'},
				'copyMovies': 	 {label: 'Copying game cutscenes'},
				'extractRofs': 	 {label: 'Extracting game data'},
				'makeIni':  	 {label: 'Creating custom settings'},
				'replaceWarne':  {label: 'Replacing original warning message'},
				
				// WIP
				'runDoorLink':   {label: 'Running R3V3 DoorLink™'},
				
				'makeModFile': 	 {label: 'Making Mod file'},
				'autoFillPaths': {label: 'Seetting up internal variables'},
				'resetVars': 	 {label: 'Cleaning memory'},
				'finish': 		 {label: 'Updating data'}
			},

			// Action opcodes
			WIZARD_ACTIONS = function(functionName, pData){

				// Update progressbar
				R3.design.progressbar.setValue({
					dock: !0,
					max: pData.max,
					value: pData.current,
					label: 'R3V3_wizardPercent',
					target: 'R3V3_progressBar_wizard_1'
				});
				
				// Close semaphore
				WIZARD_SEMAPHORE = !0;
				
				// Error handling
				var iSemaphore = !0, eReason = '';
				const WIZARD_throwErr = function(msg){
					eReason = eReason + '\n' + msg;
				},

				// Check if there is error before releasing semaphore
				WIZARD_checkSemaphore = function(){
					if (iSemaphore !== !0){
						document.getElementById('R3V3_LOG_Save').disabled = '';
						window.alert('ERROR: Unable to run action ' + functionName + '!\n\n' + eReason);
					} else {
						WIZARD_SEMAPHORE = !1;
					}
				}

				// Log status
				R3.system.log.add('Wizard: ' + WIZARD_SCRIPT[functionName].label);
				document.getElementById('R3V3_wizardLabel').innerHTML = WIZARD_SCRIPT[functionName].label;

				/*
					Wizard Opcodes
				*/
				switch (functionName) {

					// Check tools
					case 'checkTools':
						const seekList = [
							'SDL.dll',
							'rofs.exe',
							'eAssets.bin',
							'version_template.json'
						];
						seekList.forEach(function(cFile){
							if (R3.modules.fs.existsSync(R3.system.paths.tools + '/' + cFile) !== !0){
								iSemaphore = !1;
								WIZARD_throwErr('Unable to find ' + cFile);
							}
						});
						WIZARD_checkSemaphore();
						break;

					// Check paths
					case 'checkPaths':
						const pathList = [
							// Main Assets
							wSettings.modPath + '/Assets',
							wSettings.modPath + '/Assets/Save',
							wSettings.modPath + '/Assets/zmovie',
							// Database
							wSettings.modPath + '/Database' // DoorLink and more
						];
						// Create paths
						pathList.forEach(function(cPath, cIndex){
							try {
								// Check if folder already exists
								if (R3.modules.fs.existsSync(cPath) === !1){
									R3.modules.fs.mkdirSync(cPath);
								} else {
									R3.system.log.add('WARN: Skipping \"' + cPath + '\" because it already exists!');
								}
								// Update GUI
								R3.design.progressbar.setValue({
									value: cIndex,
									max: pathList.length,
									target: 'R3V3_progressBar_wizard_2'
								});
							} catch (err) {
								iSemaphore = !1;
								WIZARD_throwErr('Unable to create path!\nPath: ' + cPath +'\nReason: ' + err);
							} finally {
								// End
								WIZARD_checkSemaphore();
							}
						});
						break;			

					// Copy game files
					case 'copyGameFiles':
						// Files to be copied
						var fileList = {
							0: {file: wSettings.gameDir + '/ResidentEvil3.exe', dest: wSettings.modPath + '/Assets/ResidentEvil3.exe'},
							1: {file: wSettings.gameDir + '/RE3_MERCE.exe', dest: wSettings.modPath + '/Assets/RE3_MERCE.exe'}
						}

						// Check if Rofs11 is needed
						if (R3.wizard.settings.keepRofs === !0){
							fileList[2] = {file: wSettings.gameDir + '/Rofs11.dat', dest: wSettings.modPath + '/Assets/Rofs11.dat'}
						}
						
						// Copy files
						try {
							R3.system.copyFiles({
								list: fileList,
								progress: {
									useDock: !1,
									domId: 'R3V3_progressBar_wizard_2'
								}
							});
						} finally {
							WIZARD_checkSemaphore();
						}
						break;

					// Copy movies
					case 'copyMovies':

						// List
						const movieList = R3.modules.fs.readdirSync(wSettings.gameDir + '/zmovie');
						
						// Copy files
						try {
							movieList.forEach(function(cFile, cIndex){
								// Copy file
								R3.modules.fs.copyFileSync(wSettings.gameDir + '/zmovie/' + cFile, wSettings.modPath + '/Assets/zmovie/' + cFile);

								// Update Progressbar
								R3.design.progressbar.setValue({
									value: cIndex,
									max: movieList.length,
									target: 'R3V3_progressBar_wizard_2'
								});
							});
						} finally {
							WIZARD_checkSemaphore();
						}
						break;

					// Extract ROFS [WIP]
					case 'extractRofs':

						// Start process
						var cFile = 1,
							extractInterval = setInterval(function(){

								if (cFile < 16){

									if (R3.system.external.processes['rofs'] === void 0){

										// Run Rofs
										R3.system.external.run(R3.system.paths.tools + '/rofs.exe', {
											isGame: !1,
											chdir: wSettings.modPath + '/Assets',
											args: [wSettings.gameDir + '/Rofs' + cFile + '.dat']
										});

										// Update Progressbar
										R3.design.progressbar.setValue({
											max: 16,
											value: cFile,
											target: 'R3V3_progressBar_wizard_2'
										});

										// Log and Update label
										R3.system.log.add('Wizard: Extracting Rofs' + cFile + '.dat');
										document.getElementById('R3V3_wizardLabel').innerHTML = 'Extracting <font class="font-code">Rofs' + cFile + '.dat</font>';

										// End
										cFile++;
									}

								} else {
									// Process complete
									WIZARD_checkSemaphore();
									clearInterval(extractInterval);
								}

							}, 100);
						break;

					// Run DoorLink™
					case 'runDoorLink':
						// WIP
						WIZARD_checkSemaphore();
						break;

					// Make INI
					case 'makeIni':
						try {
							R3.INI.makeINI('wizard');
						} finally {
							WIZARD_checkSemaphore();
						}
						break;

					// Replace warning message
					case 'replaceWarne':
						if (wSettings.replaceWarning === !0){
							try {
								R3.modules.fs.copyFileSync(R3.system.paths.tools + '/eAssets.bin', wSettings.modPath + '/Assets/DATA_E/ETC2/WARNE.TIM');
							} catch (err) {
								iSemaphore = !1;
								WIZARD_throwErr('Unable to replace original warning message!\n' + err);
							} finally {
								WIZARD_checkSemaphore();
							}
						}
						break;

					// Autofill settings
					case 'autoFillPaths':
						if (wSettings.autoFillSettings === !0){
							R3.settings.list.paths.re3Path = wSettings.gamePath;
							if (R3.modules.fs.existsSync(wSettings.gameDir + '/RE3_MERCE.exe') === !0){
								R3.settings.list.paths.mercePath = wSettings.gameDir + '/RE3_MERCE.exe';
							}
							R3.settings.save();
						}
						WIZARD_checkSemaphore();
						break;

					// Make mod file
					case 'makeModFile':
						try {

							// Create settings
							const modFile = {
								// R3V3 Version
								toolVersion: R3.build.appString,
								// Metadata
								modName: wSettings.modName,
								mainGame: wSettings.gameName,
								gameAssets: wSettings.modPath + '/Assets',
								hardPath: wSettings.modPath + '/Assets/DATA_E/RDT',
								easyPath: wSettings.modPath + '/Assets/DATA_AJ/RDT',
								mercePath: wSettings.modPath + '/Assets/RE3_MERCE.exe',
								gamePath: wSettings.modPath + '/Assets/' + wSettings.gameName
							}

							// Save it!
							R3.modules.fs.writeFileSync(wSettings.modPath + '/R3V3_MOD.r3mod', btoa(JSON.stringify(modFile)), 'utf-8');

						} catch (err) {
							iSemaphore = !1;
							WIZARD_throwErr('Unable to create mod file!');
						} finally {
							WIZARD_checkSemaphore();
						}
						break;

					// Reset variables
					case 'resetVars':
						R3.wizard.resetVars();
						WIZARD_checkSemaphore();
						break;

					// Finish Process
					case 'finish':
						R3.wizard.running = !1;
						
						// Update and show post screen
						R3.design.miniwindow.updateForm('appWizard', {
							width: 550,
							height: 146,
							position: 'center',
							title: 'R3V3 Wizard - Process Complete!'
						});
						console.clear();
						TMS.removeClass('R3V3_miniWindow_appWizard', 'R3V3_WIZARD_BG');
						TMS.addClass('R3V3_miniWindow_appWizard', 'R3V3_WIZARD_BG_COMPLETE')
						document.getElementById('R3V3_wizardLabel_modPath').innerHTML = wSettings.modPath;
						TMS.css('R3V3_WIZARD_PROGRESS', {display: 'none'});
						TMS.css('R3V3_WIZARD_COMPLETE', {display: 'block'});

						// Update log window
						document.getElementById('R3V3_LOG_Save').disabled = '';
						WIZARD_checkSemaphore();

						// Open mod
						R3.mod.processModFile(wSettings.modPath + '/R3V3_MOD.r3mod', !0);
						break;

					// Default action (Unk Opcode)
					default:
						WIZARD_checkSemaphore();
						break;
				}
			},

			// Wizard interpreter
			WIZARD_INTERPRETER = function(){
				// Constants
				const aList = Object.keys(WIZARD_SCRIPT),
					tActions = (aList.length);

				// Variables and functions
				var cAction = 0,
					actionInterval = setInterval(function(){

						if (cAction < tActions){
							
							if (WIZARD_SEMAPHORE === !1){
								console.log('WIZARD PROCESSOR: Running action ' + cAction + ' (' + aList[cAction] + ')');
								WIZARD_ACTIONS(aList[cAction], {max: tActions, current: cAction});
								cAction++;
							}
	
						} else {
							// Update progressbars
							R3.design.progressbar.setValue({
								max: tActions,
								value: cAction,
								label: 'R3V3_wizardPercent',
								target: 'R3V3_progressBar_wizard_1'
							});
							R3.design.progressbar.setValue({
								max: tActions,
								value: cAction,
								target: 'R3V3_progressBar_wizard_2'
							});
							R3.design.progressbar.resetNwProgress();

							// Update labels
							R3.system.log.add('separator');
							R3.system.log.add('Wizard: Process complete');
							document.getElementById('R3V3_wizardLabel').innerHTML = 'Process complete!';

							console.info('WIZARD PROCESSOR: Finishing actions - process complete!');
							clearInterval(actionInterval);
						}

					}, 100);
			}

		// Start Interpreter
		WIZARD_INTERPRETER();
	},

	// Close wizard window after running
	close: function(){
		if (R3.wizard.running === !1){
			// Restore window.onresize
			window.onresize = null;

			// Close all windows
			R3.design.miniwindow.closeAll(['appLog']);

			// Adjust log window
			document.getElementById('R3V3_LOG_Save').disabled = '';
			document.getElementById('R3V3_LOG_Clear').disabled = '';
			R3.design.miniwindow.updateForm('appLog', {
				hideMax: !1,
				hideMin: !1,
				hideClose: !1,
				position: 'bottom-right',
				css: { 'transition': '0s' }
			});

			// Re-enable drag
			R3.design.miniwindow.canDrag = !0;

			// Reset progressbar dock status
			R3.design.progressbar.resetNwProgress();

			// Re-enable menubar
			R3.design.menuBar.update(R3.design.menuBar.menuList.mainMenu);

			// Re-enable shortcuts
			R3.design.shortcuts.enabled = !0;
		}
	},

	// Handle main form mod name keypress
	modNameKP: function(kPress){
		if (kPress.keyCode === 13){
			this.checkVars();
		}
	},

	// Reset variables
	resetVars: function(){

		// Checks
		this.keepRofs = !0;
		this.replaceWarning = !0;
		this.enableDoorLink = !0;
		this.autoFillSettings = !0;

		// Paths
		this.modPath = 'Unknown';
		this.gamePath = 'Unknown';
		this.gameDir = 'Unknown';
		this.gameName = 'Unknown';
		
	}
}