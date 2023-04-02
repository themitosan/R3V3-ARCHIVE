/*
	*******************************************************************************
	R3ditor V3 - editor.js
	By TheMitoSan

	This file is responsible for handling all functions related to MSG editor
	GUI
	*******************************************************************************
*/

tempFn_msgEditor = {

	/*
		Variables
	*/

	// Form size
	formWidth: 832,
	formHeight: 375,

	/*
		Functions
	*/

	// New file / Open GUI
	newFile: function(){

		// Clean GUI
		R3.design.msg.clear();

		// Clean variables
		R3.MSG.clean();
		
		// Process blank message
		R3.MSG.processFile('fa02fcfe00', {
			isHex: !0,
			renderMsg: !0,
			returnMessageData: !1
		});
	
	},

	// Open file
	open: function(){

		// Trigger load window
		R3.system.loadFile('.msg', 'hex', function(post){

			// Close some windows
			R3.design.miniwindow.closeList(['rdtEditor', 'backupManager']);

			// Clean GUI
			R3.design.msg.clear();

			// Clean variables
			R3.MSG.clean();

			// Process file
			R3.MSG.processFile(post.path, {
				isHex: !1,
				renderMsg: !0,
				returnMessageData: !1
			});

		});

	},

	// Render message on editor
	renderMessage: function(){

		// Check if RDT editor is opened. if not, will open MSG Editor instead
		if (R3.design.miniwindow.isActive('rdtEditor') === !1){

			// Close some sassy windows
			R3.design.miniwindow.closeList(['backupManager']);

			// Open form
			R3.design.miniwindow.openForm({
				isEditor: !0,
				disableMax: !1,
				canMinimize: !0,
				showMinimize: !0,
				path: 'msg/main',
				position: 'center',
				title: 'MSG Editor',
				domName: 'msgEditor',
				width: this.formWidth,
				height: this.formHeight,
				openShortcut:'msgEditor',
				spawnLocation: 'R3_APP_HOLDER',
				postAction: function(){

					// Hide Message List
					TMS.css('R3V3_msgEditor_mainGUI', {'width': '100%'});
					TMS.css('R3V3_msgEditor_messageListHolder', {'display': 'none'});

					// Hide Add / Remove Buttons and Next / Previous Buttons
					TMS.css('R3V3_msgEditor_addRemove', {'display': 'none'});
					TMS.css('R3V3_msgEditor_nextPrevious', {'display': 'none'});

					// Hide compile button
					TMS.css('R3V3_msgEditor_compileBtn', {'display': 'none'});

				}
			});
			
		}

		// Bump render counter
		R3.MSG.currentMessage.renderCounter++;
		// console.info(R3.MSG.currentMessage.renderCounter);

		// Hex Preview
		document.getElementById('R3V3_msgEditor_hexPreview').innerHTML = R3.tools.unsolveHex(R3.MSG.currentMessage.hexData);
	
		// Editable text
		document.getElementById('R3V3_msgEditor_textarea').value = R3.MSG.currentMessage.text;
	
		// Preview
		document.getElementById('R3V3_msgEditor_textPreview').innerHTML = R3.MSG.currentMessage.preview;
		
		// Set first preview
		if (R3.MSG.currentMessage.renderCounter < 2){
			R3.MSG.currentMessage.firstHexData = R3.MSG.currentMessage.hexData;
			R3.MSG.currentMessage.firstPreview = R3.MSG.currentMessage.preview;
		}
	
		// Hex Length
		document.getElementById('R3V3_msgEditor_textMetadata_length').innerHTML = '<font class="can-select">' + R3.tools.fixVars(parseInt(R3.MSG.currentMessage.hexData.length / 2).toString(16), 6).toUpperCase() + '</font> h';

		// Total functions
		document.getElementById('R3V3_msgEditor_textMetadata_totalFunctions').innerHTML = R3.tools.fixVars(R3.MSG.currentMessage.totalFunctions, 6);
	
		// Give textcode focus
		document.getElementById('R3V3_msgEditor_textarea').focus();

		// Update textcode metadata
		this.processType();

	},

	// Open message on Hex Editor
	openMsgOnHex: function(){

		// Check if latest file is msg
		if (R3.settings.list.lastFileExtension === 'msg'){
			R3.system.openOnHex(R3.settings.list.lastFileOpenedPath);
		}

	},

	// Read message from id
	readMessageId: function(msgId){
		
		// Check if is valid input
		if (parseInt(msgId) !== NaN){
			
			// Set current message
			R3.MSG.currentMessage.messageId = msgId;

			// Reset render counter
			R3.MSG.currentMessage.renderCounter = 0;

			// Set focus to current message
			R3.design.msg.focusMsg(msgId);

			// Render on editor
			R3.MSG.processFile(R3.MSG.messageArray[msgId], {
				isHex: !0,
				renderMsg: !0,
				returnMessageData: !1
			});

		}

	},

	// Close file
	close: function(){
		R3.system.wip();
	},

	// Save file
	save: function(hexData){

		// Check if form is active
		if (R3.design.miniwindow.isActive('msgEditor') === !0){

			// Check if latest file was a message
			if (R3.settings.list.lastFileExtension === 'msg'){

				try {

					// File changes
					var fChanges = '<div class="R3V3_bManager_msgChangesPrevious">Previous message: ' + R3.MSG.currentMessage.firstPreview +
								   '</div><div class="R3V3_bManager_msgChangesNew">New Message: ' + R3.MSG.currentMessage.preview + '</div>';

					// Check if there is any change
					if (R3.MSG.currentMessage.firstPreview === R3.MSG.currentMessage.preview){
						fChanges = 'No changes detected from previous message.<br><br>Message:<br>' + R3.MSG.currentMessage.preview;
					}

					/*
						This is a comment to explain that the line below is a comment about what it's next line is. Didn't like it? Too bad...
					*/
					// Backup file
					R3.system.backupManager.backup({
						editor: 'MSG',
						extension: 'msg',
						fileChanges: fChanges,
						originalHex: R3.MSG.currentMessage.firstHexData,
						originalPath: R3.settings.list.lastFileOpenedPath,
						fileName: R3.tools.getFileName(R3.settings.list.lastFileOpenedPath)
					});

					// Write file
					R3.modules.fs.writeFileSync(R3.settings.list.lastFileOpenedPath, hexData, 'hex');

					// Log data
					R3.system.log.add('separator');
					R3.system.log.add('MSG: Save sucessfull!\nPath: ' + R3.settings.list.lastFileOpenedPath);

					// Set latest file opened
					R3.settings.setLatestFile(R3.settings.list.lastFileOpenedPath, 'msg', 'MSG Editor');
					
				} catch (err) {
					R3.system.log.add('separator');
					R3.system.log.add('ERROR: Unable to save file!\nReason: ' + err);
				}

			} else {

				// Prompt save as
				R3.MSG.editor.saveAs(hexData);
		
			}

		}

	},

	// Save As
	saveAs: function(hexData){

		// Check if form is active
		if (R3.design.miniwindow.isActive('msgEditor') === !0){

			// Save window
			R3.system.saveFile('MyMessage.msg', '.msg', hexData, 'hex', function(filePath){
				
				// Log data
				R3.system.log.add('separator');
				R3.system.log.add('MSG: Save sucessfull!\nPath: ' + filePath);
	
				// Set latest file opened
				R3.settings.setLatestFile(filePath, 'msg', 'MSG Editor');
	
			});

		}

	},

	// (RDT) Add current message
	addMessage: function(){
		
		// Check if RDT file is open
		if (R3.RDT.originalFile !== ''){

			// Push new pointer
			R3.MSG.msgPointers.splice(R3.MSG.currentMessage.messageId, 0, '0000');

			// Push blank message
			R3.MSG.messageArray.splice(R3.MSG.currentMessage.messageId, 0, 'fa02fcfe00');

			// Compile pointers and read message id
			R3.MSG.compilePointers({ msgHex: 'fa02fcfe00' });

		}

	},

	// (RDT) Remove current message
	removeMessage: function(){
		R3.system.wip();
	},

	// (RDT) Load next message
	nextMessage: function(){
		
		// Check if message exists
		const nextMsg = parseInt(R3.MSG.currentMessage.messageId + 1);
		if (R3.MSG.messageArray[nextMsg] !== void 0){
			R3.MSG.currentMessage.messageId = nextMsg;
		}
		
		// Load Message
		this.readMessageId(R3.MSG.currentMessage.messageId);

	},

	// (RDT) Load previous message
	previousMessage: function(){
		
		// Check if message exists
		const nextMsg = parseInt(R3.MSG.currentMessage.messageId - 1);
		if (R3.MSG.messageArray[nextMsg] !== void 0){
			R3.MSG.currentMessage.messageId = nextMsg;
		}
		
		// Load Message
		this.readMessageId(R3.MSG.currentMessage.messageId);

	},

	// Update textcode metadata Process message while writting
	processType: function(kp){

		// Change color
		TMS.css('R3V3_msgEditor_textarea', {'color': '#0f0'});

		// Variables
		var textDom = document.getElementById('R3V3_msgEditor_textarea'),
			cStart = textDom.selectionStart,
			cEnd = textDom.selectionEnd,
			textCode = textDom.value;

		// Update Textcode Metadata
		document.getElementById('R3V3_msgEditor_textCode_length').innerHTML = textCode.length;
		document.getElementById('R3V3_msgEditor_textCode_cursor').innerHTML = '<font title="Start">S</font>: ' + R3.tools.fixVars(cStart, 5) + ' - <font title="End">E</font>: ' + R3.tools.fixVars(cEnd, 5);

		// If key input is active and can compile as you type
		if (kp !== void 0 && R3.settings.list.msgEditor.compileMessageOnType === !0){

			// Variables
			var currentKey = kp.key, canCompile = !0;

			// console.info(currentKey);

			// Slices
			const selectStart = textCode.slice(0, cStart),
				selectEnd = textCode.slice(cStart, textCode.length),
				nextChar  = textCode.slice(cStart, (cStart + 1)),
				prevChar  = textCode.slice((cStart - 1), cStart);
	
			// Add key fix
			if (currentKey === '{' && nextChar !== '}'){
				canCompile = !1;
				document.getElementById('R3V3_msgEditor_textarea').value = selectStart + '}' + selectEnd;
			}

			// Remove key fix
			if (currentKey === 'Backspace' && nextChar === '}' && prevChar === '{'){
				document.getElementById('R3V3_msgEditor_textarea').value = selectStart + selectEnd.slice(1);
			}			
	
			// Auto-insert args
			if (currentKey === ':' && nextChar === '}'){

				// Check if is a function
				const fPrefix = textCode.slice((cStart - 3), cStart).toUpperCase();
				if (R3.database.msgCompilerFunctionDatabase[fPrefix] !== void 0){

					// Add args
					if (R3.database.msgCompilerFunctionDatabase[fPrefix].length === 2){
						document.getElementById('R3V3_msgEditor_textarea').value = selectStart + '00' + selectEnd;
					}

				}
			}
	
			// Check for incomplete functions
			if (nextChar === '}' && textCode.slice((cStart - 4), (cStart - 3)) === '{'){

				// Function prefix
				const fPrefix = textCode.slice((cStart - 3), cStart).toUpperCase();
				if (R3.database.msgCompilerFunctionDatabase[fPrefix] !== void 0){

					// Disable compile if is incomplete
					if (R3.database.msgCompilerFunctionDatabase[fPrefix].length === 2){
						canCompile = !1;
					}

				}

			}

			// Set cursor back to location
			document.getElementById('R3V3_msgEditor_textarea').selectionEnd = cEnd;
			document.getElementById('R3V3_msgEditor_textarea').selectionStart = cStart;
	
			// Check if can compile
			if (canCompile === !0){
				R3.MSG.compileMessage();
			}

		}

	}

}