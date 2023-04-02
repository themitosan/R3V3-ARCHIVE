/*
	*******************************************************************************
	R3ditor V3 - shortcuts.js
	By TheMitoSan

	This file is responsible for creating and managing local / global shortcuts.

	NW Global API: https://docs.nwjs.io/en/latest/References/Shortcut/
	Mousetrap webpage: https://craig.is/killing/mice
					   https://github.com/ccampbell/mousetrap 
	*******************************************************************************
*/
tempFn_designShortcuts = {

	/*
		Variables
	*/

	// Disable shortcuts
	enabled: !0,

	// Open file [CTRL + O] mode (Default: Open Mod)
 	openFileMode: 'openMod',

 	// Active shortcuts database
	activeShortcuts: {},

	/*
		Functions
	*/

	/*
		Create shortcut API

		shData  	   Object holder for shorcut settings
		shData.id 	   String: Shorcut name (REQUIRED!)
		shData.key     String: Combination of keys. Example: 'Ctrl+Shift+A'
		shData.type    String: Can be 'global' or addeventlistener type (onkeypress, onkeyup, onmousepress...)
		shData.action  function to be executed on trigger
	*/
	create: function(shData){
		try {

			// Check if is global
			if (shData.type === 'global'){

				R3.design.shortcuts.activeShortcuts[shData.id] = new nw.Shortcut({
					key: shData.key,
					active: function(){
						if (R3.design.shortcuts.enabled === !0){
							shData.action();
						}
					},
					failed: function(err){
						console.error('ERROR - Shorcut failed!\nType: ' + shData.type + '\nKey: ' + shData.key + '\nId: ' + shData.id + '\n\n' + err);
					}
				});

				R3.design.shortcuts.activeShortcuts[shData.id].type = shData.type;
				
				// Bind it!
				nw.App.registerGlobalHotKey(R3.design.shortcuts.activeShortcuts[shData.id]);
			}

			// Local (Mousetrap)
			if (shData.type === 'local'){

				// Mousetrap
				try {

					Mousetrap.bind(shData.key.toLowerCase(), function(){
						if (R3.design.shortcuts.enabled === !0){
							shData.action();
						}
					});

					R3.design.shortcuts.activeShortcuts[shData.id] = {
						type: shData.type,
						key: shData.key
					}

				} catch (err) {
					console.error('ERROR: Unable to register shortcut using Mousetrap!\n' + err);
				}

			}

		} catch (err) {
			console.error('ERROR: Unable to create shortcut!\n' + err);
		}
	},

	/*
		Remove shortcut

		shName: shorcut id

		IMPORTANT: You MUST remove all active shortcuts before reloading, otherwise nw will not allow
		creating it again due an internal bug.

		GitHub Issue: https://github.com/nwjs/nw.js/issues/6228
	*/
	remove: function(shName){

		// Checks if shortcut exists
		if (R3.design.shortcuts.activeShortcuts[shName] !== void 0){

			// Global
			if (R3.design.shortcuts.activeShortcuts[shName].type === 'global'){
				nw.App.unregisterGlobalHotKey(R3.design.shortcuts.activeShortcuts[shName]);
				delete R3.design.shortcuts.activeShortcuts[shName];
			}

			// Local (Mousetrap)
			if (R3.design.shortcuts.activeShortcuts[shName].type === 'local'){
				Mousetrap.unbind(R3.design.shortcuts.activeShortcuts[shName].key.toLowerCase());
				delete R3.design.shortcuts.activeShortcuts[shName];
			}

		}

	},

	// Remove all shortcuts
	removeAll: function(){
		Object.keys(R3.design.shortcuts.activeShortcuts).forEach(function(cShort){
			R3.design.shortcuts.remove(cShort);
		});
	},

	/*
		Shortcuts
	*/
	
	// Create main shortcuts
	createMainShorcuts: function(){

		// Open file [CTRL + O]
		this.create({
			id: 'openFile',
			type: 'local',
			key: 'Ctrl+o',
			action: function(){ R3.design.shortcuts.openFile(); }
		});

		// Open Log [CTRL + Shift + L]
		this.create({
			id: 'openLog',
			type: 'local',
			key: 'Ctrl+Shift+L',
			action: function(){ R3.system.log.open(); }
		});

		// Reload App [CTRL + Shift + R]
		this.create({
			id: 'reloadApp',
			type: 'local',
			key: 'Ctrl+Shift+R',
			action: function(){ R3.system.reload(); }
		});

		// New Mod (Wizard) [CTRL + N]
		this.create({
			id: 'newModWizard',
			type: 'local',
			key: 'Ctrl+n',
			action: function(){ R3.wizard.open(); }
		});
		
		// RDT Editor {CTRL + 1}
		this.create({
			id: 'rdtEditor',
			type: 'local',
			key: 'Ctrl+1',
			action: function(){ R3.RDT.editor.open(); }
		});

		// MSG Editor {CTRL + 3}
		this.create({
			id: 'msgEditor',
			type: 'local',
			key: 'Ctrl+3',
			action: function(){ R3.MSG.editor.newFile(); }
		});

	},

	// Open File
	openFile: function(){

		// Get open file mode
		const openMode = this.openFileMode;

		// Check if enabled
		if (this.enabled === !0){

			switch (openMode){

				// Open Mod
				case 'openMod':
					R3.mod.open();
					break;

				// MSG Editor
				case 'msgEditor':
					R3.MSG.editor.open();
					break;

				// RDT Editor
				case 'rdtEditor':
					R3.RDT.editor.open();
					break;

			}

		}

	}

}