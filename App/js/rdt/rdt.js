/*
	*******************************************************************************
	R3ditor V3 - rdt.js
	By TheMitoSan

	This file is responsible for storing all functions related to Room Data Table
	(RDT) files
	*******************************************************************************
*/

tempFn_RDT = {

	// Pull all RDT Modules
	editor: tempFn_rdtEditor,

	/*
		RDT Structure variables
	*/

	// AKA. arquivoBruto!
	originalFile: '',

	map: {

		// General data
		general: {

			// Total cameras
			totalCams: 0
		},

		// RDT Headers
		headers: [],

		// RDT Sections
		sections: {
			MSG: '',
			SCD: '',
			RVD: '',
			LIT: '',
			PRI: '',
			RID: '',
			BLK: '',
			EFF: '',
			SCA: '',
			EFFSPR: ''
		},

		// Original Sections
		backupSections: {}
	},

	/*
		Functions
	*/

	// Process RDT file
	readFile: function(hexData){

		// Clean Variables
		this.editor.close();

		// Start reading process
		this.originalFile = hexData;

		// Get header info
		const rawRdtHeader = hexData.slice(0, 192),
			headerSplice = rawRdtHeader.match(/.{8,8}/g);

		// Push the first one as normal
		this.map.headers.push(headerSplice[0]);
		// Push all others
		headerSplice.forEach(function(a, b){
			if (b !== 0){
				R3.RDT.map.headers.push(R3.tools.parseEndian(a));
			}
		});

		/*
			Get metadata
		*/
		// Total cameras
		this.map.general.totalCams = parseInt(this.map.headers[0].slice(0, 4), 16);
		
		/*
			Start reading sections
		*/
		// Read MSG
		this.read_MSG(this.map.headers[15]);

		// Read SCD
		this.read_SCD(this.map.headers[18]);

		/*
			End
		*/
		// Backup sections
		Object.keys(this.map.sections).forEach(function(sectionData){
			R3.RDT.map.backupSections[sectionData] = R3.RDT.map.sections[sectionData];
		});
		
	},

	// Read MSG
	read_MSG: function(pointer){
		R3.system.log.add('RDT: Reading MSG...');
		if (pointer !== '00000000'){

			/*
				R3V2 Original implementation
			*/
			// Get MSG Section location
			var	MSG_HEX_STARTPOS = (parseInt(pointer, 16) * 2),
				// Get MSG pointers length
				MSG_POINTER_LENGTH = (parseInt(R3.tools.parseEndian(R3.RDT.originalFile.slice(MSG_HEX_STARTPOS, (MSG_HEX_STARTPOS + 4))), 16) * 2),
				// Get MSG pointers
				MSG_POINTERS = R3.RDT.originalFile.slice(MSG_HEX_STARTPOS, (MSG_HEX_STARTPOS + MSG_POINTER_LENGTH)),
				// Get location for last MSG pointer
				MSG_LAST_POINTER_LENGTH = (parseInt(R3.tools.parseEndian(MSG_POINTERS.slice(MSG_POINTERS.length - 4, MSG_POINTERS.length)), 16) * 2),
				// Get almost all messages (Get first pointers + almost all messages, missing latest one)
				MSG_RAW_SECTION = R3.RDT.originalFile.slice(MSG_HEX_STARTPOS, parseInt(MSG_HEX_STARTPOS + MSG_LAST_POINTER_LENGTH)),
				// Range for searching last message
				RDT_MSG_SEEK_AREA = R3.RDT.originalFile.slice((R3.RDT.originalFile.indexOf(MSG_RAW_SECTION) + MSG_RAW_SECTION.length), R3.RDT.originalFile.length);
			
			// Import section
			R3.RDT.map.sections.MSG = MSG_RAW_SECTION + RDT_MSG_SEEK_AREA.slice(0, parseInt(RDT_MSG_SEEK_AREA.indexOf('fe') + 4));

			// Read MSG Section
			R3.MSG.readFromRDT();
		}
	},

	// Read SCD
	read_SCD: function(pointer){
		R3.system.log.add('RDT: Reading SCD...');
		if (pointer !== '00000000'){

			/*
				R3V2 Original implementation
			*/
			var opcodeLength, RDT_SCD_SEEK_AREA, foundEnd = !1, cOpcode = '', tmpStart = 0, tmpEnd = 2, lastScript = '',
				SCD_HEX_STARTPOS  = (parseInt(pointer, 16) * 2),
				SCD_POINTER_START = R3.tools.parseEndian(R3.RDT.originalFile.slice(SCD_HEX_STARTPOS, (SCD_HEX_STARTPOS + 4))),
				SCD_POINTER_END   = SCD_HEX_STARTPOS + (parseInt(SCD_POINTER_START, 16) * 2),
				SCD_LENGTH 		  = (parseInt(R3.tools.parseEndian(R3.RDT.originalFile.slice((SCD_POINTER_END - 4), SCD_POINTER_END)), 16) * 2),
				SCD_RAW_SECTION   = R3.RDT.originalFile.slice(SCD_HEX_STARTPOS, (SCD_HEX_STARTPOS + SCD_LENGTH));

			/*
				Now, let's try extract the last script from RDT:
			
				After getting all scripts using Khaled SA Method, it will crop the RDT file from the end of already extracted SCD to the end of RDT file.
				Then, it will analyze the next hex block and will compare to the database to see if it is the EVT_END function (01 00).
				If not, it will see what opcode is, it's length and will jump to the next opcode.
			
				Let's hope to all maps haves EVT_END in the last script!
			 */

			RDT_SCD_SEEK_AREA = R3.RDT.originalFile.slice((R3.RDT.originalFile.indexOf(SCD_RAW_SECTION) + SCD_RAW_SECTION.length), R3.RDT.originalFile.length);
			while (foundEnd === !1){
				cOpcode = RDT_SCD_SEEK_AREA.slice(tmpStart, tmpEnd);
				if (cOpcode === '01'){
					lastScript = RDT_SCD_SEEK_AREA.slice(0, (tmpEnd + 2));
					foundEnd = !0;
				} else {
					opcodeLength = parseInt(R3.database.scdDatabase[cOpcode][0] * 2);
					tmpStart = (tmpStart + opcodeLength);
					tmpEnd = (tmpEnd + opcodeLength);
				}
			}

			// Import section
			R3.RDT.map.sections.SCD = SCD_RAW_SECTION + lastScript;
		}
	},

	/*
		Compile RDT [WIP]

		Method: It will check if all sections are identical to it's backup. If so, it will only replace the original section.
		If not, will compile all pointers. <-- TBD
	*/
	compile: function(){

		// Variables
		var canSave = !0,
			eReason = '',
			finalHex = '',
			compilePointers = !1,
			totalSections = Object.keys(R3.RDT.map.sections).length;

		// Error - Disable saving on final
		const addError = function(reason){
			canSave = !1;
			eReason = eReason + reason + '\n';
		}

		// Check sections length
		Object.keys(R3.RDT.map.backupSections).forEach(function(mapSection){
			if (R3.RDT.map.backupSections[sName].length !== R3.RDT.map.sections[sName].length){
				compilePointers = !0;
			}
		});

		// Log Status
		R3.system.log.add('separator');
		R3.system.log.add('RDT: Starting compiler...\nUpdate pointers: ' + JSON.stringify(compilePointers));

		/*
			Compile without pointers
			All sections has the same length
		*/
		if (compilePointers === !1){

			// Set final hex as original hex
			finalHex = this.originalFile;
			
			// Process sections
			Object.keys(R3.RDT.map.sections).forEach(function(mapSection, sectionIndex){
				
				// Check if section is not empty
				if (R3.RDT.map.sections[mapSection] !== ''){
					R3.system.log.add('RDT: Updating ' + mapSection + ' (' + sectionIndex + ' of ' + totalSections + ')');
					finalHex = finalHex.replace(R3.RDT.map.backupSections[mapSection], R3.RDT.map.sections[mapSection]);
				}
			
			});

		}
		
		/*
			Compile with pointers
			Sections contains different size from original file
		*/
		if (compilePointers === !0){
			addError('R3V3 RDT Pointer Compiler is not implemented yet!');
		}

		// Add separator
		R3.system.log.add('separator');

		/*
			End
			Check if can save file on disk
		*/
		if (canSave === !0){

			try {

				// Write file
				R3.modules.fs.writeFileSync(R3.settings.list.lastFileOpenedPath, finalHex, 'hex');

				// Log
				R3.system.log.add('RDT: Save sucessfull!\nPath: ' + R3.settings.list.lastFileOpenedPath);

				// Re-open map to load latest changes
				R3.RDT.editor.processFile(R3.settings.list.lastFileOpenedPath);

			} catch (err) {

				// Log save error
				R3.system.log.add('RDT: Unable to save map!\n' + err);

			}

		} else {

			// Log compiler error
			R3.system.log.add('RDT: Unable to compile map!\nReason: ' + eReason);

		}

	}

}

// End
delete tempFn_rdtEditor;