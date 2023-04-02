/*
	**************************************************************************************

		TMS.js - By TemmieHeartz (@temmieheartz)

		This file is an original replacement - Because I don't want to deal with jQuery
		anymore!

		Original source / motivation: http://youmightnotneedjquery.com/

	**************************************************************************************
*/

tmsTemp = {};
tmsTemp['logWarnings'] = !1;

/*
	Warn if something goes wrong
*/
tmsTemp['warn'] = function(warnText){
	if (TMS.logWarnings === !0){
		console.warn(warnText);
	}
}

/*
	Get element
*/
tmsTemp['getElement'] = function(elementId){
	var res = document.getElementById(elementId);
	if (res === null){
		res = document.getElementsByTagName(elementId)[0];
	}
	if (res === void 0){
		res = null;
	}
	return res;
}
/*
	CSS
*/
tmsTemp['css'] = function(elementId, cssChanges){
	var eReason = '',
		canStart = !0,
		elId = TMS.getElement(elementId);
	if (elId === null){
		canStart = !1;
		eReason = eReason + '\nDOM or Tag does not exist! (' + elementId + ')';
	}
	if (typeof cssChanges !== 'object'){
		canStart = !1;
		eReason = eReason + '\nYou must insert an object for CSS data (Current type: ' + typeof cssChanges + ')';
	}
	// End
	if (canStart === !0){
		Object.keys(cssChanges).forEach(function(cItem){
			elId.style[cItem] = cssChanges[cItem];
		});
	} else {
		TMS.warn('TMS - Unable to apply CSS data!' + eReason);
	}
}
/*
	Animate

	elementId     = HTML DOM id
	cssChanges    = Object {width: x, height, y}
	animationTime = Number (Min: 0)
	animationEase = CSS for transition option, like cubic-bezier
*/
tmsTemp['animate'] = function(elementId, cssChanges, animationTime, animationEase){
	var canStart = !0, eReason = transitionString = '';
	const elId = TMS.getElement(elementId);
	if (elId === null){
		canStart = !1;
		eReason = eReason + '\nDOM does not exist! (' + elementId + ')';
	}
	if (typeof cssChanges !== 'object'){
		canStart = !1;
		eReason = eReason + '\nYou must insert an object for CSS data (Current type: ' + typeof cssChanges + ')';
	}
	if (typeof animationTime !== 'number'){
		canStart = !1;
		eReason = eReason + '\nYou must insert a number on animation time (Current type: ' + typeof animationTime + ')';
	}
	// End
	if (canStart === !0){
		if (animationEase === void 0){
			animationEase = '';
		}
		if (animationTime < 0){
			animationTime = 0;
		}
		Object.keys(cssChanges).forEach(function(cItem){
			elId.style[cItem] = cssChanges[cItem];
			transitionString = transitionString + cItem + ' ' + (animationTime / 1000) + 's ';
			elId.style['transition'] = transitionString + animationEase;
		});
		setTimeout(function(){
			elId.style['transition'] = 'none 0s';
		}, (animationTime + 1));
	} else {
		TMS.warn('TMS - Unable to animate!' + eReason);
	}
}
/*
	Focus Element
	sTimeout = time [ms]
*/
tmsTemp['focus'] = function(elementId, sTimeout){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		if (sTimeout !== void 0 && parseInt(sTimeout) !== NaN){
			setTimeout(function(){
				elId.focus();
			}, sTimeout);
		} else {
			elId.focus();
		}
	} else {
		TMS.warn('TMS - Unable to focus element because it does not exist! (' + elementId + ')');
	}
}
/*
	Disable Element
*/
tmsTemp['disableElement'] = function(idList){
	var disableList = [];
	if (typeof idList === 'object'){
		disableList = idList;
	} else {
		disableList.push(idList);
	}
	// End
	disableList.forEach(function(cItem){
		const elId = TMS.getElement(elementId);
		if (elId !== null){
			elId.disabled = 'disabled';
			// If is <input>
			if (elId.type === 'button'){
				TMS.css(cItem, {'filter': 'grayscale(1) blur(0.8px)', 'cursor': 'not-allowed', 'opacity': '0.6'});
			}
		} else {
			TMS.warn('TMS - Unable to disable element because it does not exist! (' + cItem + ')');
		}
	});
}
/*
	Enable Element
*/
tmsTemp['enableElement'] = function(elementId){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		elId.disabled = '';
		if (elId.type === 'button'){
			TMS.css(elementId, {'filter': 'grayscale(0) blur(0px)', 'cursor': 'pointer', 'opacity': '1'});
		}
	} else {
		TMS.warn('TMS - Unable to enable element because it does not exist! (' + elementId + ')');
	}
}
/*
	Get CSS data
	Returns the attr value from CSS propriety
*/
tmsTemp['getCssData'] = function(elementId, cssAttrName){
	var result = '',
		elId = TMS.getElement(elementId);
	if (elId !== null){
		result = elId.style[cssAttrName];
		// Get computed style
		if (result === ''){
			result = window.getComputedStyle(elId)[cssAttrName];
		}
		// Get from DOM
		if (result === void 0){
			result = elId[cssAttrName];
		}
	} else {
		TMS.warn('TMS - Unable to get element because it does not exist! (' + elementId + ')');
	}
	return result;
}
/*
	Scroll top
	Usage: elementObjects = {HTML_DOM_ID_0: scrollInt, HTML_DOM_ID_1: scrollInt2} and goes on
*/
tmsTemp['scrollTop'] = function(elementObjects){
	Object.keys(elementObjects).forEach(function(cItem){
		const elId = TMS.getElement(elementId);
		if (elId !== null){
			elId.scrollTop = elementObjects[cItem];
		} else {
			TMS.warn('TMS - Unable to scroll element because it does not exist! (' + elementId + ')');
		}
	});
}
/*
	Append data
*/
tmsTemp['append'] = function(elementId, newData){
	var elId = TMS.getElement(elementId);
	if (elId !== null){
		elId.insertAdjacentHTML('beforeend', newData);
	} else {
		TMS.warn('TMS - Unable to append element data because parent DOM does not exist! (' + elementId + ')');
	}
}
/*
	Add Class
*/
tmsTemp['addClass'] = function(elementId, className){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		elId.classList.add(className);
	} else {
		TMS.warn('TMS - Unable to add class because DOM does not exist! (' + elementId + ')');
	}
}
/*
	Add Class
*/
tmsTemp['removeClass'] = function(elementId, className){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		elId.classList.remove(className);
	} else {
		TMS.warn('TMS - Unable to remove class because DOM does not exist! (' + elementId + ')');
	}
}
/*
	Clear
	Removes all HTML inside
*/
tmsTemp['clear'] = function(elementId){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		elId.innerHTML = '';
	} else {
		TMS.warn('TMS - Unable to clear inner data because DOM does not exist! (' + elementId + ')');
	}
}
/*
	triggerClick
*/
tmsTemp['triggerClick'] = function(elementId){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		elId.click();
	} else {
		TMS.warn('TMS - Unable to clear inner data because DOM does not exist! (' + elementId + ')');
	}
}
/*
	fadeIn
*/
tmsTemp['fadeIn'] = function(elementId, animationTime){
	const elId = TMS.getElement(elementId), 
		tagType = {
		'DIV': 'block',
		'IMG': 'inline'
	}
	if (elId !== null){
		var dTime = 1000, dMode = 'block', finalOpacity = 1, eStyles = getComputedStyle(elId);
		if (animationTime !== void 0 && animationTime !== NaN){
			dTime = parseInt(animationTime);
			if (dTime < 0){
				dTime = 1;
			}
		}
		if (tagType[elId.tagType] !== void 0){
			dMode = tagType[elId.tagType];
		}
		if (eStyles.opacity !== ''){
			finalOpacity = eStyles.opacity;
		}
		TMS.css(elementId, {'display': dMode, 'opacity': finalOpacity, 'transition': 'opacity ' + dTime + 'ms'});
		setTimeout(function(){
			TMS.css(elementId, {'transition': 'none'});
		}, (dTime + 1));
	} else {
		TMS.warn('TMS - Unable to fade in because DOM does not exist! (' + elementId + ')');
	}
}
/*
	fadeOut
*/
tmsTemp['fadeOut'] = function(elementId, animationTime){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		var dTime = 1000;
		if (animationTime !== void 0 && animationTime !== NaN){
			dTime = parseInt(animationTime);
			if (dTime < 0){
				dTime = 1;
			}
		}
		TMS.css(elementId, {'opacity': '0', 'transition': 'opacity ' + dTime + 'ms'});
		setTimeout(function(){
			TMS.css(elementId, {'transition': 'none', 'display': 'none'});
		}, (dTime + 1));
	} else {
		TMS.warn('TMS - Unable to fade out because DOM does not exist! (' + elementId + ')');
	}
}
/*
	scrollCenter
*/
tmsTemp['scrollCenter'] = function(elementId, delay){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		var parentDom = elId.parentElement,
			parentHeight = parentDom.offsetHeight,
			elHeight = parseFloat(window.getComputedStyle(elId).height.replace('px', ''));
		if (delay === void 0){
			delay = 0;
		}
		setTimeout(function(){
			parentDom.scrollTo(0, (elId.offsetTop - ((parentHeight / 2) - (elHeight / 2))));
		}, delay);
	} else {
		TMS.warn('TMS - Unable to scroll because DOM does not exist! (' + elementId + ')');
	}
}
/*
	setInnerHtml
*/
tmsTemp['setInnerHtml'] = function(elementId, htmlData){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		document.getElementById(elementId).innerHTML = htmlData;
	} else {
		TMS.warn('TMS - Unable to set innerHTML because DOM does not exist! (' + elementId + ')');
	}
}
/*
	Remove HTML DOM
*/
tmsTemp['removeDOM'] = function(elementId){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		document.getElementById(elementId).remove();
	} else {
		TMS.warn('TMS - Unable to remove DOM because DOM does not exist! (' + elementId + ')');
	}
}
/*
	On document loaded
*/
tmsTemp['onReady'] = function(callback){
	if (callback !== void 0){
		if (document.readyState !== 'loading'){
			callback();
		} else {
			document.addEventListener('DOMContentLoaded', callback);
		}
	}
}
/*
	Blur element
*/
tmsTemp['blur'] = function(elementId){
	const elId = TMS.getElement(elementId);
	if (elId !== null){
		document.getElementById(elementId).blur();
	} else {
		TMS.warn('TMS - Unable to blur DOM because DOM does not exist! (' + elementId + ')');
	}
}
/*
	Get HTML child count
*/
tmsTemp['getChildCount'] = function(elementId){
	var res = 0,
		elId = TMS.getElement(elementId);
	if (elId !== null){
		res = document.getElementById(elementId).childElementCount;
		if (res < 0){
			res = 0;
		}
		return res;
	} else {
		TMS.warn('TMS - Unable to get html collection because DOM does not exist! (' + elementId + ')');
	}
}
/*
	Get HTML element rect
*/
tmsTemp['getRect'] = function(elementId){
	var elId = TMS.getElement(elementId);
	if (elId !== null){
		return document.getElementById(elementId).getBoundingClientRect();
	} else {
		TMS.warn('TMS - Unable to get rect because DOM does not exist! (' + elementId + ')');
	}
}
/*
	END
*/
const TMS = tmsTemp;
Object.seal(Object.freeze(TMS));
delete tmsTemp;