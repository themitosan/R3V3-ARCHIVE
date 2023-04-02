/*
	*******************************************************************************
	R3ditor V3 - menubar.js
	By TheMitoSan

	This file is responsible for creating and managing main menubar and it's 
	contents.
	*******************************************************************************
*/
tempFn_design_menuBar = {

	mainMenu: void 0,

	// Update menubar
	update: function(menuJson){

		const appendMenu = function(jsonData){
			
			var subMenu = new nw.Menu({type: 'menubar'});

			Object.keys(jsonData).forEach(function(cItem){
				var cMenu = jsonData[cItem],
					cKey = cMenu.key,
					cName = cMenu.name,
					cType = cMenu.type,
					cMod = cMenu.modifiers,
					cAction = cMenu.action,
					cEnabled = cMenu.enabled;

				if (cKey === void 0){
					cKey = '';
				}

				if (cMod === void 0){
					cMod = '';
				}

				if (cName === void 0){
					cName = '';
				}

				if (cType === void 0){
					cType = 'normal';
				}

				if (cAction === void 0){
					cAction = function(){};
				}

				if (cEnabled === void 0){
					cEnabled = !0;
				}

				subMenu.append(new nw.MenuItem({label: cName, click: cAction, type: cType, enabled: cEnabled, key: cKey, modifiers: cMod}));
			});
			return subMenu;
		};

		R3.design.menuBar.mainMenu = new nw.Menu({type: 'menubar'});

		Object.keys(menuJson).forEach(function(cItem){
			var cSub = {}, cMenu = menuJson[cItem],
				cName = cMenu.name,
				cHide = cMenu.hide,
				cIcon = cMenu.iconPath,
				cAction = cMenu.action,
				cEnabled = cMenu.enabled;

			if (cIcon === void 0){
				cIcon = '';
			}

			if (cName === void 0){
				cName = '';
			}

			if (cMenu.sub !== void 0){
				cSub = appendMenu(cMenu.sub);
			}

			if (cAction === void 0){
				cAction = function(){};
			}

			if (cEnabled === void 0){
				cEnabled = !0;
			}

			if (cHide === void 0){
				cHide = !1;
			}

			// End
			if (cHide !== !0){
				R3.design.menuBar.mainMenu.append(new nw.MenuItem({ icon: cIcon, label: cName, submenu: cSub, click: cAction, enabled: cEnabled }));
			}
		});

		// End
		R3.modules.win.menu = R3.design.menuBar.mainMenu;
		R3.design.menuBar.mainMenu = void 0;

	},
	
	// Hide menubar
	hide: function(){
		R3.modules.win.menu = null;
	},

	// Update main menu
	updateMainMenu: function(){

		// Mod Settings
		this.menuList.mainMenu[1].sub[3].enabled = R3.mod.loaded;
		
		// Close Mod
		this.menuList.mainMenu[1].sub[4].enabled = R3.mod.loaded;
		
		// Map List
		this.menuList.mainMenu[2].sub[6].enabled = R3.mod.loaded;
		
		// Run RE3
		this.menuList.mainMenu[4].sub[0].enabled = R3.modules.fs.existsSync(R3.settings.list.paths.re3Path);
		
		// Run RE3 (Mod)
		this.menuList.mainMenu[4].sub[1].enabled = R3.modules.fs.existsSync(R3.settings.list.paths.re3Path) && R3.mod.loaded === !0;
		
		// Run MERCE
		this.menuList.mainMenu[4].sub[3].enabled = R3.modules.fs.existsSync(R3.settings.list.paths.mercePath);
		
		// Run MERCE (Mod)
		this.menuList.mainMenu[4].sub[4].enabled = R3.modules.fs.existsSync(R3.settings.list.paths.mercePath) && R3.mod.loaded === !0;

		/*
			End
		*/
		this.update(this.menuList.mainMenu);

	},

	/*
		Menu list
	*/
	menuList: {
		// Main menu
		mainMenu: {
			0: {
				name: 'App',
				sub: {
					0: {
						name: 'Reload',
						action: function(){ R3.system.reload(); }
					},
					1: {
						name: 'Exit R3V3',
						action: function(){ nw.App.quit(); }
					}
				}
			},
			1: {
				name: 'Mod',
				sub: {
					0: {
						name: 'New Mod (Wizard)',
						action: function(){ R3.wizard.open(); }
					},
					1: {
						name: 'Open Mod',
						action: function(){ R3.mod.open(); }
					},
					2: { type: 'separator' },
					3: {
						enabled: !1,
						name: 'Mod Settings',
						action: function(){
							R3.design.miniwindow.openForm({
								width: 400,
								height: 128,
								disableMax: !0,
								canMinimize: !1,
								showMinimize: !1,
								position: 'center',
								path: 'modSettings',
								title: 'Mod Settings',
								domName: 'modSettings',
								spawnLocation: 'R3_APP_HOLDER',
								postAction: function(){
									R3.mod.renderSettings();
								}
							});
						}
					},
					4: {
						enabled: !1,
						name: 'Close Mod',
						action: function(){	R3.mod.close(!0); }
					}
				}
			},
			2: {
				name: 'Main Tools',
				sub: {
					0: {
						enabled: !0,
						name: 'RDT Editor',
						action: function(){
							R3.RDT.editor.open();
						}
					},
					1: {
						enabled: !1,
						name: 'SCD Editor'
					},
					2: {
						enabled: !0,
						name: 'MSG Editor',
						action: function(){
							R3.MSG.editor.newFile();
						}
					},
					3: {
						enabled: !1,
						name: 'INI Editor'
					},
					4: {
						enabled: !1,
						name: 'SAV Editor'
					},
					5: { type: 'separator' },
					6: {
						key: 'F4',
						enabled: !1,
						name: 'Map List',
						action: function(){
							R3.design.miniwindow.openForm({
								width: 440,
								height: 400,
								disableMax: !0,
								path: 'mapList',
								canMinimize: !1,
								showMinimize: !1,
								title: 'Map List',
								domName: 'mapList',
								position: 'bottom-left',
								spawnLocation: 'R3_APP_HOLDER',
								postAction: function(){
									R3.design.rdt.renderFileList();
								}
							});
						}
					}
				}
			},
			// Current tool options
			3: {
				hide: !0,
				enabled: !1,
				name: 'Tool Options',
				sub : {
					// To be overwritten
				}
			},
			4: {
				name: 'Run',
				sub: {
					0: {
						key: 'F5',
						enabled: !1,
						name: 'Run Resident Evil 3',
						action: function(){ R3.game.run(); }
					},
					1: {
						key: 'F6',
						enabled: !1,
						name: 'Run Resident Evil 3 [Mod]',
						action: function(){ R3.game.run('mod'); }
					},
					2: {type: 'separator'},
					3: {
						key: 'F7',
						enabled: !1,
						name: 'Run Mercenaries',
						action: function(){ R3.game.run('merce'); }
					},
					4: {
						key: 'F8',
						enabled: !1,
						name: 'Run Mercenaries [Mod]',
						action: function(){ R3.game.run('merceMod'); }
					}
				}
			},
			5: {
				name: 'Settings',
				sub: {
					0: {
						key: 'F11',
						name: 'R3V3 Settings',
						action: function(){
							R3.design.miniwindow.openForm({
								width: 600,
								height: 300,
								disableMax: !0,
								canMinimize: !1,
								showMinimize: !1,
								path: 'settings',
								position: 'center',
								title: 'R3V3 Settings',
								domName: 'appSettings',
								spawnLocation: 'R3_APP_HOLDER',
								postAction: function(){
									R3.settings.renderSettings();
								}
							});
						}
					},
					1: { type: 'separator' },
					2: {
						name: 'Open R3V3 Log',
						action: function(){ R3.system.log.open(); }
					},
					3: {
						key: 'F12',
						name: 'Open DevTools',
						action: function(){ R3.modules.win.showDevTools(); }
					},
					4: { type: 'separator' },
					5: {
						key: 'F10',
						enabled: !0,
						name: 'Backup Manager',
						action: function(){ R3.system.backupManager.openForm(); }
					},
					6: { type: 'separator' },
					7: {
						enabled: !1,
						name: 'Check for updates',
						action: function(){ R3.system.wip(); }
					}
				}
			},
			6: {
				name: 'Window',
				sub: {
					0: {
						name: 'Minimize all windows',
						action: function(){ R3.design.miniwindow.minimizeAll(); }
					},
					1: {
						name: 'Close all windows',
						action: function(){ R3.design.miniwindow.closeAll(); }
					}
				}
			},
			7: {
				name: 'About',
				sub: {
					0: {
						key: 'F1',
						enabled: !1,
						name: 'Help Center',
						action: function(){ R3.system.wip(); }
					},
					1: { type: 'separator' },
					2: {
						name: 'About External Sources / API',
						action: function(){
							R3.design.miniwindow.openForm({
								width: 408,
								height: 320,
								disableMax: !0,
								canMinimize: !1,
								showMinimize: !1,
								position: 'center',
								domName: 'appAboutAPI',
								path: 'externalSources',
								class: 'R3V3_EXTERNAL_BG',
								spawnLocation: 'R3_APP_HOLDER',
								title: 'About External Sources / API',
							});
						}
					},
					3: {
						name: 'About R3V3',
						action: function(){
							R3.design.miniwindow.openForm({
								width: 368,
								height: 310,
								path: 'about',
								disableMax: !0,
								canMinimize: !1,
								showMinimize: !1,
								position: 'center',
								title: 'About R3V3',
								domName: 'appAbout',
								spawnLocation: 'R3_APP_HOLDER',
								postAction: function(){
									document.getElementById('R3V3_ABOUT_VERSION').innerHTML = R3.build.version + ' [' + R3.build.status + ']';
								}
							});
						}
					}
				}
			}
		}
	}
};