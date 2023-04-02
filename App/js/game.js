/*
	*******************************************************************************
	R3ditor V3 - game.js
	By TheMitoSan

	This file is responsible for handling game execution and it's location
	*******************************************************************************
*/

tempFn_GAME	= {

	// Run game
	run: function(mode){
		if (R3.modules.fs.existsSync(R3.settings.list.paths.re3Path) === !0 && R3.modules.fs.existsSync(R3.settings.list.paths.mercePath) === !0){

			switch (mode){

				// Main Game (Mod)
				case 'mod':
					R3.system.external.run(R3.mod.paths.mainGame, {
						mainGame: !0,
						chdir: R3.mod.paths.assets
					});
					break;

				// Mercenaries
				case 'merce':
					R3.system.external.run(R3.mod.paths.merce, {
						mainGame: !0,
						chdir: R3.tools.getFilePath(R3.settings.list.paths.mercePath, '.exe')
					});
					break;

				// Mercenaries (Mod)
				case 'merceMod':
					R3.system.external.run(R3.mod.paths.merce, {
						mainGame: !0,
						chdir: R3.mod.paths.assets
					});
					break;

				// Main game (Default)
				default:
					R3.system.external.run(R3.settings.list.paths.re3Path, {
						mainGame: !0,
						chdir: R3.tools.getFilePath(R3.settings.list.paths.re3Path, '.exe')
					});
					break;
			}

		}
	}

}