/*
	*******************************************************************************
	R3ditor V3 - system.js
	By TheMitoSan

	This file is responsible for handling internal functions and variables for 
	general usage
	*******************************************************************************
*/

tempFn_SYSTEM = {

	// Pull all modules
	backupManager: tempFn_backupManager,

	/*
		Paths
	*/
	paths: {
		app: '',		  // Main app location
		forms: '',  	  // App html forms location
		tools: '',		  // Main app tools (rofs, 7z and more)
		originalChdir: '' // Original chdir.
	},

	/*
		Boot Functions
	*/

	// Main function
	init: function(){
		this.os.getData();
		this.initPaths();
		this.checkFlags();
		this.backupManager.init();
	},

	// Set all paths on boot
	initPaths: function(){
		this.paths.app = R3.tools.fixPath(nw.__dirname);
		this.paths.tools = this.paths.app + '/Tools';
		this.paths.backup = this.paths.app + '/Backup';
		this.paths.originalChdir = R3.tools.fixPath(process.cwd());
		this.paths.forms = R3.tools.getFilePath(nw.__filename) + '/forms';
	},

	// Check for possible flags
	checkFlags: function(){
		
		// Process flag array
		nw.App.argv.forEach(function(flag){

			switch (flag){

				// Show DevTools
				case '--devtools':
					R3.modules.win.showDevTools();
					break;

				// Disable updates
				case '--disable-updates':
					// TBD
					break;

			}

		});

	},

	/*
		OS Data
	*/
	os: {

		/*
			Variables
		*/
		totalRam: '',
		cpuCores: '',
		cpuName:  '',

		/*
			Functions
		*/
		// Geet OS Data
		getData: function(){
			this.totalRam = parseFloat(R3.modules.os.totalmem() / 1024 / 1024 / 1024).toString().slice(0, 4) + 'GB';
			this.cpuCores = parseInt(Object.keys(R3.modules.os.cpus()).length);
			this.cpuName = R3.modules.os.cpus()[0].model;
		}

	},

	/*
		File Manager
	*/
	// Load file
	loadFile: function(ext, readMode, postAction){

		if (ext !== void 0 && postAction !== void 0){

			if (ext === ''){
				ext = '*.*';
			}

			if (readMode === '' || readMode === void 0){
				readMode = 'utf-8';
			}

			document.getElementById('R3_FILE_LOAD_DOM').value = '';
			document.getElementById('R3_FILE_LOAD_DOM').files = null;
			document.getElementById('R3_FILE_LOAD_DOM').accept = ext;
			TMS.triggerClick('R3_FILE_LOAD_DOM');

			// Start read
			document.getElementById('R3_FILE_LOAD_DOM').onchange = function(){

				const cFile = document.getElementById('R3_FILE_LOAD_DOM').files[0],
					cPath = R3.tools.fixPath(cFile.path),
					cRaw = R3.modules.fs.readFileSync(cPath, readMode);

				postAction({'path': cPath, 'data': cRaw});

			};

		}
	},

	// Load Path
	loadPath: function(postAction){

		if (postAction !== void 0){

			document.getElementById('R3_FOLDER_LOAD_DOM').onchange = function(){

				const cFile = document.getElementById('R3_FOLDER_LOAD_DOM').files[0];

				if (cFile.path !== null && cFile.path !== void 0 && cFile.path !== ''){
					postAction(R3.tools.fixPath(cFile.path));
					document.getElementById('R3_FOLDER_LOAD_DOM').value = '';
					document.getElementById('R3_FOLDER_LOAD_DOM').accept = '';
				}

			}

			TMS.triggerClick('R3_FOLDER_LOAD_DOM');

		}
	},

	// Save file
	saveFile: function(filename, ext, content, mode, postAction){
		
		// Variables
		var extension = '', location;

		// Check for extension
		if (ext !== void 0 && ext !== ''){
			extension = ext;
		}
		
		// Prepare save dom
		document.getElementById('R3_FILE_SAVE_DOM').nwsaveas = filename;
		document.getElementById('R3_FILE_SAVE_DOM').accept = '.' + extension.replace('.', '');
		document.getElementById('R3_FILE_SAVE_DOM').onchange = function(){
			
			// Set location value
			location = R3.tools.fixPath(document.getElementById('R3_FILE_SAVE_DOM').value);
			if (location.replace(filename, '') !== ''){

				try {
					
					// Write file
					R3.modules.fs.writeFileSync(location, content, mode);

					// If has post action, execute it!
					if (postAction !== void 0){
						postAction(location);
					}

				} catch (err) {

					// If error, log it!
					R3.system.log.add('separator');
					R3.system.log.add('ERROR - Unable to save file!\nReason: ' + err);

				} finally {

					// Clean DOM
					document.getElementById('R3_FILE_SAVE_DOM').value = '';
					document.getElementById('R3_FILE_SAVE_DOM').accept = '';

				}
			}

		}
		
		// End
		TMS.triggerClick('R3_FILE_SAVE_DOM');
	},

	/*
		Copy files

		data: 		{Object}
		list: 		{Object} List with files to be copied
		
		progress:   {Object}
			domId: 		{String} Progress bar Dom ID
			useDock: 	{Boolean} Use dock status  
	*/
	copyFiles: function(data){
		if (data !== void 0){
			// Variables
			const fList = Object.keys(data.list);
			
			fList.forEach(function(item, cIndex){

				// Copy file
				R3.modules.fs.copyFile(data.list[item].file, data.list[item].dest, 0, function(err){
					// Callback
					if (err){
						console.error('ERROR: Unable to copy file!\n' + err);
						throw err;
					}
				});
				
				// Use progressbar
				if (data.progress !== void 0){

					R3.design.progressbar.setValue({
						value: cIndex,
						max: fList.length,
						dock: data.progress.useDock,
						target: data.progress.domId
					});
				}

			});

		}
	},

	// Open file on Hex Editor
	openOnHex: function(filePath){
		
		// Variables
		var canOpen = !0,
			eReason = '';

		// Add error
		const addError = function(reason){
			canOpen = !1;
			eReason = eReason + reason + '\n';
		}

		// If file does not exist
		if (R3.modules.fs.existsSync(filePath) !== !0){
			addError('This file does not exists!');
		}

		// If hex editor is not defined on settings
		if (R3.modules.fs.existsSync(R3.settings.list.paths.hexEditor_path) !== !0){
			addError('Hex editor was not found!\nMake sure to configure it on Settings --> Paths');
		}

		/*
			End
		*/
		if (canOpen === !0){
			
			// Run Hex editor
			R3.system.external.run(R3.settings.list.paths.hexEditor_path, {	args: [filePath], useChdir: !1 });

		} else {

			// Fix last char
			eReason = eReason.slice(0, (eReason.length - 1));

			// Alert
			window.alert('Unable to open file on Hex editor!\n\n' + eReason);
			
			// Log error
			this.log.add('separator');
			this.log.add('Unable to open file on Hex editor!\nReason: ' + eReason);

		}

	},

	/*
		Log system
	*/
	log: {

		// Log string
		logData: '',
		lastLog: '',
		counter: 0,

		/*
			Functions
		*/

		// Log message
		add: function(msg){
			if (msg !== void 0 && msg !== ''){
				// Variables
				var lineBreak = '', 
					useConsole = !0;
				const sepTemplate = '_______________________________________________________________________________\n';

				// Line break
				if (R3.system.log.counter > 0){
					lineBreak = '\n';
				}

				// Separator on log
				if (msg === 'separator'){
					msg = sepTemplate;
					useConsole = !1;
				}

				// Avoid two identical logs
				if (msg !== R3.system.log.lastLog){
					R3.system.log.logData = R3.system.log.logData + lineBreak + msg;
					R3.system.log.lastLog = msg;

					if (useConsole === !0){
						console.log(msg);
					}

					// Increment log count
					R3.system.log.counter++;
					R3.system.log.render();
				}
			}
		},

		// Clear Log
		clear: function(){
			this.counter = 0;
			this.logData = '';
			this.lastLog = '';
			this.add('INFO: Log was cleared.');
			this.add('separator');
			console.clear();
		},

		// Save log
		save: function(){
			R3.system.saveFile('R3V3_LOG.log', '.log', this.logData, 'utf-8');
		},

		// Render log
		render: function(){
			if (R3.design.miniwindow.isActive('appLog')){
				const sHeight = (document.getElementById('R3V3_LOG_TEXTAREA').scrollHeight * 2);
				document.getElementById('R3V3_LOG_TEXTAREA').value = R3.system.log.logData;
				document.getElementById('R3V3_LOG_TEXTAREA').scrollTop = sHeight;
			}
		},

		// Open log window
		open: function(){
			R3.design.miniwindow.openForm({
				width: 600,
				height: 224,
				path: 'appLog',
				canMinimize: !0,
				showMaximize: !0,
				title: 'R3V3 Log',
				domName: 'appLog',
				class: 'R3V3_LOG_BG',
				position: 'bottom-right',
				spawnLocation: 'R3_APP_HOLDER',
				postAction: function(){
					R3.system.log.render();
				}
			});
		}
	},

	/*
		Run external software
	*/
	external: {

		// Process list
		processes: {},

		run: function(exePath, settings){

			// Fix settings
			if (settings === void 0){
				settings = {};
			}

			// Variables
			var args 	 	= settings.args,
				isGame 	 	= settings.mainGame,
				useChdir 	= settings.useChdir,
				fixExePath  = R3.tools.fixPath(exePath),
				newChdir 	= R3.tools.fixPath(settings.chdir),
				execName 	= R3.tools.getFileName(exePath);

			// Check if executable is already running
			if (this.processes[fixExePath] === void 0){

				// Fix Variables
				if (isGame === void 0){
					isGame = !1;
				}
	
				// Fix args
				if (args === void 0){
					args = [''];
				}

				// Update chdir
				if (newChdir === '' && useChdir !== !1){
					newChdir = R3.tools.getFilePath(fixExePath, '.exe');
				}
				if (R3.modules.fs.existsSync(newChdir) === !0 && useChdir !== !1){
					R3.system.log.add('External: Updating chdir to ' + newChdir);
					process.chdir(newChdir);
				}
	
				// Spawn process
				const spawnProcess = R3.modules.childProcess.spawn(fixExePath, args);
	
				// Add data to R3V3 process list
				this.processes[execName] = {
					pid: spawnProcess.pid,
					isMainGame: isGame,
					path: fixExePath
				}
	
				// Log on stdout
				spawnProcess.stdout.on('data', function(data){
					R3.system.log.add('External: ' + data.toString());
				});
	
				// Log on stderr
				spawnProcess.stderr.on('data', function(data){
					R3.system.log.add('External: ' + data.toString());
				});
	
				// Closing process
				spawnProcess.on('close', function(code){
					
					// Reset chdir
					if (newChdir !== void 0 && useChdir !== !1){
						R3.system.log.add('External: Reseting chdir to original value');
						process.chdir(R3.system.paths.originalChdir);
					}
	
					// Log exit code
					R3.system.log.add('separator');
					var msgStatus = 'External: The application closed with code ' + code;
					if (parseInt(code) > 1){
						msgStatus = 'External: The application closed with error ' + code;
					}
					R3.system.log.add(msgStatus);

					// Delete from internal processes list
					delete R3.system.external.processes[execName];

					// End
					return code;
				});

			} else {
				// Log error
				R3.system.log.add('ERROR: Unable to spawn process!\nLooks like ' + fixExePath + ' is already running!');
			}
		},

		// Kill PID
		kill: function(pid){
			var res = 0;
			if (pid !== void 0 && parseInt(pid) !== NaN){

				try {
					process.kill(pid);
				} catch (err) {
					R3.system.log.add('ERROR: Unable to kill PID ' + pid + '!\n' + err);
					res = 1;
				}

			}

			return res;
		},

		// Kill spawned process
		killSpawned: function(execName){
			if (this.processes[execName] !== void 0){
				
				// Try killing this thing!
				const kProcess = R3.system.external.kill(R3.system.external.processes[execName].pid);

				// If everything is ok
				if (kProcess !== 0){
					delete R3.system.external.processes[execName];
				}

			}
		}
	},

	/*
		Clean Utility [WIP]
	*/
	cleanUtils: {

		// Editor Database
		database: {
			
			// RDT Editor
			RDT: {},

			// MSG Editor
			MSG: {},

		},

		// Initalize Function
		init: function(){
			
			// RDT Editor
			this.database.RDT['originalFile'] = '';
			this.database.RDT['map'] = JSON.stringify(R3.RDT.map);
			this.database.RDT['metadata'] = JSON.stringify(R3.RDT.editor.metadata);

			// MSG Editor
			this.database['MSG'] = JSON.stringify(R3.MSG)
		
		},

		// Restore Editor
		restore: function(editor){
			// TBD
		}

	},

	/*
		Misc
	*/

	// WIP Function
	wip: function(){

		window.alert('TheMitoSan Says: This function still WIP. Sorry! :/');

	},

	// Reload app
	reload: function(){

		R3.settings.save();

		R3.design.shortcuts.removeAll();

		setTimeout(function(){
			chrome.runtime.reload();
		}, 10);

	},

	// Close app
	exit: function(){

		R3.settings.save();
		nw.App.quit();

	}

}

// Delete
delete tempFn_backupManager;