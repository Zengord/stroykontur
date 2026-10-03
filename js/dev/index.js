import "./main.min.js";
//#region src/js/common/functions.js
function getHash() {
	if (location.hash) return location.hash.replace("#", "");
}
function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split("#")[0];
	history.pushState("", "", hash);
}
var slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore && target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore && target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
		}, duration);
	}
};
var slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.hidden = target.hidden ? false : null;
		showmore && target.style.removeProperty("height");
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
		}, duration);
	}
};
var slideToggle = (target, duration = 500) => {
	if (target.hidden) return slideDown(target, duration);
	else return slideUp(target, duration);
};
var bodyLockStatus = true;
var bodyLockToggle = (delay = 500) => {
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) bodyUnlock(delay);
	else bodyLock(delay);
};
var bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = "";
			});
			document.body.style.paddingRight = "";
			document.documentElement.removeAttribute("data-fls-scrolllock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
var bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue;
		});
		document.body.style.paddingRight = lockPaddingValue;
		document.documentElement.setAttribute("data-fls-scrolllock", "");
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
function getDigFormat(item, sepp = " ") {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}
function uniqArray(array) {
	return array.filter((item, index, self) => self.indexOf(item) === index);
}
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
		const [value, type = "max"] = item.dataset[dataSetValue].split(",");
		return {
			value,
			type,
			item
		};
	});
	if (media.length === 0) return [];
	const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
	return [...new Set(breakpointsArray)].map((query) => {
		const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
		const matchMedia = window.matchMedia(mediaQuery);
		return {
			itemsArray: media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType),
			matchMedia
		};
	});
}
var gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = "header.header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("--header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("--header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("--header-scroll");
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else headerItemHeight = headerElement.offsetHeight;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
		let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
		targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
		targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
		window.scrollTo({
			top: targetBlockElementPosition,
			behavior: "smooth"
		});
	}
};
//#endregion
//#region src/components/layout/tabs/tabs.js
function tabs() {
	const tabs = document.querySelectorAll("[data-fls-tabs]");
	let tabsActiveHash = [];
	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add("--tab-init");
			tabsBlock.setAttribute("data-fls-tabs-index", index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});
		let mdQueriesArray = dataMediaQueries(tabs, "flsTabs");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector("[data-fls-tabs-titles]");
			let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-title]");
			let tabsContent = tabsMediaItem.querySelector("[data-fls-tabs-body]");
			let tabsContentItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-item]");
			tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add("--tab-spoller");
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove("--tab-spoller");
				}
			});
		});
	}
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-titles]>*");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-body]>*");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector("[data-fls-tabs-titles]>.--tab-active");
			tabsActiveTitle && tabsActiveTitle.classList.remove("--tab-active");
		}
		if (tabsContent.length) tabsContent.forEach((tabsContentItem, index) => {
			tabsTitles[index].setAttribute("data-fls-tabs-title", "");
			tabsContentItem.setAttribute("data-fls-tabs-item", "");
			if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("--tab-active");
			tabsContentItem.hidden = !tabsTitles[index].classList.contains("--tab-active");
		});
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-title]");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-item]");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute("data-fls-tabs-animate")) return tabsBlock.dataset.flsTabsAnimate > 0 ? Number(tabsBlock.dataset.flsTabsAnimate) : 500;
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute("data-fls-tabs-hash");
			tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains("--tab-active")) {
					if (tabsBlockAnimate) slideDown(tabsContentItem, tabsBlockAnimate);
					else tabsContentItem.hidden = false;
					if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
				} else if (tabsBlockAnimate) slideUp(tabsContentItem, tabsBlockAnimate);
				else tabsContentItem.hidden = true;
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-fls-tabs-title]")) {
			const tabTitle = el.closest("[data-fls-tabs-title]");
			const tabsBlock = tabTitle.closest("[data-fls-tabs]");
			if (!tabTitle.classList.contains("--tab-active") && !tabsBlock.querySelector(".--slide")) {
				let tabActiveTitle = tabsBlock.querySelectorAll("[data-fls-tabs-title].--tab-active");
				tabActiveTitle.length && (tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock));
				tabActiveTitle.length && tabActiveTitle[0].classList.remove("--tab-active");
				tabTitle.classList.add("--tab-active");
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
window.addEventListener("load", tabs);
//#endregion
//#region src/components/forms/_functions.js
var formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll("[required]");
		if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem) => {
			if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
		});
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.type === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else if (!formRequiredItem.value.trim()) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else {
			this.removeError(formRequiredItem);
			this.addSuccess(formRequiredItem);
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add("--form-error");
		formRequiredItem.parentElement.classList.add("--form-error");
		let inputError = formRequiredItem.parentElement.querySelector("[data-fls-form-error]");
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.flsFormErrtext) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div data-fls-form-error>${formRequiredItem.dataset.flsFormErrtext}</div>`);
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove("--form-error");
		formRequiredItem.parentElement.classList.remove("--form-error");
		if (formRequiredItem.parentElement.querySelector("[data-fls-form-error]")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector("[data-fls-form-error]"));
	},
	addSuccess(formRequiredItem) {
		formRequiredItem.classList.add("--form-success");
		formRequiredItem.parentElement.classList.add("--form-success");
	},
	removeSuccess(formRequiredItem) {
		formRequiredItem.classList.remove("--form-success");
		formRequiredItem.parentElement.classList.remove("--form-success");
	},
	removeFocus(formRequiredItem) {
		formRequiredItem.classList.remove("--form-focus");
		formRequiredItem.parentElement.classList.remove("--form-focus");
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll("input,textarea");
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				formValidate.removeFocus(el);
				formValidate.removeSuccess(el);
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll("input[type=\"checkbox\"]");
			if (checkboxes.length) checkboxes.forEach((checkbox) => {
				checkbox.checked = false;
			});
			if (window["flsSelect"]) {
				let selects = form.querySelectorAll("select[data-fls-select]");
				if (selects.length) selects.forEach((select) => {
					window["flsSelect"].selectBuild(select);
				});
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
};
//#endregion
//#region src/components/forms/select/select.js
var SelectConstructor = class {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			speed: 150
		};
		this.config = Object.assign(defaultConfig, props);
		this.selectClasses = {
			classSelect: "select",
			classSelectBody: "select__body",
			classSelectTitle: "select__title",
			classSelectValue: "select__value",
			classSelectLabel: "select__label",
			classSelectInput: "select__input",
			classSelectText: "select__text",
			classSelectLink: "select__link",
			classSelectOptions: "select__options",
			classSelectOptionsScroll: "select__scroll",
			classSelectOption: "select__option",
			classSelectContent: "select__content",
			classSelectRow: "select__row",
			classSelectData: "select__asset",
			classSelectDisabled: "--select-disabled",
			classSelectTag: "--select-tag",
			classSelectOpen: "--select-open",
			classSelectActive: "--select-active",
			classSelectFocus: "--select-focus",
			classSelectMultiple: "--select-multiple",
			classSelectCheckBox: "--select-checkbox",
			classSelectOptionSelected: "--select-selected",
			classSelectPseudoLabel: "--select-pseudo-label"
		};
		this._this = this;
		if (this.config.init) {
			const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select[data-fls-select]");
			if (selectItems.length) this.selectsInit(selectItems);
		}
	}
	getSelectClass(className) {
		return `.${className}`;
	}
	getSelectElement(selectItem, className) {
		return {
			originalSelect: selectItem.querySelector("select"),
			selectElement: selectItem.querySelector(this.getSelectClass(className))
		};
	}
	selectsInit(selectItems) {
		selectItems.forEach((originalSelect, index) => {
			this.selectInit(originalSelect, index + 1);
		});
		document.addEventListener("click", function(e) {
			this.selectsActions(e);
		}.bind(this));
		document.addEventListener("keydown", function(e) {
			this.selectsActions(e);
		}.bind(this));
		document.addEventListener("focusin", function(e) {
			this.selectsActions(e);
		}.bind(this));
		document.addEventListener("focusout", function(e) {
			this.selectsActions(e);
		}.bind(this));
	}
	selectInit(originalSelect, index) {
		index && (originalSelect.dataset.flsSelectId = index);
		if (originalSelect.options.length) {
			const _this = this;
			let selectItem = document.createElement("div");
			selectItem.classList.add(this.selectClasses.classSelect);
			originalSelect.parentNode.insertBefore(selectItem, originalSelect);
			selectItem.appendChild(originalSelect);
			originalSelect.hidden = true;
			if (this.getSelectPlaceholder(originalSelect)) {
				originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
				if (this.getSelectPlaceholder(originalSelect).label.show) this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
			}
			selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
			this.selectBuild(originalSelect);
			originalSelect.dataset.flsSelectSpeed = originalSelect.dataset.flsSelectSpeed ? originalSelect.dataset.flsSelectSpeed : this.config.speed;
			this.config.speed = +originalSelect.dataset.flsSelectSpeed;
			originalSelect.addEventListener("change", function(e) {
				_this.selectChange(e);
			});
		}
	}
	selectBuild(originalSelect) {
		const selectItem = originalSelect.parentElement;
		if (originalSelect.id) {
			selectItem.id = originalSelect.id;
			originalSelect.removeAttribute("id");
		}
		selectItem.dataset.flsSelectId = originalSelect.dataset.flsSelectId;
		originalSelect.dataset.flsSelectModif && selectItem.classList.add(`select--${originalSelect.dataset.flsSelectModif}`);
		originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
		originalSelect.hasAttribute("data-fls-select-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
		this.setSelectTitleValue(selectItem, originalSelect);
		this.setOptions(selectItem, originalSelect);
		originalSelect.hasAttribute("data-fls-select-search") && this.searchActions(selectItem);
		originalSelect.hasAttribute("data-fls-select-open") && this.selectAction(selectItem);
		this.selectDisabled(selectItem, originalSelect);
	}
	selectsActions(e) {
		const t = e.target, type = e.type;
		const isSelect = t.closest(this.getSelectClass(this.selectClasses.classSelect));
		const isTag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
		if (!isSelect && !isTag) return this.selectsСlose();
		const selectItem = isSelect || document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${isTag.dataset.flsSelectId}"]`);
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		if (originalSelect.disabled) return;
		if (type === "click") {
			const tag = t.closest(this.getSelectClass(this.selectClasses.classSelectTag));
			const title = t.closest(this.getSelectClass(this.selectClasses.classSelectTitle));
			const option = t.closest(this.getSelectClass(this.selectClasses.classSelectOption));
			if (tag) {
				const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-fls-select-id="${tag.dataset.flsSelectId}"] .select__option[data-fls-select-value="${tag.dataset.flsSelectValue}"]`);
				this.optionAction(selectItem, originalSelect, optionItem);
			} else if (title) this.selectAction(selectItem);
			else if (option) this.optionAction(selectItem, originalSelect, option);
		} else if (type === "focusin" || type === "focusout") {
			if (isSelect) selectItem.classList.toggle(this.selectClasses.classSelectFocus, type === "focusin");
		} else if (type === "keydown" && e.code === "Escape") this.selectsСlose();
	}
	selectsСlose(selectOneGroup) {
		const selectActiveItems = (selectOneGroup ? selectOneGroup : document).querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
		if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem) => {
			this.selectСlose(selectActiveItem);
		});
	}
	selectСlose(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		if (!selectOptions.classList.contains("_slide")) {
			selectItem.classList.remove(this.selectClasses.classSelectOpen);
			slideUp(selectOptions, originalSelect.dataset.flsSelectSpeed);
			setTimeout(() => {
				selectItem.style.zIndex = "";
			}, originalSelect.dataset.flsSelectSpeed);
		}
	}
	selectAction(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
		const selectOpenzIndex = originalSelect.dataset.flsSelectZIndex ? originalSelect.dataset.flsSelectZIndex : 3;
		this.setOptionsPosition(selectItem);
		if (originalSelect.closest("[data-fls-select-one]")) {
			const selectOneGroup = originalSelect.closest("[data-fls-select-one]");
			this.selectsСlose(selectOneGroup);
		}
		setTimeout(() => {
			if (!selectOptions.classList.contains("--slide")) {
				selectItem.classList.toggle(this.selectClasses.classSelectOpen);
				slideToggle(selectOptions, originalSelect.dataset.flsSelectSpeed);
				if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) selectItem.style.zIndex = selectOpenzIndex;
				else setTimeout(() => {
					selectItem.style.zIndex = "";
				}, originalSelect.dataset.flsSelectSpeed);
			}
		}, 0);
	}
	setSelectTitleValue(selectItem, originalSelect) {
		const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
		const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
		if (selectItemTitle) selectItemTitle.remove();
		selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
		originalSelect.hasAttribute("data-fls-select-search") && this.searchActions(selectItem);
	}
	getSelectTitleValue(selectItem, originalSelect) {
		let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
		if (originalSelect.multiple && originalSelect.hasAttribute("data-fls-select-tags")) {
			selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option) => `<span role="button" data-fls-select-id="${selectItem.dataset.flsSelectId}" data-fls-select-value="${option.value}" class="--select-tag">${this.getSelectElementContent(option)}</span>`).join("");
			if (originalSelect.dataset.flsSelectTags && document.querySelector(originalSelect.dataset.flsSelectTags)) {
				document.querySelector(originalSelect.dataset.flsSelectTags).innerHTML = selectTitleValue;
				if (originalSelect.hasAttribute("data-fls-select-search")) selectTitleValue = false;
			}
		}
		selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.flsSelectPlaceholder || "";
		if (!originalSelect.hasAttribute("data-fls-select-tags")) selectTitleValue = selectTitleValue ? selectTitleValue.map((item) => item.replace(/"/g, "&quot;")) : "";
		let pseudoAttribute = "";
		let pseudoAttributeClass = "";
		if (originalSelect.hasAttribute("data-fls-select-pseudo-label")) {
			pseudoAttribute = originalSelect.dataset.flsSelectPseudoLabel ? ` data-fls-select-pseudo-label="${originalSelect.dataset.flsSelectPseudoLabel}"` : ` data-fls-select-pseudo-label="Заполните атрибут"`;
			pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
		}
		this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
		if (originalSelect.hasAttribute("data-fls-select-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-fls-select-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
		else {
			const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.flsSelectClass}` : "";
			return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
		}
	}
	getSelectElementContent(selectOption) {
		const selectOptionData = selectOption.dataset.flsSelectAsset ? `${selectOption.dataset.flsSelectAsset}` : "";
		const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
		let selectOptionContentHTML = ``;
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
		selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
		selectOptionContentHTML += selectOption.textContent;
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		return selectOptionContentHTML;
	}
	getSelectPlaceholder(originalSelect) {
		const selectPlaceholder = Array.from(originalSelect.options).find((option) => !option.value);
		if (selectPlaceholder) return {
			value: selectPlaceholder.textContent,
			show: selectPlaceholder.hasAttribute("data-fls-select-show"),
			label: {
				show: selectPlaceholder.hasAttribute("data-fls-select-label"),
				text: selectPlaceholder.dataset.flsSelectLabel
			}
		};
	}
	getSelectedOptionsData(originalSelect, type) {
		let selectedOptions = [];
		if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option) => option.value).filter((option) => option.selected);
		else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
		return {
			elements: selectedOptions.map((option) => option),
			values: selectedOptions.filter((option) => option.value).map((option) => option.value),
			html: selectedOptions.map((option) => this.getSelectElementContent(option))
		};
	}
	getOptions(originalSelect) {
		const selectOptionsScroll = originalSelect.hasAttribute("data-fls-select-scroll") ? `` : "";
		const customMaxHeightValue = +originalSelect.dataset.flsSelectScroll ? +originalSelect.dataset.flsSelectScroll : null;
		let selectOptions = Array.from(originalSelect.options);
		if (selectOptions.length > 0) {
			let selectOptionsHTML = ``;
			if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option) => option.value);
			selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ""} class="${this.selectClasses.classSelectOptionsScroll}">`;
			selectOptions.forEach((selectOption) => {
				selectOptionsHTML += this.getOption(selectOption, originalSelect);
			});
			selectOptionsHTML += `</div>`;
			return selectOptionsHTML;
		}
	}
	getOption(selectOption, originalSelect) {
		const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
		const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-fls-select-show-selected") && !originalSelect.multiple ? `hidden` : ``;
		const selectOptionClass = selectOption.dataset.flsSelectClass ? ` ${selectOption.dataset.flsSelectClass}` : "";
		const selectOptionLink = selectOption.dataset.flsSelectHref ? selectOption.dataset.flsSelectHref : false;
		const selectOptionLinkTarget = selectOption.hasAttribute("data-fls-select-href-blank") ? `target="_blank"` : "";
		let selectOptionHTML = ``;
		selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-fls-select-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-fls-select-value="${selectOption.value}" type="button">`;
		selectOptionHTML += this.getSelectElementContent(selectOption);
		selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
		return selectOptionHTML;
	}
	setOptions(selectItem, originalSelect) {
		const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		selectItemOptions.innerHTML = this.getOptions(originalSelect);
	}
	setOptionsPosition(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
		const customMaxHeightValue = +originalSelect.dataset.flsSelectScroll ? `${+originalSelect.dataset.flsSelectScroll}px` : ``;
		const selectOptionsPosMargin = +originalSelect.dataset.flsSelectOptionsMargin ? +originalSelect.dataset.flsSelectOptionsMargin : 10;
		if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
			selectOptions.hidden = false;
			const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
			const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
			const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
			selectOptions.hidden = true;
			const selectItemHeight = selectItem.offsetHeight;
			const selectItemPos = selectItem.getBoundingClientRect().top;
			const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
			const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
			if (selectItemResult < 0) {
				const newMaxHeightValue = selectOptionsHeight + selectItemResult;
				if (newMaxHeightValue < 100) {
					selectItem.classList.add("select--show-top");
					selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
				} else {
					selectItem.classList.remove("select--show-top");
					selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
				}
			}
		} else setTimeout(() => {
			selectItem.classList.remove("select--show-top");
			selectItemScroll.style.maxHeight = customMaxHeightValue;
		}, +originalSelect.dataset.flsSelectSpeed);
	}
	optionAction(selectItem, originalSelect, optionItem) {
		if (selectItem.querySelector(this.getSelectClass(this.selectClasses.classSelectOptions)).classList.contains("--slide")) return;
		if (originalSelect.multiple) {
			optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
			const selectedEls = this.getSelectedOptionsData(originalSelect).elements;
			for (const el of selectedEls) el.removeAttribute("selected");
			const selectedUI = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
			for (const el of selectedUI) {
				const val = el.dataset.flsSelectValue;
				const opt = originalSelect.querySelector(`option[value="${val}"]`);
				if (opt) opt.setAttribute("selected", "selected");
			}
		} else {
			if (!originalSelect.hasAttribute("data-fls-select-show-selected")) setTimeout(() => {
				const hiddenOpt = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`);
				if (hiddenOpt) hiddenOpt.hidden = false;
				optionItem.hidden = true;
			}, this.config.speed);
			originalSelect.value = optionItem.dataset.flsSelectValue || optionItem.textContent;
			this.selectAction(selectItem);
		}
		this.setSelectTitleValue(selectItem, originalSelect);
		this.setSelectChange(originalSelect);
	}
	selectChange(e) {
		const originalSelect = e.target;
		this.selectBuild(originalSelect);
		this.setSelectChange(originalSelect);
	}
	setSelectChange(originalSelect) {
		if (originalSelect.hasAttribute("data-fls-select-validate")) formValidate.validateInput(originalSelect);
		if (originalSelect.hasAttribute("data-fls-select-submit") && originalSelect.value) {
			let tempButton = document.createElement("button");
			tempButton.type = "submit";
			originalSelect.closest("form").append(tempButton);
			tempButton.click();
			tempButton.remove();
		}
		const selectItem = originalSelect.parentElement;
		this.selectCallback(selectItem, originalSelect);
	}
	selectDisabled(selectItem, originalSelect) {
		if (originalSelect.disabled) {
			selectItem.classList.add(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
		} else {
			selectItem.classList.remove(this.selectClasses.classSelectDisabled);
			this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
		}
	}
	searchActions(selectItem) {
		const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
		selectInput.addEventListener("input", () => {
			const inputValue = selectInput.value.toLowerCase();
			selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`).forEach((item) => {
				item.hidden = !item.textContent.toLowerCase().includes(inputValue);
			});
			if (selectOptions.hidden) this.selectAction(selectItem);
		});
	}
	selectCallback(selectItem, originalSelect) {
		document.dispatchEvent(new CustomEvent("selectCallback", { detail: { select: originalSelect } }));
	}
};
document.querySelector("select[data-fls-select]") && window.addEventListener("load", () => window.flsSelect = new SelectConstructor({}));
//#endregion
//#region src/components/custom/services/services.js
window.addEventListener("load", () => {
	const root = document.querySelector("[data-fls-tabs]");
	const buttons = [...root.querySelectorAll(".services__tab")];
	const panels = [...root.querySelectorAll(".services__panel")];
	const mobile = window.matchMedia("(max-width: 768px)");
	function sync() {
		root.querySelector(".services__navigation").setAttribute("role", mobile.matches ? "presentation" : "tablist");
		buttons.forEach((button, index) => {
			const active = button.classList.contains("--tab-active");
			button.setAttribute("role", mobile.matches ? "button" : "tab");
			button.setAttribute("aria-controls", panels[index].id);
			button.setAttribute(mobile.matches ? "aria-expanded" : "aria-selected", String(active));
			button.removeAttribute(mobile.matches ? "aria-selected" : "aria-expanded");
			button.tabIndex = mobile.matches || active ? 0 : -1;
			panels[index].setAttribute("role", mobile.matches ? "region" : "tabpanel");
			panels[index].setAttribute("aria-labelledby", button.id);
		});
	}
	root.addEventListener("click", sync);
	root.addEventListener("keydown", (event) => {
		if (mobile.matches || !buttons.includes(event.target)) return;
		if (![
			"ArrowRight",
			"ArrowDown",
			"ArrowLeft",
			"ArrowUp",
			"Home",
			"End"
		].includes(event.key)) return;
		event.preventDefault();
		let next = buttons.indexOf(event.target);
		if (event.key === "Home") next = 0;
		else if (event.key === "End") next = buttons.length - 1;
		else next = (next + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) + buttons.length) % buttons.length;
		buttons[next].click();
		buttons[next].focus();
	});
	new MutationObserver(sync).observe(root, {
		attributes: true,
		subtree: true,
		attributeFilter: ["class"]
	});
	mobile.addEventListener("change", sync);
	sync();
});
//#endregion
//#region src/components/layout/spollers/spollers.js
function spollers() {
	const spollersArray = document.querySelectorAll("[data-fls-spollers]");
	if (spollersArray.length > 0) {
		document.addEventListener("click", setSpollerAction);
		const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
			return !item.dataset.flsSpollers.split(",")[0];
		});
		if (spollersRegular.length) initSpollers(spollersRegular);
		let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock) => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add("--spoller-init");
					initSpollerBody(spollersBlock);
				} else {
					spollersBlock.classList.remove("--spoller-init");
					initSpollerBody(spollersBlock, false);
				}
			});
		}
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerItems = spollersBlock.querySelectorAll("details");
			if (spollerItems.length) spollerItems.forEach((spollerItem) => {
				let spollerTitle = spollerItem.querySelector("summary");
				if (hideSpollerBody) {
					spollerTitle.removeAttribute("tabindex");
					if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
						spollerItem.open = false;
						spollerTitle.nextElementSibling.hidden = true;
					} else {
						spollerTitle.classList.add("--spoller-active");
						spollerItem.open = true;
					}
				} else {
					spollerTitle.setAttribute("tabindex", "-1");
					spollerTitle.classList.remove("--spoller-active");
					spollerItem.open = true;
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
				e.preventDefault();
				if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
					const spollerTitle = el.closest("summary");
					const spollerBlock = spollerTitle.closest("details");
					const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
					const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
					const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
					const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
					if (!spollersBlock.querySelectorAll(".--slide").length) {
						if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
						!spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
							spollerBlock.open = false;
						}, spollerSpeed);
						spollerTitle.classList.toggle("--spoller-active");
						slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
						if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
							const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
							const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
							const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
							window.scrollTo({
								top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
								behavior: "smooth"
							});
						}
					}
				}
			}
			if (!el.closest("[data-fls-spollers]")) {
				const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
				if (spollersClose.length) spollersClose.forEach((spollerClose) => {
					const spollersBlock = spollerClose.closest("[data-fls-spollers]");
					const spollerCloseBlock = spollerClose.parentNode;
					if (spollersBlock.classList.contains("--spoller-init")) {
						const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
						spollerClose.classList.remove("--spoller-active");
						slideUp(spollerClose.nextElementSibling, spollerSpeed);
						setTimeout(() => {
							spollerCloseBlock.open = false;
						}, spollerSpeed);
					}
				});
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveBlock = spollersBlock.querySelector("details[open]");
			if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
				const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
				const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
				spollerActiveTitle.classList.remove("--spoller-active");
				slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				setTimeout(() => {
					spollerActiveBlock.open = false;
				}, spollerSpeed);
			}
		}
	}
}
window.addEventListener("load", spollers);
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return import.meta.resolve(specifier);
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			).href;
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			dep = importMetaResolve(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region src/components/layout/slider/slider.js
var sliderLibrary;
var pendingSliders = /* @__PURE__ */ new WeakSet();
async function initSliders(slider) {
	if (slider && !slider.swiper && !pendingSliders.has(slider)) {
		pendingSliders.add(slider);
		sliderLibrary ||= __vitePreload(() => import("./_library.min.js"), [], import.meta.url);
		const { Swiper, Navigation } = await sliderLibrary;
		new Swiper(slider, {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 800,
			navigation: {
				prevEl: ".swiper-button-prev",
				nextEl: ".swiper-button-next"
			},
			on: {}
		});
		slider.dispatchEvent(new CustomEvent("sliderReady"));
	}
}
document.querySelector("[data-fls-slider]") && window.addEventListener("load", () => {
	document.querySelectorAll("[data-fls-slider]").forEach((slider) => {
		if (!slider.hasAttribute("data-fls-slider-lazy") || slider.classList.contains("--watcher-view")) initSliders(slider);
	});
});
document.addEventListener("watcherCallback", ({ detail: { entry } }) => {
	if (entry.isIntersecting && entry.target.matches("[data-fls-slider-lazy]")) initSliders(entry.target);
});
document.addEventListener("focusin", ({ target }) => {
	const slider = target.closest("[data-fls-slider-lazy]");
	if (slider) initSliders(slider);
});
document.addEventListener("click", (event) => {
	const button = event.target.closest(".swiper-button-next, .swiper-button-prev");
	const slider = button?.closest("[data-fls-slider-lazy]");
	if (!slider || slider.swiper) return;
	event.preventDefault();
	slider.addEventListener("sliderReady", () => {
		queueMicrotask(() => {
			if (button.classList.contains("swiper-button-next")) slider.swiper.slideNext();
			else slider.swiper.slidePrev();
		});
	}, { once: true });
	initSliders(slider);
}, true);
//#endregion
//#region src/components/layout/popup/popup.js
var Popup = class {
	constructor(options) {
		let config = {
			logging: true,
			init: true,
			attributeOpenButton: "data-fls-popup-link",
			attributeCloseButton: "data-fls-popup-close",
			fixElementSelector: "[data-fls-lp]",
			attributeMain: "data-fls-popup",
			youtubeAttribute: "data-fls-popup-youtube",
			youtubePlaceAttribute: "data-fls-popup-youtube-place",
			setAutoplayYoutube: true,
			classes: {
				popup: "popup",
				popupContent: "data-fls-popup-body",
				popupActive: "data-fls-popup-active",
				bodyActive: "data-fls-popup-open"
			},
			focusCatch: true,
			closeEsc: true,
			bodyLock: true,
			hashSettings: {
				location: true,
				goHash: true
			},
			on: {
				beforeOpen: function() {},
				afterOpen: function() {},
				beforeClose: function() {},
				afterClose: function() {}
			}
		};
		this.youTubeCode;
		this.isOpen = false;
		this.targetOpen = {
			selector: false,
			element: false
		};
		this.previousOpen = {
			selector: false,
			element: false
		};
		this.lastClosed = {
			selector: false,
			element: false
		};
		this._dataValue = false;
		this.hash = false;
		this._reopen = false;
		this._selectorOpen = false;
		this.lastFocusEl = false;
		this._focusEl = [
			"a[href]",
			"input:not([disabled]):not([type=\"hidden\"]):not([aria-hidden])",
			"button:not([disabled]):not([aria-hidden])",
			"select:not([disabled]):not([aria-hidden])",
			"textarea:not([disabled]):not([aria-hidden])",
			"area[href]",
			"iframe",
			"object",
			"embed",
			"[contenteditable]",
			"[tabindex]:not([tabindex^=\"-\"])"
		];
		this.options = {
			...config,
			...options,
			classes: {
				...config.classes,
				...options?.classes
			},
			hashSettings: {
				...config.hashSettings,
				...options?.hashSettings
			},
			on: {
				...config.on,
				...options?.on
			}
		};
		this.bodyLock = false;
		this.options.init && this.initPopups();
	}
	initPopups() {
		this.buildPopup();
		this.eventsPopup();
	}
	buildPopup() {}
	eventsPopup() {
		document.addEventListener("click", function(e) {
			const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
			if (buttonOpen) {
				e.preventDefault();
				this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
				this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
				if (this._dataValue !== "error") {
					if (!this.isOpen) this.lastFocusEl = buttonOpen;
					this.targetOpen.selector = `${this._dataValue}`;
					this._selectorOpen = true;
					this.open();
					return;
				}
				return;
			}
			if (e.target.closest(`[${this.options.attributeCloseButton}]`) || !e.target.closest(`[${this.options.classes.popupContent}]`) && this.isOpen) {
				e.preventDefault();
				this.close();
				return;
			}
		}.bind(this));
		document.addEventListener("keydown", function(e) {
			if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
				e.preventDefault();
				this.close();
				return;
			}
			if (this.options.focusCatch && e.which == 9 && this.isOpen) {
				this._focusCatch(e);
				return;
			}
		}.bind(this));
		if (this.options.hashSettings.goHash) {
			window.addEventListener("hashchange", function() {
				if (window.location.hash) this._openToHash();
				else this.close(this.targetOpen.selector);
			}.bind(this));
			if (window.location.hash) this._openToHash();
		}
	}
	open(selectorValue) {
		if (bodyLockStatus) {
			this.bodyLock = document.documentElement.hasAttribute("data-fls-scrolllock") && !this.isOpen ? true : false;
			if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
				this.targetOpen.selector = selectorValue;
				this._selectorOpen = true;
			}
			if (this.isOpen) {
				this._reopen = true;
				this.close();
			}
			if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
			if (!this._reopen) this.previousActiveElement = document.activeElement;
			this.targetOpen.element = document.querySelector(`[${this.options.attributeMain}=${this.targetOpen.selector}]`);
			if (this.targetOpen.element) {
				const codeVideo = this.youTubeCode || this.targetOpen.element.getAttribute(`${this.options.youtubeAttribute}`);
				if (codeVideo) {
					const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
					const iframe = document.createElement("iframe");
					const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
					iframe.setAttribute("allowfullscreen", "");
					iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
					iframe.setAttribute("src", urlVideo);
					if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector("[data-fls-popup-content]").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
					this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
				}
				if (this.options.hashSettings.location) {
					this._getHash();
					this._setHash();
				}
				this.options.on.beforeOpen(this);
				document.dispatchEvent(new CustomEvent("beforePopupOpen", { detail: { popup: this } }));
				this.targetOpen.element.setAttribute(this.options.classes.popupActive, "");
				document.documentElement.setAttribute(this.options.classes.bodyActive, "");
				if (!this._reopen) !this.bodyLock && bodyLock();
				else this._reopen = false;
				this.targetOpen.element.setAttribute("aria-hidden", "false");
				this.previousOpen.selector = this.targetOpen.selector;
				this.previousOpen.element = this.targetOpen.element;
				this._selectorOpen = false;
				this.isOpen = true;
				setTimeout(() => {
					this._focusTrap();
				}, 50);
				this.options.on.afterOpen(this);
				document.dispatchEvent(new CustomEvent("afterPopupOpen", { detail: { popup: this } }));
			}
		}
	}
	close(selectorValue) {
		if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
		if (!this.isOpen || !bodyLockStatus) return;
		this.options.on.beforeClose(this);
		document.dispatchEvent(new CustomEvent("beforePopupClose", { detail: { popup: this } }));
		if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) setTimeout(() => {
			this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
		}, 500);
		this.previousOpen.element.removeAttribute(this.options.classes.popupActive);
		this.previousOpen.element.setAttribute("aria-hidden", "true");
		if (!this._reopen) {
			document.documentElement.removeAttribute(this.options.classes.bodyActive);
			!this.bodyLock && bodyUnlock();
			this.isOpen = false;
		}
		this._removeHash();
		if (this._selectorOpen) {
			this.lastClosed.selector = this.previousOpen.selector;
			this.lastClosed.element = this.previousOpen.element;
		}
		this.options.on.afterClose(this);
		document.dispatchEvent(new CustomEvent("afterPopupClose", { detail: { popup: this } }));
		setTimeout(() => {
			this._focusTrap();
		}, 50);
	}
	_getHash() {
		if (this.options.hashSettings.location) this.hash = `#${this.targetOpen.selector}`;
	}
	_openToHash() {
		let classInHash = window.location.hash.replace("#", "");
		const openButton = document.querySelector(`[${this.options.attributeOpenButton}="${classInHash}"]`);
		if (openButton) this.youTubeCode = openButton.getAttribute(this.options.youtubeAttribute) ? openButton.getAttribute(this.options.youtubeAttribute) : null;
		if (classInHash) this.open(classInHash);
	}
	_setHash() {
		history.pushState("", "", this.hash);
	}
	_removeHash() {
		history.pushState("", "", window.location.href.split("#")[0]);
	}
	_focusCatch(e) {
		const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);
		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}
		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}
	_focusTrap() {
		const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
		if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus();
		else focusable[0].focus();
	}
};
document.querySelector("[data-fls-popup]") && window.addEventListener("load", () => window.flsPopup = new Popup({}));
//#endregion
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/layout/header/header.js
var burger = document.querySelector("[data-fls-menu]");
var menu = document.querySelector(".header__menu");
var desktop = window.matchMedia("(width > 1200px)");
document.documentElement.setAttribute("data-site-ready", "");
function syncMenu() {
	const open = document.documentElement.hasAttribute("data-fls-menu-open");
	burger.setAttribute("aria-expanded", String(open));
	burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
	menu.inert = !desktop.matches && !open;
}
window.addEventListener("load", () => {
	document.documentElement.setAttribute("data-site-ready", "");
	syncMenu();
	new MutationObserver(syncMenu).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-fls-menu-open"]
	});
});
function closeMenu() {
	if (!document.documentElement.hasAttribute("data-fls-menu-open")) return;
	bodyUnlock();
	document.documentElement.removeAttribute("data-fls-menu-open");
	burger.focus();
}
document.addEventListener("keydown", (event) => {
	if (!document.documentElement.hasAttribute("data-fls-menu-open")) return;
	if (event.key === "Escape") closeMenu();
	if (event.key === "Tab") {
		const items = [burger, ...menu.querySelectorAll("a")];
		const first = items[0];
		const last = items.at(-1);
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
});
desktop.addEventListener("change", () => {
	if (desktop.matches) closeMenu();
	syncMenu();
});
//#endregion
//#region src/components/layout/header/plugins/scroll/scroll.js
function headerScroll() {
	const header = document.querySelector("[data-fls-header-scroll]");
	const headerShow = header.hasAttribute("data-fls-header-scroll-show");
	const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
	const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("scroll", function(e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains("--header-scroll") && header.classList.add("--header-scroll");
			if (headerShow) {
				if (scrollTop > scrollDirection) header.classList.contains("--header-show") && header.classList.remove("--header-show");
				else !header.classList.contains("--header-show") && header.classList.add("--header-show");
				timer = setTimeout(() => {
					!header.classList.contains("--header-show") && header.classList.add("--header-show");
				}, headerShowTimer);
			}
		} else {
			header.classList.contains("--header-scroll") && header.classList.remove("--header-scroll");
			if (headerShow) header.classList.contains("--header-show") && header.classList.remove("--header-show");
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
document.querySelector("[data-fls-header-scroll]") && window.addEventListener("load", headerScroll);
//#endregion
//#region src/components/layout/footer/footer.js
document.querySelector(".footer__year").textContent = (/* @__PURE__ */ new Date()).getFullYear();
//#endregion
//#region src/components/layout/digcounter/digcounter.js
function digitsCounter() {
	function digitsCountersInit(digitsCountersItems) {
		let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-fls-digcounter]");
		if (digitsCounters.length) digitsCounters.forEach((digitsCounter) => {
			if (digitsCounter.hasAttribute("data-fls-digcounter-go")) return;
			digitsCounter.setAttribute("data-fls-digcounter-go", "");
			digitsCounter.dataset.flsDigcounter = digitsCounter.innerHTML;
			digitsCounter.innerHTML = `0`;
			digitsCountersAnimate(digitsCounter);
		});
	}
	function digitsCountersAnimate(digitsCounter) {
		let startTimestamp = null;
		const duration = parseFloat(digitsCounter.dataset.flsDigcounterSpeed) ? parseFloat(digitsCounter.dataset.flsDigcounterSpeed) : 1e3;
		const startValue = parseFloat(digitsCounter.dataset.flsDigcounter);
		const format = digitsCounter.dataset.flsDigcounterFormat ? digitsCounter.dataset.flsDigcounterFormat : " ";
		const startPosition = 0;
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const value = Math.floor(progress * (startPosition + startValue));
			digitsCounter.innerHTML = typeof digitsCounter.dataset.flsDigcounterFormat !== "undefined" ? getDigFormat(value, format) : value;
			if (progress < 1) window.requestAnimationFrame(step);
			else digitsCounter.removeAttribute("data-fls-digcounter-go");
		};
		window.requestAnimationFrame(step);
	}
	function digitsCounterAction(e) {
		const entry = e.detail.entry;
		const targetElement = entry.target;
		if (targetElement.querySelectorAll("[data-fls-digcounter]").length && !targetElement.querySelectorAll("[data-fls-watcher]").length && entry.isIntersecting) digitsCountersInit(targetElement.querySelectorAll("[data-fls-digcounter]"));
	}
	document.addEventListener("watcherCallback", digitsCounterAction);
}
document.querySelector("[data-fls-digcounter]") && window.addEventListener("load", digitsCounter);
//#endregion
//#region src/components/forms/input/plugins/mask.js
var library;
var pending = /* @__PURE__ */ new WeakMap();
function activateMask(inputMask) {
	if (pending.has(inputMask)) return pending.get(inputMask);
	library ||= __vitePreload(() => import("./inputmask.min.js"), [], import.meta.url);
	const ready = library.then(({ default: Inputmask }) => {
		const russianPhone = inputMask.type === "tel" && inputMask.dataset.flsInputMask.startsWith("+7");
		function normalizePhone(value) {
			const digits = value.replace(/\D/g, "");
			return russianPhone && /^[78]\d{10}$/.test(digits) ? `+7${digits.slice(1)}` : value;
		}
		Inputmask({
			mask: inputMask.dataset.flsInputMask,
			inputmode: inputMask.type === "tel" ? "tel" : "text",
			onBeforeMask: normalizePhone
		}).mask(inputMask);
		if (inputMask.hasAttribute("data-fls-input-mask-nativepaste")) {
			inputMask.inputmask.dependencyLib(inputMask).off("paste.inputmask");
			inputMask.addEventListener("paste", (event) => {
				const value = event.clipboardData?.getData("text/plain") || "";
				const normalized = normalizePhone(value);
				if (normalized !== value) queueMicrotask(() => inputMask.inputmask.setValue(normalized));
			});
		}
	});
	pending.set(inputMask, ready);
	return ready;
}
function inputMask() {
	document.querySelectorAll("input[data-fls-input-mask]").forEach((inputMask) => {
		if (!inputMask.hasAttribute("data-fls-input-mask-lazy") || inputMask.classList.contains("--watcher-view")) activateMask(inputMask);
	});
}
document.querySelector("input[data-fls-input-mask]") && window.addEventListener("load", inputMask);
document.addEventListener("watcherCallback", ({ detail: { entry } }) => {
	if (entry.isIntersecting && entry.target.matches("input[data-fls-input-mask-lazy]")) activateMask(entry.target);
});
document.addEventListener("focusin", ({ target }) => {
	if (target.matches("input[data-fls-input-mask]")) activateMask(target);
});
//#endregion
//#region src/components/forms/input/plugins/autoheight.js
var autoHeight = () => {
	const textareas = document.querySelectorAll("textarea[data-fls-input-autoheight]");
	if (textareas.length) {
		textareas.forEach((textarea) => {
			const startHeight = textarea.hasAttribute("data-fls-input-autoheight-min") ? Number(textarea.dataset.flsInputAutoheightMin) : Number(textarea.offsetHeight);
			const maxHeight = textarea.hasAttribute("data-fls-input-autoheight-max") ? Number(textarea.dataset.flsInputAutoheightMax) : Infinity;
			setHeight(textarea, Math.min(startHeight, maxHeight));
			textarea.addEventListener("input", () => {
				if (textarea.scrollHeight > startHeight) {
					textarea.style.height = `auto`;
					setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
				}
			});
		});
		function setHeight(textarea, height) {
			textarea.style.height = `${height}px`;
		}
	}
};
document.querySelector("textarea[data-fls-input-autoheight]") && window.addEventListener("load", autoHeight);
//#endregion
//#region src/components/forms/form/form.js
function formInit() {
	function formSubmit() {
		const forms = document.forms;
		if (forms.length) for (const form of forms) {
			!form.hasAttribute("data-fls-form-novalidate") && form.setAttribute("novalidate", true);
			form.addEventListener("submit", function(e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener("reset", function(e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
		async function formSubmitAction(form, e) {
			if (formValidate.getErrors(form) === 0) {
				if (form.dataset.flsForm === "ajax") {
					e.preventDefault();
					const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
					const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
					const formData = new FormData(form);
					form.classList.add("--sending");
					const response = await fetch(formAction, {
						method: formMethod,
						body: formData
					});
					if (response.ok) {
						let responseResult = await response.json();
						form.classList.remove("--sending");
						formSent(form, responseResult);
					} else form.classList.remove("--sending");
				} else if (form.dataset.flsForm === "dev") {
					e.preventDefault();
					formSent(form);
				}
			} else {
				e.preventDefault();
				if (form.querySelector(".--form-error") && form.hasAttribute("data-fls-form-gotoerr")) gotoBlock(form.dataset.flsFormGotoerr ? form.dataset.flsFormGotoerr : ".--form-error");
			}
		}
		function formSent(form, responseResult = ``) {
			document.dispatchEvent(new CustomEvent("formSent", { detail: { form } }));
			setTimeout(() => {
				if (window.flsPopup) {
					const popup = form.dataset.flsFormPopup;
					if (form.dataset.flsFormPopupMessage) document.querySelector(`[data-fls-popup="${popup}"] [data-fls-popup-content]`).insertAdjacentHTML("afterbegin", form.dataset.flsFormPopupMessage);
					popup && window.flsPopup.open(popup);
				}
			}, 0);
			formValidate.formClean(form);
		}
	}
	function formFieldsInit() {
		document.body.addEventListener("focusin", function(e) {
			const targetElement = e.target;
			if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
				if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
					targetElement.classList.add("--form-focus");
					targetElement.parentElement.classList.add("--form-focus");
				}
				targetElement.hasAttribute("data-fls-form-validatenow") && formValidate.removeError(targetElement);
			}
		});
		document.body.addEventListener("focusout", function(e) {
			const targetElement = e.target;
			if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
				if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
					targetElement.classList.remove("--form-focus");
					targetElement.parentElement.classList.remove("--form-focus");
				}
				targetElement.hasAttribute("data-fls-form-validatenow") && formValidate.validateInput(targetElement);
			}
		});
	}
	formSubmit();
	formFieldsInit();
}
document.querySelector("[data-fls-form]") && window.addEventListener("load", formInit);
//#endregion
//#region src/components/effects/watcher/watcher.js
var ScrollWatcher = class {
	constructor(props) {
		let defaultConfig = { logging: true };
		this.config = Object.assign(defaultConfig, props);
		this.observer;
		!document.documentElement.hasAttribute("data-fls-watch") && this.scrollWatcherRun();
	}
	scrollWatcherUpdate() {
		this.scrollWatcherRun();
	}
	scrollWatcherRun() {
		document.documentElement.setAttribute("data-fls-watch", "");
		this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
	}
	scrollWatcherConstructor(items) {
		if (items.length) uniqArray(Array.from(items).map(function(item) {
			if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
				let valueOfThreshold;
				if (item.clientHeight > 2) {
					valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
					if (valueOfThreshold > 1) valueOfThreshold = 1;
				} else valueOfThreshold = 1;
				item.setAttribute("data-fls-watcher-threshold", valueOfThreshold.toFixed(2));
			}
			return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
		})).forEach((uniqParam) => {
			let uniqParamArray = uniqParam.split("|");
			let paramsWatch = {
				root: uniqParamArray[0],
				margin: uniqParamArray[1],
				threshold: uniqParamArray[2]
			};
			let groupItems = Array.from(items).filter(function(item) {
				let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
				let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
				let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
				if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
			});
			let configWatcher = this.getScrollWatcherConfig(paramsWatch);
			this.scrollWatcherInit(groupItems, configWatcher);
		});
	}
	getScrollWatcherConfig(paramsWatch) {
		let configWatcher = {};
		if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root);
		else if (paramsWatch.root !== "null") {}
		configWatcher.rootMargin = paramsWatch.margin;
		if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) return;
		if (paramsWatch.threshold === "prx") {
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
		} else paramsWatch.threshold = paramsWatch.threshold.split(",");
		configWatcher.threshold = paramsWatch.threshold;
		return configWatcher;
	}
	scrollWatcherCreate(configWatcher) {
		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}
	scrollWatcherInit(items, configWatcher) {
		this.scrollWatcherCreate(configWatcher);
		items.forEach((item) => this.observer.observe(item));
	}
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) !targetElement.classList.contains("--watcher-view") && targetElement.classList.add("--watcher-view");
		else targetElement.classList.contains("--watcher-view") && targetElement.classList.remove("--watcher-view");
	}
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
	}
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		this.scrollWatcherIntersecting(entry, targetElement);
		targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting && this.scrollWatcherOff(targetElement, observer);
		document.dispatchEvent(new CustomEvent("watcherCallback", { detail: { entry } }));
	}
};
document.querySelector("[data-fls-watcher]") && window.addEventListener("load", () => new ScrollWatcher({}));
//#endregion
//#region src/components/effects/scrollto/scrollto.js
function pageNavigation() {
	document.addEventListener("click", pageNavigationAction);
	document.addEventListener("watcherCallback", pageNavigationAction);
	function pageNavigationAction(e) {
		if (e.type === "click") {
			const targetElement = e.target;
			if (targetElement.closest("[data-fls-scrollto]")) {
				const gotoLink = targetElement.closest("[data-fls-scrollto]");
				const gotoLinkSelector = gotoLink.dataset.flsScrollto ? gotoLink.dataset.flsScrollto : "";
				const noHeader = gotoLink.hasAttribute("data-fls-scrollto-header") ? true : false;
				const gotoSpeed = gotoLink.dataset.flsScrolltoSpeed ? gotoLink.dataset.flsScrolltoSpeed : 500;
				const offsetTop = gotoLink.dataset.flsScrolltoTop ? parseInt(gotoLink.dataset.flsScrolltoTop) : 0;
				if (window.fullpage) {
					const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fls-fullpage-section]");
					const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.flsFullpageId : null;
					if (fullpageSectionId !== null) {
						window.fullpage.switchingSection(fullpageSectionId);
						if (document.documentElement.hasAttribute("data-fls-menu-open")) {
							bodyUnlock();
							document.documentElement.removeAttribute("data-fls-menu-open");
						}
					}
				} else gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				e.preventDefault();
			}
		} else if (e.type === "watcherCallback" && e.detail) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			if (targetElement.dataset.flsWatcher === "navigator") {
				document.querySelector(`[data-fls-scrollto].--navigator-active`);
				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`);
				else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
					const element = targetElement.classList[index];
					if (document.querySelector(`[data-fls-scrollto=".${element}"]`)) {
						navigatorCurrentItem = document.querySelector(`[data-fls-scrollto=".${element}"]`);
						break;
					}
				}
				if (entry.isIntersecting) navigatorCurrentItem && navigatorCurrentItem.classList.add("--navigator-active");
				else navigatorCurrentItem && navigatorCurrentItem.classList.remove("--navigator-active");
			}
		}
	}
	if (getHash()) {
		let goToHash;
		if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`;
		else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
		goToHash && gotoBlock(goToHash);
	}
}
document.querySelector("[data-fls-scrollto]") && window.addEventListener("load", pageNavigation);
var extensions = /* @__PURE__ */ new Set([
	"pdf",
	"dwg",
	"xlsx",
	"docx",
	"zip"
]);
function validateAttachments(files) {
	if (files.length > 5) return "Можно прикрепить не более 5 файлов.";
	if (files.some((file) => !extensions.has(file.name.split(".").pop().toLowerCase()))) return "Допустимые форматы: PDF, DWG, XLSX, DOCX и ZIP.";
	if (files.some((file) => file.size === 0)) return "Пустой файл нельзя прикрепить к заявке.";
	if (files.reduce((total, file) => total + file.size, 0) > 52428800) return "Общий размер материалов превышает 50 МБ.";
	return "";
}
//#endregion
//#region src/components/custom/request/_api.js
async function submitProjectRequest(payload, { endpoint, signal, simulateError = false } = {}) {
	const attachmentError = validateAttachments(payload.getAll("materials"));
	if (attachmentError) throw new Error(attachmentError);
	if (endpoint) {
		const response = await fetch(endpoint, {
			method: "POST",
			body: payload,
			signal,
			headers: { Accept: "application/json" }
		});
		if (!response.ok) throw new Error(`Request failed: ${response.status}`);
		const result = await response.json();
		if (result.success !== true) throw new Error("Request was not accepted");
		return result;
	}
	await new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(signal.reason);
			return;
		}
		const timer = setTimeout(() => {
			signal?.removeEventListener("abort", abort);
			resolve();
		}, 900);
		function abort() {
			clearTimeout(timer);
			reject(signal.reason);
		}
		signal?.addEventListener("abort", abort, { once: true });
	});
	if (simulateError || typeof navigator !== "undefined" && !navigator.onLine) throw new Error("Request transport is unavailable");
	return { success: true };
}
//#endregion
//#region src/components/custom/request/request.js
var form = document.querySelector(".request__form");
var submit = form.querySelector(".request__submit");
var submitText = form.querySelector(".request__submit-text");
var submitArrow = form.querySelector(".request__submit-arrow");
var submitSpinner = form.querySelector(".request__submit-spinner");
var result = form.querySelector(".request__result");
var submitLabel = submitText.textContent;
var resultTitle = form.querySelector(".request__result-title");
var resultText = form.querySelector(".request__result-text");
var fileInput = form.querySelector(".request__file-input");
var dropzone = form.querySelector(".request__dropzone");
var fileList = form.querySelector(".request__file-list");
var fileError = form.querySelector(".request__file-error");
var attachments = [];
form.addEventListener("submit", async (event) => {
	event.preventDefault();
	event.stopImmediatePropagation();
	if (form.dataset.state === "loading") return;
	result.hidden = true;
	form.dataset.state = "idle";
	let errors = formValidate.getErrors(form);
	const phone = form.elements.phone;
	if (phone.inputmask ? !phone.inputmask.isComplete() : !/^(?:\+?7|8)?\d{10}$/.test(phone.value.replace(/[\s()-]/g, ""))) {
		formValidate.addError(phone);
		errors++;
	}
	const area = form.elements.area;
	if (area.value && !area.checkValidity()) {
		area.dataset.flsFormErrtext = "Укажите площадь от 1 до 10 000 000 м²";
		formValidate.addError(area);
		errors++;
	}
	decorateErrors();
	const attachmentError = validateAttachments(attachments);
	showFileError(attachmentError);
	if (attachmentError) errors++;
	if (errors) {
		const first = form.querySelector("input.--form-error, textarea.--form-error, select.--form-error");
		if (first?.tagName === "SELECT") first.parentElement.querySelector(".select__title")?.focus();
		else (first || fileInput).focus();
		return;
	}
	const payload = new FormData(form);
	payload.delete("materials");
	attachments.forEach((file) => payload.append("materials", file));
	setLoading(true);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 3e4);
	try {
		await submitProjectRequest(payload, {
			endpoint: form.dataset.requestEndpoint,
			signal: controller.signal
		});
		formValidate.formClean(form);
		attachments = [];
		renderAttachments();
		document.dispatchEvent(new CustomEvent("formSent", { detail: { form } }));
		form.dataset.state = "success";
		result.classList.remove("request__result--error");
		resultTitle.textContent = "Заявка принята";
		resultText.textContent = "Заявка принята. Инженер проекта свяжется с вами в течение 1 рабочего дня.";
	} catch {
		form.dataset.state = "error";
		result.classList.add("request__result--error");
		resultTitle.textContent = "Заявка не отправлена";
		resultText.textContent = "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону +7 (495) 120-44-18.";
	} finally {
		clearTimeout(timeout);
		setLoading(false);
		result.hidden = false;
		result.focus({ preventScroll: true });
		decorateErrors();
	}
}, true);
function setLoading(loading) {
	if (loading) form.dataset.state = "loading";
	form.setAttribute("aria-busy", String(loading));
	submit.disabled = loading;
	fileInput.disabled = loading;
	form.querySelectorAll(".request__file-remove").forEach((button) => {
		button.disabled = loading;
	});
	submitText.textContent = loading ? "Отправляем заявку…" : submitLabel;
	submitArrow.hidden = loading;
	submitSpinner.hidden = !loading;
}
function showFileError(message) {
	fileError.textContent = message;
	fileError.hidden = !message;
	fileInput.setAttribute("aria-invalid", String(Boolean(message)));
}
function addAttachments(incoming) {
	if (form.dataset.state === "loading") return;
	const next = [...attachments];
	for (const file of incoming) if (!next.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) next.push(file);
	const error = validateAttachments(next);
	showFileError(error);
	if (error) return;
	attachments = next;
	renderAttachments();
}
function renderAttachments() {
	fileList.replaceChildren();
	attachments.forEach((file, index) => {
		const item = document.createElement("li");
		item.className = "request__file-item";
		const name = document.createElement("span");
		name.className = "request__file-name";
		name.textContent = file.name;
		const size = document.createElement("span");
		size.className = "request__file-size";
		const unit = file.size < 1024 ? "Б" : file.size < 1048576 ? "КБ" : "МБ";
		const divisor = unit === "Б" ? 1 : unit === "КБ" ? 1024 : 1048576;
		size.textContent = `${(file.size / divisor).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ${unit}`;
		const remove = document.createElement("button");
		remove.type = "button";
		remove.className = "request__file-remove";
		remove.textContent = "Удалить";
		remove.setAttribute("aria-label", `Удалить файл ${file.name}`);
		remove.addEventListener("pointerdown", (event) => event.preventDefault());
		remove.addEventListener("click", () => {
			attachments.splice(index, 1);
			showFileError("");
			renderAttachments();
			(fileList.querySelector(".request__file-remove") || fileInput).focus();
		});
		item.append(name, size, remove);
		fileList.append(item);
	});
}
fileInput.addEventListener("change", () => {
	addAttachments([...fileInput.files]);
	fileInput.value = "";
});
var dragDepth = 0;
dropzone.addEventListener("dragenter", (event) => {
	event.preventDefault();
	if (form.dataset.state === "loading") return;
	dragDepth++;
	dropzone.dataset.state = "dragging";
});
dropzone.addEventListener("dragover", (event) => {
	event.preventDefault();
	event.dataTransfer.dropEffect = form.dataset.state === "loading" ? "none" : "copy";
});
dropzone.addEventListener("dragleave", (event) => {
	event.preventDefault();
	dragDepth = Math.max(0, dragDepth - 1);
	if (!dragDepth) dropzone.dataset.state = "idle";
});
dropzone.addEventListener("drop", (event) => {
	event.preventDefault();
	dragDepth = 0;
	dropzone.dataset.state = "idle";
	addAttachments([...event.dataTransfer.files]);
});
function decorateErrors() {
	form.querySelectorAll("input, textarea, select").forEach((field) => {
		if (field.type === "file") return;
		field.setAttribute("aria-invalid", String(field.classList.contains("--form-error")));
		const error = field.parentElement.querySelector("[data-fls-form-error]");
		if (error) {
			error.classList.add("request__error");
			error.id = `${field.id || "consent"}-error`;
			field.setAttribute("aria-describedby", error.id);
		} else field.removeAttribute("aria-describedby");
		if (field.tagName === "SELECT") {
			const title = field.parentElement.querySelector(".select__title");
			if (title) {
				title.setAttribute("aria-invalid", field.getAttribute("aria-invalid"));
				if (error) title.setAttribute("aria-describedby", error.id);
				else title.removeAttribute("aria-describedby");
			}
		}
	});
}
new MutationObserver(decorateErrors).observe(form, {
	childList: true,
	subtree: true
});
window.addEventListener("load", () => {
	const select = form.querySelector(".select");
	if (!select) return;
	function labelSelect() {
		const title = select.querySelector(".select__title");
		const list = select.querySelector(".select__options");
		title.id = "object-trigger";
		document.getElementById("object-label").htmlFor = title.id;
		const value = title.querySelector(".select__value");
		value.id = "object-value";
		title.setAttribute("aria-labelledby", "object-label object-value");
		title.setAttribute("aria-expanded", String(select.classList.contains("--select-open")));
		title.setAttribute("aria-haspopup", "listbox");
		title.setAttribute("aria-controls", "object-options");
		list.id = "object-options";
		list.setAttribute("role", "listbox");
		list.setAttribute("aria-labelledby", "object-label");
		select.querySelectorAll(".select__option").forEach((option) => {
			option.setAttribute("role", "option");
			option.setAttribute("aria-selected", String(option.dataset.flsSelectValue === form.elements.object.value));
		});
	}
	labelSelect();
	new MutationObserver(labelSelect).observe(select, {
		childList: true,
		attributes: true,
		subtree: true,
		attributeFilter: ["class"]
	});
	select.addEventListener("keydown", (event) => {
		const options = [...select.querySelectorAll(".select__option:not([hidden])")];
		const title = select.querySelector(".select__title");
		if (event.key === "Escape") {
			title.focus();
			return;
		}
		if (![
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End"
		].includes(event.key)) return;
		event.preventDefault();
		if (!select.classList.contains("--select-open")) {
			title.click();
			setTimeout(() => (event.key === "ArrowUp" ? options.at(-1) : options[0])?.focus(), 180);
			return;
		}
		let index = options.indexOf(document.activeElement);
		if (event.key === "Home") index = 0;
		else if (event.key === "End") index = options.length - 1;
		else index = (index + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length;
		options[index]?.focus();
	});
});
//#endregion
//#region src/components/custom/projects/projects.js
var slider = document.querySelector(".projects__slider[data-fls-slider]");
function enhanceSlider() {
	queueMicrotask(() => {
		const swiper = slider.swiper;
		if (!swiper) return;
		swiper.params.speed = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700;
		swiper.params.autoHeight = true;
		slider.classList.add(`${swiper.params.containerModifierClass}autoheight`);
		swiper.params.navigation.addIcons = false;
		slider.querySelectorAll(".swiper-navigation-icon").forEach((icon) => icon.remove());
		const counter = slider.querySelector(".projects__counter");
		const slides = [...slider.querySelectorAll(".projects__slide")];
		function sync() {
			counter.textContent = `${String(swiper.activeIndex + 1).padStart(2, "0")} / 03`;
			slides.forEach((slide, index) => {
				slide.inert = index !== swiper.activeIndex;
				slide.setAttribute("aria-hidden", String(index !== swiper.activeIndex));
			});
		}
		swiper.on("slideChange", sync);
		slider.addEventListener("keydown", (event) => {
			if (event.key === "ArrowRight") {
				event.preventDefault();
				swiper.slideNext();
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				swiper.slidePrev();
			}
		});
		let heightFrame;
		function updateHeight() {
			cancelAnimationFrame(heightFrame);
			heightFrame = requestAnimationFrame(() => {
				if (!swiper.destroyed) swiper.updateAutoHeight(0);
			});
		}
		swiper.on("resize", updateHeight);
		swiper.update();
		updateHeight();
		sync();
	});
}
slider?.addEventListener("sliderReady", enhanceSlider);
window.addEventListener("load", () => {
	if (slider?.swiper) enhanceSlider();
});
//#endregion
//#region src/components/custom/process/process.js
var root = document.querySelector("[data-fls-process]");
var steps = [...root.querySelectorAll("[data-step]")];
var labels = [
	"Аудит площадки и задачи",
	"Концепция и бюджетирование",
	"Проектирование",
	"Подготовка площадки",
	"Каркас и фасад",
	"Инженерные системы",
	"Готовый объект"
];
var visible = /* @__PURE__ */ new Map();
var mobile = window.matchMedia("(max-width: 768px)");
function show(index) {
	root.dataset.stage = String(index);
	root.style.setProperty("--progress", `${(index + 1) / 7 * 100}%`);
	root.querySelector(".process__progress-label").textContent = `0${index + 1} / 07`;
	root.querySelector(".process__current").textContent = labels[index];
	steps.forEach((step, i) => step.toggleAttribute("data-active", i === index));
}
show(mobile.matches ? 6 : 0);
mobile.addEventListener("change", () => show(mobile.matches ? 6 : 0));
document.addEventListener("watcherCallback", ({ detail: { entry } }) => {
	if (!entry.target.matches(".process__step")) return;
	if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
	else visible.delete(entry.target);
	if (mobile.matches || !visible.size) return;
	const sorted = [...visible.keys()].sort((a, b) => {
		const center = window.innerHeight / 2;
		return Math.abs(a.getBoundingClientRect().top + a.offsetHeight / 2 - center) - Math.abs(b.getBoundingClientRect().top + b.offsetHeight / 2 - center);
	});
	show(Number(sorted[0].dataset.step));
});
//#endregion
//#region src/components/custom/numbers/numbers.js
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.querySelectorAll("[data-fls-digcounter]").forEach((counter) => {
	counter.dataset.flsDigcounterSpeed = "1";
});
//#endregion
