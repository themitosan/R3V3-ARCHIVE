/*
	*******************************************************************************
	R3ditor V3 - tools.js
	By TheMitoSan

	This file is responsible for all tools for general data manipulation, some 
	angry-sassylike comments and more.
	*******************************************************************************
*/

tempFn_TOOLS = {

	/*
		Fix Undefined

		Checks if value are undefined. If so, it will return default value.
		It could be solved with a single-line check:

		"if (mainVar === void 0) res = defaultVal;"

		But... I don't know about you but I feel 400% unconfortable doing it like this!
	*/
	fixUndefined: function(mainVar, defaultVal){
		var res = mainVar;
		if (res === void 0){
			res = defaultVal;
		}
		return res;
	},

	// Get file size
	getFileSize: function(filePath, mode){
		
		var res = 0;
		
		if (R3.modules.fs.existsSync(filePath) === !0){
			
			// Get status from file
			const read = R3.modules.fs.statSync(filePath);

			switch (mode) {

				// Bytes
				case 'bytes':
					res = read.size; 
					break;

				// KB
				case 'kb':
					res = parseInt(read.size / 1024);
					break;

				// MB
				case 'mb':
					res = read.size / 1000000.0;
					break;

				// Bytes (Default)
				default: 
					res = read.size;
					break;

			}

		}

		return res;
	},

	// Get file extension
	getFileExtension: function(file){
		var res = '';
		if (file !== '' && file !== void 0){
			res = R3.modules.path.extname(file).slice(1);
		}
		return res;
	},

	// Format hex values to string properly 
	solveHex: function(hex){
		var res = '';
		if (hex !== '' && hex !== void 0){
			res = hex.replace(new RegExp(' ', 'g'), '').toLowerCase();
		}
		return res;
	},

	// Format string as hex
	unsolveHex: function(hex){
		var res = '';
		if (hex !== void 0){
			res = hex.match(/.{2,2}/g).toString().replace(RegExp(',', 'gi'), ' ').toUpperCase();
		}
		return res;
	},

	// Get file name
	getFilePath: function(fileName){
		var res = '';
		if (fileName !== void 0 && fileName !== ''){
			res = R3.tools.fixPath(R3.modules.path.dirname(fileName));
		}
		return res;
	},

	// Fix paths
	fixPath: function(path){
		var res = '';
		if (path !== void 0 && path !== ''){
			res = path.replace(new RegExp('\\\\', 'gi'), '/');
		}
		return res;
	},

	// Get file name
	getFileName: function(filePath){
		var res = '';
		if (filePath !== void 0){
			res = R3.modules.path.basename(filePath).replace(R3.modules.path.extname(filePath), '');
		}
		return res;
	},

	// Parse percentage
	parsePercentage: function(current, maximum){
		var res = 0;
		if (current !== void 0 && maximum !== void 0){
			res = Math.floor((current / maximum) * 100);
		};
		return res;
	},

	// Get random number
	getRandom: function(maximum){
		var res = Math.random();
		if (maximum !== void 0){
			res = parseInt(Math.floor(Math.random() * parseInt(maximum)));
		}
		return res;
	},

	// Parse string from Endian
	parseEndian: function(str){
		var res = '';
		if (str !== void 0 && str !== ''){
			res = str.toString().match(/.{2,2}/g).reverse().toString().replace(RegExp(',', 'gi'), '');
		}
		return res;
	},

	// Fix values
	fixVars: function(inp, v){

		var c = 0, inp, size;

		if (inp === void 0 || inp === ''){
			input = '00';
		} else {
			input = inp.toString();
		}

		if (v === void 0 || v === ''){
			size = 2;
		} else {
			size = parseInt(v);
		}

		if (input.length < size){
			while (input.length !== size){
				input = '0' + input;
			}
		} else {
			if (input.length !== size && input.toString().length > size){
				input = input.slice(0, v);
			}
		}

		return input;
	},

	// Parse array values to string
	arrayToString: function(arrayValue){
		var res = '';
		if (arrayValue !== void 0){
			res = arrayValue.toString().replace(RegExp(',', 'gi'), '');
		}
		return res;
	}
	
}