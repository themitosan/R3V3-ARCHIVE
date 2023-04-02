/*
	*******************************************************************************
	R3ditor V3 - msg.js
	By TheMitoSan

	This file is responsible for handling map messages reading and writting 
	functions 
	*******************************************************************************
*/

tempFn_MSG = {

	// Pull all modules
	editor: tempFn_msgEditor,

	/*
		Variables
	*/

	// Original file
	originalFile: '',

	// MSG Pointers
	msgPointers: [],

	// RDT Messages
	messageArray: [],

	// Message commands
	msgFunctions: {},

	// Metadata
	currentMessage: {
		renderCounter: 0, // Render counter
		firstPreview: '', // First message preview (Used on Backup Manager)
		firstHexData: '', // First hex data
		messageId: 0, 	  // Message ID
		preview: '', 	  // Message preview
		hexData: '', 	  // Hex for current message
		totalFunctions: 0 // Total functions on current message
	},

	/*
		Functions
	*/
	// Process hex data
	processFile: function(path, options){

		// Return value
		var objectRes, hexData;

		// Read mode
		if (options.isHex === !0){

			// Path IS hex data
			hexData = path;

		} else {

			// Set latest file opened path and read as hex
			R3.settings.setLatestFile(path, 'msg', 'MSG Editor');
			hexData = R3.modules.fs.readFileSync(path, 'hex');

		}

		// Check if options is available
		if (options === void 0){
			options = {
				isHex: !1,
				renderMsg: !1,
				returnMessageData: !0
			}
		}

		// Check if hex length is correct
		if (Number.isInteger(hexData.length / 2) === !0){
			
			// Get original data
			this.originalFile = hexData;

			// Variables
			var skipHex = !1,
				textData = '',
				skipCounter = 0,
				releaseText = !1,
				messageData = {
					functions: {},
					hex: R3.tools.solveHex(hexData)
				},
				totalFunctions = 0;

			// Main hex array
			const hexArray = R3.tools.solveHex(hexData).match(/.{2,2}/g);
			hexArray.forEach(function(cHex, cIndex){
				
				// Skip hex
				if (skipHex === !1 && skipCounter === 0){

					// Check if current hex is function
					if (R3.database.msgDatabase[cHex].isFunction === !0){
						
						// If need to release text
						if (releaseText === !0){

							// Bump function counter for text
							totalFunctions++;
							messageData.functions[totalFunctions] = {type: 'text', data: textData};
							releaseText = !1;
							textData = '';

						}

						// Bump function counter
						totalFunctions++;

						// Setup skip counter
						skipHex = !0;
						skipCounter = parseInt(R3.database.msgDatabase[cHex].length - 1);
	
						// Function details
						const functionArgs = hexArray[(cIndex + 1)];

						/*
							Append function
							it will not skip hex and add args if function length are 1 (aka. has no args)
						*/
						if (skipCounter !== 0){
							messageData.functions[totalFunctions] = {type: cHex, data: functionArgs};
						} else {
							skipHex = !1;
							messageData.functions[totalFunctions] = {type: cHex};
						}

					} else {

						// If is text
						releaseText = !0;
						textData = textData + cHex;

					}

				} else {

					// Process skip counter
					skipCounter--;
					if (skipCounter < 1){
						skipHex = !1;
					}
					
				}

			});
			
			// Post: check if is need to release remaining text
			if (releaseText === !0){
				totalFunctions++;
				messageData.functions[totalFunctions] = {type: 'text', data: textData};
				releaseText = !1;
				textData = '';
			}

			/*
				End
			*/

			// Render message automatically
			if (options.renderMsg === !0){

				// Set message functions
				this.msgFunctions = messageData.functions;

				// Render on msgEditor
				this.processFunctions(messageData);

			}

			// Return Object
			if (options.returnMessageData === !0){
				objectRes = messageData;
			}

			// Return
			return objectRes;
		}

	},

	// Process messages functions
	processFunctions: function(msgData){
		if (Object.keys(msgData.functions).length !== 0){

			// Variables
			var textEdit = '',
				tFunctions = 0,
				textPreview = '',
				currentTextColor = '#fff';

			// Message interpreter
			const msgInterpreter = function(type, data){
				
				// Variables
				var txtEdit = '',
					txtPrev = '';

				if (type === void 0){
					type = 'text';
				}

				// Text edit and preview default values
				if (type !== 'text'){
					
					tFunctions++;
					txtEdit = '{' + R3.database.msgDatabase[type].prefix + ':' + data + '}';

					// If function has no args
					if (data === void 0){
						txtEdit = '{' + R3.database.msgDatabase[type].prefix + '}';
						txtPrev = R3.database.msgDatabase[type].char;
					}
					
					// Show functions on text preview
					if (R3.settings.list.msgEditor.showFunctionsOnPreview === !0){
						txtPrev = R3.database.msgDatabase[type].char + data + ') ';
					}

				}

				/*
					Switch for opcodes
					The options below will only catch what is diffs from default display
				*/
				switch (type) {

					// Change text color
					case 'f9':

						// Color database
						const colorDatabase = {
							'0': '#ffffffff', // Default color (White) 
							'1': '#00ff00ff', // Green
							'2': '#b70660ff', // Wine Red
							'3': '#888888ff', // Dark Gray
							'4': '#9595ffff', // Blue
							'5': '#ffffffff', // Default color (White) 
							'6': '#00000000', // Transparent
							'7': '#00000000', // Transparent
							'8': '#00000000', // Transparent
							'9': '#00000000', // Transparent
							'a': '#00000000', // Transparent
							'b': '#00000000', // Transparent
							'c': '#00000000', // Transparent
							'd': '#00000000', // Transparent
							'e': '#00000000', // Transparent
							'f': '#00000000'  // Transparent
						}

						currentTextColor = colorDatabase[data.slice(1)];
						txtPrev = '';
						break;

					// Show Item Name
					case 'f8':
						txtPrev = '<font style="color: ' + currentTextColor + ';">' + R3.database.itemDatabase[data].name + '</font>';
						break;

					// Line Break
					case 'fc':
						txtEdit = '{' + R3.database.msgDatabase[type].prefix + '}\n';
						txtPrev = R3.database.msgDatabase[type].char;
						break;

					// Start Message
					case 'fa':
						txtEdit = '{' + R3.database.msgDatabase[type].prefix + ':' + data + '}\n';
						break;

					// End Message
					case 'fe':
						txtEdit = '\n{' + R3.database.msgDatabase[type].prefix + ':' + data + '}';
						break;

					// Normal text
					case 'text':

						// Replace HTML from Message database
						const parseMessage = function(msg){
							
							// Filter list
							const replaceList = {
								'<code>': '',
								'</code>': ''
							}
							
							// Replace on current message
							Object.keys(replaceList).forEach(function(caseText){
								msg = msg.replace(RegExp(caseText, 'gi'), replaceList[caseText]);
							});

							return msg;
						}

						// Char array
						const hexArray = data.match(/.{2,2}/g);
						hexArray.forEach(function(txtChar){
							txtEdit = txtEdit + parseMessage(R3.database.msgDatabase[txtChar].char);
							txtPrev = txtPrev + '<font style="color: ' + currentTextColor + ';">' + R3.database.msgDatabase[txtChar].char + '</font>';
						});

						break;

				}

				// End
				return {edit: txtEdit, prev: txtPrev};

			}

			// Start processing data
			Object.keys(msgData.functions).forEach(function(cMsg, cIndex){
				const res = msgInterpreter(msgData.functions[cMsg].type, msgData.functions[cMsg].data);
				textEdit = textEdit + res.edit;
				textPreview = textPreview + res.prev;
			});
			
			// End
			R3.MSG.currentMessage.text = textEdit;
			R3.MSG.currentMessage.hexData = msgData.hex;
			R3.MSG.currentMessage.preview = textPreview;
			R3.MSG.currentMessage.totalFunctions = tFunctions;

			// Render message
			R3.MSG.editor.renderMessage();

		}

	},

	// Read MSG from RDT
	readFromRDT: function(){

		// Get pointers array
		var pointersLength = (parseInt(R3.tools.parseEndian(R3.RDT.map.sections.MSG.slice(0, 2)), 16) * 2),
			pointersTemp = R3.RDT.map.sections.MSG.slice(0, pointersLength).match(/.{4,4}/g).forEach(function(tmpPointer){
				R3.MSG.msgPointers.push(R3.tools.parseEndian(tmpPointer));
			});

		// Read and add message from MSG section
		const addMsgToList = function(msgId){
			
			// Check if pointer exists for selected message
			if (R3.MSG.msgPointers[msgId] !== void 0){
				
				// Get selected message from section
				var tmpMsgRaw = R3.RDT.map.sections.MSG,
					pointersLength = (parseInt(R3.MSG.msgPointers[msgId], 16) * 2),
					msgStart = tmpMsgRaw.slice(pointersLength, tmpMsgRaw.length),
					msgFinal = msgStart.slice(0, (msgStart.indexOf('fe') + 4));

				// Push message to message array
				R3.MSG.messageArray.push(msgFinal);

			}
		}

		// Push all messages to MSG List
		this.msgPointers.forEach(function(cItem, cIndex){
			addMsgToList(cIndex);
		});

		// GUI - Append Message List
		R3.design.msg.appendMessageList();

		// End
		this.currentMessage.messageId = 0;

		// Read first message
		this.editor.readMessageId(0);

	},

	// Compile
	compileMessage: function(postAction){

		// Variables
		var codeArray, 
			finalMessageHex = '',
			textCode = document.getElementById('R3V3_msgEditor_textarea').value; // Textcode
		
		// Fix for blank textbox (Blank message, output: FA 02 FC FE 00)
		if (textCode === ''){
			textCode = '{STR:02}{BRL}{END:00}';
		}

		// Set code array
		codeArray = textCode.match(/.{1,1}/g);

		// Process array variables
		var holdingFunction    = !0,
			releaseFunction    = !1,
			ignoreRemaining    = !1,
			tempFunctionHolder = '';

		try {

			// Code Interpreter
			const codeInterpreter = function(codeData){
				
				// Variables
				var finalHex = '',
					isFunction = !1,
					functionAttr = '',
					functionPrefix = '';
				
				// Check if is function
				if (codeData.indexOf('{') !== -1 && codeData.indexOf('}') !== -1){
	
					// Set function as true
					isFunction = !0;
					
					// Index of function args
					var attrIndex = codeData.indexOf(':');
	
					// Check if there is args
					if (attrIndex === -1){
						attrIndex = codeData.indexOf('}'); // If not, function code will end on key char ( } )
					} else {
						functionAttr = codeData.slice(parseInt(codeData.indexOf(':') + 1), codeData.indexOf('}')).toUpperCase();
					}
	
					// Get function prefix
					functionPrefix = codeData.slice(parseInt(codeData.indexOf('{') + 1), attrIndex).toUpperCase();
	
				}
				
				// Final check
				if (isFunction === !0){
				
					// Check if function exists
					if (R3.database.msgCompilerFunctionDatabase[functionPrefix] !== void 0){
						finalHex = R3.database.msgCompilerFunctionDatabase[functionPrefix].opcode + functionAttr;
					} else {
						throw 'Unknown message function! (Function: ' + functionPrefix + ', Args: ' + functionAttr + ')';
					}
				
				} else {
					finalHex = R3.database.msgCompilerCharDatabase[codeData];
				}
	
				// Set ignoreRemaining true if latest function is End Message ( {END:??} / FE ?? )
				if (functionPrefix === 'END'){
					ignoreRemaining = !0;
				}
	
				// End
				return finalHex.toLowerCase();
	
			}

			// Process code array
			codeArray.forEach(function(cChar){

				// If it needs to skip char for some reason (see codeInterpreter for more details)
				if (ignoreRemaining === !1){

					// Hold function
					if (cChar === '{'){
						holdingFunction = !0;
						releaseFunction = !1;
					}

					// Release function
					if (cChar === '}'){
						holdingFunction = !1;
						releaseFunction = !0;
						tempFunctionHolder = tempFunctionHolder + cChar; 
					}

					/*
						Process Data
					*/
					// If needs to push a function
					if (releaseFunction === !0){

						finalMessageHex = finalMessageHex + codeInterpreter(tempFunctionHolder);
						tempFunctionHolder = '';
						releaseFunction = !1;

					} else {

						// If is collecting function data
						if (holdingFunction === !0){
							tempFunctionHolder = tempFunctionHolder + cChar;
						} else {

							// If is a single char
							finalMessageHex = finalMessageHex + codeInterpreter(cChar);

						}

					}

				} else {
					R3.system.log.add('separator');
					R3.system.log.add('WARN: There is more data after End Message {END} function! Ignoring...');
				}

			});

			// Check if message contains End Message {END:??}
			if (finalMessageHex.slice((finalMessageHex.length - 4), (finalMessageHex.length - 2)).toLowerCase() !== 'fe'){
				finalMessageHex = finalMessageHex + 'fe00';
			}

			/*
				Post action
			*/
			switch (postAction){

				// Compile to RDT
				case 'rdtCompile':
					R3.MSG.compilePointers({ msgHex: finalMessageHex });
					break;

				// Save
				case 'save':
					R3.MSG.editor.save(finalMessageHex);
					break;

				// Save As
				case 'saveAs':
					R3.MSG.editor.saveAs(finalMessageHex);
					break;

			}

			/*
				End
				Read result message on editor 
			*/
			this.processFile(finalMessageHex, {
				isHex: !0,
				renderMsg: !0,
				returnMessageData: !1
			});

		} catch (err) {

			// Change textcode color to red on error
			TMS.css('R3V3_msgEditor_textarea', {'color': '#f00'});

			// Log it
			R3.system.log.add('separator');
			R3.system.log.add('ERROR: Unable to process message data!\n' + err);

		}

	},

	/*
		Compile message with RDT Pointers
	*/
	compilePointers: function(data){

		// Insert current message on array
		this.messageArray[this.currentMessage.messageId] = data.msgHex;

		// Set text hex with first message
		var finalMsg = '',

			// First pointer length
			firstPointerLength = parseInt(R3.tools.arrayToString(this.msgPointers).length / 2),

			/*
				Pointer array
				It will already have the first pointer compiled.
			*/
			newPointerArray = [R3.tools.parseEndian(R3.tools.fixVars(firstPointerLength.toString(16), 4))];

		// Process pointers
		this.msgPointers.forEach(function(cPointer, pIndex){

			// Concat message to previous message
			finalMsg = finalMsg + R3.MSG.messageArray[pIndex];

			// Skip if is last pointer
			if (pIndex !== (R3.MSG.msgPointers.length - 1)){

				// Calc pointer position for next message
				const newPointer = parseInt(firstPointerLength + (finalMsg.length / 2));

				// Push new pointer to array
				newPointerArray.push(R3.tools.parseEndian(R3.tools.fixVars(newPointer.toString(16), 4)));

			}

		});

		// Final Result
		var HEX_FINAL = R3.tools.arrayToString(newPointerArray) + finalMsg;

		/*
			Security Check
			Check if latest message has End Message function {END:??}
		*/
		if (HEX_FINAL.slice((HEX_FINAL.length - 4), (HEX_FINAL.length - 2)).toLowerCase() !== 'fe'){
			HEX_FINAL = HEX_FINAL + 'fe00';
		}

		/*
			End
		*/
		R3.system.log.add('separator');
		R3.system.log.add('RDT: Updating MSG section...');
		R3.RDT.map.sections.MSG = HEX_FINAL;

		// Compile RDT
		// R3.RDT.compile();
	},

	// Clean Variables
	clean: function(){

		// Original file
		this.originalFile = '';

		// MSG Pointers
		this.msgPointers = [];

		// RDT Messages
		this.messageArray = [];

		// Message commands
		this.msgFunctions = {};

		// Metadata
		this.currentMessage.renderCounter = 0;  // Render counter
		this.currentMessage.messageId = 0;		// Current message
		this.currentMessage.preview = ''; 	  	// Message preview
		this.currentMessage.hexData = ''; 	  	// Hex for current message
		this.currentMessage.firstHexData = '';	// First Hex data
		this.currentMessage.firstPreview = '';	// First Message preview
		this.currentMessage.totalFunctions = 0; // Total functions on current message
		
	}

}

delete tempFn_msgEditor;