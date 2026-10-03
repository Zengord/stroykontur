//#region node_modules/inputmask/lib/defaults.js
var defaults_default = {
	_maxTestPos: 500,
	placeholder: "_",
	optionalmarker: ["[", "]"],
	quantifiermarker: ["{", "}"],
	groupmarker: ["(", ")"],
	alternatormarker: "|",
	escapeChar: "\\",
	mask: null,
	regex: null,
	oncomplete: () => {},
	onincomplete: () => {},
	oncleared: () => {},
	repeat: 0,
	greedy: false,
	autoUnmask: false,
	removeMaskOnSubmit: false,
	clearMaskOnLostFocus: true,
	insertMode: true,
	insertModeVisual: true,
	clearIncomplete: false,
	alias: null,
	onKeyDown: () => {},
	onBeforeMask: null,
	onBeforePaste: function(pastedValue, opts) {
		return typeof opts.onBeforeMask === "function" ? opts.onBeforeMask.call(this, pastedValue, opts) : pastedValue;
	},
	onBeforeWrite: null,
	onUnMask: null,
	outputMask: null,
	showMaskOnFocus: true,
	showMaskOnHover: true,
	onKeyValidation: () => {},
	skipOptionalPartCharacter: " ",
	numericInput: false,
	rightAlign: false,
	undoOnEscape: true,
	radixPoint: "",
	_radixDance: false,
	groupSeparator: "",
	keepStatic: null,
	positionCaretOnTab: true,
	tabThrough: false,
	supportsInputType: [
		"text",
		"tel",
		"url",
		"password",
		"search"
	],
	isComplete: null,
	preValidation: null,
	postValidation: null,
	staticDefinitionSymbol: void 0,
	jitMasking: false,
	nullable: true,
	inputEventOnly: false,
	noValuePatching: false,
	positionCaretOnClick: "lvp",
	casing: null,
	inputmode: "text",
	importDataAttributes: true,
	shiftPositions: true,
	usePrototypeDefinitions: true,
	validationEventTimeOut: 3e3,
	substitutes: {}
};
//#endregion
//#region node_modules/inputmask/lib/definitions.js
var definitions_default = {
	9: {
		validator: "\\p{N}",
		definitionSymbol: "*"
	},
	a: {
		validator: "\\p{L}",
		definitionSymbol: "*"
	},
	"*": { validator: "[\\p{L}\\p{N}]" }
};
var window_default = !!(typeof window !== "undefined" && window.document && window.document.createElement) ? window : {};
//#endregion
//#region node_modules/inputmask/lib/dependencyLibs/data.js
function data_default(owner, key, value) {
	if (value === void 0) return owner.__data ? owner.__data[key] : null;
	else {
		owner.__data = owner.__data || {};
		owner.__data[key] = value;
	}
}
//#endregion
//#region node_modules/inputmask/lib/dependencyLibs/extend.js
function extend() {
	let options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[i] || {};
		i++;
	}
	if (typeof target !== "object" && typeof target !== "function") target = {};
	for (; i < length; i++) if ((options = arguments[i]) != null) for (name in options) {
		src = target[name];
		copy = options[name];
		if (target === copy) continue;
		if (deep && copy && (Object.prototype.toString.call(copy) === "[object Object]" || (copyIsArray = Array.isArray(copy)))) {
			if (copyIsArray) {
				copyIsArray = false;
				clone = src && Array.isArray(src) ? src : [];
			} else clone = src && Object.prototype.toString.call(src) === "[object Object]" ? src : {};
			target[name] = extend(deep, clone, copy);
		} else if (copy !== void 0) target[name] = copy;
	}
	return target;
}
//#endregion
//#region node_modules/inputmask/lib/dependencyLibs/events.js
var document$3 = window_default.document;
function isValidElement(elem) {
	return elem instanceof Element && data_default(elem, "events");
}
var Evnt;
if (typeof window_default.CustomEvent === "function") Evnt = window_default.CustomEvent;
else if (window_default.Event && document$3 && document$3.createEvent) {
	Evnt = function(event, params) {
		params = params || {
			bubbles: false,
			cancelable: false,
			composed: true,
			detail: void 0
		};
		const evt = document$3.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};
	Evnt.prototype = window_default.Event.prototype;
} else if (typeof Event !== "undefined") Evnt = Event;
function on(events, handler) {
	if (!this[0] || !isValidElement(this[0])) return this;
	const elem = this[0], eventRegistry = data_default(elem, "events"), addEvent = (ev, namespace) => {
		if (elem.addEventListener) elem.addEventListener(ev, handler, false);
		else if (elem.attachEvent) elem.attachEvent(`on${ev}`, handler);
		eventRegistry[ev] = eventRegistry[ev] || {};
		eventRegistry[ev][namespace] = eventRegistry[ev][namespace] || [];
		eventRegistry[ev][namespace].push(handler);
	};
	events.split(" ").forEach((event) => {
		const [ev, namespace = "global"] = event.split(".");
		addEvent(ev, namespace);
	});
	return this;
}
function off(events, handler) {
	let eventRegistry, elem;
	function removeEvent(ev, namespace, handler) {
		if (ev in eventRegistry === true) {
			if (elem.removeEventListener) elem.removeEventListener(ev, handler, false);
			else if (elem.detachEvent) elem.detachEvent(`on${ev}`, handler);
			if (namespace === "global") for (const nmsp in eventRegistry[ev]) eventRegistry[ev][nmsp].splice(eventRegistry[ev][nmsp].indexOf(handler), 1);
			else eventRegistry[ev][namespace].splice(eventRegistry[ev][namespace].indexOf(handler), 1);
		}
	}
	function resolveNamespace(ev, namespace) {
		const evts = [];
		let hndx, hndL;
		if (ev.length > 0) {
			const namespaces = namespace ? [namespace] : Object.keys(eventRegistry[ev]);
			for (let nsi = 0; nsi < namespaces.length; nsi++) {
				namespace = namespaces[nsi];
				if (handler === void 0) for (hndx = 0, hndL = eventRegistry[ev][namespace]?.length || 0; hndx < hndL; hndx++) evts.push({
					ev,
					namespace,
					handler: eventRegistry[ev][namespace][hndx]
				});
				else evts.push({
					ev,
					namespace,
					handler
				});
			}
		} else if (namespace.length > 0) {
			for (const evNdx in eventRegistry) if (eventRegistry[evNdx][namespace]) {
				if (handler === void 0) for (hndx = 0, hndL = eventRegistry[evNdx][namespace].length; hndx < hndL; hndx++) evts.push({
					ev: evNdx,
					namespace,
					handler: eventRegistry[evNdx][namespace][hndx]
				});
				else evts.push({
					ev: evNdx,
					namespace,
					handler
				});
			}
		}
		return evts;
	}
	if (isValidElement(this[0])) {
		eventRegistry = data_default(this[0], "events");
		elem = this[0];
		events = events || Object.keys(eventRegistry).join(" ");
		if (events !== "") events.split(" ").forEach((event) => {
			const [ev, namespace] = event.split(".");
			resolveNamespace(ev, namespace).forEach(({ ev: ev1, handler: handler1, namespace: namespace1 }) => {
				removeEvent(ev1, namespace1, handler1);
			});
		});
	}
	return this;
}
function trigger(events) {
	if (isValidElement(this[0])) {
		const eventRegistry = data_default(this[0], "events"), elem = this[0], _events = typeof events === "string" ? events.split(" ") : [events.type];
		for (let endx = 0; endx < _events.length; endx++) {
			const nsEvent = _events[endx].split("."), ev = nsEvent[0], namespace = nsEvent[1] || "global";
			if (document$3 !== void 0) {
				let evnt;
				const params = {
					bubbles: true,
					cancelable: true,
					composed: true,
					detail: arguments[1]
				};
				if (document$3.createEvent) {
					try {
						switch (ev) {
							case "input":
								params.inputType = "insertText";
								evnt = new InputEvent(ev, params);
								break;
							default: evnt = new CustomEvent(ev, params);
						}
					} catch (e) {
						evnt = document$3.createEvent("CustomEvent");
						evnt.initCustomEvent(ev, params.bubbles, params.cancelable, params.detail);
					}
					if (events.type) extend(evnt, events);
					elem.dispatchEvent(evnt);
				} else {
					evnt = document$3.createEventObject();
					evnt.eventType = ev;
					evnt.detail = arguments[1];
					if (events.type) extend(evnt, events);
					elem.fireEvent("on" + evnt.eventType, evnt);
				}
			} else if (eventRegistry[ev] !== void 0) {
				arguments[0] = arguments[0].type ? arguments[0] : DependencyLib.Event(arguments[0]);
				arguments[0].detail = arguments.slice(1);
				const registry = eventRegistry[ev];
				(namespace === "global" ? Object.values(registry).flat() : registry[namespace]).forEach((handler) => handler.apply(elem, arguments));
			}
		}
	}
	return this;
}
//#endregion
//#region node_modules/inputmask/lib/dependencyLibs/inputmask.dependencyLib.js
var document$2 = window_default.document;
function DependencyLib(elem) {
	if (elem instanceof DependencyLib) return elem;
	if (!(this instanceof DependencyLib)) return new DependencyLib(elem);
	if (elem !== void 0 && elem !== null && elem !== window_default) {
		this[0] = elem.nodeName ? elem : elem[0] !== void 0 && elem[0].nodeName ? elem[0] : document$2.querySelector(elem);
		if (this[0] !== void 0 && this[0] !== null) data_default(this[0], "events", data_default(this[0], "events") || {});
	}
}
DependencyLib.prototype = {
	on,
	off,
	trigger
};
DependencyLib.extend = extend;
DependencyLib.data = data_default;
DependencyLib.Event = Evnt;
//#endregion
//#region node_modules/inputmask/lib/environment.js
var ua = window_default.navigator && window_default.navigator.userAgent || "";
var ie = ua.indexOf("MSIE ") > 0 || ua.indexOf("Trident/") > 0;
var mobile = !!(navigator.userAgentData?.mobile ?? ((matchMedia("(pointer:coarse)").matches || navigator.maxTouchPoints) && innerWidth <= 1024 || /Mobi|Android|iPhone/i.test(ua)));
var iphone = /iphone/i.test(ua);
//#endregion
//#region node_modules/inputmask/lib/keycode.js
var keyCode = {
	c: 67,
	x: 88,
	z: 90,
	BACKSPACE_SAFARI: 127,
	Enter: 13,
	Meta_LEFT: 91,
	Meta_RIGHT: 92,
	Space: 32,
	Alt: 18,
	AltGraph: 18,
	ArrowDown: 40,
	ArrowLeft: 37,
	ArrowRight: 39,
	ArrowUp: 38,
	Backspace: 8,
	CapsLock: 20,
	Control: 17,
	ContextMenu: 93,
	Dead: 221,
	Delete: 46,
	End: 35,
	Escape: 27,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	Home: 36,
	Insert: 45,
	NumLock: 144,
	PageDown: 34,
	PageUp: 33,
	Pause: 19,
	PrintScreen: 44,
	Process: 229,
	Shift: 16,
	ScrollLock: 145,
	Tab: 9,
	Unidentified: 229
};
Object.entries(keyCode).reduce((acc, [key, value]) => (acc[value] = acc[value] === void 0 ? key : acc[value], acc), {});
var keys = Object.entries(keyCode).reduce((acc, [key, value]) => (acc[key] = key === "Space" ? " " : key, acc), {});
//#endregion
//#region node_modules/inputmask/lib/validation-tests.js
function getLocator(tst, align) {
	let locator = (tst.alternation != void 0 ? tst.mloc[`${getDecisionTaker(tst)}:${tst.alternation}`] || tst.locator : tst.locator).join("");
	if (locator !== "") {
		locator = locator.split(":")[0];
		while (locator.length < align) locator += "0";
	}
	return locator;
}
function getDecisionTaker(tst) {
	let decisionTaker = tst.locator[tst.alternation];
	if (typeof decisionTaker === "string" && decisionTaker.length > 0) decisionTaker = decisionTaker.split(",").sort((a, b) => a - b)[0];
	return decisionTaker !== void 0 ? decisionTaker.toString() : "";
}
function getPlaceholder(pos, test, returnPL) {
	const inputmask = this, opts = this.opts, maskset = this.maskset;
	test = test || getTest.call(inputmask, pos).match;
	if (test.placeholder !== void 0 || returnPL === true) {
		if (test.placeholder !== "" && test.static === true && test.generated !== true) {
			const lvp = getLastValidPosition.call(inputmask, pos), nextPos = seekNext.call(inputmask, lvp);
			return (returnPL ? pos <= nextPos : pos < nextPos) ? casing.call(inputmask, opts.staticDefinitionSymbol && test.static ? test.nativeDef : test.def, test, pos) : typeof test.placeholder === "function" ? test.placeholder(opts) : test.placeholder;
		} else return typeof test.placeholder === "function" ? test.placeholder(opts) : test.placeholder;
	} else if (test.static === true) {
		if (pos > -1 && maskset.validPositions[pos] === void 0) {
			let tests = getTests.call(inputmask, pos), staticAlternations = [], prevTest;
			if (typeof opts.placeholder === "string" && tests.length > 1 + (tests[tests.length - 1].match.def === "" ? 1 : 0)) {
				for (let i = 0; i < tests.length; i++) if (tests[i].match.def !== "" && tests[i].match.optionality !== true && tests[i].match.optionalQuantifier !== true && (tests[i].match.static === true || prevTest === void 0 || tests[i].match.fn.test(prevTest.match.def, maskset, pos, true, opts) !== false)) {
					staticAlternations.push(tests[i]);
					if (tests[i].match.static === true) prevTest = tests[i];
					if (staticAlternations.length > 1) {
						if (/[0-9a-zA-Z]/.test(staticAlternations[0].match.def)) return opts.placeholder.charAt(pos % opts.placeholder.length);
					}
				}
			}
		}
		return test.def;
	}
	return typeof opts.placeholder === "object" ? test.def : opts.placeholder.charAt(pos % opts.placeholder.length);
}
function getMaskTemplate(baseOnInput, minimalPos, includeMode, noJit, clearOptionalTail) {
	const inputmask = this, opts = this.opts, maskset = this.maskset, greedy = opts.greedy, maskTemplate = [];
	if (clearOptionalTail && opts.greedy) {
		opts.greedy = false;
		inputmask.maskset.tests = {};
	}
	minimalPos = minimalPos || 0;
	let ndxIntlzr, pos = 0, test, testPos, jitRenderStatic;
	do {
		if (baseOnInput === true && maskset.validPositions[pos]) {
			testPos = clearOptionalTail && maskset.validPositions[pos].match.optionality && maskset.validPositions[pos + 1] === void 0 && (maskset.validPositions[pos].generatedInput === true || maskset.validPositions[pos].input == opts.skipOptionalPartCharacter && pos > 0) ? determineTestTemplate.call(inputmask, pos, getTests.call(inputmask, pos, ndxIntlzr, pos - 1)) : maskset.validPositions[pos];
			test = testPos.match;
			ndxIntlzr = testPos.locator.slice();
			maskTemplate.push(includeMode === true ? testPos.input : includeMode === false ? test.nativeDef : getPlaceholder.call(inputmask, pos, test));
		} else {
			testPos = getTestTemplate.call(inputmask, pos, ndxIntlzr, pos - 1);
			test = testPos.match;
			ndxIntlzr = testPos.locator.slice();
			const jitMasking = noJit === true ? false : opts.jitMasking !== false ? opts.jitMasking : test.jit;
			jitRenderStatic = (jitRenderStatic || maskset.validPositions[pos - 1]) && test.static && test.def !== opts.groupSeparator && test.fn === null;
			if (jitRenderStatic || jitMasking === false || jitMasking === void 0 || typeof jitMasking === "number" && isFinite(jitMasking) && jitMasking > pos) maskTemplate.push(includeMode === false ? test.nativeDef : getPlaceholder.call(inputmask, maskTemplate.length, test));
			else jitRenderStatic = false;
		}
		pos++;
	} while (test.static !== true || test.def !== "" || minimalPos > pos);
	if (maskTemplate[maskTemplate.length - 1] === "") maskTemplate.pop();
	if (includeMode !== false || maskset.maskLength === void 0) maskset.maskLength = pos - 1;
	opts.greedy = greedy;
	return maskTemplate;
}
function getTestTemplate(pos, ndxIntlzr, tstPs) {
	const inputmask = this;
	return this.maskset.validPositions[pos] || determineTestTemplate.call(inputmask, pos, getTests.call(inputmask, pos, ndxIntlzr ? ndxIntlzr.slice() : ndxIntlzr, tstPs));
}
function determineTestTemplate(pos, tests) {
	const inputmask = this, opts = inputmask.opts, optionalityLevel = determineOptionalityLevel(pos, tests);
	pos = pos > 0 ? pos - 1 : 0;
	const longestLocator = Math.max(...tests.map((tst) => tst.locator === void 0 ? 0 : tst.locator.length)), prevLocator = getLocator(getTest.call(inputmask, pos), longestLocator);
	let lenghtOffset = 0, tstLocator, closest, bestMatch;
	if (opts.greedy && tests.length > 1 && tests[tests.length - 1].match.def === "") lenghtOffset = 1;
	for (let ndx = 0; ndx < tests.length - lenghtOffset; ndx++) {
		const tst = tests[ndx];
		tstLocator = getLocator(tst, longestLocator);
		const distance = Number(tstLocator) - Number(prevLocator);
		if (tst.unMatchedAlternationStopped !== true || tests.filter((tst) => tst.unMatchedAlternationStopped !== true).length <= 1) {
			if (closest === void 0 || tstLocator !== "" && distance < closest || bestMatch && !opts.greedy && bestMatch.match.optionality && bestMatch.match.optionality - optionalityLevel > 0 && bestMatch.match.newBlockMarker === "master" && (!tst.match.optionality || tst.match.optionality - optionalityLevel < 1 || !tst.match.newBlockMarker) || bestMatch && !opts.greedy && bestMatch.match.optionalQuantifier && !tst.match.optionalQuantifier) {
				closest = distance;
				bestMatch = tst;
			}
		}
	}
	return bestMatch;
}
function determineOptionalityLevel(pos, tests) {
	let optionalityLevel = 0, differentOptionalLevels = false;
	tests.forEach((test) => {
		if (test.match.optionality) {
			if (optionalityLevel !== 0 && optionalityLevel !== test.match.optionality) differentOptionalLevels = true;
			if (optionalityLevel === 0 || optionalityLevel > test.match.optionality) optionalityLevel = test.match.optionality;
		}
	});
	if (optionalityLevel) {
		if (pos == 0) optionalityLevel = 0;
		else if (tests.length == 1) optionalityLevel = 0;
		else if (!differentOptionalLevels) optionalityLevel = 0;
	}
	return optionalityLevel;
}
function getTest(pos, tests) {
	const inputmask = this, maskset = this.maskset;
	if (maskset.validPositions[pos]) return maskset.validPositions[pos];
	return (tests || getTests.call(inputmask, pos))[0];
}
function isSubsetOf(source, target, opts) {
	function expand(pattern) {
		let expanded = [], start = -1, end;
		for (let i = 0, l = pattern.length; i < l; i++) if (pattern.charAt(i) === "-") {
			end = pattern.charCodeAt(i + 1);
			while (++start < end) expanded.push(String.fromCharCode(start));
		} else {
			start = pattern.charCodeAt(i);
			expanded.push(pattern.charAt(i));
		}
		return expanded.join("");
	}
	if (source.match.def === target.match.nativeDef) return true;
	if ((opts.regex || source.match.fn instanceof RegExp && target.match.fn instanceof RegExp) && source.match.static !== true && target.match.static !== true) {
		if (target.match.fn.source === ".") return true;
		return expand(target.match.fn.source.replace(/[[\]/]/g, "")).indexOf(expand(source.match.fn.source.replace(/[[\]/]/g, ""))) !== -1;
	}
	return false;
}
function getTests(pos, ndxIntlzr, tstPs) {
	let inputmask = this, $ = this.dependencyLib, maskset = this.maskset, opts = this.opts, el = this.el, maskTokens = maskset.maskToken, testPos = ndxIntlzr ? tstPs : 0, ndxInitializer = ndxIntlzr ? ndxIntlzr.slice() : [0], matches = [], insertStop = false, insertStopFromAlternation = false, latestMatch, cacheDependency = ndxIntlzr ? ndxIntlzr.join("") : "", unMatchedAlternation = false;
	function resolveTestFromToken(maskToken, ndxInitializer, loopNdx, quantifierRecurse) {
		function handleMatch(match, loopNdx, quantifierRecurse) {
			function isFirstMatch(latestMatch, tokenGroup) {
				let firstMatch = tokenGroup.matches.indexOf(latestMatch) === 0;
				if (!firstMatch) tokenGroup.matches.every(function(match, ndx) {
					if (match.isQuantifier === true) firstMatch = isFirstMatch(latestMatch, tokenGroup.matches[ndx - 1]);
					else if (Object.prototype.hasOwnProperty.call(match, "matches")) firstMatch = isFirstMatch(latestMatch, match);
					if (firstMatch) {
						if (tokenGroup.matches[ndx + 1] && tokenGroup.matches[ndx + 1].isQuantifier) firstMatch = ndx === 0;
						return false;
					}
					return true;
				});
				return firstMatch;
			}
			function resolveNdxInitializer(pos, alternateNdx, targetAlternation) {
				let bestMatch, distance, locator, newAlternateMloc, alternateMloc = `${alternateNdx}:${targetAlternation}`;
				if (maskset.tests[pos] || maskset.validPositions[pos]) (maskset.validPositions[pos] ? [maskset.validPositions[pos]] : maskset.tests[pos]).every(function(lmnt, ndx) {
					if (lmnt.mloc[alternateMloc]) {
						bestMatch = lmnt;
						return false;
					}
					Object.values(lmnt.mloc).filter((m) => m[targetAlternation] == alternateNdx).every((mlocMatch) => {
						let mlocMatchL = mlocMatch.join("").split(":")[0];
						locator = locator || mlocMatchL;
						while (mlocMatchL.length < locator.length) mlocMatchL += "0";
						const mlocDistance = Number(mlocMatchL);
						if (bestMatch === void 0 || mlocDistance < distance) {
							distance = mlocDistance;
							bestMatch = lmnt;
							newAlternateMloc = Object.entries(lmnt.mloc).find((entry) => entry[1].toString() === mlocMatch.toString())[0];
						}
						return true;
					});
					return true;
				});
				if (bestMatch) {
					if (targetAlternation === void 0) alternateMloc = `${alternateNdx}:${bestMatch.alternation}`;
					const bestMatchAltIndex = `${bestMatch.locator[bestMatch.alternation]}:${bestMatch.alternation}`, slocator = bestMatch.mloc[newAlternateMloc || alternateMloc] || bestMatch.mloc[bestMatchAltIndex] || bestMatch.locator;
					if (slocator[slocator.length - 1].toString().indexOf(":") !== -1) slocator.pop();
					const sliceStart = parseInt(bestMatch.alternation) + 1;
					return slocator.slice(sliceStart);
				} else return targetAlternation !== void 0 ? resolveNdxInitializer(pos, alternateNdx) : void 0;
			}
			function staticCanMatchDefinition(source, target) {
				return source.match.static === true && target.match.static !== true ? target.match.fn.test(source.match.def, maskset, pos, false, opts, false) : false;
			}
			function setMergeLocators(targetMatch, altMatch) {
				function mergeLoc(altNdx) {
					targetMatch.mloc = targetMatch.mloc || {};
					let locNdx = targetMatch.locator[altNdx];
					if (locNdx === void 0) targetMatch.alternation = void 0;
					else {
						if (altMatch === void 0) {
							if (typeof locNdx === "string") locNdx = locNdx.split(",")[0];
							locNdx = `${locNdx}:${altNdx}`;
							if (targetMatch.mloc[locNdx] === void 0) {
								targetMatch.mloc[locNdx] = targetMatch.locator.slice();
								targetMatch.mloc[locNdx].push(`:${altNdx}`);
							}
						} else {
							let offset = 0;
							for (const ndx in altMatch.mloc) if (targetMatch.mloc[ndx] === void 0) targetMatch.mloc[ndx] = altMatch.mloc[ndx];
							else do
								if (targetMatch.mloc[ndx + offset] === void 0) {
									targetMatch.mloc[ndx + offset] = altMatch.mloc[ndx];
									break;
								}
							while (targetMatch.mloc[ndx + offset++] !== void 0);
							targetMatch.locator = mergeLocators(testPos, [targetMatch, altMatch]);
						}
						if (targetMatch.alternation > altNdx) targetMatch.alternation = altNdx;
						return true;
					}
					return false;
				}
				let alternationNdx = targetMatch.alternation, shouldMerge = altMatch === void 0 || alternationNdx <= altMatch.alternation && targetMatch.locator[alternationNdx].toString().indexOf(altMatch.locator[alternationNdx]) === -1;
				if (!shouldMerge && alternationNdx > altMatch.alternation) {
					for (let i = 0; i < alternationNdx; i++) if (targetMatch.locator[i] !== altMatch.locator[i]) {
						alternationNdx = i;
						shouldMerge = true;
						break;
					}
				}
				if (shouldMerge) return mergeLoc(alternationNdx);
				return false;
			}
			function handleGroup() {
				match = handleMatch(maskToken.matches[maskToken.matches.indexOf(match) + 1], loopNdx, quantifierRecurse);
				if (match) return true;
			}
			function handleOptional() {
				const optionalToken = match, mtchsNdx = matches.length;
				match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse);
				if (matches.length > 0) {
					matches.forEach(function(mtch, ndx) {
						if (ndx >= mtchsNdx) mtch.match.optionality = mtch.match.optionality ? mtch.match.optionality + 1 : 1;
					});
					latestMatch = matches[matches.length - 1].match;
					if (quantifierRecurse === void 0 && isFirstMatch(latestMatch, optionalToken)) {
						insertStop = true;
						testPos = pos;
					} else return match;
				}
			}
			function handleAlternator() {
				function calculateMatchesLength(matches) {
					let matchesLength = 0;
					for (let ndx = 0; ndx < matches.length; ndx++) {
						const match = matches[ndx];
						if (match.isQuantifier && !isNaN(match.quantifier.max)) matchesLength += match.quantifier.max;
						else matchesLength++;
					}
					return matchesLength;
				}
				function isUnmatchedAlternation(alternateToken) {
					const matchesLength = alternateToken.matches[0].matches ? calculateMatchesLength(alternateToken.matches[0].matches) : 1;
					let matchesNewLength;
					for (let alndx = 0; alndx < alternateToken.matches.length; alndx++) {
						matchesNewLength = alternateToken.matches[alndx].matches ? calculateMatchesLength(alternateToken.matches[alndx].matches) : 1;
						if (matchesLength !== matchesNewLength) break;
					}
					return matchesLength !== matchesNewLength;
				}
				inputmask.hasAlternator = true;
				const alternateToken = match, malternateMatches = [], currentMatches = matches.slice(), loopNdxCnt = loopNdx.length, altIndex = ndxInitializer.length > 0 ? ndxInitializer.shift() : -1;
				let maltMatches;
				if (altIndex === -1 || typeof altIndex === "string") {
					const currentPos = testPos, ndxInitializerClone = ndxInitializer.slice();
					let altIndexArr = [], amndx;
					if (typeof altIndex === "string") altIndexArr = altIndex.split(",");
					else for (amndx = 0; amndx < alternateToken.matches.length; amndx++) altIndexArr.push(amndx.toString());
					if (maskset.excludes[pos] !== void 0) {
						const altIndexArrClone = altIndexArr.slice();
						for (let i = 0, exl = maskset.excludes[pos].length; i < exl; i++) {
							const excludeSet = maskset.excludes[pos][i].toString().split(":");
							if (loopNdx.length == excludeSet[1]) altIndexArr.splice(altIndexArr.indexOf(excludeSet[0]), 1);
						}
						if (altIndexArr.length === 0) {
							delete maskset.excludes[pos];
							altIndexArr = altIndexArrClone;
						}
					}
					if (opts.keepStatic === true || isFinite(parseInt(opts.keepStatic)) && currentPos >= opts.keepStatic) altIndexArr = altIndexArr.slice(0, 1);
					for (let ndx = 0; ndx < altIndexArr.length; ndx++) {
						amndx = parseInt(altIndexArr[ndx]);
						matches = [];
						ndxInitializer = typeof altIndex === "string" ? resolveNdxInitializer(testPos, amndx, loopNdxCnt) || ndxInitializerClone.slice() : ndxInitializerClone.slice();
						const tokenMatch = alternateToken.matches[amndx];
						if (tokenMatch && handleMatch(tokenMatch, [amndx].concat(loopNdx), quantifierRecurse)) match = true;
						else {
							unMatchedAlternation = isUnmatchedAlternation(alternateToken);
							if (tokenMatch && tokenMatch.matches && tokenMatch.matches.length > alternateToken.matches[0].matches.length) break;
						}
						maltMatches = matches.slice();
						testPos = currentPos;
						matches = [];
						for (let ndx1 = 0; ndx1 < maltMatches.length; ndx1++) {
							let altMatch = maltMatches[ndx1], dropMatch = false;
							altMatch.alternation = altMatch.alternation || loopNdxCnt;
							setMergeLocators(altMatch);
							for (let ndx2 = 0; ndx2 < malternateMatches.length; ndx2++) {
								const altMatch2 = malternateMatches[ndx2];
								if (typeof altIndex !== "string" || altMatch.alternation !== void 0 && altIndex.indexOf(altMatch.locator[altMatch.alternation].toString()) !== -1) {
									if (altMatch.match.nativeDef === altMatch2.match.nativeDef) {
										dropMatch = true;
										setMergeLocators(altMatch2, altMatch);
										break;
									} else if (isSubsetOf(altMatch, altMatch2, opts)) {
										if (setMergeLocators(altMatch, altMatch2)) {
											dropMatch = true;
											malternateMatches.splice(malternateMatches.indexOf(altMatch2), 0, altMatch);
										}
										break;
									} else if (isSubsetOf(altMatch2, altMatch, opts)) {
										setMergeLocators(altMatch2, altMatch);
										break;
									} else if (staticCanMatchDefinition(altMatch, altMatch2)) {
										if (setMergeLocators(altMatch, altMatch2)) {
											dropMatch = true;
											malternateMatches.splice(malternateMatches.indexOf(altMatch2), 0, altMatch);
										}
										break;
									} else if (staticCanMatchDefinition(altMatch2, altMatch)) {
										setMergeLocators(altMatch2, altMatch);
										if (altMatch2.match.optionality && el.inputmask.userOptions.keepStatic === void 0) opts.keepStatic = currentPos;
										break;
									}
								}
							}
							if (!dropMatch) malternateMatches.push(altMatch);
						}
					}
					matches = currentMatches.concat(malternateMatches);
					testPos = pos;
					insertStop = insertStop || matches.length > 0 && unMatchedAlternation;
					if (!unMatchedAlternation && insertStop) insertStopFromAlternation = true;
					match = malternateMatches.length > 0 && !unMatchedAlternation;
					if (unMatchedAlternation && insertStop && !match) matches.forEach(function(mtch, ndx) {
						mtch.unMatchedAlternationStopped = true;
					});
					ndxInitializer = ndxInitializerClone.slice();
				} else match = handleMatch(alternateToken.matches[altIndex] || maskToken.matches[altIndex], [altIndex].concat(loopNdx), quantifierRecurse);
				if (match) return true;
			}
			function handleQuantifier() {
				const qt = match;
				let breakloop = false;
				for (let qndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; qndx < (isNaN(qt.quantifier.max) ? qndx + 1 : qt.quantifier.max) && testPos <= pos; qndx++) {
					const tokenGroup = maskToken.matches[maskToken.matches.indexOf(qt) - 1];
					match = handleMatch(tokenGroup, [qndx].concat(loopNdx), tokenGroup);
					if (match) {
						matches.forEach(function(mtch, ndx) {
							if (IsMatchOf(tokenGroup, mtch.match)) latestMatch = mtch.match;
							else latestMatch = matches[matches.length - 1].match;
							latestMatch.optionalQuantifier = qndx >= qt.quantifier.min;
							latestMatch.jit = (qndx + 1) * (tokenGroup.matches.indexOf(latestMatch) + 1) > qt.quantifier.jit;
							if ((latestMatch.optionalQuantifier || latestMatch.optionality) && isFirstMatch(latestMatch, tokenGroup)) {
								insertStop = true;
								testPos = pos;
								if (opts.greedy && maskset.validPositions[pos - 1] == void 0 && qndx > qt.quantifier.min && ["*", "+"].indexOf(qt.quantifier.max) != -1) {
									matches.pop();
									cacheDependency = void 0;
								}
								breakloop = true;
								match = false;
							}
							if (!breakloop && latestMatch.jit) maskset.jitOffset[pos] = tokenGroup.matches.length - tokenGroup.matches.indexOf(latestMatch);
						});
						if (breakloop) break;
						return true;
					}
				}
			}
			if (testPos > pos + opts._maxTestPos) throw new Error(`Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. ${maskset.mask}`);
			if (testPos === pos && match.matches === void 0) {
				matches.push({
					match,
					locator: loopNdx.reverse(),
					cd: cacheDependency,
					mloc: {}
				});
				if (match.optionality && quantifierRecurse === void 0 && (opts.definitions && opts.definitions[match.nativeDef] && opts.definitions[match.nativeDef].optional || Inputmask.prototype.definitions[match.nativeDef] && Inputmask.prototype.definitions[match.nativeDef].optional)) {
					insertStop = true;
					testPos = pos;
				} else return true;
			} else if (match.matches !== void 0) {
				if (match.isGroup && quantifierRecurse !== match) return handleGroup();
				else if (match.isOptional) return handleOptional();
				else if (match.isAlternator) return handleAlternator();
				else if (match.isQuantifier && quantifierRecurse !== maskToken.matches[maskToken.matches.indexOf(match) - 1]) return handleQuantifier();
				else {
					match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse);
					if (match) return true;
				}
			} else testPos++;
		}
		for (let tndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; tndx < maskToken.matches.length; tndx++) if (maskToken.matches[tndx].isQuantifier !== true) {
			const match = handleMatch(maskToken.matches[tndx], [tndx].concat(loopNdx), quantifierRecurse);
			if (match && testPos === pos) return match;
			else if (testPos > pos) break;
		}
	}
	function IsMatchOf(tokenGroup, match) {
		let isMatch = tokenGroup.matches.indexOf(match) != -1;
		if (!isMatch) tokenGroup.matches.forEach((mtch, ndx) => {
			if (mtch.matches !== void 0 && !isMatch) isMatch = IsMatchOf(mtch, match);
		});
		return isMatch;
	}
	function mergeLocators(pos, tests) {
		let locator = [];
		if (!Array.isArray(tests)) tests = [tests];
		if (tests.length > 0) {
			if (tests[0].alternation === void 0 || opts.keepStatic === true || isFinite(parseInt(opts.keepStatic)) && pos >= opts.keepStatic) {
				locator = determineTestTemplate.call(inputmask, pos, tests.slice()).locator.slice();
				if (locator.length === 0) locator = tests[0].locator.slice();
			} else tests.forEach((mtch) => {
				Object.values(mtch.mloc).forEach((mloc) => {
					mloc.forEach((loc, locNdx) => {
						const mergedPos = locator[locNdx];
						if (loc.toString().includes(":") || mergedPos && mergedPos.toString().includes(":")) return;
						if (mergedPos === void 0) locator[locNdx] = loc;
						else if (!mergedPos.toString().includes(loc)) locator[locNdx] = locator[locNdx] + "," + loc;
					});
				});
			});
		}
		return locator;
	}
	if (pos > -1) {
		if (ndxIntlzr === void 0) {
			let previousPos = pos - 1, test;
			while ((test = maskset.validPositions[previousPos] || maskset.tests[previousPos]) === void 0 && previousPos > -1) previousPos--;
			if (test !== void 0 && previousPos > -1) {
				ndxInitializer = mergeLocators(previousPos, test);
				cacheDependency = ndxInitializer.join("");
				testPos = previousPos;
			}
		}
		if (maskset.tests[pos] && maskset.tests[pos][0].cd === cacheDependency) return maskset.tests[pos];
		for (let mtndx = ndxInitializer.shift(); mtndx < maskTokens.length; mtndx++) if (resolveTestFromToken(maskTokens[mtndx], ndxInitializer, [mtndx]) && testPos === pos || testPos > pos) break;
	}
	if (matches.length === 0 || insertStop) matches.push({
		match: {
			fn: null,
			static: true,
			optionality: false,
			casing: null,
			def: "",
			placeholder: ""
		},
		locator: unMatchedAlternation && matches.filter((tst) => tst.unMatchedAlternationStopped !== true).length === 0 ? [0] : insertStopFromAlternation && matches.length > 0 && matches.filter((tst) => !tst.match.static).every((tst) => tst.match.optionalQuantifier) ? [0] : [],
		mloc: {},
		cd: cacheDependency
	});
	let result;
	if (ndxIntlzr !== void 0 && maskset.tests[pos]) result = $.extend(true, [], matches);
	else {
		maskset.tests[pos] = $.extend(true, [], matches);
		result = maskset.tests[pos];
	}
	matches.forEach((t) => {
		t.match.optionality = t.match.defOptionality || false;
	});
	return result;
}
//#endregion
//#region node_modules/inputmask/lib/validation.js
function alternate(maskPos, c, strict, fromIsValid, rAltPos, selection) {
	const inputmask = this, $ = this.dependencyLib, opts = this.opts, maskset = inputmask.maskset;
	if (!inputmask.hasAlternator) return false;
	const validPsClone = $.extend(true, [], maskset.validPositions), tstClone = $.extend(true, {}, maskset.tests);
	let lastAlt, alternation, isValidRslt = false, returnRslt = false, altPos, prevAltPos, i, validPos, decisionPos, lAltPos = rAltPos !== void 0 ? rAltPos : getLastValidPosition.call(inputmask), nextPos, input, begin, end;
	if (selection) {
		begin = selection.begin;
		end = selection.end;
		if (selection.begin > selection.end) {
			begin = selection.end;
			end = selection.begin;
		}
	}
	if (lAltPos === -1 && rAltPos === void 0) {
		lastAlt = 0;
		prevAltPos = getTest.call(inputmask, lastAlt);
		alternation = prevAltPos.alternation;
	} else for (; lAltPos >= 0; lAltPos--) {
		altPos = lAltPos === 0 ? getTest.call(inputmask, 0) : maskset.validPositions[lAltPos];
		if (altPos && altPos.alternation !== void 0) {
			if (lAltPos <= (maskPos || 0) && prevAltPos && prevAltPos.locator[altPos.alternation] !== altPos.locator[altPos.alternation]) break;
			lastAlt = lAltPos;
			alternation = altPos.alternation;
			prevAltPos = altPos;
		}
	}
	if (alternation !== void 0) {
		decisionPos = parseInt(lastAlt);
		maskset.excludes[decisionPos] = maskset.excludes[decisionPos] || [];
		if (maskPos !== true) maskset.excludes[decisionPos].push(getDecisionTaker(prevAltPos) + ":" + prevAltPos.alternation);
		const validInputs = [];
		let resultPos = -1;
		for (i = decisionPos; decisionPos < getLastValidPosition.call(inputmask, void 0, true) + 1; i++) {
			if (resultPos === -1 && maskPos <= i && c !== void 0) {
				validInputs.push(c);
				resultPos = validInputs.length - 1;
			}
			validPos = maskset.validPositions[decisionPos];
			if (validPos && validPos.generatedInput !== true && (decisionPos !== 0 || validPos.input !== opts.skipOptionalPartCharacter) && (selection === void 0 || i < begin || i >= end)) validInputs.push(validPos.input);
			maskset.validPositions.splice(decisionPos, 1);
		}
		if (resultPos === -1 && c !== void 0) {
			validInputs.push(c);
			resultPos = validInputs.length - 1;
		}
		while (maskset.excludes[decisionPos] !== void 0 && maskset.excludes[decisionPos].length < 10) {
			maskset.tests = {};
			resetMaskSet.call(inputmask, true);
			isValidRslt = true;
			nextPos = decisionPos - 1;
			const targetTemplate = getMaskTemplate.call(inputmask, true, 0);
			for (i = 0; i < validInputs.length; i++) {
				input = validInputs[i];
				if (targetTemplate[nextPos + 1] === input && opts.numericInput !== true) nextPos++;
				else if (i === 0 || returnRslt.caretPos !== void 0 || opts.insertMode === false) nextPos = seekNext.call(inputmask, nextPos);
				else nextPos = getLastValidPosition.call(inputmask, nextPos, true) + 1;
				if (!(isValidRslt = isValid.call(inputmask, nextPos, input, false, fromIsValid, true))) break;
				if (i === resultPos) returnRslt = isValidRslt;
				if (maskPos === true && isValidRslt) returnRslt = { caretPos: i };
			}
			if (!isValidRslt) {
				resetMaskSet.call(inputmask);
				prevAltPos = getTest.call(inputmask, decisionPos);
				maskset.validPositions = $.extend(true, [], validPsClone);
				maskset.tests = $.extend(true, {}, tstClone);
				returnRslt = false;
				if (maskset.excludes[decisionPos]) {
					if (prevAltPos.alternation != void 0) {
						const decisionTaker = getDecisionTaker(prevAltPos);
						if (maskset.excludes[decisionPos].indexOf(decisionTaker + ":" + prevAltPos.alternation) !== -1) {
							returnRslt = alternate.call(inputmask, maskPos, c, strict, fromIsValid, decisionPos - 1, selection);
							break;
						}
						maskset.excludes[decisionPos].push(decisionTaker + ":" + prevAltPos.alternation);
						for (i = decisionPos; i < getLastValidPosition.call(inputmask, void 0, true) + 1; i++) maskset.validPositions.splice(decisionPos);
					} else delete maskset.excludes[decisionPos];
				} else {
					returnRslt = alternate.call(inputmask, maskPos, c, strict, fromIsValid, decisionPos - 1, selection);
					break;
				}
			} else break;
		}
	}
	if (!returnRslt || opts.keepStatic !== false) delete maskset.excludes[decisionPos];
	if (!returnRslt) {
		maskset.validPositions = $.extend(true, [], validPsClone);
		maskset.tests = $.extend(true, {}, tstClone);
	}
	return returnRslt;
}
function casing(elem, test, pos) {
	const opts = this.opts, maskset = this.maskset;
	switch (opts.casing || test.casing) {
		case "upper":
			elem = elem.toLocaleUpperCase();
			break;
		case "lower":
			elem = elem.toLocaleLowerCase();
			break;
		case "title":
			var posBefore = maskset.validPositions[pos - 1];
			if (pos === 0 || posBefore && posBefore.input === String.fromCharCode(keyCode.Space)) elem = elem.toLocaleUpperCase();
			else elem = elem.toLocaleLowerCase();
			break;
		case "follow":
			if (test.def && test.def !== test.def.toLocaleLowerCase()) elem = elem.toLocaleUpperCase();
			else if (test.def && test.def !== test.def.toLocaleUpperCase()) elem = elem.toLocaleLowerCase();
			break;
		default: if (typeof opts.casing === "function") {
			const args = Array.prototype.slice.call(arguments);
			args.push(maskset.validPositions);
			elem = opts.casing.apply(this, args);
		}
	}
	return elem;
}
function checkAlternationMatch(altArr1, altArr2, na) {
	let altArrC = this.opts.greedy ? altArr2 : altArr2.slice(0, 1), isMatch = false, naArr = na !== void 0 ? na.split(",") : [], naNdx;
	for (let i = 0; i < naArr.length; i++) if ((naNdx = altArr1.indexOf(naArr[i])) !== -1) altArr1.splice(naNdx, 1);
	for (let alndx = 0; alndx < altArr1.length; alndx++) if (altArrC.includes(altArr1[alndx])) {
		isMatch = true;
		break;
	}
	return isMatch;
}
function handleRemove(input, c, pos, strict, fromIsValid) {
	const inputmask = this, maskset = this.maskset, opts = this.opts;
	if (opts.numericInput || inputmask.isRTL) {
		if (c === keys.Backspace) c = keys.Delete;
		else if (c === keys.Delete) c = keys.Backspace;
		if (inputmask.isRTL) {
			const pend = pos.end;
			pos.end = pos.begin;
			pos.begin = pend;
		}
	}
	const lvp = getLastValidPosition.call(inputmask, void 0, true);
	if (pos.end >= getBuffer.call(inputmask).length && lvp >= pos.end) pos.end = lvp + 1;
	if (c === keys.Backspace) {
		if (pos.end - pos.begin < 1) pos.begin = seekPrevious.call(inputmask, pos.begin);
	} else if (c === keys.Delete) {
		if (pos.begin === pos.end) pos.end = isMask.call(inputmask, pos.end, true, true) ? pos.end + 1 : seekNext.call(inputmask, pos.end) + 1;
	}
	let offset;
	if ((offset = revalidateMask.call(inputmask, pos)) !== false) {
		if (strict !== true && opts.keepStatic !== false || opts.regex !== null && getTest.call(inputmask, pos.begin).match.def.indexOf("|") !== -1) alternate.call(inputmask, true);
		if (strict !== true) {
			maskset.p = c === keys.Delete ? pos.begin + offset : pos.begin;
			maskset.p = determineNewCaretPosition.call(inputmask, {
				begin: maskset.p,
				end: maskset.p
			}, false, opts.insertMode === false && c === keys.Backspace ? "none" : void 0).begin;
		}
	}
}
function isComplete(buffer) {
	const inputmask = this, opts = this.opts, maskset = this.maskset;
	if (typeof opts.isComplete === "function") return opts.isComplete(buffer, opts);
	if (opts.repeat === "*") return void 0;
	let complete = false, lrp = determineLastRequiredPosition.call(inputmask, true), aml = lrp.l;
	if (lrp.def === void 0 || lrp.def.newBlockMarker || lrp.def.optionality || lrp.def.optionalQuantifier) {
		complete = true;
		for (let i = 0; i <= aml; i++) {
			const test = getTestTemplate.call(inputmask, i).match;
			if (test.static !== true && maskset.validPositions[i] === void 0 && (test.optionality === false || test.optionality === void 0 || test.optionality && test.newBlockMarker == false) && (test.optionalQuantifier === false || test.optionalQuantifier === void 0) || test.static === true && test.def != "" && buffer[i] !== getPlaceholder.call(inputmask, i, test)) {
				complete = false;
				break;
			}
		}
	}
	return complete;
}
function isSelection(posObj) {
	const inputmask = this, insertModeOffset = this.opts.insertMode ? 0 : 1;
	return inputmask.isRTL ? posObj.begin - posObj.end > insertModeOffset : posObj.end - posObj.begin > insertModeOffset;
}
function isValid(pos, c, strict, fromIsValid, fromAlternate, validateOnly, fromCheckval) {
	const inputmask = this, $ = this.dependencyLib, opts = this.opts, maskset = inputmask.maskset;
	strict = strict === true;
	let maskPos = pos;
	if (pos.begin !== void 0) maskPos = inputmask.isRTL ? pos.end : pos.begin;
	function processCommandObject(commandObj) {
		if (commandObj !== void 0) {
			if (commandObj.remove !== void 0) {
				if (!Array.isArray(commandObj.remove)) commandObj.remove = [commandObj.remove];
				commandObj.remove.sort(function(a, b) {
					return inputmask.isRTL ? a.pos - b.pos : b.pos - a.pos;
				}).forEach(function(lmnt) {
					revalidateMask.call(inputmask, {
						begin: lmnt,
						end: lmnt + 1
					});
				});
				commandObj.remove = void 0;
			}
			if (commandObj.insert !== void 0) {
				if (!Array.isArray(commandObj.insert)) commandObj.insert = [commandObj.insert];
				commandObj.insert.sort(function(a, b) {
					return inputmask.isRTL ? b.pos - a.pos : a.pos - b.pos;
				}).forEach(function(lmnt) {
					if (lmnt.c !== "") isValid.call(inputmask, lmnt.pos, lmnt.c, lmnt.strict !== void 0 ? lmnt.strict : true, lmnt.fromIsValid !== void 0 ? lmnt.fromIsValid : fromIsValid);
				});
				commandObj.insert = void 0;
			}
			if (commandObj.refreshFromBuffer && commandObj.buffer) {
				const refresh = commandObj.refreshFromBuffer;
				refreshFromBuffer.call(inputmask, refresh === true ? refresh : refresh.start, refresh.end, commandObj.buffer);
				commandObj.refreshFromBuffer = void 0;
			}
			if (commandObj.rewritePosition !== void 0) {
				maskPos = commandObj.rewritePosition;
				commandObj = true;
			}
		}
		return commandObj;
	}
	function _isValid(position, c, strict) {
		let rslt = false;
		getTests.call(inputmask, position).every(function(tst, ndx) {
			const test = tst.match;
			getBuffer.call(inputmask, true);
			if (test.jit && maskset.validPositions[seekPrevious.call(inputmask, position)] === void 0) rslt = false;
			else rslt = test.fn != null ? test.fn.test(c, maskset, position, strict, opts, isSelection.call(inputmask, pos)) : (c === test.def || c === opts.skipOptionalPartCharacter) && test.def !== "" ? {
				c: getPlaceholder.call(inputmask, position, test, true) || test.def,
				pos: position
			} : false;
			if (rslt !== false) {
				let elem = rslt.c !== void 0 ? rslt.c : c, validatedPos = position;
				elem = elem === opts.skipOptionalPartCharacter && test.static === true ? getPlaceholder.call(inputmask, position, test, true) || test.def : elem;
				rslt = processCommandObject(rslt);
				if (rslt !== true && rslt.pos !== void 0 && rslt.pos !== position) validatedPos = rslt.pos;
				if (rslt !== true && rslt.pos === void 0 && rslt.c === void 0) return false;
				if (revalidateMask.call(inputmask, pos, $.extend({}, tst, { input: casing.call(inputmask, elem, test, validatedPos) }), fromIsValid, validatedPos) === false) rslt = false;
				return false;
			}
			return true;
		});
		return rslt;
	}
	let result = true, positionsClone = $.extend(true, [], maskset.validPositions);
	if (opts.keepStatic === false && maskset.excludes[maskPos] !== void 0 && fromAlternate !== true && fromIsValid !== true) {
		for (let i = maskPos; i < (inputmask.isRTL ? pos.begin : pos.end); i++) if (maskset.excludes[i] !== void 0) {
			maskset.excludes[i] = void 0;
			delete maskset.tests[i];
		}
	}
	if (typeof opts.preValidation === "function" && fromIsValid !== true && validateOnly !== true) {
		result = opts.preValidation.call(inputmask, getBuffer.call(inputmask), maskPos, c, isSelection.call(inputmask, pos), opts, maskset, pos, strict || fromAlternate);
		result = processCommandObject(result);
	}
	if (result === true) {
		result = _isValid(maskPos, c, strict);
		if ((!strict || fromIsValid === true) && result === false && validateOnly !== true) {
			const currentPosValid = maskset.validPositions[maskPos];
			if (currentPosValid && currentPosValid.match.static === true && (currentPosValid.match.def === c || c === opts.skipOptionalPartCharacter)) result = { caret: seekNext.call(inputmask, maskPos) };
			else if (opts.insertMode || maskset.validPositions[seekNext.call(inputmask, maskPos)] === void 0 || pos.end > maskPos) {
				let skip = false;
				if (maskset.jitOffset[maskPos] && maskset.validPositions[seekNext.call(inputmask, maskPos)] === void 0) {
					result = isValid.call(inputmask, maskPos + maskset.jitOffset[maskPos], c, true, true);
					if (result !== false) {
						if (fromAlternate !== true) result.caret = maskPos;
						skip = true;
					}
				}
				if (pos.end > maskPos) maskset.validPositions[maskPos] = void 0;
				if (!skip && !isMask.call(inputmask, maskPos, opts.keepStatic && maskPos === 0)) for (let nPos = maskPos + 1, snPos = seekNext.call(inputmask, maskPos, false, maskPos !== 0); nPos <= snPos; nPos++) {
					result = _isValid(nPos, c, strict);
					if (result !== false) {
						result = trackbackPositions.call(inputmask, maskPos, result.pos !== void 0 ? result.pos : nPos) || result;
						maskPos = nPos;
						break;
					}
				}
			}
		}
		if (inputmask.hasAlternator && fromAlternate !== true && !strict) {
			fromAlternate = true;
			if (result === false) {
				if (opts.keepStatic === true || isFinite(parseInt(opts.keepStatic)) && maskPos >= opts.keepStatic) result = alternate.call(inputmask, maskPos, c, strict, fromIsValid, void 0, pos);
			} else if (result === true) {
				if (isSelection.call(inputmask, pos) && maskset.tests[maskPos] && maskset.tests[maskPos].length > 1 && opts.keepStatic) result = alternate.call(inputmask, true) || result;
				else if (opts.numericInput !== true && maskset.tests[maskPos] && maskset.tests[maskPos].length > 1 && getLastValidPosition.call(inputmask, void 0, true) > maskPos) result = alternate.call(inputmask, true) || result;
			}
		}
		if (result === true) result = { pos: maskPos };
		if (typeof opts.postValidation === "function" && fromIsValid !== true && validateOnly !== true) {
			const postResult = opts.postValidation.call(inputmask, getBuffer.call(inputmask, true), pos.begin !== void 0 ? inputmask.isRTL ? pos.end : pos.begin : pos, c, result, opts, maskset, strict, fromCheckval, fromAlternate);
			if (postResult !== void 0) result = postResult === true ? result : postResult;
		}
	}
	if (result && result.pos === void 0) result.pos = maskPos;
	if (result === false || validateOnly === true) {
		resetMaskSet.call(inputmask, true);
		maskset.validPositions = $.extend(true, [], positionsClone);
	} else trackbackPositions.call(inputmask, void 0, maskPos, true);
	let endResult = processCommandObject(result);
	if (inputmask.maxLength !== void 0) {
		if (getBuffer.call(inputmask).length > inputmask.maxLength && !fromIsValid) {
			resetMaskSet.call(inputmask, true);
			maskset.validPositions = $.extend(true, [], positionsClone);
			endResult = false;
		}
	}
	return endResult;
}
function positionCanMatchDefinition(pos, testDefinition, opts) {
	const inputmask = this, maskset = this.maskset;
	let valid = false, tests = getTests.call(inputmask, pos);
	for (let tndx = 0; tndx < tests.length; tndx++) if (tests[tndx].match && (tests[tndx].match.nativeDef === testDefinition.match[opts.shiftPositions ? "def" : "nativeDef"] && (!opts.shiftPositions || !testDefinition.match.static) || tests[tndx].match.nativeDef === testDefinition.match.nativeDef || opts.regex && !tests[tndx].match.static && tests[tndx].match.fn.test(testDefinition.input, maskset, pos, false, opts))) {
		valid = true;
		break;
	} else if (tests[tndx].match && tests[tndx].match.def === testDefinition.match.nativeDef) {
		valid = void 0;
		break;
	}
	if (valid === false) {
		if (maskset.jitOffset[pos] !== void 0) valid = positionCanMatchDefinition.call(inputmask, pos + maskset.jitOffset[pos], testDefinition, opts);
	}
	return valid;
}
function refreshFromBuffer(start, end, buffer) {
	const inputmask = this, maskset = this.maskset, opts = this.opts, $ = this.dependencyLib;
	let i, p, skipOptionalPartCharacter = opts.skipOptionalPartCharacter, bffr = inputmask.isRTL ? buffer.slice().reverse() : buffer;
	opts.skipOptionalPartCharacter = "";
	if (start === true) {
		resetMaskSet.call(inputmask, false);
		start = 0;
		end = buffer.length;
		p = determineNewCaretPosition.call(inputmask, {
			begin: 0,
			end: 0
		}, false).begin;
	} else {
		for (i = start; i < end; i++) delete maskset.validPositions[i];
		p = start;
	}
	const keypress = new $.Event("keypress");
	for (i = start; i < end; i++) {
		keypress.key = bffr[i].toString();
		inputmask.ignorable = false;
		const valResult = EventHandlers.keypressEvent.call(inputmask, keypress, true, false, false, p);
		if (valResult !== false && valResult !== void 0) p = valResult.forwardPosition;
	}
	opts.skipOptionalPartCharacter = skipOptionalPartCharacter;
}
function trackbackPositions(originalPos, newPos, fillOnly) {
	const inputmask = this, maskset = this.maskset, $ = this.dependencyLib;
	if (originalPos === void 0) {
		for (originalPos = newPos - 1; originalPos > 0; originalPos--) if (maskset.validPositions[originalPos]) break;
	}
	for (let ps = originalPos; ps < newPos; ps++) if (maskset.validPositions[ps] === void 0 && !isMask.call(inputmask, ps, false)) {
		if (ps == 0 ? getTest.call(inputmask, ps) : maskset.validPositions[ps - 1]) {
			const tests = getTests.call(inputmask, ps).slice();
			if (tests[tests.length - 1].match.def === "") tests.pop();
			var bestMatch = determineTestTemplate.call(inputmask, ps, tests), np;
			if (bestMatch && (bestMatch.match.jit !== true || bestMatch.match.newBlockMarker === "master" && (np = maskset.validPositions[ps + 1]) && np.match.optionalQuantifier === true)) {
				bestMatch = $.extend({}, bestMatch, { input: getPlaceholder.call(inputmask, ps, bestMatch.match, true) || bestMatch.match.def });
				bestMatch.generatedInput = true;
				revalidateMask.call(inputmask, ps, bestMatch, true);
				if (fillOnly !== true) {
					const cvpInput = maskset.validPositions[newPos].input;
					maskset.validPositions[newPos] = void 0;
					return isValid.call(inputmask, newPos, cvpInput, true, true);
				}
			}
		}
	}
}
function revalidateMask(pos, validTest, fromIsValid, validatedPos) {
	const inputmask = this, maskset = this.maskset, opts = this.opts, $ = this.dependencyLib;
	function IsEnclosedStatic(pos, valids, selection) {
		const posMatch = valids[pos];
		if (posMatch !== void 0 && posMatch.match.static === true && posMatch.match.optionality !== true && (valids[0] === void 0 || valids[0].alternation === void 0)) {
			const prevMatch = selection.begin <= pos - 1 ? valids[pos - 1] && valids[pos - 1].match.static === true && valids[pos - 1] : valids[pos - 1], nextMatch = selection.end > pos + 1 ? valids[pos + 1] && valids[pos + 1].match.static === true && valids[pos + 1] : valids[pos + 1];
			return prevMatch && nextMatch;
		}
		return false;
	}
	let offset = 0, begin = pos.begin !== void 0 ? pos.begin : pos, end = pos.end !== void 0 ? pos.end : pos, valid = true;
	if (pos.begin > pos.end) {
		begin = pos.end;
		end = pos.begin;
	}
	validatedPos = validatedPos !== void 0 ? validatedPos : begin;
	if (fromIsValid === void 0 && (begin !== end || opts.insertMode && maskset.validPositions[validatedPos] !== void 0 || validTest === void 0 || validTest.match.optionalQuantifier || validTest.match.optionality)) {
		let positionsClone = $.extend(true, [], maskset.validPositions), lvp = getLastValidPosition.call(inputmask, void 0, true), i;
		maskset.p = begin;
		const clearpos = isSelection.call(inputmask, pos) ? begin : validatedPos;
		for (i = lvp; i >= clearpos; i--) {
			maskset.validPositions.splice(i, 1);
			if (validTest === void 0) delete maskset.tests[i + 1];
		}
		let j = validatedPos, posMatch = j, t, canMatch, test;
		if (validTest) {
			maskset.validPositions[validatedPos] = $.extend(true, {}, validTest);
			posMatch++;
			j++;
		}
		if (positionsClone[end] == void 0 && maskset.jitOffset[end]) end += maskset.jitOffset[end] + (validTest ? 1 : 0);
		for (i = validTest ? end : end - 1; i <= lvp; i++) {
			if ((t = positionsClone[i]) !== void 0 && (opts.shiftPositions !== true || t.generatedInput !== true) && (i >= end || i >= begin && IsEnclosedStatic(i, positionsClone, {
				begin,
				end
			}))) {
				while (test = getTest.call(inputmask, posMatch), test.match.def !== "") {
					if ((canMatch = positionCanMatchDefinition.call(inputmask, posMatch, t, opts)) !== false || t.match.def === "+") {
						if (t.match.def === "+") getBuffer.call(inputmask, true);
						const result = isValid.call(inputmask, posMatch, t.input, t.match.def !== "+", true);
						valid = result !== false;
						j = (result.pos || posMatch) + 1;
						if (!valid && canMatch) break;
					} else valid = false;
					if (valid) {
						if (validTest === void 0 && t.match.static && i === pos.begin) offset++;
						break;
					}
					if (!valid && getBuffer.call(inputmask), posMatch > maskset.maskLength) break;
					posMatch++;
				}
				if (getTest.call(inputmask, posMatch).match.def == "") valid = false;
				posMatch = j;
			}
			if (!valid) break;
		}
		if (!valid) {
			maskset.validPositions = $.extend(true, [], positionsClone);
			resetMaskSet.call(inputmask, true);
			return false;
		}
	} else if (validTest && getTest.call(inputmask, validatedPos).match.cd === validTest.match.cd) maskset.validPositions[validatedPos] = $.extend(true, {}, validTest);
	resetMaskSet.call(inputmask, true);
	return offset;
}
//#endregion
//#region node_modules/inputmask/lib/positioning.js
function caret(input, begin, end, notranslate, isDelete) {
	const inputmask = this, opts = this.opts;
	let range;
	if (begin !== void 0) {
		if (Array.isArray(begin)) {
			end = inputmask.isRTL ? begin[0] : begin[1];
			begin = inputmask.isRTL ? begin[1] : begin[0];
		}
		if (begin.begin !== void 0) {
			end = inputmask.isRTL ? begin.begin : begin.end;
			begin = inputmask.isRTL ? begin.end : begin.begin;
		}
		if (typeof begin === "number") {
			begin = notranslate ? begin : translatePosition.call(inputmask, begin);
			end = notranslate ? end : translatePosition.call(inputmask, end);
			end = typeof end === "number" ? end : begin;
			const scrollCalc = parseInt(((input.ownerDocument.defaultView || window_default).getComputedStyle ? (input.ownerDocument.defaultView || window_default).getComputedStyle(input, null) : input.currentStyle).fontSize) * end;
			input.scrollLeft = scrollCalc > input.scrollWidth ? scrollCalc : 0;
			input.inputmask.caretPos = {
				begin,
				end
			};
			if (opts.insertModeVisual && opts.insertMode === false && begin === end) {
				if (!isDelete) end++;
			}
			if (input === input.getRootNode().activeElement) {
				if ("setSelectionRange" in input) input.setSelectionRange(begin, end);
				else if (window_default.getSelection) {
					range = document.createRange();
					if (input.firstChild === void 0 || input.firstChild === null) {
						const textNode = document.createTextNode("");
						input.appendChild(textNode);
					}
					range.setStart(input.firstChild, begin < input.inputmask._valueGet().length ? begin : input.inputmask._valueGet().length);
					range.setEnd(input.firstChild, end < input.inputmask._valueGet().length ? end : input.inputmask._valueGet().length);
					range.collapse(true);
					const sel = window_default.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (input.createTextRange) {
					range = input.createTextRange();
					range.collapse(true);
					range.moveEnd("character", end);
					range.moveStart("character", begin);
					range.select();
				}
				input.inputmask.caretHook === void 0 || input.inputmask.caretHook.call(inputmask, {
					begin,
					end
				});
			}
		}
	} else {
		if ("selectionStart" in input && "selectionEnd" in input) {
			begin = input.selectionStart;
			end = input.selectionEnd;
		} else if (window_default.getSelection) {
			range = window_default.getSelection().getRangeAt(0);
			if (range.commonAncestorContainer.parentNode === input || range.commonAncestorContainer === input) {
				begin = range.startOffset;
				end = range.endOffset;
			}
		} else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			begin = 0 - range.duplicate().moveStart("character", -input.inputmask._valueGet().length);
			end = begin + range.text.length;
		}
		return {
			begin: notranslate ? begin : translatePosition.call(inputmask, begin),
			end: notranslate ? end : translatePosition.call(inputmask, end)
		};
	}
}
function determineLastRequiredPosition(returnDefinition) {
	const inputmask = this, { maskset, dependencyLib: $ } = inputmask, lvp = getLastValidPosition.call(inputmask), positions = {}, lvTest = maskset.validPositions[lvp], buffer = getMaskTemplate.call(inputmask, true, getLastValidPosition.call(inputmask), true, true);
	let bl = buffer.length, pos, ndxIntlzr = lvTest !== void 0 ? lvTest.locator.slice() : void 0, testPos;
	for (pos = lvp + 1; pos < buffer.length; pos++) {
		testPos = getTestTemplate.call(inputmask, pos, ndxIntlzr, pos - 1);
		ndxIntlzr = testPos.locator.slice();
		positions[pos] = $.extend(true, {}, testPos);
	}
	const lvTestAlt = lvTest && lvTest.alternation !== void 0 ? lvTest.locator[lvTest.alternation] : void 0;
	for (pos = bl - 1; pos > lvp; pos--) {
		testPos = positions[pos];
		if ((testPos.match.optionality || testPos.match.optionalQuantifier && testPos.match.newBlockMarker || lvTestAlt && (lvTestAlt !== positions[pos].locator[lvTest.alternation] && testPos.match.static !== true || testPos.match.static === true && testPos.locator[lvTest.alternation] && checkAlternationMatch.call(inputmask, testPos.locator[lvTest.alternation].toString().split(","), lvTestAlt.toString().split(",")) && getTests.call(inputmask, pos)[0].def !== "")) && buffer[pos] === getPlaceholder.call(inputmask, pos, testPos.match)) {
			bl--;
			if (testPos.match.optionality) {
				let prevPos = pos;
				while (prevPos > 0) {
					const test = getTest.call(inputmask, prevPos);
					if (test.match.newBlockMarker === "master" || test.match.newBlockMarker === true) break;
					prevPos--;
				}
				if (maskset.validPositions[prevPos] !== void 0) break;
			}
		} else break;
	}
	if (pos === lvp) bl = pos;
	return returnDefinition ? {
		l: bl,
		def: positions[bl] ? positions[bl].match : void 0
	} : bl;
}
function determineNewCaretPosition(selectedCaret, tabbed, positionCaretOnClick) {
	const inputmask = this, { maskset, opts } = inputmask;
	let clickPosition, lvclickPosition, lastPosition;
	function doRadixFocus(clickPos) {
		if (opts.radixPoint !== "" && opts.digits !== 0) {
			const vps = maskset.validPositions;
			if (vps[clickPos] === void 0 || vps[clickPos].input === void 0) {
				if (clickPos < seekNext.call(inputmask, -1)) return true;
				const radixPos = getBuffer.call(inputmask).indexOf(opts.radixPoint);
				if (radixPos !== -1) {
					for (const vp in vps) {
						const pos = Number(vp);
						if (radixPos < pos && vps[vp].input !== getPlaceholder.call(inputmask, pos)) return false;
					}
					return true;
				}
			}
		}
		return false;
	}
	if (tabbed) {
		if (inputmask.isRTL) selectedCaret.end = selectedCaret.begin;
		else selectedCaret.begin = selectedCaret.end;
	}
	if (selectedCaret.begin === selectedCaret.end) {
		positionCaretOnClick = positionCaretOnClick || opts.positionCaretOnClick;
		switch (positionCaretOnClick) {
			case "none": break;
			case "select":
				selectedCaret = {
					begin: 0,
					end: getBuffer.call(inputmask).length
				};
				break;
			case "ignore":
				selectedCaret.end = selectedCaret.begin = seekNext.call(inputmask, getLastValidPosition.call(inputmask));
				break;
			case "radixFocus":
				if (inputmask.clicked > 1 && maskset.validPositions.length === 0) break;
				if (doRadixFocus(selectedCaret.begin)) {
					const radixPos = getBuffer.call(inputmask).join("").indexOf(opts.radixPoint);
					selectedCaret.end = selectedCaret.begin = opts.numericInput ? seekNext.call(inputmask, radixPos) : radixPos;
					break;
				}
			default:
				clickPosition = selectedCaret.begin;
				lvclickPosition = getLastValidPosition.call(inputmask, clickPosition, true);
				lastPosition = seekNext.call(inputmask, lvclickPosition === -1 && !isMask.call(inputmask, 0) ? -1 : lvclickPosition);
				if (clickPosition <= lastPosition) selectedCaret.end = selectedCaret.begin = !isMask.call(inputmask, clickPosition, false, true) ? seekNext.call(inputmask, clickPosition) : clickPosition;
				else {
					const lvp = maskset.validPositions[lvclickPosition], tt = getTestTemplate.call(inputmask, lastPosition, lvp ? lvp.match.locator : void 0, lvp), placeholder = getPlaceholder.call(inputmask, lastPosition, tt.match);
					if (placeholder !== "" && getBuffer.call(inputmask)[lastPosition] !== placeholder && tt.match.optionalQuantifier !== true && tt.match.newBlockMarker !== true || !isMask.call(inputmask, lastPosition, opts.keepStatic, true) && tt.match.def === placeholder) {
						const newPos = seekNext.call(inputmask, lastPosition);
						if (clickPosition >= newPos || clickPosition === lastPosition) lastPosition = newPos;
					}
					selectedCaret.end = selectedCaret.begin = lastPosition;
				}
		}
		return selectedCaret;
	}
}
function getBuffer(noCache) {
	const inputmask = this, { maskset } = inputmask;
	if (maskset.buffer === void 0 || noCache === true) {
		maskset.buffer = getMaskTemplate.call(inputmask, true, getLastValidPosition.call(inputmask), true);
		if (maskset._buffer === void 0) maskset._buffer = maskset.buffer.slice();
	}
	return maskset.buffer;
}
function getBufferTemplate() {
	const inputmask = this, maskset = this.maskset;
	if (maskset._buffer === void 0) {
		maskset._buffer = getMaskTemplate.call(inputmask, false, 1);
		if (maskset.buffer === void 0) maskset.buffer = maskset._buffer.slice();
	}
	return maskset._buffer;
}
function getLastValidPosition(closestTo, strict, validPositions) {
	const maskset = this.maskset;
	let before = -1, after = -1;
	const valids = validPositions || maskset.validPositions;
	if (closestTo === void 0) closestTo = -1;
	for (let psNdx = 0, vpl = valids.length; psNdx < vpl; psNdx++) if (valids[psNdx] && (strict || valids[psNdx].generatedInput !== true)) {
		if (psNdx <= closestTo) before = psNdx;
		if (psNdx >= closestTo) after = psNdx;
	}
	return before === -1 || before === closestTo ? after : after === -1 ? before : closestTo - before < after - closestTo ? before : after;
}
function isMask(pos, strict, fuzzy) {
	const inputmask = this, maskset = this.maskset;
	let test = getTestTemplate.call(inputmask, pos).match;
	if (test.def === "") test = getTest.call(inputmask, pos).match;
	if (test.static !== true) return test.fn;
	if (fuzzy === true && maskset.validPositions[pos] !== void 0 && maskset.validPositions[pos].generatedInput !== true) return true;
	if (strict !== true && pos > -1) {
		if (fuzzy) {
			const tests = getTests.call(inputmask, pos);
			return tests.length > 1 + (tests[tests.length - 1].match.def === "" ? 1 : 0);
		}
		const testTemplate = determineTestTemplate.call(inputmask, pos, getTests.call(inputmask, pos)), testPlaceHolder = getPlaceholder.call(inputmask, pos, testTemplate.match);
		return testTemplate.match.def !== testPlaceHolder;
	}
	return false;
}
function resetMaskSet(soft) {
	const maskset = this.maskset;
	maskset.buffer = void 0;
	if (soft !== true) {
		maskset.validPositions = [];
		maskset.p = 0;
	}
	if (soft === false) {
		maskset.tests = {};
		maskset.jitOffset = {};
	}
}
function seekNext(pos, newBlock, fuzzy) {
	const inputmask = this;
	if (fuzzy === void 0) fuzzy = true;
	let position = pos + 1;
	while (getTest.call(inputmask, position).match.def !== "" && (newBlock === true && (getTest.call(inputmask, position).match.newBlockMarker !== true || !isMask.call(inputmask, position, void 0, true)) || newBlock !== true && !isMask.call(inputmask, position, void 0, fuzzy))) position++;
	return position;
}
function seekPrevious(pos, newBlock) {
	const inputmask = this;
	let position = pos - 1;
	if (pos <= 0) return 0;
	while (position > 0 && (newBlock === true && (getTest.call(inputmask, position).match.newBlockMarker !== true || !isMask.call(inputmask, position, void 0, true)) || newBlock !== true && !isMask.call(inputmask, position, void 0, true))) position--;
	return position;
}
function translatePosition(pos) {
	const inputmask = this, opts = this.opts, el = this.el;
	if (inputmask.isRTL && typeof pos === "number" && (!opts.greedy || opts.placeholder !== "") && el) {
		pos = inputmask._valueGet().length - pos;
		if (pos < 0) pos = 0;
	}
	return pos;
}
//#endregion
//#region node_modules/inputmask/lib/eventhandlers.js
var EventHandlers = {
	keyEvent: function(e, checkval, writeOut, strict, ndx) {
		const inputmask = this.inputmask, opts = inputmask.opts, $ = inputmask.dependencyLib, maskset = inputmask.maskset, input = this, $input = $(input), c = e.key, pos = caret.call(inputmask, input), kdResult = opts.onKeyDown.call(this, e, getBuffer.call(inputmask), pos, opts);
		if (kdResult !== void 0) return kdResult;
		if (c === keys.Backspace || c === keys.Delete || iphone && c === keys.BACKSPACE_SAFARI || e.ctrlKey && c === keys.x && !("oncut" in input)) {
			e.preventDefault();
			handleRemove.call(inputmask, input, c, pos);
			writeBuffer(input, getBuffer.call(inputmask, true), maskset.p, e, input.inputmask._valueGet() !== getBuffer.call(inputmask).join(""));
		} else if (c === keys.End || c === keys.PageDown) {
			e.preventDefault();
			const caretPos = seekNext.call(inputmask, getLastValidPosition.call(inputmask));
			caret.call(inputmask, input, e.shiftKey ? pos.begin : caretPos, caretPos, true);
		} else if (c === keys.Home && !e.shiftKey || c === keys.PageUp) {
			e.preventDefault();
			caret.call(inputmask, input, 0, e.shiftKey ? pos.begin : 0, true);
		} else if ((opts.undoOnEscape && c === keys.Escape || false) && e.altKey !== true) {
			checkVal(input, true, false, inputmask.undoValue.split(""));
			$input.trigger("click");
		} else if (c === keys.Insert && !(e.shiftKey || e.ctrlKey) && inputmask.userOptions.insertMode === void 0) {
			if (!isSelection.call(inputmask, pos)) {
				opts.insertMode = !opts.insertMode;
				caret.call(inputmask, input, pos.begin, pos.begin);
			} else opts.insertMode = !opts.insertMode;
		} else if (opts.tabThrough === true && c === keys.Tab) {
			if (e.shiftKey === true) {
				pos.end = seekPrevious.call(inputmask, pos.end, true);
				if (getTest.call(inputmask, pos.end - 1).match.static === true) pos.end--;
				pos.begin = seekPrevious.call(inputmask, pos.end, true);
				if (pos.begin >= 0 && pos.end > 0) {
					e.preventDefault();
					caret.call(inputmask, input, pos.begin, pos.end);
				}
			} else {
				pos.begin = seekNext.call(inputmask, pos.begin, true);
				pos.end = seekNext.call(inputmask, pos.begin, true);
				if (pos.end < maskset.maskLength) pos.end--;
				if (pos.begin <= maskset.maskLength) {
					e.preventDefault();
					caret.call(inputmask, input, pos.begin, pos.end);
				}
			}
		} else if (!e.shiftKey) {
			if (opts.insertModeVisual && opts.insertMode === false) {
				if (c === keys.ArrowRight) setTimeout(function() {
					const caretPos = caret.call(inputmask, input);
					caret.call(inputmask, input, caretPos.begin);
				}, 0);
				else if (c === keys.ArrowLeft) setTimeout(function() {
					const caretPos = {
						begin: translatePosition.call(inputmask, input.inputmask.caretPos.begin),
						end: translatePosition.call(inputmask, input.inputmask.caretPos.end)
					};
					if (inputmask.isRTL) caret.call(inputmask, input, caretPos.begin + (caretPos.begin === maskset.maskLength ? 0 : 1));
					else caret.call(inputmask, input, caretPos.begin - (caretPos.begin === 0 ? 0 : 1));
				}, 0);
			} else inputmask.keyEventHook === void 0 || inputmask.keyEventHook(e);
		}
		inputmask.isComposing = c === keys.Process || c === keys.Unidentified;
		inputmask.ignorable = c === void 0 || c.length > 1;
		return EventHandlers.keypressEvent.call(inputmask, e, checkval, writeOut, strict, ndx);
	},
	keypressEvent: function(e, checkval, writeOut, strict, ndx) {
		const inputmask = this.inputmask || this, opts = inputmask.opts, $ = inputmask.dependencyLib, maskset = inputmask.maskset, input = inputmask.el, $input = $(input);
		let c = e.key;
		if (checkval !== true && !(e.ctrlKey && e.altKey && !inputmask.ignorable) && (e.ctrlKey || e.metaKey || inputmask.ignorable)) {
			if (c === keys.Enter) {
				if (inputmask.undoValue !== inputmask._valueGet(true)) {
					inputmask.undoValue = inputmask._valueGet(true);
					setTimeout(function() {
						$input.trigger("change");
					}, 0);
				}
			}
		} else if (c) {
			let pos = checkval ? {
				begin: ndx,
				end: ndx
			} : caret.call(inputmask, input), forwardPosition;
			if (!checkval) c = opts.substitutes[c] || c;
			maskset.writeOutBuffer = true;
			const valResult = isValid.call(inputmask, pos, c, strict, void 0, void 0, void 0, checkval);
			if (valResult !== false) {
				resetMaskSet.call(inputmask, true);
				forwardPosition = valResult.caret !== void 0 ? valResult.caret : seekNext.call(inputmask, valResult.pos.begin ? valResult.pos.begin : valResult.pos);
				maskset.p = forwardPosition;
			}
			forwardPosition = opts.numericInput && valResult.caret === void 0 ? seekPrevious.call(inputmask, forwardPosition) : forwardPosition;
			if (writeOut !== false) {
				setTimeout(function() {
					opts.onKeyValidation.call(input, c, valResult);
				}, 0);
				if (maskset.writeOutBuffer && valResult !== false) writeBuffer(input, getBuffer.call(inputmask), forwardPosition, e, checkval !== true);
			}
			e.preventDefault();
			if (checkval) {
				if (valResult !== false) valResult.forwardPosition = forwardPosition;
				return valResult;
			}
		}
	},
	pasteEvent: async function(e) {
		function handlePaste(inputmask, input, inputValue, pastedValue, onBeforePaste) {
			let caretPos = caret.call(inputmask, input, void 0, void 0, true), valueBeforeCaret = inputValue.substr(0, caretPos.begin), valueAfterCaret = inputValue.substr(caretPos.end, inputValue.length);
			if (valueBeforeCaret == (inputmask.isRTL ? getBufferTemplate.call(inputmask).slice().reverse() : getBufferTemplate.call(inputmask)).slice(0, caretPos.begin).join("")) valueBeforeCaret = "";
			if (valueAfterCaret == (inputmask.isRTL ? getBufferTemplate.call(inputmask).slice().reverse() : getBufferTemplate.call(inputmask)).slice(caretPos.end).join("")) valueAfterCaret = "";
			pastedValue = valueBeforeCaret + pastedValue + valueAfterCaret;
			if (inputmask.isRTL && opts.numericInput !== true) {
				pastedValue = pastedValue.split("");
				for (const c of getBufferTemplate.call(inputmask)) if (pastedValue[0] === c) pastedValue.shift();
				pastedValue = pastedValue.reverse().join("");
			}
			let pasteValue = pastedValue;
			if (typeof onBeforePaste === "function") {
				pasteValue = onBeforePaste.call(inputmask, pasteValue, opts);
				if (pasteValue === false) return false;
				if (!pasteValue) pasteValue = inputValue;
			}
			checkVal(input, true, false, pasteValue.toString().split(""), e);
		}
		const input = this, inputmask = this.inputmask, opts = inputmask.opts;
		let inputValue = inputmask._valueGet(true), pastedValue;
		inputmask.skipInputEvent = true;
		if (e.clipboardData && e.clipboardData.getData) pastedValue = e.clipboardData.getData("text/plain");
		else if (window_default.clipboardData && window_default.clipboardData.getData) pastedValue = window_default.clipboardData.getData("Text");
		handlePaste(inputmask, input, inputValue, pastedValue, opts.onBeforePaste);
		e.preventDefault();
	},
	inputFallBackEvent: function(e) {
		const inputmask = this.inputmask, opts = inputmask.opts, $ = inputmask.dependencyLib;
		function analyseChanges(inputValue, buffer, caretPos) {
			let frontPart = inputValue.substr(0, caretPos.begin).split(""), backPart = inputValue.substr(caretPos.begin).split(""), frontBufferPart = buffer.substr(0, caretPos.begin).split(""), backBufferPart = buffer.substr(caretPos.begin).split(""), fpl = frontPart.length >= frontBufferPart.length ? frontPart.length : frontBufferPart.length, bpl = backPart.length >= backBufferPart.length ? backPart.length : backBufferPart.length, bl, i, action = "", data = [], marker = "~", placeholder;
			while (frontPart.length < fpl) frontPart.push(marker);
			while (frontBufferPart.length < fpl) frontBufferPart.push(marker);
			while (backPart.length < bpl) backPart.unshift(marker);
			while (backBufferPart.length < bpl) backBufferPart.unshift(marker);
			const newBuffer = frontPart.concat(backPart), oldBuffer = frontBufferPart.concat(backBufferPart);
			for (i = 0, bl = newBuffer.length; i < bl; i++) {
				placeholder = getPlaceholder.call(inputmask, translatePosition.call(inputmask, i));
				switch (action) {
					case "insertText":
						if (oldBuffer[i - 1] === newBuffer[i] && caretPos.begin == newBuffer.length - 1) data.push(newBuffer[i]);
						i = bl;
						break;
					case "insertReplacementText":
						if (newBuffer[i] === marker) caretPos.end++;
						else i = bl;
						break;
					case "deleteContentBackward":
						if (newBuffer[i] === marker) caretPos.end++;
						else i = bl;
						break;
					default: if (newBuffer[i] !== oldBuffer[i]) {
						if ((newBuffer[i + 1] === marker || newBuffer[i + 1] === placeholder || newBuffer[i + 1] === void 0) && (oldBuffer[i] === placeholder && oldBuffer[i + 1] === marker || oldBuffer[i] === marker)) {
							action = "insertText";
							data.push(newBuffer[i]);
							caretPos.begin--;
							caretPos.end--;
						} else if (oldBuffer[i + 1] === marker && oldBuffer[i] === newBuffer[i + 1]) {
							action = "insertText";
							data.push(newBuffer[i]);
							caretPos.begin--;
							caretPos.end--;
						} else if (newBuffer[i] !== placeholder && newBuffer[i] !== marker && (newBuffer[i + 1] === marker || oldBuffer[i] !== newBuffer[i] && oldBuffer[i + 1] === newBuffer[i + 1])) {
							action = "insertReplacementText";
							data.push(newBuffer[i]);
							caretPos.begin--;
						} else if (newBuffer[i] === marker) {
							action = "deleteContentBackward";
							if (isMask.call(inputmask, translatePosition.call(inputmask, i), true) || oldBuffer[i] === opts.radixPoint) caretPos.end++;
						} else i = bl;
					}
				}
			}
			return {
				action,
				data,
				caret: caretPos
			};
		}
		let input = this, inputValue = input.inputmask._valueGet(true), buffer = (inputmask.isRTL ? getBuffer.call(inputmask).slice().reverse() : getBuffer.call(inputmask)).join(""), caretPos = caret.call(inputmask, input, void 0, void 0, true), changes;
		if (buffer !== inputValue) {
			changes = analyseChanges(inputValue, buffer, caretPos);
			if (input.getRootNode().activeElement !== input) input.focus();
			writeBuffer(input, getBuffer.call(inputmask));
			caret.call(inputmask, input, caretPos.begin, caretPos.end, true);
			if (!mobile && inputmask.skipNextInsert && e.inputType === "insertText" && changes.action === "insertText" && inputmask.isComposing) return false;
			if (e.inputType === "insertCompositionText" && changes.action === "insertText" && inputmask.isComposing) inputmask.skipNextInsert = true;
			else inputmask.skipNextInsert = false;
			switch (changes.action) {
				case "insertText":
				case "insertReplacementText":
					changes.data.forEach(function(entry, ndx) {
						const keypress = new $.Event("keypress");
						keypress.key = entry;
						inputmask.ignorable = false;
						EventHandlers.keypressEvent.call(input, keypress);
					});
					setTimeout(function() {
						inputmask.$el.trigger("keyup");
					}, 0);
					break;
				case "deleteContentBackward":
					var keydown = new $.Event("keydown");
					keydown.key = keys.Backspace;
					EventHandlers.keyEvent.call(input, keydown);
					break;
				default:
					applyInputValue(input, inputValue, e);
					caret.call(inputmask, input, caretPos.begin, caretPos.end, true);
			}
			e.preventDefault();
		}
	},
	setValueEvent: function(e) {
		const inputmask = this.inputmask, $ = inputmask.dependencyLib;
		let input = this, value = e && e.detail ? e.detail[0] : arguments[1];
		if (value === void 0) value = input.inputmask._valueGet(true);
		applyInputValue(input, value, new $.Event("input"), (e && e.detail ? e.detail[0] : arguments[1]) !== void 0);
		if (e.detail && e.detail[1] !== void 0 || arguments[2] !== void 0) caret.call(inputmask, input, e.detail ? e.detail[1] : arguments[2]);
	},
	focusEvent: function(e) {
		const inputmask = this.inputmask, opts = inputmask.opts, input = this, nptValue = inputmask && inputmask._valueGet();
		if (opts.showMaskOnFocus) {
			if (nptValue !== getBuffer.call(inputmask).join("")) writeBuffer(input, getBuffer.call(inputmask), seekNext.call(inputmask, getLastValidPosition.call(inputmask)));
		}
		if (opts.positionCaretOnTab === true && inputmask.mouseEnter === false && (!isComplete.call(inputmask, getBuffer.call(inputmask)) || getLastValidPosition.call(inputmask) === -1)) EventHandlers.clickEvent.apply(input, [e, true]);
		inputmask.undoValue = inputmask && inputmask._valueGet(true);
	},
	invalidEvent: function(e) {
		this.inputmask.validationEvent = true;
	},
	mouseleaveEvent: function() {
		const inputmask = this.inputmask, opts = inputmask.opts, input = this;
		inputmask.mouseEnter = false;
		if (opts.clearMaskOnLostFocus && input.getRootNode().activeElement !== input) HandleNativePlaceholder(input, inputmask.originalPlaceholder);
	},
	clickEvent: function(e, tabbed) {
		const inputmask = this.inputmask;
		inputmask.clicked++;
		const input = this;
		if (input.getRootNode().activeElement === input) {
			const newCaretPosition = determineNewCaretPosition.call(inputmask, caret.call(inputmask, input), tabbed);
			if (newCaretPosition !== void 0) caret.call(inputmask, input, newCaretPosition);
		}
	},
	cutEvent: function(e) {
		const inputmask = this.inputmask, maskset = inputmask.maskset, input = this, pos = caret.call(inputmask, input), clipData = inputmask.isRTL ? getBuffer.call(inputmask).slice(pos.end, pos.begin) : getBuffer.call(inputmask).slice(pos.begin, pos.end), clipDataText = inputmask.isRTL ? clipData.reverse().join("") : clipData.join("");
		if (window_default.navigator && window_default.navigator.clipboard) window_default.navigator.clipboard.writeText(clipDataText);
		else if (window_default.clipboardData && window_default.clipboardData.getData) window_default.clipboardData.setData("Text", clipDataText);
		handleRemove.call(inputmask, input, keys.Delete, pos);
		writeBuffer(input, getBuffer.call(inputmask), maskset.p, e, inputmask.undoValue !== inputmask._valueGet(true));
	},
	blurEvent: function(e) {
		const inputmask = this.inputmask, opts = inputmask.opts, $ = inputmask.dependencyLib;
		inputmask.clicked = 0;
		const $input = $(this), input = this;
		if (input.inputmask) {
			HandleNativePlaceholder(input, inputmask.originalPlaceholder);
			let nptValue = input.inputmask._valueGet(), buffer = getBuffer.call(inputmask).slice();
			if (nptValue !== "") {
				if (opts.clearMaskOnLostFocus) {
					if (getLastValidPosition.call(inputmask) === -1 && nptValue === getBufferTemplate.call(inputmask).join("")) buffer = [];
					else clearOptionalTail.call(inputmask, buffer);
				}
				if (isComplete.call(inputmask, buffer) === false) {
					setTimeout(function() {
						$input.trigger("incomplete");
					}, 0);
					if (opts.clearIncomplete) {
						resetMaskSet.call(inputmask, false);
						if (opts.clearMaskOnLostFocus) buffer = [];
						else buffer = getBufferTemplate.call(inputmask).slice();
					}
				}
				writeBuffer(input, buffer, void 0, e);
			}
			nptValue = inputmask._valueGet(true);
			if (inputmask.undoValue !== nptValue) {
				const bufferTemplateStr = (inputmask.isRTL ? getBufferTemplate.call(inputmask).slice().reverse() : getBufferTemplate.call(inputmask)).join("");
				if (nptValue !== "" || inputmask.undoValue !== bufferTemplateStr || inputmask.undoValue === bufferTemplateStr && inputmask.maskset.validPositions.length > 0) {
					inputmask.undoValue = nptValue;
					$input.trigger("change");
				}
			}
		}
	},
	mouseenterEvent: function() {
		const inputmask = this.inputmask, { showMaskOnHover } = inputmask.opts, input = this;
		inputmask.mouseEnter = true;
		if (input.getRootNode().activeElement !== input) {
			const bufferTemplate = (inputmask.isRTL ? getBufferTemplate.call(inputmask).slice().reverse() : getBufferTemplate.call(inputmask)).join("");
			if (showMaskOnHover) HandleNativePlaceholder(input, bufferTemplate);
		}
	},
	submitEvent: function() {
		const inputmask = this.inputmask, opts = inputmask.opts;
		if (inputmask.undoValue !== inputmask._valueGet(true)) inputmask.$el.trigger("change");
		if (getLastValidPosition.call(inputmask) === -1 && inputmask._valueGet && inputmask._valueGet() === getBufferTemplate.call(inputmask).join("")) inputmask._valueSet("");
		if (opts.clearIncomplete && isComplete.call(inputmask, getBuffer.call(inputmask)) === false) inputmask._valueSet("");
		if (opts.removeMaskOnSubmit) {
			inputmask._valueSet(inputmask.unmaskedvalue(), true);
			setTimeout(function() {
				writeBuffer(inputmask.el, getBuffer.call(inputmask));
			}, 0);
		}
	},
	resetEvent: function() {
		const inputmask = this.inputmask;
		inputmask.refreshValue = true;
		setTimeout(function() {
			applyInputValue(inputmask.el, inputmask._valueGet(true));
		}, 0);
	}
};
//#endregion
//#region node_modules/inputmask/lib/inputHandling.js
function applyInputValue(input, value, initialEvent, strict) {
	const inputmask = input ? input.inputmask : this, opts = inputmask.opts;
	input.inputmask.refreshValue = false;
	if (strict !== true && typeof opts.onBeforeMask === "function") value = opts.onBeforeMask.call(inputmask, value, opts) || value;
	value = (value || "").toString().split("");
	checkVal(input, true, false, value, initialEvent);
	inputmask.undoValue = inputmask._valueGet(true);
	if ((opts.clearMaskOnLostFocus || opts.clearIncomplete) && input.inputmask._valueGet() === getBufferTemplate.call(inputmask).join("") && getLastValidPosition.call(inputmask) === -1) input.inputmask._valueSet("");
}
function clearOptionalTail(buffer) {
	const inputmask = this;
	buffer.length = 0;
	let template = getMaskTemplate.call(inputmask, true, 0, true, void 0, true), lmnt;
	while ((lmnt = template.shift()) !== void 0) buffer.push(lmnt);
	return buffer;
}
function checkVal(input, writeOut, strict, nptvl, initiatingEvent) {
	const inputmask = input ? input.inputmask : this, maskset = inputmask.maskset, opts = inputmask.opts, $ = inputmask.dependencyLib;
	let inputValue = nptvl.slice(), charCodes = "", initialNdx = -1, result, skipOptionalPartCharacter = opts.skipOptionalPartCharacter;
	opts.skipOptionalPartCharacter = "";
	function isTemplateMatch(ndx, charCodes) {
		let targetTemplate = getMaskTemplate.call(inputmask, true, 0).slice(ndx, seekNext.call(inputmask, ndx, false, false)).join("").replace(/'/g, ""), charCodeNdx = targetTemplate.indexOf(charCodes);
		while (charCodeNdx > 0 && targetTemplate[charCodeNdx - 1] === " ") charCodeNdx--;
		const match = charCodeNdx === 0 && !isMask.call(inputmask, ndx) && (getTest.call(inputmask, ndx).match.nativeDef === charCodes.charAt(0) || getTest.call(inputmask, ndx).match.static === true && getTest.call(inputmask, ndx).match.nativeDef === "'" + charCodes.charAt(0) || getTest.call(inputmask, ndx).match.nativeDef === " " && (getTest.call(inputmask, ndx + 1).match.nativeDef === charCodes.charAt(0) || getTest.call(inputmask, ndx + 1).match.static === true && getTest.call(inputmask, ndx + 1).match.nativeDef === "'" + charCodes.charAt(0)));
		if (!match && charCodeNdx > 0 && !isMask.call(inputmask, ndx, false, true)) {
			const nextPos = seekNext.call(inputmask, ndx);
			if (inputmask.caretPos.begin < nextPos) inputmask.caretPos = { begin: nextPos };
		}
		return match;
	}
	resetMaskSet.call(inputmask, false);
	inputmask.clicked = 0;
	initialNdx = opts.radixPoint ? determineNewCaretPosition.call(inputmask, {
		begin: 0,
		end: 0
	}, false, opts.__financeInput === false ? "radixFocus" : void 0).begin : 0;
	maskset.p = initialNdx;
	inputmask.caretPos = { begin: initialNdx };
	let staticMatches = [], prevCaretPos = inputmask.caretPos;
	inputValue.forEach(function(charCode, ndx) {
		if (charCode !== void 0) {
			const keypress = new $.Event("_checkval");
			keypress.key = charCode;
			charCodes += charCode;
			const lvp = getLastValidPosition.call(inputmask, void 0, true);
			if (!isTemplateMatch(initialNdx, charCodes)) {
				result = EventHandlers.keypressEvent.call(inputmask, keypress, true, false, strict, inputmask.caretPos.begin);
				if (result) {
					initialNdx = inputmask.caretPos.begin + 1;
					charCodes = "";
				}
			} else result = getTest.call(inputmask, ndx).match.static === true ? EventHandlers.keypressEvent.call(inputmask, keypress, true, false, strict, lvp + 1) : false;
			if (result) {
				if (result.pos !== void 0 && maskset.validPositions[result.pos] && maskset.validPositions[result.pos].match.static === true && maskset.validPositions[result.pos].alternation === void 0) {
					staticMatches.push(result.pos);
					if (!inputmask.isRTL) result.forwardPosition = result.pos + 1;
				}
				writeBuffer.call(inputmask, void 0, getBuffer.call(inputmask), result.forwardPosition, keypress, false);
				inputmask.caretPos = {
					begin: result.forwardPosition,
					end: result.forwardPosition
				};
				prevCaretPos = inputmask.caretPos;
			} else if (maskset.validPositions[ndx] === void 0 && inputValue[ndx] === getPlaceholder.call(inputmask, ndx) && isMask.call(inputmask, ndx, true)) inputmask.caretPos.begin++;
			else inputmask.caretPos = prevCaretPos;
		}
	});
	if (staticMatches.length > 0) {
		let sndx, validPos, nextValid = seekNext.call(inputmask, -1, void 0, false);
		if (!isComplete.call(inputmask, getBuffer.call(inputmask)) && staticMatches.length <= nextValid || isComplete.call(inputmask, getBuffer.call(inputmask)) && staticMatches.length > 0 && staticMatches.length !== nextValid && staticMatches[0] === 0) {
			let nextSndx = nextValid;
			while ((sndx = staticMatches.shift()) !== void 0) if (sndx < nextSndx) {
				const keypress = new $.Event("_checkval");
				validPos = maskset.validPositions[sndx];
				validPos.generatedInput = true;
				keypress.key = validPos.input;
				result = EventHandlers.keypressEvent.call(inputmask, keypress, true, false, strict, nextSndx);
				if (result && result.pos !== void 0 && result.pos !== sndx && maskset.validPositions[result.pos] && maskset.validPositions[result.pos].match.static === true) staticMatches.push(result.pos);
				else if (!result) break;
				nextSndx++;
			}
		} else while (sndx = staticMatches.pop()) {
			validPos = maskset.validPositions[sndx];
			if (validPos && maskset.validPositions[sndx + 1] === void 0) delete maskset.validPositions[sndx];
		}
	}
	if (writeOut) writeBuffer.call(inputmask, input, getBuffer.call(inputmask), result ? result.forwardPosition : inputmask.caretPos.begin, initiatingEvent || new $.Event("checkval"), initiatingEvent && (initiatingEvent.type === "input" && inputmask.undoValue !== getBuffer.call(inputmask).join("") || initiatingEvent.type === "paste"));
	opts.skipOptionalPartCharacter = skipOptionalPartCharacter;
}
function HandleNativePlaceholder(npt, value) {
	const inputmask = npt ? npt.inputmask : this;
	if (ie) {
		if (npt.inputmask._valueGet() !== value && (npt.placeholder !== value || npt.placeholder === "")) {
			let buffer = getBuffer.call(inputmask).slice(), nptValue = npt.inputmask._valueGet();
			if (nptValue !== value) {
				const lvp = getLastValidPosition.call(inputmask);
				if (lvp === -1 && nptValue === getBufferTemplate.call(inputmask).join("")) buffer = [];
				else if (lvp !== -1) clearOptionalTail.call(inputmask, buffer);
				writeBuffer(npt, buffer);
			}
		}
	} else if (npt.placeholder !== value) {
		npt.placeholder = value;
		if (npt.placeholder === "") npt.removeAttribute("placeholder");
	}
}
function unmaskedvalue(input) {
	const inputmask = input ? input.inputmask : this, opts = inputmask.opts, maskset = inputmask.maskset;
	if (input) {
		if (input.inputmask === void 0) return input.value;
		if (input.inputmask && input.inputmask.refreshValue) applyInputValue(input, input.inputmask._valueGet(true));
	}
	const umValue = [], vps = maskset.validPositions;
	for (let pndx = 0, vpl = vps.length; pndx < vpl; pndx++) if (vps[pndx] && vps[pndx].match && (vps[pndx].match.static != true || opts.keepStatic !== true && Array.isArray(maskset.metadata) && vps[pndx].generatedInput !== true)) umValue.push(vps[pndx].input);
	let unmaskedValue = umValue.length === 0 ? "" : (inputmask.isRTL ? umValue.reverse() : umValue).join("");
	if (typeof opts.onUnMask === "function") {
		const bufferValue = (inputmask.isRTL ? getBuffer.call(inputmask).slice().reverse() : getBuffer.call(inputmask)).join("");
		unmaskedValue = opts.onUnMask.call(inputmask, bufferValue, unmaskedValue, opts);
	}
	if (opts.outputMask && unmaskedValue.length > 0) return Inputmask.format(unmaskedValue, {
		...opts,
		mask: opts.outputMask,
		alias: null
	});
	return unmaskedValue;
}
function writeBuffer(input, buffer, caretPos, event, triggerEvents) {
	const inputmask = input ? input.inputmask : this, opts = inputmask.opts, $ = inputmask.dependencyLib;
	if (event && typeof opts.onBeforeWrite === "function") {
		const result = opts.onBeforeWrite.call(inputmask, event, buffer, caretPos, opts);
		if (result) {
			if (result.refreshFromBuffer) {
				const refresh = result.refreshFromBuffer;
				refreshFromBuffer.call(inputmask, refresh === true ? refresh : refresh.start, refresh.end, result.buffer || buffer);
				buffer = getBuffer.call(inputmask, true);
			}
			if (caretPos !== void 0) caretPos = result.caret !== void 0 ? result.caret : caretPos;
		}
	}
	if (input !== void 0) {
		input.inputmask._valueSet(buffer.join(""));
		if (caretPos !== void 0 && (event === void 0 || event.type !== "blur")) caret.call(inputmask, input, caretPos, void 0, void 0, event !== void 0 && event.type === "keydown" && (event.key === keys.Delete || event.key === keys.Backspace));
		input.inputmask.writeBufferHook === void 0 || input.inputmask.writeBufferHook(caretPos);
		if (triggerEvents === true) {
			const $input = $(input), nptVal = input.inputmask._valueGet();
			input.inputmask.skipInputEvent = true;
			$input.trigger("input");
			setTimeout(function() {
				if (nptVal === getBufferTemplate.call(inputmask).join("")) $input.trigger("cleared");
				else if (isComplete.call(inputmask, buffer) === true) $input.trigger("complete");
			}, 0);
		}
	}
}
//#endregion
//#region node_modules/inputmask/lib/eventruler.js
var EventRuler = {
	on: function(input, eventName, eventHandler) {
		const $ = input.inputmask.dependencyLib;
		let ev = function(e) {
			if (e.originalEvent) {
				e = e.originalEvent || e;
				arguments[0] = e;
			}
			const that = this, inputmask = that.inputmask, opts = inputmask ? inputmask.opts : void 0;
			let args;
			if (inputmask === void 0 && this.nodeName !== "FORM") {
				const imOpts = $.data(that, "_inputmask_opts");
				$(that).off();
				if (imOpts) new Inputmask(imOpts).mask(that);
			} else if (![
				"submit",
				"reset",
				"setvalue"
			].includes(e.type) && this.nodeName !== "FORM" && (that.disabled || that.readOnly && !(e.type === "keydown" && e.ctrlKey && e.key === keys.c || opts.tabThrough === false && e.key === keys.Tab))) e.preventDefault();
			else {
				switch (e.type) {
					case "input":
						if (inputmask.skipInputEvent === true) {
							inputmask.skipInputEvent = false;
							return e.preventDefault();
						}
						inputmask.lastInputEvent = {
							time: Date.now(),
							data: e.data
						};
						break;
					case "keydown":
						if (inputmask.lastInputEvent && Date.now() - inputmask.lastInputEvent.time < 10 && inputmask.lastInputEvent.data === e.key) return false;
						break;
					case "click":
					case "focus":
						if (inputmask.validationEvent) {
							inputmask.validationEvent = false;
							input.blur();
							HandleNativePlaceholder(input, (inputmask.isRTL ? getBufferTemplate.call(inputmask).slice().reverse() : getBufferTemplate.call(inputmask)).join(""));
							setTimeout(function() {
								input.focus();
							}, opts.validationEventTimeOut);
							return false;
						}
						args = arguments;
						setTimeout(function() {
							if (!input.inputmask) return;
							eventHandler.apply(that, args);
						}, 0);
						return;
				}
				const returnVal = eventHandler.apply(that, arguments);
				if (returnVal === false) {
					e.preventDefault();
					e.stopPropagation();
				}
				return returnVal;
			}
		};
		eventName = `${eventName}.inputmask`;
		if (["submit.inputmask", "reset.inputmask"].includes(eventName)) {
			ev = ev.bind(input);
			if (input.form !== null) $(input.form).on(eventName, ev);
		} else $(input).on(eventName, ev);
	},
	off: function(input, event) {
		if (input.inputmask) {
			const $ = input.inputmask.dependencyLib;
			$(input).off(event || ".inputmask");
		}
	}
};
//#endregion
//#region node_modules/inputmask/lib/mask.js
function mask() {
	const inputmask = this, opts = this.opts, el = this.el, $ = this.dependencyLib;
	function isElementTypeSupported(input, opts) {
		function patchValueProperty(npt) {
			let valueGet, valueSet;
			function patchValhook(type) {
				if ($.valHooks && ($.valHooks[type] === void 0 || $.valHooks[type].inputmaskpatch !== true)) {
					const valhookGet = $.valHooks[type] && $.valHooks[type].get ? $.valHooks[type].get : function(elem) {
						return elem.value;
					}, valhookSet = $.valHooks[type] && $.valHooks[type].set ? $.valHooks[type].set : function(elem, value) {
						elem.value = value;
						return elem;
					};
					$.valHooks[type] = {
						get: function(elem) {
							if (elem.inputmask) {
								if (elem.inputmask.opts.autoUnmask) return elem.inputmask.unmaskedvalue();
								else {
									const result = valhookGet(elem);
									return getLastValidPosition.call(inputmask, void 0, void 0, elem.inputmask.maskset.validPositions) !== -1 || opts.nullable !== true ? result : "";
								}
							} else return valhookGet(elem);
						},
						set: function(elem, value) {
							const result = valhookSet(elem, value);
							if (elem.inputmask) applyInputValue(elem, value);
							return result;
						},
						inputmaskpatch: true
					};
				}
			}
			function getter() {
				if (this.inputmask) return this.inputmask.opts.autoUnmask ? this.inputmask.unmaskedvalue() : getLastValidPosition.call(inputmask) !== -1 || opts.nullable !== true ? this.getRootNode().activeElement === this && opts.clearMaskOnLostFocus ? (inputmask.isRTL ? clearOptionalTail.call(inputmask, getBuffer.call(inputmask).slice()).reverse() : clearOptionalTail.call(inputmask, getBuffer.call(inputmask).slice())).join("") : valueGet.call(this) : "";
				else return valueGet.call(this);
			}
			function setter(value) {
				valueSet.call(this, value);
				if (this.inputmask) applyInputValue(this, value);
			}
			function installNativeValueSetFallback(npt) {
				EventRuler.on(npt, "mouseenter", function() {
					const input = this, value = input.inputmask._valueGet(true);
					if (value != (input.inputmask.isRTL ? getBuffer.call(input.inputmask).slice().reverse() : getBuffer.call(input.inputmask)).join("")) applyInputValue(input, value);
				});
			}
			if (!npt.inputmask.__valueGet) {
				if (opts.noValuePatching !== true) {
					if (Object.getOwnPropertyDescriptor) {
						const valueProperty = Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(npt), "value") : void 0;
						if (valueProperty && valueProperty.get && valueProperty.set) {
							valueGet = valueProperty.get;
							valueSet = valueProperty.set;
							Object.defineProperty(npt, "value", {
								get: getter,
								set: setter,
								configurable: true
							});
						} else if (npt.tagName.toLowerCase() !== "input") {
							valueGet = function() {
								return this.textContent;
							};
							valueSet = function(value) {
								this.textContent = value;
							};
							Object.defineProperty(npt, "value", {
								get: getter,
								set: setter,
								configurable: true
							});
						}
					} else if (document.__lookupGetter__ && npt.__lookupGetter__("value")) {
						valueGet = npt.__lookupGetter__("value");
						valueSet = npt.__lookupSetter__("value");
						npt.__defineGetter__("value", getter);
						npt.__defineSetter__("value", setter);
					}
					npt.inputmask.__valueGet = valueGet;
					npt.inputmask.__valueSet = valueSet;
				}
				npt.inputmask._valueGet = function(overruleRTL) {
					return inputmask.isRTL && overruleRTL !== true ? valueGet.call(this.el).split("").reverse().join("") : valueGet.call(this.el);
				};
				npt.inputmask._valueSet = function(value, overruleRTL) {
					valueSet.call(this.el, value === null || value === void 0 ? "" : overruleRTL !== true && inputmask.isRTL ? value.split("").reverse().join("") : value);
				};
				if (valueGet === void 0) {
					valueGet = function() {
						return this.value;
					};
					valueSet = function(value) {
						this.value = value;
					};
					patchValhook(npt.type);
					installNativeValueSetFallback(npt);
				}
			}
		}
		const elementType = input.getAttribute("type");
		let isSupported = input.tagName.toLowerCase() === "input" && opts.supportsInputType.includes(elementType) || input.isContentEditable || input.tagName.toLowerCase() === "textarea";
		if (!isSupported) {
			if (input.tagName.toLowerCase() === "input") {
				let el = document.createElement("input");
				el.setAttribute("type", elementType);
				isSupported = el.type === "text";
				el = null;
			} else isSupported = "partial";
		}
		if (isSupported !== false) patchValueProperty(input);
		else input.inputmask = void 0;
		return isSupported;
	}
	EventRuler.off(el);
	const isSupported = isElementTypeSupported(el, opts);
	if (isSupported !== false) {
		inputmask.originalPlaceholder = el.placeholder;
		inputmask.maxLength = el !== void 0 ? el.maxLength : void 0;
		if (inputmask.maxLength === -1) inputmask.maxLength = void 0;
		if ("inputMode" in el && el.getAttribute("inputmode") === null) {
			el.inputMode = opts.inputmode;
			el.setAttribute("inputmode", opts.inputmode);
		}
		if (isSupported === true) {
			opts.showMaskOnFocus = opts.showMaskOnFocus && ["cc-number", "cc-exp"].indexOf(el.autocomplete) === -1;
			if (iphone) {
				opts.insertModeVisual = false;
				el.setAttribute("autocorrect", "off");
			}
			EventRuler.on(el, "submit", EventHandlers.submitEvent);
			EventRuler.on(el, "reset", EventHandlers.resetEvent);
			EventRuler.on(el, "blur", EventHandlers.blurEvent);
			EventRuler.on(el, "focus", EventHandlers.focusEvent);
			EventRuler.on(el, "invalid", EventHandlers.invalidEvent);
			EventRuler.on(el, "click", EventHandlers.clickEvent);
			EventRuler.on(el, "mouseleave", EventHandlers.mouseleaveEvent);
			EventRuler.on(el, "mouseenter", EventHandlers.mouseenterEvent);
			EventRuler.on(el, "paste", EventHandlers.pasteEvent);
			EventRuler.on(el, "cut", EventHandlers.cutEvent);
			EventRuler.on(el, "complete", opts.oncomplete);
			EventRuler.on(el, "incomplete", opts.onincomplete);
			EventRuler.on(el, "cleared", opts.oncleared);
			if (opts.inputEventOnly !== true) EventRuler.on(el, "keydown", EventHandlers.keyEvent);
			if (mobile || opts.inputEventOnly) el.removeAttribute("maxLength");
			EventRuler.on(el, "input", EventHandlers.inputFallBackEvent);
		}
		EventRuler.on(el, "setvalue", EventHandlers.setValueEvent);
		inputmask.applyMaskHook === void 0 || inputmask.applyMaskHook();
		getBufferTemplate.call(inputmask).join("");
		inputmask.undoValue = inputmask._valueGet(true);
		const activeElement = el.getRootNode().activeElement;
		if (el.inputmask._valueGet(true) !== "" || opts.clearMaskOnLostFocus === false || activeElement === el) {
			applyInputValue(el, el.inputmask._valueGet(true));
			let buffer = getBuffer.call(inputmask).slice();
			if (isComplete.call(inputmask, buffer) === false) {
				if (opts.clearIncomplete) resetMaskSet.call(inputmask, false);
			}
			if (opts.clearMaskOnLostFocus && activeElement !== el) {
				if (getLastValidPosition.call(inputmask) === -1) buffer = [];
				else clearOptionalTail.call(inputmask, buffer);
			}
			if (opts.clearMaskOnLostFocus === false || opts.showMaskOnFocus && activeElement === el || el.inputmask._valueGet(true) !== "") writeBuffer(el, buffer);
			if (activeElement === el) caret.call(inputmask, el, seekNext.call(inputmask, getLastValidPosition.call(inputmask)));
			else caret.call(inputmask, el, 0);
		}
	}
}
//#endregion
//#region node_modules/inputmask/lib/escapeRegex.js
var escapeRegexRegex = new RegExp("(\\" + [
	"/",
	".",
	"*",
	"+",
	"?",
	"|",
	"(",
	")",
	"[",
	"]",
	"{",
	"}",
	"\\",
	"$",
	"^"
].join("|\\") + ")", "gim");
function escapeRegex(str) {
	return str.replace(escapeRegexRegex, "\\$1");
}
//#endregion
//#region node_modules/inputmask/lib/masktoken.js
function masktoken_default(isGroup, isOptional, isQuantifier, isAlternator) {
	this.matches = [];
	this.openGroup = isGroup || false;
	this.alternatorGroup = false;
	this.isGroup = isGroup || false;
	this.isOptional = isOptional || false;
	this.isQuantifier = isQuantifier || false;
	this.isAlternator = isAlternator || false;
	this.quantifier = {
		min: 1,
		max: 1
	};
}
//#endregion
//#region node_modules/inputmask/lib/mask-lexer.js
function generateMaskSet(opts, nocache) {
	let ms;
	function preProcessMask(mask, { repeat, groupmarker, quantifiermarker, keepStatic }) {
		if (repeat > 0 || repeat === "*" || repeat === "+") {
			const repeatStart = repeat === "*" ? 0 : repeat === "+" ? 1 : repeat;
			if (repeatStart !== repeat) mask = groupmarker[0] + mask + groupmarker[1] + quantifiermarker[0] + repeatStart + "," + repeat + quantifiermarker[1];
			else {
				const msk = mask;
				for (let i = 1; i < repeatStart; i++) mask += msk;
			}
		}
		if (keepStatic === true) {
			const maskMatches = mask.match(/* @__PURE__ */ new RegExp("(.)\\[([^\\]]*)\\]", "g"));
			maskMatches && maskMatches.forEach((m, i) => {
				let [p1, p2] = m.split("[");
				p2 = p2.replace("]", "");
				mask = mask.replace(new RegExp(`${escapeRegex(p1)}\\[${escapeRegex(p2)}\\]`), p1.charAt(0) === p2.charAt(0) ? `(${p1}|${p1}${p2})` : `${p1}[${p2}]`);
			});
		}
		return mask;
	}
	function generateMask(mask, metadata, opts) {
		let regexMask = false;
		if (mask === null || mask === "") {
			regexMask = opts.regex !== null;
			if (regexMask) {
				mask = opts.regex;
				mask = mask.replace(/^(\^)(.*)(\$)$/, "$2");
			} else {
				regexMask = true;
				mask = ".*";
			}
		}
		if (mask.length === 1 && opts.greedy === false && opts.repeat !== 0) opts.placeholder = "";
		mask = preProcessMask(mask, opts);
		let masksetDefinition, maskdefKey;
		maskdefKey = regexMask ? "regex_" + opts.regex : opts.numericInput ? mask.split("").reverse().join("") : mask;
		if (opts.keepStatic !== null) maskdefKey = "ks_" + opts.keepStatic + maskdefKey;
		if (typeof opts.placeholder === "object") maskdefKey = "ph_" + JSON.stringify(opts.placeholder) + maskdefKey;
		if (Inputmask.prototype.masksCache[maskdefKey] === void 0 || nocache === true) {
			masksetDefinition = {
				mask,
				maskToken: Inputmask.prototype.analyseMask(mask, regexMask, opts),
				validPositions: [],
				_buffer: void 0,
				buffer: void 0,
				tests: {},
				excludes: {},
				metadata,
				maskLength: void 0,
				jitOffset: {}
			};
			if (nocache !== true) {
				Inputmask.prototype.masksCache[maskdefKey] = masksetDefinition;
				masksetDefinition = DependencyLib.extend(true, {}, Inputmask.prototype.masksCache[maskdefKey]);
			}
		} else masksetDefinition = DependencyLib.extend(true, {}, Inputmask.prototype.masksCache[maskdefKey]);
		return masksetDefinition;
	}
	if (typeof opts.mask === "function") opts.mask = opts.mask(opts);
	if (Array.isArray(opts.mask)) {
		if (opts.mask.length > 1) {
			if (opts.keepStatic === null) opts.keepStatic = true;
			let altMask = opts.groupmarker[0];
			(opts.isRTL ? opts.mask.reverse() : opts.mask).forEach(function(msk) {
				if (altMask.length > 1) altMask += opts.alternatormarker;
				if (msk.mask !== void 0 && typeof msk.mask !== "function") altMask += msk.mask;
				else altMask += msk;
			});
			altMask += opts.groupmarker[1];
			return generateMask(altMask, opts.mask, opts);
		} else opts.mask = opts.mask.pop();
	}
	if (opts.mask && opts.mask.mask !== void 0 && typeof opts.mask.mask !== "function") ms = generateMask(opts.mask.mask, opts.mask, opts);
	else ms = generateMask(opts.mask, opts.mask, opts);
	if (opts.keepStatic === null) opts.keepStatic = false;
	return ms;
}
function analyseMask(mask, regexMask, opts) {
	const tokenizer = /(?:[?*+]|\{[0-9+*]+(?:,[0-9+*]*)?(?:\|[0-9+*]*)?\})|[^.?*+^${[]()|\\]+|./g, regexTokenizer = /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g, currentToken = new masktoken_default(), openenings = [], maskTokens = [];
	let escaped = false, match, m, openingToken, currentOpeningToken, alternator, lastMatch, closeRegexGroup = false;
	function insertTestDefinition(mtoken, element, position) {
		position = position !== void 0 ? position : mtoken.matches.length;
		let prevMatch = mtoken.matches[position - 1], flag = opts.casing ? "i" : "";
		if (regexMask) {
			if (element.indexOf("[") === 0 || escaped && /\\d|\\s|\\w|\\p/i.test(element) || element === ".") {
				if (/\\p\{.*}/i.test(element)) flag += "u";
				mtoken.matches.splice(position++, 0, {
					fn: new RegExp(element, flag),
					static: false,
					optionality: false,
					newBlockMarker: prevMatch === void 0 ? "master" : prevMatch.def !== element,
					casing: null,
					def: element,
					placeholder: typeof opts.placeholder === "object" ? opts.placeholder[currentToken.matches.length] : void 0,
					nativeDef: element
				});
			} else {
				if (escaped) element = element[element.length - 1];
				element.split("").forEach(function(lmnt, ndx) {
					prevMatch = mtoken.matches[position - 1];
					mtoken.matches.splice(position++, 0, {
						fn: /[a-z]/i.test(opts.staticDefinitionSymbol || lmnt) ? new RegExp("[" + (opts.staticDefinitionSymbol || lmnt) + "]", flag) : null,
						static: true,
						optionality: false,
						newBlockMarker: prevMatch === void 0 ? "master" : prevMatch.def !== lmnt && prevMatch.static !== true,
						casing: null,
						def: opts.staticDefinitionSymbol || lmnt,
						placeholder: opts.staticDefinitionSymbol !== void 0 ? lmnt : typeof opts.placeholder === "object" ? opts.placeholder[currentToken.matches.length] : void 0,
						nativeDef: (escaped ? "'" : "") + lmnt
					});
				});
			}
			escaped = false;
		} else {
			const maskdef = opts.definitions && opts.definitions[element] || opts.usePrototypeDefinitions && Inputmask.prototype.definitions[element];
			if (maskdef && !escaped) {
				if (typeof maskdef.validator === "string" && /\\p\{.*}/i.test(maskdef.validator)) flag += "u";
				mtoken.matches.splice(position++, 0, {
					fn: maskdef.validator ? typeof maskdef.validator === "string" ? new RegExp(maskdef.validator, flag) : new (function() {
						this.test = maskdef.validator;
					})() : /./,
					static: maskdef.static || false,
					optionality: maskdef.optional || false,
					defOptionality: maskdef.optional || false,
					newBlockMarker: prevMatch === void 0 || maskdef.optional ? "master" : prevMatch.def !== (maskdef.definitionSymbol || element),
					casing: maskdef.casing,
					def: maskdef.definitionSymbol || element,
					placeholder: maskdef.placeholder,
					nativeDef: element,
					generated: maskdef.generated
				});
			} else {
				mtoken.matches.splice(position++, 0, {
					fn: /[a-z]/i.test(opts.staticDefinitionSymbol || element) ? new RegExp("[" + (opts.staticDefinitionSymbol || element) + "]", flag) : null,
					static: true,
					optionality: false,
					newBlockMarker: prevMatch === void 0 ? "master" : prevMatch.def !== element && prevMatch.static !== true,
					casing: null,
					def: opts.staticDefinitionSymbol || element,
					placeholder: opts.staticDefinitionSymbol !== void 0 ? element : void 0,
					nativeDef: (escaped ? "'" : "") + element
				});
				escaped = false;
			}
		}
	}
	function verifyGroupMarker(maskToken) {
		if (maskToken && maskToken.matches) maskToken.matches.forEach(function(token, ndx) {
			const nextToken = maskToken.matches[ndx + 1];
			if ((nextToken === void 0 || nextToken.matches === void 0 || nextToken.isQuantifier === false) && token && token.isGroup) {
				token.isGroup = false;
				if (!regexMask) {
					insertTestDefinition(token, opts.groupmarker[0], 0);
					if (token.openGroup !== true) insertTestDefinition(token, opts.groupmarker[1]);
				}
			}
			verifyGroupMarker(token);
		});
	}
	function defaultCase() {
		if (openenings.length > 0) {
			currentOpeningToken = openenings[openenings.length - 1];
			insertTestDefinition(currentOpeningToken, m);
			if (currentOpeningToken.isAlternator) {
				alternator = openenings.pop();
				for (let mndx = 0; mndx < alternator.matches.length; mndx++) if (alternator.matches[mndx].isGroup) alternator.matches[mndx].isGroup = false;
				if (openenings.length > 0) {
					currentOpeningToken = openenings[openenings.length - 1];
					currentOpeningToken.matches.push(alternator);
				} else currentToken.matches.push(alternator);
			}
		} else insertTestDefinition(currentToken, m);
	}
	function reverseTokens(maskToken) {
		function reverseStatic(st) {
			if (st === opts.optionalmarker[0]) st = opts.optionalmarker[1];
			else if (st === opts.optionalmarker[1]) st = opts.optionalmarker[0];
			else if (st === opts.groupmarker[0]) st = opts.groupmarker[1];
			else if (st === opts.groupmarker[1]) st = opts.groupmarker[0];
			return st;
		}
		maskToken.matches = maskToken.matches.reverse();
		for (const match in maskToken.matches) if (Object.prototype.hasOwnProperty.call(maskToken.matches, match)) {
			const intMatch = parseInt(match);
			if (maskToken.matches[match].isQuantifier && maskToken.matches[intMatch + 1] && maskToken.matches[intMatch + 1].isGroup) {
				const qt = maskToken.matches[match];
				maskToken.matches.splice(match, 1);
				maskToken.matches.splice(intMatch + 1, 0, qt);
			}
			if (maskToken.matches[match].matches !== void 0) maskToken.matches[match] = reverseTokens(maskToken.matches[match]);
			else maskToken.matches[match] = reverseStatic(maskToken.matches[match]);
		}
		return maskToken;
	}
	function groupify(matches) {
		const groupToken = new masktoken_default(true);
		groupToken.openGroup = false;
		groupToken.matches = matches;
		return groupToken;
	}
	function closeGroup() {
		openingToken = openenings.pop();
		openingToken.openGroup = false;
		if (openingToken !== void 0) {
			if (openenings.length > 0) {
				currentOpeningToken = openenings[openenings.length - 1];
				currentOpeningToken.matches.push(openingToken);
				if (currentOpeningToken.isAlternator) {
					alternator = openenings.pop();
					for (let mndx = 0; mndx < alternator.matches.length; mndx++) {
						alternator.matches[mndx].isGroup = false;
						alternator.matches[mndx].alternatorGroup = false;
					}
					if (openenings.length > 0) {
						currentOpeningToken = openenings[openenings.length - 1];
						currentOpeningToken.matches.push(alternator);
					} else currentToken.matches.push(alternator);
				}
			} else currentToken.matches.push(openingToken);
		} else defaultCase();
	}
	function groupQuantifier(matches) {
		let lastMatch = matches.pop();
		if (lastMatch.isQuantifier) lastMatch = groupify([matches.pop(), lastMatch]);
		return lastMatch;
	}
	if (regexMask) {
		opts.optionalmarker[0] = void 0;
		opts.optionalmarker[1] = void 0;
	}
	while (match = regexMask ? regexTokenizer.exec(mask) : tokenizer.exec(mask)) {
		m = match[0];
		if (regexMask) {
			switch (m.charAt(0)) {
				case "?":
					m = "{0,1}";
					break;
				case "+":
				case "*":
					m = "{" + m + "}";
					break;
				case "|": if (openenings.length === 0) {
					const altRegexGroup = groupify(currentToken.matches);
					altRegexGroup.openGroup = true;
					openenings.push(altRegexGroup);
					currentToken.matches = [];
					closeRegexGroup = true;
				}
			}
			switch (m) {
				case "\\d":
					m = "[0-9]";
					break;
				case "\\p":
					m += regexTokenizer.exec(mask)[0];
					m += regexTokenizer.exec(mask)[0];
			}
		}
		if (escaped) {
			defaultCase();
			continue;
		}
		switch (m.charAt(0)) {
			case "$":
			case "^":
				if (!regexMask) defaultCase();
				break;
			case opts.escapeChar:
				escaped = true;
				if (regexMask) defaultCase();
				break;
			case opts.optionalmarker[1]:
			case opts.groupmarker[1]:
				closeGroup();
				break;
			case opts.optionalmarker[0]:
				openenings.push(new masktoken_default(false, true));
				break;
			case opts.groupmarker[0]:
				openenings.push(new masktoken_default(true));
				break;
			case opts.quantifiermarker[0]:
				{
					const quantifier = new masktoken_default(false, false, true);
					m = m.replace(/[{}?]/g, "");
					const mqj = m.split("|"), mq = mqj[0].split(",");
					let mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]);
					const mq1 = mq.length === 1 ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]), mqJit = isNaN(mqj[1]) ? mqj[1] : parseInt(mqj[1]);
					if (mq0 === "*" || mq0 === "+") mq0 = mq1 === "*" ? 0 : 1;
					quantifier.quantifier = {
						min: mq0,
						max: mq1,
						jit: mqJit
					};
					const matches = openenings.length > 0 ? openenings[openenings.length - 1].matches : currentToken.matches;
					match = matches.pop();
					if (!match.isGroup) match = groupify([match]);
					matches.push(match);
					matches.push(quantifier);
				}
				break;
			case opts.alternatormarker:
				if (openenings.length > 0) {
					currentOpeningToken = openenings[openenings.length - 1];
					const subToken = currentOpeningToken.matches[currentOpeningToken.matches.length - 1];
					if (currentOpeningToken.openGroup && (subToken.matches === void 0 || subToken.isGroup === false && subToken.isAlternator === false)) lastMatch = openenings.pop();
					else lastMatch = groupQuantifier(currentOpeningToken.matches);
				} else lastMatch = groupQuantifier(currentToken.matches);
				if (lastMatch.isAlternator) openenings.push(lastMatch);
				else {
					if (lastMatch.alternatorGroup) {
						alternator = openenings.pop();
						lastMatch.alternatorGroup = false;
					} else alternator = new masktoken_default(false, false, false, true);
					alternator.matches.push(lastMatch);
					openenings.push(alternator);
					if (lastMatch.openGroup) {
						lastMatch.openGroup = false;
						const alternatorGroup = new masktoken_default(true);
						alternatorGroup.alternatorGroup = true;
						openenings.push(alternatorGroup);
					}
				}
				break;
			default: defaultCase();
		}
	}
	if (closeRegexGroup) closeGroup();
	while (openenings.length > 0) {
		openingToken = openenings.pop();
		currentToken.matches.push(openingToken);
	}
	if (currentToken.matches.length > 0) {
		verifyGroupMarker(currentToken);
		maskTokens.push(currentToken);
	}
	if (opts.numericInput || opts.isRTL) reverseTokens(maskTokens[0]);
	return maskTokens;
}
//#endregion
//#region node_modules/inputmask/lib/inputmask.js
var document$1 = window_default.document;
var dataKey = "_inputmask_opts";
function Inputmask(alias, options, internal) {
	if (!(this instanceof Inputmask)) return new Inputmask(alias, options, internal);
	this.dependencyLib = DependencyLib;
	this.el = void 0;
	this.events = {};
	this.maskset = void 0;
	if (internal !== true) {
		if (Object.prototype.toString.call(alias) === "[object Object]") options = alias;
		else {
			options = options || {};
			if (alias) options.alias = alias;
		}
		this.opts = DependencyLib.extend(true, {}, this.defaults, options);
		this.noMasksCache = options && options.definitions !== void 0;
		this.userOptions = options || {};
		resolveAlias(this.opts.alias, options, this.opts);
	}
	this.refreshValue = false;
	this.undoValue = void 0;
	this.$el = void 0;
	this.skipInputEvent = false;
	this.validationEvent = false;
	this.ignorable = false;
	this.maxLength;
	this.mouseEnter = false;
	this.clicked = 0;
	this.originalPlaceholder = void 0;
	this.isComposing = false;
	this.lastInputEvent = null;
	this.hasAlternator = false;
}
Inputmask.prototype = {
	dataAttribute: "data-inputmask",
	defaults: defaults_default,
	definitions: definitions_default,
	aliases: {},
	masksCache: {},
	i18n: {},
	get isRTL() {
		return this.opts.isRTL || this.opts.numericInput;
	},
	mask: function(elems) {
		const that = this;
		if (typeof elems === "string") elems = document$1.getElementById(elems) || document$1.querySelectorAll(elems);
		elems = elems.nodeName ? [elems] : Array.isArray(elems) ? elems : [].slice.call(elems);
		elems.forEach(function(el, ndx) {
			const scopedOpts = DependencyLib.extend(true, {}, that.opts);
			if (importAttributeOptions(el, scopedOpts, DependencyLib.extend(true, {}, that.userOptions), that.dataAttribute)) {
				const maskset = generateMaskSet(scopedOpts, that.noMasksCache);
				if (maskset !== void 0) {
					if (el.inputmask !== void 0) {
						el.inputmask.opts.autoUnmask = true;
						el.inputmask.remove();
					}
					el.inputmask = new Inputmask(void 0, void 0, true);
					el.inputmask.opts = scopedOpts;
					el.inputmask.noMasksCache = that.noMasksCache;
					el.inputmask.userOptions = DependencyLib.extend(true, {}, that.userOptions);
					el.inputmask.el = el;
					el.inputmask.$el = DependencyLib(el);
					el.inputmask.maskset = maskset;
					DependencyLib.data(el, dataKey, that.userOptions);
					mask.call(el.inputmask);
				}
			}
		});
		return elems && elems[0] ? elems[0].inputmask || this : this;
	},
	option: function(options, noremask) {
		if (typeof options === "string") return this.opts[options];
		else if (typeof options === "object") {
			DependencyLib.extend(this.userOptions, options);
			if (this.el && noremask !== true) this.mask(this.el);
			return this;
		}
	},
	unmaskedvalue: function(value) {
		this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
		if (this.el === void 0 || value !== void 0) {
			const valueBuffer = (typeof this.opts.onBeforeMask === "function" ? this.opts.onBeforeMask.call(this, value, this.opts) || value : value).split("");
			checkVal.call(this, void 0, false, false, valueBuffer);
			if (typeof this.opts.onBeforeWrite === "function") this.opts.onBeforeWrite.call(this, void 0, getBuffer.call(this), 0, this.opts);
		}
		return unmaskedvalue.call(this, this.el);
	},
	remove: function() {
		if (this.el) {
			DependencyLib.data(this.el, dataKey, null);
			const cv = this.opts.autoUnmask ? unmaskedvalue(this.el) : this._valueGet(this.opts.autoUnmask);
			if (cv !== getBufferTemplate.call(this).join("")) this._valueSet(cv, this.opts.autoUnmask);
			else this._valueSet("");
			EventRuler.off(this.el);
			let valueProperty;
			if (Object.getOwnPropertyDescriptor && Object.getPrototypeOf) {
				valueProperty = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.el), "value");
				if (valueProperty) {
					if (this.__valueGet) Object.defineProperty(this.el, "value", {
						get: this.__valueGet,
						set: this.__valueSet,
						configurable: true
					});
				}
			} else if (document$1.__lookupGetter__ && this.el.__lookupGetter__("value")) {
				if (this.__valueGet) {
					this.el.__defineGetter__("value", this.__valueGet);
					this.el.__defineSetter__("value", this.__valueSet);
				}
			}
			this.el.inputmask = void 0;
		}
		return this.el;
	},
	getemptymask: function() {
		this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
		return (this.isRTL ? getBufferTemplate.call(this).reverse() : getBufferTemplate.call(this)).join("");
	},
	hasMaskedValue: function() {
		return !this.opts.autoUnmask;
	},
	isComplete: function() {
		this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
		return isComplete.call(this, getBuffer.call(this));
	},
	getmetadata: function() {
		this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
		if (Array.isArray(this.maskset.metadata)) {
			let maskTarget = getMaskTemplate.call(this, true, 0, false).join("");
			this.maskset.metadata.forEach(function(mtdt) {
				if (mtdt.mask === maskTarget) {
					maskTarget = mtdt;
					return false;
				}
				return true;
			});
			return maskTarget;
		}
		return this.maskset.metadata;
	},
	isValid: function(value) {
		this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
		if (value) {
			const valueBuffer = (typeof this.opts.onBeforeMask === "function" ? this.opts.onBeforeMask.call(this, value, this.opts) || value : value).split("");
			checkVal.call(this, void 0, true, false, valueBuffer);
		}
		const buffer = clearOptionalTail.call(this, []), isC = isComplete.call(this, buffer), isc2 = value === (this.isRTL ? buffer.reverse().join("") : buffer.join(""));
		return isC && (value === void 0 || isc2);
	},
	format: function(value, metadata) {
		this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache);
		const valueBuffer = (typeof this.opts.onBeforeMask === "function" ? this.opts.onBeforeMask.call(this, value, this.opts) || value : value).split("");
		checkVal.call(this, void 0, true, false, valueBuffer);
		const formattedValue = this.isRTL ? getBuffer.call(this).slice().reverse().join("") : getBuffer.call(this).join("");
		return metadata ? {
			value: formattedValue,
			metadata: this.getmetadata()
		} : formattedValue;
	},
	setValue: function(value) {
		if (this.el) DependencyLib(this.el).trigger("setvalue", [value]);
	},
	analyseMask
};
function resolveAlias(aliasStr, options, opts) {
	const aliasDefinition = Inputmask.prototype.aliases[aliasStr];
	if (aliasDefinition) {
		if (aliasDefinition.alias) resolveAlias(aliasDefinition.alias, void 0, opts);
		DependencyLib.extend(true, opts, aliasDefinition);
		DependencyLib.extend(true, opts, options);
		return true;
	} else if (opts.mask === null) opts.mask = aliasStr;
	return false;
}
function importAttributeOptions(npt, opts, userOptions, dataAttribute) {
	function importOption(option, optionData) {
		const attrOption = dataAttribute === "" ? option : dataAttribute + "-" + option;
		optionData = optionData !== void 0 ? optionData : npt.getAttribute(attrOption);
		if (optionData !== null) {
			if (typeof optionData === "string") {
				if (option.startsWith("on")) optionData = window_default[optionData];
				else if (optionData === "false") optionData = false;
				else if (optionData === "true") optionData = true;
				else if (option === "mask") optionData = optionData.replace(/\\\\/g, "\\");
			}
			userOptions[option] = optionData;
		}
	}
	if (opts.importDataAttributes === true) {
		let attrOptions = npt.getAttribute(dataAttribute), option, dataoptions, optionData, p;
		if (attrOptions && attrOptions !== "") {
			attrOptions = attrOptions.replace(/'/g, "\"");
			dataoptions = JSON.parse("{" + attrOptions + "}");
		}
		if (dataoptions) {
			optionData = void 0;
			for (p in dataoptions) if (p.toLowerCase() === "alias") {
				optionData = dataoptions[p];
				break;
			}
		}
		importOption("alias", optionData);
		if (userOptions.alias) resolveAlias(userOptions.alias, userOptions, opts);
		for (option in opts) {
			if (dataoptions) {
				optionData = void 0;
				for (p in dataoptions) if (p.toLowerCase() === option.toLowerCase()) {
					optionData = dataoptions[p];
					break;
				}
			}
			importOption(option, optionData);
		}
	}
	DependencyLib.extend(true, opts, userOptions);
	if (npt.dir === "rtl" || opts.rightAlign) npt.style.textAlign = "right";
	if (npt.dir === "rtl" || opts.numericInput) {
		npt.dir = "ltr";
		npt.removeAttribute("dir");
		opts.isRTL = true;
	}
	return Object.keys(userOptions).length;
}
Inputmask.extendDefaults = function(options) {
	DependencyLib.extend(true, Inputmask.prototype.defaults, options);
};
Inputmask.extendDefinitions = function(definition) {
	DependencyLib.extend(true, Inputmask.prototype.definitions, definition);
};
Inputmask.extendAliases = function(alias) {
	DependencyLib.extend(true, Inputmask.prototype.aliases, alias);
};
Inputmask.format = function(value, options, metadata) {
	return Inputmask(options).format(value, metadata);
};
Inputmask.unmask = function(value, options) {
	return Inputmask(options).unmaskedvalue(value);
};
Inputmask.isValid = function(value, options) {
	return Inputmask(options).isValid(value);
};
Inputmask.remove = function(elems) {
	if (typeof elems === "string") elems = document$1.getElementById(elems) || document$1.querySelectorAll(elems);
	elems = elems.nodeName ? [elems] : elems;
	for (let i = 0; i < elems.length; i++) if (elems[i].inputmask) elems[i].inputmask.remove();
};
Inputmask.setValue = function(elems, value) {
	if (typeof elems === "string") elems = document$1.getElementById(elems) || document$1.querySelectorAll(elems);
	elems = elems.nodeName ? [elems] : elems;
	elems.forEach(function(el) {
		if (el.inputmask) el.inputmask.setValue(value);
		else DependencyLib(el).trigger("setvalue", [value]);
	});
};
Inputmask.dependencyLib = DependencyLib;
window_default.Inputmask = Inputmask;
//#endregion
export { Inputmask as default };
