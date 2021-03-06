var reactComponentSymbol = Symbol.for("r2wc.reactComponent");
var renderSymbol = Symbol.for("r2wc.reactRender");
var shouldRenderSymbol = Symbol.for("r2wc.shouldRender");
import _ from 'lodash';

var define = {
	// Creates a getter/setter that re-renders everytime a property is set.
	expando: function(receiver, key, value) {
		Object.defineProperty(receiver, key, {
			enumerable: true,
			get: function() {
				return value;
			},
			set: function(newValue) {
				value = newValue;
				this[renderSymbol]();
			}
		});
		receiver[renderSymbol]();
	}
}

function toPropName(attrName) {
	return attrName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
function toAttrName(propName) {
  return propName.replace(/([A-Z])/g,"-$1").toLowerCase();
}

/**
 * Converts a React component into a webcomponent by wrapping it in a Proxy object.
 * @param {ReactComponent}
 * @param {React}
 * @param {ReactDOM}
 * @param {Object} options - Optional parameters
 * @param {String?} options.shadow - Use shadow DOM rather than light DOM.
 */
export default function(ReactComponent, React, ReactDOM, options= {}) {
	var renderAddedProperties = {isConnected: "isConnected" in HTMLElement.prototype};
	var rendering = false;
	// Create the web component "class"
	var WebComponent = function() {
		var self = Reflect.construct(HTMLElement, arguments, this.constructor);
		if (options.shadow) {
			self.attachShadow({ mode: 'open' });
		}
		return self;
	};

	// Handle attributes changing
	if (ReactComponent.propTypes) {
		WebComponent.observedAttributes = Object.keys(ReactComponent.propTypes).map((key)=>{return toAttrName(key)});
	}

	// Make the class extend HTMLElement
	var targetPrototype = Object.create(HTMLElement.prototype);
	targetPrototype.constructor = WebComponent;

	// But have that prototype be wrapped in a proxy.
	var proxyPrototype = new Proxy(targetPrototype, {
		has: function (target, key) {
			return key in WebComponent.observedAttributes ||
				key in targetPrototype;
		},

		// when any undefined property is set, create a getter/setter that re-renders
		set: function(target, key, value, receiver) {
			if (rendering) {
				renderAddedProperties[key] = true;
			}

			if (typeof key === "symbol" || renderAddedProperties[key] || key in target) {
				return Reflect.set(target, key, value, receiver);
			} else {
				define.expando(receiver, key, value)
			}
			return true;
		},
		// makes sure the property looks writable
		getOwnPropertyDescriptor: function(target, key){
			var own = Reflect.getOwnPropertyDescriptor(target, key);
			if (own) {
				return own;
			}
			if (key in WebComponent.observedAttributes) {
				return { configurable: true, enumerable: true, writable: true, value: undefined };
			}
		}
	});
	WebComponent.prototype = proxyPrototype;

	// Setup lifecycle methods
	targetPrototype.connectedCallback = function() {
		// this.children = []
		// this.childNodes.forEach(node => {
		// 	this.children.push(node)
		// 	console.log(node.nodeName)
		// })

		// Once connected, it will keep updating the innerHTML.
		// We could add a render method to allow this as well.
		this[shouldRenderSymbol] = true;
		this[renderSymbol]();

	};
	targetPrototype[renderSymbol] = function() {
		if (this[shouldRenderSymbol] === true) {
			var data = {};
			Object.keys(this).forEach(function(key) {
				if (renderAddedProperties[key] !== false && !key.startsWith('__react')) {
					var propName = toPropName(key)
					data[propName] = this[key];
				}
			}, this);
			// data.children = this.childNodes;
			// console.log(data)
			rendering = true;
			// Container is either shadow DOM or light DOM depending on `shadow` option.
			// const container = options.shadow ? this.shadowRoot : document.createElement('span');
			// if (!options.shadow) {
			// 	this.appendChild(container);
			// }
			const container = options.shadow ? this.shadowRoot : this;

			// Use react to render element in 
			this[reactComponentSymbol] = ReactDOM.render(
				React.createElement(ReactComponent, data), container
			);
			rendering = false;
		}
	};

	// Handle attributes changing
	if (ReactComponent.propTypes) {
		targetPrototype.attributeChangedCallback = function(name, oldValue, newValue) {
			// TODO: handle type conversion
			this[name] = newValue;
		};
	}

	return WebComponent;
}
