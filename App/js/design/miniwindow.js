/*
	*******************************************************************************
	R3ditor V3 - miniwindow.js
	By TheMitoSan

	This file is responsible for creating mini-window popups for general usage
	*******************************************************************************
*/

tempFn_designMiniWindow = {

	// Enable / Disable drag if needed
	canDrag: !0,

	// Window List
	windowList: {},

	// Open form / Create window
	openForm: function(spawnData){

		// App dimensions
		const appWidth = window.innerWidth,
			appHeight = window.innerHeight;

		// Main variables
		var wTop = spawnData.top,
			wLeft = spawnData.left,
			wWidth = spawnData.width,
			formPath = spawnData.path,
			dom_Id = spawnData.domName,
			wheight = spawnData.height,
			divClass = spawnData.class,
			windowTitle = spawnData.title,
			tabActions = spawnData.tabActions,
			windowPosition = spawnData.position,
			sLocation = spawnData.spawnLocation,

			// Buttons
			disableMax = spawnData.disableMax,
			enableMin = spawnData.showMinimize,
			canMinimize = spawnData.canMinimize,

			// Execution
			onClose = spawnData.onClose,
			onFocus = spawnData.onFocus,
			onRestore = spawnData.onRestore,
			onMinimize = spawnData.onMinimize,
			onMaximize = spawnData.onMaximize,

			// Misc
			isEditor = spawnData.isEditor;
			openShortcut = spawnData.openShortcut;

		// If current window is active
		if (this.isActive(dom_Id) === !1){

			// Window & Position Fix
			if (wWidth !== void 0 && parseInt(wWidth) < 200){
				wWidth = 200;
			}
			if (wheight !== void 0 && parseInt(wheight) < 42){
				wheight = 42;
			}
			wWidth = R3.tools.fixUndefined(wWidth, 300);
			wheight = R3.tools.fixUndefined(wheight, 300);
			
			// Fix div class
			divClass = R3.tools.fixUndefined(divClass, '');

			// Can minimize
			canMinimize = R3.tools.fixUndefined(canMinimize, !0);

			// Misc: fix isEditor
			isEditor = R3.tools.fixUndefined(isEditor, !1);

			/*
				Window position
	
				center:       Spawn window at center screen
				top-left:     Spawn window at top-left screen
				top-right:    Spawn window at top-right screen
				bottom-left:  Spawn window at bottom-left screen
				bottom-right: Spawn window at bottom-right screen
			*/
			if (windowPosition === 'center'){
				wLeft = parseFloat(appWidth / 2) - (wWidth / 2);
				wTop = parseFloat(appHeight / 2) - (wheight / 2);
			}
			if (windowPosition === 'top-left'){
				wTop = wLeft = 10;
			}
			if (windowPosition === 'top-right'){
				wTop = 10;
				wLeft = parseFloat(appWidth - (wWidth + 10));
			}
			if (windowPosition === 'bottom-left'){
				wLeft = 10;
				wTop = parseFloat(appHeight) - (wheight + 10);
			}
			if (windowPosition === 'bottom-right'){
				wLeft = parseFloat(appWidth) - (wWidth + 10);
				wTop = parseFloat(appHeight) - (wheight + 10);
			}
	
			// Read html & buttons
			const mainPath = R3.system.paths.forms + '/' + formPath + '.htm', htmlData = R3.modules.fs.readFileSync(mainPath, 'utf-8');
	
			// Buttons options
			var hideMinimize = dMax = '';
			if (enableMin === !1){
				hideMinimize = 'display: none;';
			}
			if (disableMax === !0){
				dMax = 'disabled="disabled"';
			}
	
			// Window HTML Template
			const htmlTemplate = '<div class="R3V3_MINI_WINDOW ' + divClass + '" style="width: ' + parseFloat(wWidth) + 'px; height: ' + parseFloat(wheight) + 'px; top: ' + parseFloat(wTop) + 'px; left: ' + parseFloat(wLeft) +
							   'px;" id="R3V3_miniWindow_' + dom_Id + '" onmousedown="R3.design.miniwindow.sort(\'' + dom_Id + '\');"><div id="R3V3_miniWindow_' + dom_Id + '_HEADER" class="R3V3_MINI_WINDOW_DRAG_AREA">' +
							   '<font id="R3V3_miniWindow_' + dom_Id + '_title">' + windowTitle + '</font><div class="R3V3_miniWindow_controlHolder"><input type="button" style="' + hideMinimize + '" id="R3V3_miniWindow_' + dom_Id + 
							   '_minimize" onclick="R3.design.miniwindow.minimize(\'' + dom_Id + '\');" title="Click here to minimize this window" class="R3V3_MINI_WINDOW_MIN_BTN"><input type="button" id="R3V3_miniWindow_' + dom_Id +
							   '_restore" class="R3V3_MINI_WINDOW_RES_BTN" title="Click here to restore this window" onclick="R3.design.miniwindow.restore(\'' + dom_Id + '\');"><input type="button" id="R3V3_miniWindow_' + dom_Id + 
							   '_maximize" onclick="R3.design.miniwindow.maximize(\'' + dom_Id + '\');" title="Click here to maximize this window" class="R3V3_MINI_WINDOW_MAX_BTN" ' + dMax + '"><input type="button" id="R3V3_miniWindow_' + dom_Id +
							   '_closeBtn" onclick="R3.design.miniwindow.close(\'' + dom_Id + '\');" title="Click here to close this window" class="R3V3_MINI_WINDOW_CLOSE_BTN"></div></div><div id="R3V3_miniWindow_' + dom_Id + '_holder" class="R3V3_MINI_WINDOW_HOLDER">' + htmlData + 
							   '</div></div>';
	
			// Check if everything is ok to spawn
			if (document.getElementById('R3V3_miniWindow_' + dom_Id) === null){
				document.getElementById(sLocation).innerHTML += htmlTemplate;
				
				// Push id to active list
				this.windowList[dom_Id] = {

					// General data
					active: !0,
					minimized: !1,
					maximized: !1,
					tabActions: tabActions,
					canMinimize: canMinimize,

					// Window position
					spawnData: {
						top: wTop + 'px',
						left: wLeft + 'px',
						width: wWidth + 'px',
						height: wheight + 'px',
						position: windowPosition
					},

					// Actions
					onClose: onClose,
					onFocus: onFocus,
					onRestore: onRestore,
					onMinimize: onMinimize,
					onMaximize: onMaximize,

					// Misc
					isEditor: isEditor,
					openShortcut: openShortcut

				}
	
				// Initialization process
				Object.keys(this.windowList).forEach(function(wName){
					R3.design.miniwindow.enableDrag(wName);
				});
	
				// Make it at top of all other (possible) windows
				this.sort(dom_Id);
	
				// Post execution
				if (spawnData.postAction !== void 0){
					spawnData.postAction();
				}
			}

		} else {
			this.sort(dom_Id);
		}
	},

	// Update miniwindow
	updateForm: function(windowName, data){

		// Check if window is active
		if (this.isActive(windowName) === !0){

			// App dimensions
			const appWidth = window.innerWidth,
				appHeight = window.innerHeight;

			// New Settings
			var newTop = data.top,
				cssData = data.css,
				newLeft = data.left,
				newTitle = data.title,
				newWidth = data.width,
				newHeight = data.height,
				newFormPath = data.path,
				hideMinBtn = data.hideMin,
				hideMaxBtn = data.hideMax,
				hideCloseBtn = data.hideClose,
				newWindowPosition = data.position;

			// Size fix
			newWidth = R3.tools.fixUndefined(newWidth, parseFloat(TMS.getCssData('R3V3_miniWindow_' + windowName, 'width').replace('px', '')));
			newHeight = R3.tools.fixUndefined(newHeight, parseFloat(TMS.getCssData('R3V3_miniWindow_' + windowName, 'height').replace('px', '')));

			// Top & Left fix
			newTop = R3.tools.fixUndefined(newTop, parseFloat(TMS.getCssData('R3V3_miniWindow_' + windowName, 'top').replace('px', '')));
			newLeft = R3.tools.fixUndefined(newLeft, parseFloat(TMS.getCssData('R3V3_miniWindow_' + windowName, 'left').replace('px', '')));

			// Title fix
			if (newTitle === void 0 || newTitle === ''){
				newTitle = document.getElementById('R3V3_miniWindow_' + windowName + '_title').innerHTML;
			}

			// Hide / Show close button
			if (hideCloseBtn !== !1){
				hideCloseBtn = !0;
			}

			// Hide / Show max button
			if (hideMaxBtn !== !1){
				hideMaxBtn = !0;
			}

			// Hide / Show min button
			if (hideMinBtn !== !1){
				hideMinBtn = !0;
			}

			/*
				Window position
	
				center:       Move window to center screen
				top-left:     Move window to top-left screen
				top-right:    Move window to top-right screen
				bottom-left:  Move window to bottom-left screen
				bottom-right: Move window to bottom-right screen
			*/
			if (newWindowPosition === 'center'){
				newLeft = parseFloat(appWidth / 2) - (newWidth / 2);
				newTop = parseFloat(appHeight / 2) - (newHeight / 2);
			}
			if (newWindowPosition === 'top-left'){
				newTop = newLeft = 10;
			}
			if (newWindowPosition === 'top-right'){
				newTop = 10;
				newLeft = parseFloat(appWidth - (newWidth + 10));
			}
			if (newWindowPosition === 'bottom-left'){
				newLeft = 10;
				newTop = parseFloat(appHeight) - (newHeight + 10);
			}
			if (newWindowPosition === 'bottom-right'){
				newLeft = parseFloat(appWidth) - (newWidth + 10);
				newTop = parseFloat(appHeight) - (newHeight + 10);
			}

			/*
				Apply changes
			*/
			document.getElementById('R3V3_miniWindow_' + windowName + '_title').innerHTML = newTitle;

			if (newFormPath !== void 0){
				// Get HTML data
				const mainPath = R3.system.paths.forms + '/' + newFormPath + '.htm',
					htmlData = R3.modules.fs.readFileSync(mainPath, 'utf-8');
				document.getElementById('R3V3_miniWindow_' + windowName + '_holder').innerHTML = htmlData;
			}
			
			// CSS Data
			if (cssData !== void 0){
				TMS.css('R3V3_miniWindow_' + windowName, cssData);
			}
			
			// Window Position
			TMS.css('R3V3_miniWindow_' + windowName, {
				top: newTop + 'px',
				left: newLeft + 'px',
				width: newWidth + 'px',
				height: newHeight + 'px'
			});

			// Hide / Show close / maximize buttons
			var closeCss = maxCss = minCss = 'inline';

			if (hideCloseBtn === !0){
				closeCss = 'none';
			}
			if (hideMaxBtn === !0){
				maxCss = 'none';
			}
			if (hideMinBtn === !0){
				minCss = 'none';
			}

			TMS.css('R3V3_miniWindow_' + windowName + '_maximize', {display: maxCss});
			TMS.css('R3V3_miniWindow_' + windowName + '_minimize', {display: minCss});
			TMS.css('R3V3_miniWindow_' + windowName + '_closeBtn', {display: closeCss});

		}
	},

	// Enable drag window
	enableDrag: function(dom_Id){

		// Main Variables
		var elmnt = document.getElementById('R3V3_miniWindow_' + dom_Id), pos1 = pos2 = pos3 = pos4 = 0, finalTop, finalLeft;
		
		// Bind mouse action to drag functions
		function MINI_WINDOW_dragMouseDown(e){
			e = e || window.event;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmousemove = MINI_WINDOW_elementDrag;
			document.onmouseup = MINI_WINDOW_closeDragElement;
		}

		// Drag action
		function MINI_WINDOW_elementDrag(e){
			if (R3.design.miniwindow.canDrag === !0){
				var domId = elmnt.id;
				e = e || window.event;
				e.preventDefault();
				pos1 = (pos3 - e.clientX);
				pos2 = (pos4 - e.clientY);
				pos3 = e.clientX;
				pos4 = e.clientY;
				finalTop = (elmnt.offsetTop - pos2);
				finalLeft = (elmnt.offsetLeft - pos1);

				// Prevent out of bounds
				if (finalTop < 2){
					finalTop = 2;
				}
				if (finalLeft < 2){
					finalLeft = 2;
				}

				// End
				elmnt.style.top = finalTop + 'px';
				elmnt.style.left = finalLeft + 'px';
			}
		}

		// Stop drag
		function MINI_WINDOW_closeDragElement(){
			if (R3.design.miniwindow.canDrag === !0){
				document.onmouseup = null;
				document.onmousemove = null;
			}
		}

		// Bind mouse action on element 
		document.getElementById('R3V3_miniWindow_' + dom_Id + '_HEADER').onmousedown = MINI_WINDOW_dragMouseDown;

		// Force log to render
		R3.system.log.render();
	},

	// Maximize window
	maximize: function(domId){
		if (document.getElementById('R3V3_miniWindow_' + domId + '_HEADER') !== null && this.windowList[domId].maximized === !1){
			
			// Move window
			TMS.animate('R3V3_miniWindow_' + domId, { top: '2px', left: '2px', width: (window.innerWidth - 8) + 'px', height:	(window.innerHeight - 8) + 'px'}, 200, 'cubic-bezier(0, 1, 0, 1)');
	
			// Restore header
			TMS.css('R3V3_miniWindow_' + domId + '_HEADER', {'text-align': 'center'});
	
			// Update window buttons
			TMS.css('R3V3_miniWindow_' + domId + '_maximize', {'display': 'none'});
			TMS.css('R3V3_miniWindow_' + domId + '_minimize', {'display': 'inline'});
			TMS.css('R3V3_miniWindow_' + domId + '_restore', {'display': 'inline', 'transform': 'scaleY(-1)'});
	
			// Set maximize status on
			this.windowList[domId].maximized = !0;

			// Set minimize status off
			this.windowList[domId].minimized = !1;

			// Execute on maximize action
			if (this.windowList[domId].onMaximize !== void 0){
				this.windowList[domId].onMaximize();
			}

		}
	},

	// Restore window
	restore: function(domId){
		if (document.getElementById('R3V3_miniWindow_' + domId + '_HEADER') !== null){
			
			// Restore main window
			TMS.animate('R3V3_miniWindow_' + domId, {
				top: this.windowList[domId].spawnData.top,
				left: this.windowList[domId].spawnData.left,
				width: this.windowList[domId].spawnData.width,
				height:	this.windowList[domId].spawnData.height
			}, 200, 'cubic-bezier(0, 1, 0, 1)');

			// Restore header
			TMS.css('R3V3_miniWindow_' + domId + '_HEADER', {
				'text-align': 'center'
			});

			// Update window buttons
			TMS.css('R3V3_miniWindow_' + domId + '_maximize', {
				'display': 'inline'
			});
			TMS.css('R3V3_miniWindow_' + domId + '_minimize', {
				'display': 'inline'
			});
			TMS.css('R3V3_miniWindow_' + domId + '_restore', {
				'display': 'none',
				'transform': 'scaleY(1)'
			});

			// Set maximize status off
			this.windowList[domId].maximized = !1;

			// Set minimize status off
			this.windowList[domId].minimized = !1;

			// Execute on restore action
			if (this.windowList[domId].onRestore !== void 0){
				this.windowList[domId].onRestore();
			}

		}
	},

	// Minimize window
	minimize: function(domId){
		if (document.getElementById('R3V3_miniWindow_' + domId + '_HEADER') !== null && this.windowList[domId].minimized === !1){
			
			// Check if can minimize it
			if (this.windowList[domId].canMinimize === !0){

				// Update spawn data
				if (this.windowList[domId].maximized !== !0){
					this.windowList[domId].spawnData.top = TMS.getCssData('R3V3_miniWindow_' + domId, 'top');
					this.windowList[domId].spawnData.left = TMS.getCssData('R3V3_miniWindow_' + domId, 'left');
					this.windowList[domId].spawnData.width = TMS.getCssData('R3V3_miniWindow_' + domId, 'width');
					this.windowList[domId].spawnData.height = TMS.getCssData('R3V3_miniWindow_' + domId, 'height');
				}

				// Main Window
				TMS.animate('R3V3_miniWindow_' + domId, {
					width: '250px',
					height: '24px',
					top: parseFloat(window.innerHeight - 28) + 'px'
				}, 200, 'cubic-bezier(0, 1, 0, 1) 0s');
	
				// Update Header
				TMS.css('R3V3_miniWindow_' + domId + '_HEADER', {
					'text-align': '-webkit-left'
				});
	
				// Update buttons
				TMS.css('R3V3_miniWindow_' + domId + '_maximize', {
					'display': 'none'
				});
				TMS.css('R3V3_miniWindow_' + domId + '_minimize', {
					'display': 'none'
				});
				TMS.css('R3V3_miniWindow_' + domId + '_restore', {
					'display': 'inline',
					'transform': 'scaleY(1)'
				});
	
				// Set maximize status off
				this.windowList[domId].maximized = !1;

				// Set maximize status off
				this.windowList[domId].minimized = !0;

				// Execute on minimize action
				if (this.windowList[domId].onMinimize !== void 0){
					this.windowList[domId].onMinimize();
				}
				
			}

		}
	},

	/*
		Minimize all windows
		exeptionList: {Array} list of window id to not be minimized		
	*/
	minimizeAll: function(exeptionList){

		// Get window list as array
		const wList = Object.keys(R3.design.miniwindow.windowList);

		if (exeptionList !== void 0){
			wList.forEach(function(wName){
				if (exeptionList.indexOf(wName) === -1){
					R3.design.miniwindow.minimize(wName);
				}
			});
		} else {
			wList.forEach(function(wName){
				R3.design.miniwindow.minimize(wName);
			});
		}
	},

	// Close window
	close: function(domId){
		if (document.getElementById('R3V3_miniWindow_' + domId + '_HEADER') !== null){
			
			// Remove DOM
			document.getElementById('R3V3_miniWindow_' + domId + '_HEADER').onmousedown = null;
			document.getElementById('R3V3_miniWindow_' + domId).remove();

			// Execute action on closing current window
			if (this.windowList[domId].onClose !== void 0){
				R3.design.miniwindow.windowList[domId].onClose();
			}		

			// Remove from window list
			delete this.windowList[domId];

			/*
				Check if there is any editor opened. if not, set open mode as Load mod
			*/
			// Variables
			var setOpenMod = !0, wList = this.windowList;

			// Check all available windows
			Object.keys(wList).forEach(function(cWindow){
				if (wList.isEditor === !0){
					setOpenMod = !1;
				}
			});

			// Check if can set open mod
			if (setOpenMod === !0){
				R3.design.shortcuts.openFileMode = 'openMod';
			}
		}
	},

	/*
		Close List
		closeArray : {Array} list of windows to be closed
	*/
	closeList: function(closeArray){
		if (closeArray !== void 0){
			closeArray.forEach(function(wName){
				R3.design.miniwindow.close(wName);
			});
		}
	},

	/*
		Close all windows
		exeptionList: {Array} list of window id to not be closed		
	*/
	closeAll: function(exeptionList){
		const wList = Object.keys(R3.design.miniwindow.windowList);
		if (exeptionList !== void 0){
			wList.forEach(function(wName){
				if (exeptionList.indexOf(wName) === -1){
					R3.design.miniwindow.close(wName);
				}
			});
		} else {
			wList.forEach(function(wName){
				R3.design.miniwindow.close(wName);
			});
		}
	},

	/*
		Sort all windows
		This probably will receive some tweaks
	*/
	sort: function(domTop){

		// Minimun Z-Index value
		var zValue = 100;

		// Sort all windows
		Object.keys(this.windowList).forEach(function(windowName){
			// console.log(windowName);
			TMS.css('R3V3_miniWindow_' + windowName, {'z-index': zValue});
			zValue++;
		});

		// Set selected window at top
		TMS.css('R3V3_miniWindow_' + domTop, {'z-index': zValue});

		// Execute on focus action
		if (this.windowList[domTop].onFocus !== void 0){
			this.windowList[domTop].onFocus();
		}

		// MISC: Set Open file mode
		if (this.windowList[domTop].openShortcut !== void 0){
			R3.design.shortcuts.openFileMode = this.windowList[domTop].openShortcut;
		}
		
	},

	// Checks if window exists
	isActive: function(windowName){

		// Check if window name is inserted
		if (windowName !== void 0 && windowName !== ''){
			
			// Variables
			var res = !1, check = this.windowList[windowName];
		
			// Check
			if (check !== void 0){
				res = !0;
			}
		
			return res;

		}
	},

	/*
		Utility
	*/

	// Close all editors
	closeAllEditors: function(){
		this.closeList([
			'rdtEditor',
			'msgEditor'
		]);
	},

	// Get active window list
	printWindowList: function(){
		console.table(this.windowList);
	}
	
}