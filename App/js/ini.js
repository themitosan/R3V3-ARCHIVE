/*
	*******************************************************************************
	R3ditor V3 - ini.js
	By TheMitoSan

	This file is responsible for creating and editing Resident evil 3 configs 
	file (*.ini)
	*******************************************************************************
*/

tempFn_INI = {

	/*
		INI Data
	*/

	iniData: {
		// [General]
		general: {
			Save: '',
			Regist: '',
			Movie: '',
			Rofs1: '',
			Rofs2: '',
			Rofs3: '',
			Rofs4: '',
			Rofs5: '',
			Rofs6: '',
			Rofs7: '',
			Rofs8: '',
			Rofs9: '',
			Rofs10: '',
			Rofs11: '',
			Rofs12: '',
			Rofs13: '',
			Rofs14: '',
			Rofs15: ''
		},
		// [Video]
		video: {
			DisableMovie: 	 'on',
			DisableAlpha: 	 'off',
			DisableLinear: 	 'off',
			DisableSpecular: 'off',
			TextureAdjust: 	 'off',
			Mode: 			 'Windowed'
		},
		// [Windowed]
		windowed: {
			Driver: 'NULL',
			Device: '0ed36e48aa64fc1118f600000c0251e6',
			Width: 	960,
			Height: 720,
			BPP: 	32
		},
		// [Fullscreen]
		fullscreen: {
			Driver: 'NULL',
			Device: '0ed36e48aa64fc1118f600000c0251e6',
			Width: 	800,
			Height: 600,
			BPP: 	32
		},
		// [Sound]
		sound: {
			Device: 'NULL',
			SEvol: 65534,
			BGMvol: 65534
		},
		// [Keyboard]
		keyboard: {
			Key1: '',
			Key2: '',
			Key3: '',
			Key4: '',
			Key5: '',
			Key6: '',
			Key7: '',
			Key8: '',
			Key9: '',
			KeyA: '',
			KeyB: '',
			KeyC: '',
			KeyD: '',
			KeyE: ''
		},
		// [Data]
		data: {
			Complete: '',
			Data00: '',
			Data01: '',
			Data02: '',
			Data03: '',
			Data10: ''
		}

	},

	/*
		Functions
	*/

	// Parse boolean values
	parseBool: function(val){
		var res = 'on';
		if (val !== void 0 && val !== !1){
			res = 'off';
		}
		return res;
	},

	// Make INI file
	makeINI: function(mode){

		// Variables
		const iData = this.iniData;

		/*
			Unchanged settings
		*/

		// General
		iData.general.Movie = '.\\zmovie';
		iData.general.Regist = '.\\regist.txt';

		// Video
		iData.video.DisableMovie = R3.INI.parseBool(!1);
		iData.video.DisableAlpha = R3.INI.parseBool(!0);
		iData.video.DisableLinear = R3.INI.parseBool(!0);
		iData.video.DisableSpecular = R3.INI.parseBool(!0);
		iData.video.TextureAdjust = R3.INI.parseBool(!0);
		iData.video.Mode = 'Windowed';
		
		// Windowed
		iData.windowed.Driver = 'NULL';
		iData.windowed.Device = '0ed36e48aa64fc1118f600000c0251e6';
		iData.windowed.Width = 640;
		iData.windowed.Height = 480;
		iData.windowed.BPP = 32;

		// Fullscreen
		iData.fullscreen.Driver = 'NULL';
		iData.fullscreen.Device = '0ed36e48aa64fc1118f600000c0251e6';
		iData.fullscreen.Width = 800;
		iData.fullscreen.Height = 600;
		iData.fullscreen.BPP = 32;

		// Sound
		iData.sound.Device = 'NULL';
		iData.sound.SEvol = 65534;
		iData.sound.BGMvol = 65534;

		// Keyboard
		iData.keyboard.Key1 = '17,200';
		iData.keyboard.Key2 = '31,208';
		iData.keyboard.Key3 = '30,203';
		iData.keyboard.Key4 = '32,205';
		iData.keyboard.Key5 = '';
		iData.keyboard.Key6 = '75,72,36,23,57';
		iData.keyboard.Key7 = '72,82,57';
		iData.keyboard.Key8 = '71,22';
		iData.keyboard.Key9 = '73,24';
		iData.keyboard.KeyA = '78,25';
		iData.keyboard.KeyB = '16';
		iData.keyboard.KeyC = '77,38';
		iData.keyboard.KeyD = '76,37,156';
		iData.keyboard.KeyE = '';

		// Data
		iData.data.Complete = '';
		iData.data.Data00 = '';
		iData.data.Data01 = '';
		iData.data.Data02 = '';
		iData.data.Data03 = '';
		iData.data.Data10 = '';

		switch (mode){

			// Make INI for R3V3 Wizard
			case 'wizard':

				// General
				iData.general.Save = '.\\Save';
				iData.general.Rofs1 = '.\\DATA\\DOOR';
				iData.general.Rofs2 = '.\\DATA_AE\\ETC2';
				iData.general.Rofs3 = '.\\DATA\\ETC';
				iData.general.Rofs4 = '.\\DATA_E\\ETC2';
				iData.general.Rofs5 = '.\\DATA\\PLD';
				iData.general.Rofs6 = '.\\DATA_A\\PLD';
				iData.general.Rofs7 = '.\\DATA\\SOUND';
				iData.general.Rofs8 = '.\\DATA_A\\BSS';
				iData.general.Rofs9 = '.\\ROOM\\EMD';
				iData.general.Rofs10 = '.\\ROOM\\EMD08';

				// Keep Rofs11.dat
				iData.general.Rofs11 = '.\\ROOM\\RBJ';
				if (R3.wizard.settings.keepRofs === !0){
					iData.general.Rofs11 = '.\\Rofs11.dat';
				}
				
				iData.general.Rofs12 = '.\\DATA_AJ\\RDT';
				iData.general.Rofs13 = '.\\DATA_E\\RDT';
				iData.general.Rofs14 = '.\\DATA_A\\VOICE';
				iData.general.Rofs15 = '.\\DATA_A\\SOUND';
				break;

			// Default action
			default:
				// General
				iData.general.Save = '.\\Save';
				iData.general.Rofs1 = '.\\Rofs1.dat';
				iData.general.Rofs2 = '.\\Rofs2.dat';
				iData.general.Rofs3 = '.\\Rofs3.dat';
				iData.general.Rofs4 = '.\\Rofs4.dat';
				iData.general.Rofs5 = '.\\Rofs5.dat';
				iData.general.Rofs6 = '.\\Rofs6.dat';
				iData.general.Rofs7 = '.\\Rofs7.dat';
				iData.general.Rofs8 = '.\\Rofs8.dat';
				iData.general.Rofs9 = '.\\Rofs9.dat';
				iData.general.Rofs10 = '.\\Rofs10.dat';
				iData.general.Rofs11 = '.\\rofs11.dat';
				iData.general.Rofs12 = '.\\Rofs12.dat';
				iData.general.Rofs13 = '.\\Rofs13.dat';
				iData.general.Rofs14 = '.\\Rofs14.dat';
				iData.general.Rofs15 = '.\\Rofs15.dat';
				break;
		}
		this.saveINI();
	},

	// Save ini
	saveINI: function(){
		const iniFile = '[General]\n' +
			'Save=' + this.iniData.general.Save + '\n' +
			'Regist=' + this.iniData.general.Regist + '\n' +
			'Movie=' + this.iniData.general.Movie + '\n' +
			'Rofs1=' + this.iniData.general.Rofs1 + '\n' +
			'Rofs2=' + this.iniData.general.Rofs2 + '\n' +
			'Rofs3=' + this.iniData.general.Rofs3 + '\n' +
			'Rofs4=' + this.iniData.general.Rofs4 + '\n' +
			'Rofs5=' + this.iniData.general.Rofs5 + '\n' +
			'Rofs6=' + this.iniData.general.Rofs6 + '\n' +
			'Rofs7=' + this.iniData.general.Rofs7 + '\n' +
			'Rofs8=' + this.iniData.general.Rofs8 + '\n' +
			'Rofs9=' + this.iniData.general.Rofs9 + '\n' +
			'Rofs10=' + this.iniData.general.Rofs10 + '\n' +
			'Rofs11=' + this.iniData.general.Rofs11 + '\n' +
			'Rofs12=' + this.iniData.general.Rofs12 + '\n' +
			'Rofs13=' + this.iniData.general.Rofs13 + '\n' +
			'Rofs14=' + this.iniData.general.Rofs14 + '\n' +
			'Rofs15=' + this.iniData.general.Rofs15 + '\n' +
			'\n[Video]\n' +
			'DisableMovie=' + this.iniData.video.DisableMovie + '\n' +
			'DisableAlpha=' + this.iniData.video.DisableAlpha + '\n' +
			'DisableLinear=' + this.iniData.video.DisableLinear + '\n' +
			'DisableSpecular=' + this.iniData.video.DisableSpecular + '\n' +
			'TextureAdjust=' + this.iniData.video.TextureAdjust + '\n' +
			'Mode=' + this.iniData.video.Mode + '\n' +
			'\n[Windowed]\n' +
			'Driver=' + this.iniData.windowed.Driver + '\n' +
			'Device=' + this.iniData.windowed.Device + '\n' +
			'Width=' + this.iniData.windowed.Width + '\n' +
			'Height=' + this.iniData.windowed.Height + '\n' +
			'BPP=' + this.iniData.windowed.BPP + '\n' +
			'\n[FullScreen]\n' +
			'Driver=' + this.iniData.fullscreen.Driver + '\n' +
			'Device=' + this.iniData.fullscreen.Device + '\n' +
			'Width=' + this.iniData.fullscreen.Width + '\n' +
			'Height=' + this.iniData.fullscreen.Height + '\n' +
			'BPP=' + this.iniData.fullscreen.BPP + '\n' +
			'\n[Keyboard]\n' +
			'Key1=' + this.iniData.keyboard.Key1 + '\n' +
			'Key2=' + this.iniData.keyboard.Key2 + '\n' +
			'Key3=' + this.iniData.keyboard.Key3 + '\n' +
			'Key4=' + this.iniData.keyboard.Key4 + '\n' +
			'Key5=' + this.iniData.keyboard.Key5 + '\n' +
			'Key6=' + this.iniData.keyboard.Key6 + '\n' +
			'Key7=' + this.iniData.keyboard.Key7 + '\n' +
			'Key8=' + this.iniData.keyboard.Key8 + '\n' +
			'Key9=' + this.iniData.keyboard.Key9 + '\n' +
			'KeyA=' + this.iniData.keyboard.KeyA + '\n' +
			'KeyB=' + this.iniData.keyboard.KeyB + '\n' +
			'KeyC=' + this.iniData.keyboard.KeyC + '\n' +
			'KeyD=' + this.iniData.keyboard.KeyD + '\n' +
			'KeyE=' + this.iniData.keyboard.KeyE + '\n' +
			'\n[Sound]\n' +
			'Device=' + this.iniData.sound.Device + '\n' +
			'SEvol=' + this.iniData.sound.SEvol + '\n' +
			'BGMvol=' + this.iniData.sound.BGMvol + '\n' +
			'\n[Data]\n' +
			'Complete=' + this.iniData.data.Complete + '\n' +
			'Data00=' + this.iniData.data.Data00 + '\n' +
			'Data01=' + this.iniData.data.Data01 + '\n' +
			'Data02=' + this.iniData.data.Data02 + '\n' +
			'Data03=' + this.iniData.data.Data03 + '\n' +
			'Data10=' + this.iniData.data.Data10;
		
		// Check if wizard is running
		if (R3.wizard.running === !0){
			
			// Save file
			R3.modules.fs.writeFileSync(R3.wizard.settings.modPath + '/Assets/Bio3.ini', iniFile, {
				encoding: 'utf8'
			});
		
		} else {
		
			// Save prompt
			R3.system.saveFile('Bio3.ini', '.ini', iniFile, 'utf-8', function(){
				R3.system.log.add('INFO: Save sucessfull!');
			});
		
		}
	}

}