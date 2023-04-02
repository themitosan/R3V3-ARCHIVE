/*
	*******************************************************************************
	R3ditor V3 - design.js
	By TheMitoSan

	This file is responsible for creating and managing main menubar and it's 
	contents.
	*******************************************************************************
*/

tempFn_DESIGN = {

	// Pull all modules
	tabs: tempFn_tabSystem,
	menuBar: tempFn_design_menuBar,
	shortcuts: tempFn_designShortcuts,
	miniwindow: tempFn_designMiniWindow,
	progressbar: tempFn_designProgressbar,

	/*
		Tools
	*/
	tools: {

		// Toggle checkbox status onclick
		toggleCheckbox: function(domId){

			const chId = document.getElementById(domId);
			if (chId !== null){
				if (chId.checked === !0){
					chId.checked = !1;
				} else {
					chId.checked = !0;
				}
			}

		},

		// Parse Checkbox value
		parseCheckbox: function(domId){

			const chId = document.getElementById(domId);
			if (chId !== null){
				return JSON.parse(chId.checked);
			}

		},

		// Update innerHTML via value
		updateHtmlFromValue: function(target, source){

			// Const
			const domTarget = document.getElementById(target),
				domSource = document.getElementById(source);

			if (domSource !== null && domTarget !== null){
				document.getElementById(target).innerHTML = domSource.value;
			}

		},

		// Get random camera
		getRandomCam: function(mapName){

			// Variables
			var camList = R3.modules.fs.readdirSync(R3.mod.paths.assets + '/DATA_A/BSS').filter(function(cFile){ 
					if (cFile.toLowerCase().indexOf('.jpg') !== -1){ 
						return cFile;
					}
				});

			// Get random cam from specific map (Example: R101)
			if (mapName !== void 0){

				// Filter map list
				var mapCamList = camList.filter(function(cFile){
					if (cFile.toUpperCase().indexOf(mapName) !== -1){
						return cFile;
					}
				});

				// Overwrite original list
				camList = mapCamList;
				
			}

			// Get random cam and path
			var randomPic = camList[R3.tools.getRandom(camList.length)],
				randomPath = R3.mod.paths.assets + '/DATA_A/BSS/' + randomPic;
			
			// Return
			return {cam: randomPic, path: randomPath};

		}

	},

	/*
		SVG
	*/
	svg: {

		// Set custom icon
		setCustomIcon: function(domId, icon){

			if (document.getElementById(domId) !== null){

				// Variables
				var finalSrc = finalClass = '';

				// Error
				if (icon === 'err'){

					TMS.removeClass(domId, 'R3V3_SVG_status_OK');
					TMS.removeClass(domId, 'R3V3_SVG_status_ERR');
					finalSrc = 'img/svg/status-err.svg';
					finalClass = 'R3V3_SVG_status_ERR';

				}

				// OK
				if (icon === 'ok'){

					TMS.removeClass(domId, 'R3V3_SVG_status_OK');
					TMS.removeClass(domId, 'R3V3_SVG_status_ERR');
					finalSrc = 'img/svg/status-ok.svg';
					finalClass = 'R3V3_SVG_status_OK';

				}

				// End
				TMS.addClass(domId, finalClass);
				document.getElementById(domId).src = finalSrc;

			}

		}

	},

	/*
		Backup Manager
	*/
	backupManager: {

		/*
			Variables
		*/

		// Changes form active
		changesActive: !1,

		// Current editor name
		editorName: '',

		/*
			Functions
		*/

		// Render list
		renderList: function(editor){
			
			// Variables
			var htmlData = 'There\'s nothing to show here. :D';

			// Check if exists
			if (R3.system.backupManager.database[editor] !== void 0){

				var editorList = Object.keys(R3.system.backupManager.database[editor]);
				if (editorList.length > 0){
					htmlData = '';
				}

				// Process list
				editorList.forEach(function(fName){

					// Get item data
					const itemData = R3.system.backupManager.database[editor][fName];

					// Append item to html
					htmlData = htmlData + '<div class="R3V3_bManager_item R3V3_bManager_item_' + editor + '" onclick="R3.design.backupManager.openChanges({editor: \'' +
										  editor + '\', file: \'' + fName + '\'});">File: ' + itemData.fileName + '.' + itemData.extension + '<div class="R3V3_bManager_itemLbl">Date: ' +
										  itemData.time.day + ' - ' + itemData.time.time + '</div><div class="R3V3_bManager_itemLbl">Location: ' + itemData.filePath + '</div><img src="img/icons/' + editor + '.webp" class="R3V3_bManager_item_icon"></div>';

				});			

			}

			// End
			document.getElementById('R3V3_bManager_list_' + editor).innerHTML = htmlData;
		
		},

		// Open Changes
		openChanges: function(data){
			
			// Const
			const itemData = R3.system.backupManager.database[data.editor][data.file];

			// Check if entry exists
			if (itemData !== void 0){

				// Check if changes is already opened
				if (document.getElementById('R3V3_bManager_details_' + data.editor) !== null){
					R3.design.backupManager.closeChanges(data.editor);
				}

				// Set form active status true
				R3.design.backupManager.changesActive = !0;

				// Append details
				const htmlDetails = R3.modules.fs.readFileSync(R3.system.paths.forms + '/backupManager/itemDetails.htm', 'utf-8');
				TMS.append('R3V3_bManager_holder_' + data.editor, htmlDetails.replace(RegExp('EDITORNAME', 'gi'), data.editor));

				// Details
				document.getElementById('R3V3_bManager_details_lbl_' + data.editor + '_date').innerHTML = itemData.time.day + ' - ' + itemData.time.time;
				document.getElementById('R3V3_bManager_details_lbl_' + data.editor + '_fileName').innerHTML = itemData.fileName + '.' + itemData.extension;
				document.getElementById('R3V3_bManager_details_lbl_' + data.editor + '_path').innerHTML = itemData.filePath + '/' + itemData.fileName + '.' + itemData.extension;

				// Changes
				document.getElementById('R3V3_bManager_details_' + data.editor + '_changes').innerHTML = itemData.changes;

				/*
					Item actions
				*/
				// Close form
				document.getElementById('R3V3_bManager_btnActions_' + data.editor + '_close').onclick = function(){
					R3.design.backupManager.closeChanges(data.editor);
				}
				// Remove file
				document.getElementById('R3V3_bManager_btnActions_' + data.editor + '_remove').onclick = function(){
					R3.system.backupManager.removeFile({ editor: data.editor, fileName: data.file });
				}
				// Restore file
				document.getElementById('R3V3_bManager_btnActions_' + data.editor + '_restore').onclick = function(){
					R3.system.backupManager.restoreFile({ editor: data.editor, fileName: data.file });
				}

				// Set current editor
				R3.design.backupManager.editorName = data.editor;

				/*
					End
					Show GUI
				*/
				TMS.css('R3V3_bManager_list_' + data.editor, {'display': 'none'});
				TMS.css('R3V3_bManager_details_' + data.editor, {'display': 'block'});

			}
		
		},

		// Close changes
		closeChanges: function(editor){

			// Check if exists
			if (document.getElementById('R3V3_bManager_details_' + editor) !== null){

				// Set form active status false
				R3.design.backupManager.changesActive = !1;

				// Restore list and remove details
				TMS.css('R3V3_bManager_list_' + editor, {'display': 'block'});
				document.getElementById('R3V3_bManager_details_' + editor).remove();

			}

		},

		// Check if changes are opened on tab action
		checkTabs: function(){
			if (this.changesActive === !0){
				this.closeChanges(this.editorName);
			}
		}

	},

	/*
		NW Window API
	*/
	window: {

		// Maximize app
		maximize: function(){
			R3.modules.win.maximize();
		}

	},

	/*
		Section Functions
		This is where small GUI changes (that does not require a whole new file for) is stored
	*/
	mod: {

		// Update main menu when mod is loaded
		updateMainMenu: function(){

			// Get random camera and update BG
			var getCam = R3.design.tools.getRandomCam(),
				randomPic = getCam.cam,
				randomPath = getCam.path;

			// Set CSS
			TMS.css('R3V3_mainMenu_bg', {'background-image': 'url(\'' + randomPath + '\')'});
			TMS.animate('R3V3_mainMenu_bg', {'opacity': '0.68'}, 4000, 'cubic-bezier(0, 1, 0, 1) 0s');

			// Log
			R3.system.log.add('Background Cam: Stage ' + randomPic.slice(1, 2) + ', Room ' + randomPic.slice(2, 4) + ' - Camera ' + randomPic.slice(4, randomPic.indexOf('.')));

			// Update menubar
			R3.design.menuBar.updateMainMenu();

		},

		// Clean GUI if mod is closed
		cleanMainMenu: function(){

			// Update menubar
			R3.design.menuBar.updateMainMenu();

			// Update title
			document.title = R3.build.appString;

			// Update BG
			TMS.css('R3V3_mainMenu_bg', {'background-image': 'none'});
		}
	},

	// RDT Editor
	rdt: {

		// Map list
		easyList: '',
		hardList: '',

		// Render File List
		renderFileList: function(argument){

			// Adjust window height
			TMS.animate('R3V3_miniWindow_mapList', {'height': '433px', 'top': + (parseInt(window.innerHeight - 10) - 433) + 'px'}, 1200, 'cubic-bezier(0, 1, 0, 1) 0s');

			// Adjust map list
			TMS.css('R3V3_mapList_easy', {'top': '30px'});
			TMS.css('R3V3_mapList_hard', {'top': '30px'});

			// Get map list
			const getMapHTML = function(gameMode){
				
				// Fix game mode
				if (gameMode === void 0 || gameMode === ''){
					gameMode = 'easy';
				}

				// Variables
				var res = '<br><div class="align-center">Unable to render file list!</div>';
				
				// Start madness
				if (R3.mod.loaded === !0 && Object.keys(R3.mod.mapList[gameMode]).length !== 0){

					res = '';

					Object.keys(R3.mod.mapList[gameMode]).forEach(function(cMap){

						// Map Metadata
						const mapFile 	= cMap.toLowerCase().replace('.rdt', '').toUpperCase(),
							mapName 	= R3.database.rdtMetadata[mapFile].name,
							mapLocation = R3.database.rdtMetadata[mapFile].location,
							map404 		= R3.system.paths.app + '/App/img/404.webp';
	
						// Map Icon
						var mapIcon = R3.mod.paths.assets + '/DATA_A/BSS/' + mapFile + '00.JPG';
						if (R3.modules.fs.existsSync(mapIcon) === !1){
							mapIcon = R3.mod.paths.assets + '/DATA_A/BSS/' + mapFile + '01.JPG';
							if (R3.modules.fs.existsSync(mapIcon) === !1){
								mapIcon = map404;
							}
						}
	
						// HTML Madness
						res = res + '<div class="R3V3_mapList_mapFile mapList_' + gameMode + '" id="R3V3_fileList_' + gameMode + '_' + cMap + '" ' + 
									'onclick="R3.RDT.editor.processFile(\'' + R3.mod.mapList[gameMode][mapFile] + '\');"><img src="' + mapIcon + '" ' + 
									'class="R3V3_mapList_mapIcon" alt="R3V3_mapList_' + cMap + '"><div class="R3V3_mapList_mapMetadata">File: ' + cMap + 
									'<div class="separator_0"></div>Name: ' + mapName + '<br>Map Location: ' + mapLocation + '</div></div>';
	
					});

				}

				// End
				return res;
			}

			// Set map list variables
			this.easyList = getMapHTML('easy');
			this.hardList = getMapHTML('hard');

			// Render it!
			document.getElementById('R3V3_mapList_easy').innerHTML = this.easyList;
			document.getElementById('R3V3_mapList_hard').innerHTML = this.hardList;

			setTimeout(function(){
				document.getElementById('R3V3_mapList_search_hard').focus();
			}, 10);
		},

		/*
			Search map

			Easy: searchEasy
			Hard: searchHard
		*/
		searchMap: function(gameMode, keyPress){

			/*
				Clear search
				Keys: Backspace or Delete
			*/
			if (keyPress.keyCode === 8 || keyPress === 46){
				document.getElementById('R3V3_mapList_search_' + gameMode).value = '';
			}

			// Get search value
			const searchValue = document.getElementById('R3V3_mapList_search_' + gameMode).value.toUpperCase().replace('R', '');
			
			// Check search if length are correct
			if (searchValue.length > 2){
			
				// variables
				var displayRes = '<br>Unable to find map R' + searchValue + ' :(',
					res = document.getElementById('R3V3_fileList_' + gameMode + '_R' + searchValue);
				
				// Check if result are valid
				if (res !== null){
					displayRes = res.outerHTML;
				}
			
				// Render result
				document.getElementById('R3V3_mapList_' + gameMode).innerHTML = displayRes;

			} else {

				// Render list if not
				if (document.getElementById('R3V3_mapList_' + gameMode).innerHTML !== this[gameMode + 'List']){
					document.getElementById('R3V3_mapList_' + gameMode).innerHTML = this[gameMode + 'List'];
				}

			}
			
			// Fix search value
			document.getElementById('R3V3_mapList_search_' + gameMode).value = searchValue;
		}

	},

	// MSG Editor
	msg: {

		// Clear GUI
		clear: function(){

			if (R3.design.miniwindow.isActive('rdtEditor') === !0 || R3.design.miniwindow.isActive('msgEditor') === !0){

				document.getElementById('R3V3_msgEditor_textarea').innerHTML = '';
				document.getElementById('R3V3_msgEditor_hexPreview').innerHTML = '';
				document.getElementById('R3V3_msgEditor_textPreview').innerHTML = '';
				document.getElementById('R3V3_msgEditor_messageList').innerHTML = '';
				document.getElementById('R3V3_msgEditor_textMetadata_length').innerHTML = '0';
				document.getElementById('R3V3_msgEditor_textMetadata_totalFunctions').innerHTML = '0';
				
			}

		},

		// Append on Message List
		appendMessageList: function(msgId){
			
			// Check if window is available
			if (R3.design.miniwindow.isActive('rdtEditor') === !0){

				// Generate HTML
				var htmlTemp = '';
				R3.MSG.msgPointers.forEach(function(msgEntry, cMessage){
					htmlTemp = htmlTemp + '<div id="R3V3_msgEditor_msgList_' + cMessage + '" class="R3V3_messageList_item" onclick="R3.MSG.editor.readMessageId(' + cMessage + ');">Message ' +
										  R3.tools.fixVars(cMessage, 3) + '</div>';
				});

				// End
				document.getElementById('R3V3_msgEditor_messageList').innerHTML = htmlTemp;

			}

		},

		// Set focus to selected message on list
		focusMsg: function(msgId){

			// Remove class
			R3.MSG.msgPointers.forEach(function(msgEntry, cMessage){
				TMS.removeClass('R3V3_msgEditor_msgList_' + cMessage, 'R3V3_messageList_itemActive');
			});

			// Add class to selected
			TMS.scrollCenter('R3V3_msgEditor_msgList_' + msgId);
			TMS.addClass('R3V3_msgEditor_msgList_' + msgId, 'R3V3_messageList_itemActive');

		}

	},

	/*
		Initialization Functions
	*/
	init: function(){

		try {

			// Reset progressbar dock status
			this.progressbar.resetNwProgress();

			// Update main menubar
			this.menuBar.update(this.menuBar.menuList.mainMenu);

			// End
			document.title = R3.build.appString;
			TMS.css('R3_MENU_mainMenu', {'display': 'block'});

		} catch (err) {
			console.error('ERROR: Unable to initialize design script!\n' + err);
		}

	}

}

// Delete
delete tempFn_tabSystem;
delete tempFn_design_menuBar;
delete tempFn_designShortcuts;
delete tempFn_designMiniWindow;
delete tempFn_designProgressbar;