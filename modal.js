/**
 * Created by tab on 02/08/2017.
 * Modal component
 */

(function () {

	/**
	 * 共用弹窗组件使用方法
	 * @type {Modal}
		var modal = new Modal({
			content: 'Hello, World',
			cancleText: '确定'
		});

		modal.open();
		modal.close();
	*/

	/**
	 * 弹窗构造函数
	 * @constructor
	 */
	this.Modal = function () {

		//create instance global references
		this.closeButton = null;
		this.modal = null;
		this.overlay = null;
		this.cancleButton = null;
		this.okButton = null;

		//Define option defaults
		var defaults = {
			className: '',
			closeButton: true,
			title: '',
			content: '',
			maxWidth: 400,
			minWidth: 300,
			overlay: true,
			cancleCallback: null, //取消回调函数
			okCallback: null, //确定回调函数
			cancleText: '',
			okText: ''
		};

		//extending with passed in arguments
		if (arguments[0] && typeof arguments[0] === 'object') {
			this.options = _extendDefaults(defaults, arguments[0]);
		} else {
			this.options = defaults;
		}

		this.transitionEnd = _transitionSelect();

	};

	/**
	 * Public Methods
	 */
	Modal.prototype.open = function () {
		//Build out the Modal
		_buildOut.call(this);

		//Initlize Modal Events
		_initlizeEvents.call(this)

		// reforce browser to recalc the css style
		window.getComputedStyle(this.modal).height;

		this.modal.className = this.modal.className + (this.modal.offsetHeight > window.innerHeight ? ' fclc2-open fclc2-anchred' : ' fclc2-open');
		this.overlay.className = 'fclc2-overlay fclc2-open';
	};

	Modal.prototype.close = function () {
		var _this = this;

		this.modal.className = this.modal.className.replace(' fclc2-open', '');
		this.overlay.className = this.modal.className.replace(' fclc2-open', '');

		/**
		 * Listen for CSS transitionend event and then remove the nodes from the DOM
		 */
		this.modal.addEventListener(this.transitionEnd, function () {
			_this.modal.parentNode.removeChild(_this.modal);
		});
		this.overlay.addEventListener(this.transitionEnd, function () {
			_this.overlay.parentNode.removeChild(_this.overlay);
		});
	};

	/**
	 * 构建弹窗内容
	 * @private
	 */
	function _buildOut() {
		var content, contentHolder, buttonHolder, docFrag;
		var _options = this.options;

		if (_options.content && typeof _options.content === 'string') {
			content = _options.content;
		} else {
			content = _options.content.innerHTML;
		}

		docFrag = document.createDocumentFragment();

		//Create modal element
		this.modal = document.createElement('div');
		this.modal.className = 'fclc2-modal ' + _options.className;
		this.modal.style.minWidth = _options.minWidth + 'px';
		this.modal.style.maxWidth = _options.maxWidth + 'px';

		if (_options.closeButton) {
			this.closeButton = document.createElement('button');
			this.closeButton.className = 'fclc2-close close-button';
			this.closeButton.innerHTML = '<i class="wf-close iconfont fr"></i>';
			this.modal.appendChild(this.closeButton);
		}

		if(_options.overlay) {
			this.overlay = document.createElement('div');

			//TODO: className到底是做什么用的？
			this.overlay.className = 'fclc2-overlay ' + _options.className;
			docFrag.appendChild(this.overlay);
		}

		contentHolder = document.createElement('div');
		contentHolder.className = 'fclc2-content';
		contentHolder.innerHTML = content;
		this.modal.appendChild(contentHolder);

		if (_options.cancleText || _options.okText) {
			buttonHolder = document.createElement('div');
			buttonHolder.className = 'modal-button-groups';
		}

		//按钮
		if (_options.cancleText) {
			this.cancleButton = document.createElement('button');
			this.cancleButton.innerText = _options.cancleText;
			this.cancleButton.className = 'modal-button default-button';
			buttonHolder.appendChild(this.cancleButton);
		}

		if (_options.okText) {
			this.okButton = document.createElement('button');
			this.okButton.innerText = _options.okText;
			this.okButton.className = 'modal-button primary-button';

			if (_options.okCallback && typeof _options.okCallback === 'function') {
				this.okButton.addEventListener('click', _options.okCallback, false);
			}
			buttonHolder.appendChild(this.okButton);
		}

		if (buttonHolder) {
			this.modal.appendChild(buttonHolder);
		}

		docFrag.appendChild(this.modal);

		document.body.appendChild(docFrag);
	}

	function _initlizeEvents() {
		if (this.closeButton) {
			this.closeButton.addEventListener('click', this.close.bind(this));
		}

		if (this.overlay) {
			this.overlay.addEventListener('click', this.close.bind(this));
		}

		if (this.cancleButton) {
			this.cancleButton.addEventListener('click', this.close.bind(this));
		}

		if (this.okButton) {
			var _okButton = this.options.okCallback || this.close.bind(this);
			this.okButton.addEventListener('click',_okButton ,false);
		}
	}


	/**
	 * 属性拓展函数
	 * @param source
	 * @param properties
	 * @returns {*}
	 * @private
	 */
	function _extendDefaults(source, properties) {
		for (var property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}

		return source;
	}

	/**
	 * 浏览器transitionend事件支持探测
	 * @returns {*}
	 * @private
	 */
	function _transitionSelect() {
		var el = document.createElement('div');
		if (el.style.WebkitTransition) return 'webkitTransitionEnd';
		if (el.style.OTransition) return 'oTransitionEnd';
		return 'transitionend';
	}

}());
