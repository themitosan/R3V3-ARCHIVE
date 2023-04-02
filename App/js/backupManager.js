/*
	*******************************************************************************
	R3ditor V3 - backupManager.js
	By TheMitoSan

	This file is responsible for handling all functions related to R3V3 Backup 
	system
	*******************************************************************************
*/

tempFn_backupManager = {

	/*
		Variables
	*/
	database: {},
	databaseFile: '',

	/*
		Functions
	*/

	// Initialize backup manager
	init: function(){

		// Set backup path
		this.databaseFile = R3.system.paths.backup + '/database.r3data';

		// Check if backup path exists
		if (R3.modules.fs.existsSync(R3.system.paths.backup) !== !0){
			R3.system.log.add('Backup Manager: (INIT) Creating path and database file...');
			R3.system.log.add('separator');
			R3.modules.fs.mkdirSync(R3.system.paths.backup);
		}

		// Check if backup file exists
		if (R3.modules.fs.existsSync(this.databaseFile) !== !0){
			this.updateDatabase(!1);
		} else {
			this.database = JSON.parse(atob(R3.modules.fs.readFileSync(this.databaseFile, 'utf-8')));
		}

	},

	// Open backup manager
	openForm: function(){

		// Close all editors
		R3.design.miniwindow.closeAllEditors();

		// Set tab actions
		const backupManagerTabActions = {

			// Main window data
			animTime: 0,
			mainWindowName: 'backupManager',
			bezier: 'cubic-bezier(0, 1, 0, 1) 0s',
	
			// Tab actions
			tabs: {
				0: { postAction: function(){ R3.design.backupManager.checkTabs(); } },
				1: { postAction: function(){ R3.design.backupManager.checkTabs(); }	}
			}

		}

		// Open form
		R3.design.miniwindow.openForm({
			width: 680,
			height: 347,
			disableMax: !1,
			canMinimize: !0,
			showMinimize: !0,
			position: 'center',
			title: 'Backup Manager',
			domName: 'backupManager',
			path: 'backupManager/main',
			spawnLocation: 'R3_APP_HOLDER',
			tabActions: backupManagerTabActions,
			// Actions 
			postAction: function(){
				R3.system.backupManager.renderDatabase();
			}
		});

	},

	// Render editor
	renderDatabase: function(){
		Object.keys(R3.system.backupManager.database).forEach(function(cEditor){
			R3.design.backupManager.renderList(cEditor.toUpperCase());
		});
	},

	// Backup file
	backup: function(data){

		// Close form
		R3.design.miniwindow.close('backupManager');

		// Date module
		const cDate = new Date;

		// Variables
		var fName	  = data.fileName,
			fExt	  = data.extension,
			fOriginal = data.originalHex,
			fChanges  = data.fileChanges,
			fEditor	  = data.editor.toUpperCase(),
			fPath	  = R3.tools.getFilePath(data.originalPath),

			// Get Day, month and Year
			getDay = R3.tools.fixVars(cDate.getDate(), 2) + '-' + R3.tools.fixVars(cDate.getMonth(), 2) + '-' + cDate.getFullYear(),

			// Get Hour, minute and this comment is unnecessary
			getTime = R3.tools.fixVars(cDate.getHours(), 2) + '-' + R3.tools.fixVars(cDate.getMinutes(), 2) + '-' + R3.tools.fixVars(cDate.getSeconds(), 2),

			// File Name
		 	bFileName = fName + '-' + getDay + '_' + getTime + '.' + fExt,

		 	// Editor Path
			editorPath = R3.system.paths.backup + '/' + fEditor;

		// Check if path for current editor exists
		if (R3.modules.fs.existsSync(editorPath) !== !0){
			R3.modules.fs.mkdirSync(editorPath);
		}

		// Attempt to backup
		try {

			// Write file
			R3.modules.fs.writeFileSync(editorPath + '/' + bFileName, fOriginal, 'hex');

			// Check if editor exists on database
			if (this.database[fEditor] === void 0){
				this.database[fEditor] = {};
			}

			// Set database
			this.database[fEditor][bFileName] = {
				
				// General
				filePath: fPath,
				fileName: fName,
				extension: fExt,
				changes: fChanges,
				backupPath: editorPath,

				// Time data
				time: {
					day: getDay.replace(RegExp('-', 'gi'), '/'),
					time: getTime.replace(RegExp('-', 'gi'), ':')
				}

			}

			// Log sucess
			R3.system.log.add('separator');
			R3.system.log.add('Backup Manager: Process complete!\nFile: ' + fName + '.' + fExt);

			// Update backup file
			R3.modules.fs.writeFileSync(this.databaseFile, btoa(JSON.stringify(R3.system.backupManager.database)), 'utf-8');

		} catch (err) {

			// Error
			R3.system.log.add('separator');
			R3.system.log.add('Backup Manager: Unable to backup file!\n' + err);

		}

	},

	/*
		Restore file WIP
	*/
	restoreFile: function(data){
		
		// Get item data
		const getEditor = this.database[data.editor],
			itemData = getEditor[data.fileName];

		// Check if entry extsis
		if (itemData !== void 0){

			// Confirm action
			const confirmRemove = window.confirm('Question: Are you sure about this action?\n\nRestore File: ' + itemData.fileName + '.' + itemData.extension + '\n(' + data.fileName + ')');
			if (confirmRemove === !0){
				
				// File path
				var fPath = itemData.backupPath + '/' + data.fileName,
					originalPath = itemData.filePath + '/' + itemData.fileName + '.' + itemData.extension;

				// Add Separator
				R3.system.log.add('separator');

				try {

					// Read backup file
					const rawFile = R3.modules.fs.readFileSync(fPath, 'hex');

					// Write file
					R3.modules.fs.writeFileSync(originalPath, rawFile, 'hex');

					// Log sucess
					const sucessLog = 'Backup Manager: Restore complete!\n\nFile: ' + itemData.fileName + '.' + itemData.extension + '\nPath: ' + originalPath;
					
					window.alert(sucessLog);
					R3.system.log.add(sucessLog);

				} catch (err) {

					// Catch error
					R3.system.log.add('Backup Manager: Unable to restore file!\n' + err);

				} finally {

					// Close details
					R3.design.backupManager.closeChanges(data.editor);

					// Render currrent editor
					R3.design.backupManager.renderList(data.editor);

				}
			}

		} else {

			// Remove entry from backup manager
			delete R3.system.backupManager.database[data.editor][data.fileName];

			// Update database file
			R3.system.backupManager.updateDatabase(!0);

			// Unable to find file
			R3.system.log.add('separator');
			R3.system.log.add('Backup Manager: Unable to find file! (404)\nPath: ' + fPath + '\nThis file (' + itemData.fileName + ') will be removed from Backup Manager');

			// Close details
			R3.design.backupManager.closeChanges(data.editor);

			// Render currrent editor
			R3.design.backupManager.renderList(data.editor);

		}
	},

	// Remove file from backup manager
	removeFile: function(data){

		// Get item data
		const getEditor = this.database[data.editor],
			itemData = getEditor[data.fileName];

		// Check if entry exists
		if (itemData !== void 0){

			// File Path
			var fPath = itemData.backupPath + '/' + data.fileName;

			// Check if file exists
			if (R3.modules.fs.existsSync(fPath) === !0){

				// Confirm action
				const confirmRemove = window.confirm('Question: Are you sure about this action?\n\nBackup File: ' + itemData.fileName + '.' + itemData.extension + '\n(' + data.fileName + ')');
				if (confirmRemove === !0){
					
					// Add Separator
					R3.system.log.add('separator');
	
					try {
	
						// Remove (Unlink) file
						R3.modules.fs.unlinkSync(fPath);
	
						// Remove entry from backup manager
						delete R3.system.backupManager.database[data.editor][data.fileName];
	
						// Log sucess
						const sucessLog = 'Backup Manager: Process complete!\nRemoving Backup file: ' + fPath;

						window.alert(sucessLog);
						R3.system.log.add(sucessLog);

						// Update database file
						R3.system.backupManager.updateDatabase(!0);

					} catch (err) {
	
						// Catch error
						R3.system.log.add('Backup Manager: Unable to remove file!\n' + err);
	
					} finally {

						// Close details
						R3.design.backupManager.closeChanges(data.editor);

						// Render currrent editor
						R3.design.backupManager.renderList(data.editor);

					}

				}

			} else {

				// Remove entry from backup manager
				delete R3.system.backupManager.database[data.editor][data.fileName];

				// Update database file
				R3.system.backupManager.updateDatabase(!0);

				// Unable to find file
				R3.system.log.add('separator');
				R3.system.log.add('Backup Manager: Unable to find file! (404)\nPath: ' + fPath + '\nThis file (' + itemData.fileName + ') will be removed from Backup Manager');

				// Close details
				R3.design.backupManager.closeChanges(data.editor);

				// Render currrent editor
				R3.design.backupManager.renderList(data.editor);

			}

		}

	},

	// Update database file
	updateDatabase: function(showLog){
		
		try {

			// Write file
			R3.modules.fs.writeFileSync(this.databaseFile, btoa(JSON.stringify(R3.system.backupManager.database)), 'utf-8');

			// Update log
			if (showLog === !0){
				R3.system.log.add('separator');
				R3.system.log.add('Backup Manager: Updating database file...');
			}

		} catch (err){

			// Catch error
			R3.system.log.add('Backup Manager: Unable to update databse file!\n' + err);

		}

	}

}