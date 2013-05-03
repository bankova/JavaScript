var domModule = (function () {
	        //associative array as buffer, in order to keep trace of each of the selectors
	        var fragmentsBuffer = {};
	        var MAX_FRAGMENT_COUNT_OF_SELECTOR = 100;

            //first element matching selector
	        function getElementBySelector(selector) {
	            return document.querySelector(selector);
	        }

            //all elements matching selector
	        function getElementsBySelector(selector) {
	            return document.querySelectorAll(selector);
	        }

	        function addElement(parentSelector, element) {
	            var parent = getElementBySelector(parentSelector);
	            parent.appendChild(element);
	        }

	        function removeElements(parentSelector, childSelector) {
	            var elementsToRemove = getElementsBySelector(parentSelector + " " + childSelector);
	            for (var i = 0; i < elementsToRemove.length; i++) {
	                elementsToRemove[i].parentNode.removeChild(elementsToRemove[i]);
	            }
	        }

	        function addHandler(selector, eventType, eventHandler) {
	            var elements = getElementsBySelector(selector);

	            for (var i = 0, len = elements.length; i < len; i++) {
	                if (elements[i].addEventListener) {
	                    elements[i].addEventListener(eventType, eventHandler, false);
	                } else if (document.attachEvent) {
	                    elements[i].attachEvent("on" + eventType, eventHandler);
	                } else {
	                    elements[i]["on" + eventType] = eventHandler;
	                }
	            }
	        }

	        function appendToBuffer(parentSelector, element) {
                //if the selector does not exist in the buffer- create it
                if (!fragmentsBuffer[parentSelector]) {
	                    fragmentsBuffer[parentSelector] = {
	                    fragment: document.createDocumentFragment(),
	                    length: 0
	                };
	            }

	            fragmentsBuffer[parentSelector].fragment.appendChild(element);
	            fragmentsBuffer[parentSelector].length += 1;

	            // the fragment has reached the buffer maximum size per the given selector
	            if (fragmentsBuffer[parentSelector].length === MAX_FRAGMENT_COUNT_OF_SELECTOR) {
	                var parent = getElementBySelector(parentSelector);
	                parent.appendChild(fragmentsBuffer[parentSelector].fragment);
	                delete fragmentsBuffer[parentSelector];
	            }
	        }

	        return {
	            addElement: addElement,
	            removeElements: removeElements,
	            addHandler: addHandler,
	            appendToBuffer: appendToBuffer
	        };
	    })();