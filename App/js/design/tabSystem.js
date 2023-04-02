/*
	*******************************************************************************
	R3ditor V3 - tabSystem.js
	By TheMitoSan

	This file is responsible for handling tab system on forms and etc.
	*******************************************************************************
*/
tempFn_tabSystem = {

	// Set selected tab active
	setActive: function(tabHolder, newFormId, miniWindowName){
		
		// Set main form data
		const parentHolder = document.getElementById(tabHolder),
			tabList = Array.from(parentHolder.getElementsByClassName('R3_tabButton')).forEach(function(tItem, idx){
				const formName = tItem.id.replace('tab_' + idx, 'form_' + idx);
				TMS.removeClass(tItem.id, 'tabActive');
				TMS.removeClass(formName, 'formActive');
			});

		// Show active form / tab
		TMS.addClass(tabHolder + '_tab_' + newFormId, 'tabActive');
		TMS.addClass(tabHolder + '_form_' + newFormId, 'formActive');

		// Tab actions
		if (miniWindowName !== void 0 && R3.design.miniwindow.windowList[miniWindowName].tabActions !== void 0){

			const tabActions = R3.design.miniwindow.windowList[miniWindowName].tabActions;

			// Window Name
			const windowName = tabActions.mainWindowName;

			// Cubic bezier animation
			var windowBezier = tabActions.bezier;
			if (windowBezier === void 0){
				windowBezier = 'cubic-bezier(0, 0, 0, 0) 0s';
			}

			// Animation time
			var animTime = tabActions.animTime;
			if (animTime === void 0){
				animTime = 0;
			}

			// Window width
			var nWidth = TMS.getCssData('R3V3_miniWindow_' + windowName, 'width');
			if (tabActions.tabs[newFormId].nWidth !== void 0){
				nWidth = tabActions.tabs[newFormId].nWidth;
			}

			// Window height
			var nHeight = TMS.getCssData('R3V3_miniWindow_' + windowName, 'height');
			if (tabActions.tabs[newFormId].nHeight !== void 0){
				nHeight = tabActions.tabs[newFormId].nHeight;
			}

			// Window position
			var wLeft = TMS.getCssData('R3V3_miniWindow_' + windowName, 'left'),
				wTop = TMS.getCssData('R3V3_miniWindow_' + windowName, 'top'), 
				appWidth = window.innerWidth, appHeight = window.innerHeight,
				windowPosition = tabActions.tabs[newFormId].position;

			if (windowPosition === 'center'){
				wLeft = parseFloat(appWidth / 2) - (nWidth / 2);
				wTop = parseFloat(appHeight / 2) - (nHeight / 2);
			}
			if (windowPosition === 'top-left'){
				wTop = wLeft = 10;
			}
			if (windowPosition === 'top-right'){
				wTop = 10;
				wLeft = parseFloat(appWidth - (nWidth + 10));
			}
			if (windowPosition === 'bottom-left'){
				wLeft = 10;
				wTop = parseFloat(appHeight) - (nHeight + 10);
			}
			if (windowPosition === 'bottom-right'){
				wLeft = parseFloat(appWidth) - (nWidth + 10);
				wTop = parseFloat(appHeight) - (nHeight + 10);
			}

			// Fix for "px" prefix
			if (wTop.toString().indexOf('px') === -1){
				wTop = wTop + 'px';
			}
			if (wLeft.toString().indexOf('px') === -1){
				wLeft = wLeft + 'px';
			}
			if (nWidth.toString().indexOf('px') === -1){
				nWidth = nWidth + 'px';
			}
			if (nHeight.toString().indexOf('px') === -1){
				nHeight = nHeight + 'px';
			}

			// Update spawn data
			R3.design.miniwindow.windowList[windowName].spawnData.top = wTop;
			R3.design.miniwindow.windowList[windowName].spawnData.left = wLeft;
			R3.design.miniwindow.windowList[windowName].spawnData.width = nWidth;
			R3.design.miniwindow.windowList[windowName].spawnData.height = nHeight;

			/*
				End
			*/

			// Normal
			if (R3.design.miniwindow.windowList[windowName].maximized !== !0){
				TMS.animate('R3V3_miniWindow_' + windowName, {
					'top': wTop,
					'left': wLeft,
					'width': nWidth,
					'height': nHeight
				}, animTime, windowBezier);
			}

			// Restore window
			if (tabActions.tabs[newFormId].restoreWindow === !0){
				R3.design.miniwindow.restore(windowName);
			}

			/*
				Header Options
			*/
			// Hide maximize button
			if (tabActions.tabs[newFormId].hideMaximize === !0){
				document.getElementById('R3V3_miniWindow_' + windowName + '_maximize').disabled = 'disabled';
			} else {
				document.getElementById('R3V3_miniWindow_' + windowName + '_maximize').disabled = '';
			}

			// Post action
			if (tabActions.tabs[newFormId].postAction !== void 0){
				tabActions.tabs[newFormId].postAction();
			}

		}

	}

}