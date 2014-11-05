/******************************************************************************
 * This file is part of the Behavior Tree Starter Kit.
 * 
 * Copyright (c) 2012, AiGameDev.com.
 * 
 * Credits:         Alex J. Champandard
 *****************************************************************************/

/**
 * Return values of and valid states for behaviors.
 */
Status.prototype = Object.create(Object.prototype, {
    BH_INVALID: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: '0'
    },
    BH_SUCCESS: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: '1'
    },
    BH_FAILURE: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: '2'
    },
    BH_RUNNING: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: '3'
    },
    BH_ABORTED: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: '4'
    }
};

/**
 * Base class for actions, conditions and composites.
 */
Behavior.prototype = Object.create(Object.prototype, {
	_eStatus: {
        writable: true,
        configurable: false,
        enumerable: false,
        value: Status.BH_INVALID
    },
    eStatus: {
        configurable: false,
        get: function() {
            "use strict";
            return _eStatus;
        }
    },

	update: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
    },
    
    onInitialize: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
    },
    
    onTerminate: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
    },

    tick: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: function() {
            if (_eStatus != Status.BH_RUNNING) {
                onInitialize();
            }

            _eStatus = update();

            if (m_eStatus != Status.BH_RUNNING) {
                onTerminate(_eStatus);
            }
            return _eStatus;
        }
    },

    reset: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: function() {
        	m_eStatus = Status.BH_INVALID;
        }
    },
    
    abort: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: function() {
        	onTerminate(Status.BH_ABORTED);
        	_eStatus = Status.BH_ABORTED;
        }
    },

    isTerminated: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: function() {
        	return _eStatus == Status.BH_SUCCESS  ||  _eStatus == Status.BH_FAILURE;
        }
    },

    isRunning: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: function() {
        	return _eStatus == Status.BH_RUNNING;
        }
    }
});

Decorator = function(child) { this._pChild = child; };
Decorator.prototype = Object.create(new Behavior, {
    _pChild: {
        writable: true,
        configurable: false,
        enumerable: false,
        value: null
    }
});

Repeat = function(child) { this._pChild = child; };
Repeat.prototype = Object.create(new Decorator, {
    _iLimit: {
        writable: true,
        configurable: false,
        enumerable: false,
        value: null
    },
    iLimit: {
        configurable: false,
        set: function(count) {
            "use strict";
            _iLimit = count;
        }
    },
    
    _iCounter: {
        writable: true,
        configurable: false,
        enumerable: false,
        value: null
    }
    
    onInitialize: { 
    	configurable:false, 
        value: function (){
            _iCounter = 0;
        }
    }

    update: { 
    	configurable:false, 
        value: function (){
            for (;;) {
                _pChild->tick();
                if (_pChild.getStatus() == Status.BH_RUNNING) break;
                if (_pChild.getStatus() == Status.BH_FAILURE) return Status.BH_FAILURE;
                if (++_iCounter == _iLimit) return Status.BH_SUCCESS;
                _pChild.reset();
            }
            return Status.BH_INVALID;
        }
    }
});

Composite.prototype = Object.create(new Behavior, {
    _Children: {
        writable: true,
        configurable: false,
        enumerable: false,
        value: []
    }
    
    addChild: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: function(child) {
            "use strict";
            this._Children.push(child);
        }
    },

    removeChild: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: null
    },
    
    clearChildren: {
        writable: false,
        configurable: false,
        enumerable: true,
        value: null
    },
});

Parallel.prototype = Object.create(new Composite, {
});

Monitor.prototype = Object.create(new Parallel, {
});

ActiveSelector.prototype = Object.create(new Selector, {
});

ActiveSelector.prototype = Object.create(new Selector, {
});
