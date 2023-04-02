/*
	*******************************************************************************
	R3ditor V3 - progressbar.js
	By TheMitoSan

	This file is responsible for creating and managing progressbar elements and
	all NW API related
	*******************************************************************************
*/

tempFn_designProgressbar = {

	/*
		Set progressbar status

		Example: 
		R3.design.progressbar.setValue({
		    dock: !0,
		    max: 100,
		    value: 60,
		    label: 'R3V3_wizardLabel',
		    target: 'R3V3_progressBar_wizard_1'
		});
		
		data:   {Object} Object that carry all settings below

		max:    {Int} Maximum percentage value
		value:  {Int} Minimum percentage value
		dock:   {Boolean} Set dock icon progress
		label:  {String} DOM ID to get innerHTML data with current percentage
		target: {String} DOM ID to get width adjusted with current percentage

	*/

	setValue: function(data){

		// Set main variables
		var cMax = data.max,
			domId = data.target,
			cValue = data.value,
			setDock = data.dock,
			lTarget = data.label;

		// Set dock status
		if (setDock === void 0){
			setDock = !1;
		}

		// Get all required values
		var cPertcentage = R3.tools.parsePercentage(cValue, cMax);
		if (cPertcentage > 100){
			cPertcentage = 100;
		}

		// Fix for dock / badge
		const dockPercentage = parseFloat(cPertcentage / 100);

		/*
			Apply values
		*/
		const pLabel = cPertcentage + '%';

		// Progress size
		if (document.getElementById(domId) !== null){
			TMS.css(domId, {width: pLabel})
		}

		// Label
		if (document.getElementById(lTarget) !== null){
			document.getElementById(lTarget).innerHTML = pLabel;
		}

		// Dock status
		if (setDock === !0){
			R3.modules.win.setProgressBar(dockPercentage);
			R3.modules.win.setBadgeLabel(pLabel);
		}

	},

	// Reset dock status
	resetNwProgress: function(){
		R3.modules.win.setProgressBar(-1);
		R3.modules.win.setBadgeLabel('');
	}

}