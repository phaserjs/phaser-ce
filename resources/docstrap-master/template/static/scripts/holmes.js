(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.holmes = factory());
}(this, (function () { 'use strict';

var _global='undefined'==typeof window?global:window;function toFactory(a){var b=function(){for(var b=void 0,c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];return b='undefined'!=typeof this&&this!==_global?a.call.apply(a,[this].concat(d)):new(Function.prototype.bind.apply(a,[null].concat(d))),b};return b.__proto__=a,b.prototype=a.prototype,b}var stringIncludes=function(a,b){return-1!==a.indexOf(b)};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var errors={invalidInput:'The Holmes input was no <input> or contenteditable.',optionsObject:'The options need to be given inside an object like this:\n\nnew Holmes({\n  find:".result"\n});\n\nsee also https://haroen.me/holmes/doc/holmes.html',findOption:'A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like:\n\nnew Holmes({\n  find:".result"\n});\n\nsee also https://haroen.me/holmes/doc/holmes.html',noInput:'Your Holmes.input didn\'t match a querySelector',impossiblePlaceholder:'The Holmes placeholder couldn\'t be put; the elements had no parent.'}; var Holmes=function(){function a(b){var c=this;classCallCheck(this,a);var d=!1;if('object'!==('undefined'==typeof b?'undefined':_typeof(b)))throw new Error(errors.optionsObject);if('string'!=typeof b.find)throw new Error(errors.findOption);var e={input:'input[type=search]',find:'',placeholder:void 0,mark:!1,class:{visible:void 0,hidden:'hidden'},dynamic:!1,minCharacters:0,hiddenAttr:!1,onHidden:void 0,onVisible:void 0,onEmpty:void 0,onFound:void 0,onInput:void 0};this.options=Object.assign({},e,b),this.options.class=Object.assign({},e.class,b.class),this.hidden=0,this.running=!1,window.addEventListener('DOMContentLoaded',function(){return c.start()}),this.search=function(){c.running=!0;var a=!1;c.searchString=c.inputString(),c.options.minCharacters&&0!==c.searchString.length&&c.options.minCharacters>c.searchString.length||(c.options.dynamic&&(c.elements=document.querySelectorAll(c.options.find),c.elementsLength=c.elements.length,c.elementsArray=Array.prototype.slice.call(c.elements)),c.options.mark&&(c._regex=new RegExp('('+c.searchString+')(?![^<]*>)','gi')),c.elementsArray.forEach(function(b){stringIncludes(b.textContent.toLowerCase(),c.searchString)?(c._showElement(b),d&&'function'==typeof c.options.onFound&&c.options.onFound(c.placeholderNode),a=!0):c._hideElement(b);}),'function'==typeof c.options.onInput&&c.options.onInput(c.searchString),a?c.options.placeholder&&c._hideElement(c.placeholderNode):(c.options.placeholder&&c._showElement(c.placeholderNode),!1==d&&(d=!0,'function'==typeof c.options.onEmpty&&c.options.onEmpty(c.placeholderNode))));};}return createClass(a,[{key:'_hideElement',value:function _hideElement(a){this.options.class.visible&&a.classList.remove(this.options.class.visible),a.classList.contains(this.options.class.hidden)||(a.classList.add(this.options.class.hidden),this.hidden++,'function'==typeof this.options.onHidden&&this.options.onHidden(a)),this.options.hiddenAttr&&a.setAttribute('hidden','true'),this.options.mark&&(a.innerHTML=a.innerHTML.replace(/<\/?mark>/g,''));}},{key:'_showElement',value:function _showElement(a){this.options.class.visible&&a.classList.add(this.options.class.visible),a.classList.contains(this.options.class.hidden)&&(a.classList.remove(this.options.class.hidden),this.hidden--,'function'==typeof this.options.onVisible&&this.options.onVisible(a)),this.options.hiddenAttr&&a.removeAttribute('hidden'),this.options.mark&&(a.innerHTML=a.innerHTML.replace(/<\/?mark>/g,''),this.searchString.length&&(a.innerHTML=a.innerHTML.replace(this._regex,'<mark>$1</mark>')));}},{key:'_inputHandler',value:function _inputHandler(){console.warn('You can now directly call .search() to refresh the results'),this.search();}},{key:'inputString',value:function inputString(){if(this.input instanceof HTMLInputElement)return this.input.value.toLowerCase();if(this.input.contentEditable)return this.input.textContent.toLowerCase();throw new Error(errors.invalidInput)}},{key:'setInput',value:function setInput(a){if(this.input instanceof HTMLInputElement)this.input.value=a;else if(this.input.contentEditable)this.input.textContent=a;else throw new Error(errors.invalidInput)}},{key:'start',value:function start(){var a=document.querySelector(this.options.input);if(a instanceof HTMLElement)this.input=a;else throw new Error(errors.noInput);if('string'==typeof this.options.find)this.elements=document.querySelectorAll(this.options.find);else throw new Error(errors.findOption);if(this.elementsLength=this.elements.length,this.elementsArray=Array.prototype.slice.call(this.elements),this.hidden=0,'string'==typeof this.options.placeholder){var b=this.options.placeholder;if(this.placeholderNode=document.createElement('div'),this.placeholderNode.id='holmes-placeholder',this._hideElement(this.placeholderNode),this.placeholderNode.innerHTML=b,this.elements[0].parentNode instanceof Element)this.elements[0].parentNode.appendChild(this.placeholderNode);else throw new Error(errors.impossiblePlaceholder)}if(this.options.class.visible){var c=this.options.class.visible;this.elementsArray.forEach(function(a){a.classList.add(c);});}this.input.addEventListener('input',this.search);}},{key:'stop',value:function stop(){var a=this;return new Promise(function(b,c){try{a.input.removeEventListener('input',a.search),a.options.placeholder&&(a.placeholderNode.parentNode?a.placeholderNode.parentNode.removeChild(a.placeholderNode):c(new Error(errors.impossiblePlaceholder))),a.options.mark&&a.elementsArray.forEach(function(a){a.innerHTML=a.innerHTML.replace(/<\/?mark>/g,'');}),a.running=!1,b('This instance of Holmes has been stopped.');}catch(a){c(a);}})}},{key:'clear',value:function clear(){var a=this;this.setInput(''),this.elementsArray.forEach(function(b){a._showElement(b);}),this.options.placeholder&&this._hideElement(this.placeholderNode),this.hidden=0;}},{key:'count',value:function count(){return{all:this.elementsLength,hidden:this.hidden,visible:this.elementsLength-this.hidden}}}]),a}(); var holmes=toFactory(Holmes);

return holmes;

})));
