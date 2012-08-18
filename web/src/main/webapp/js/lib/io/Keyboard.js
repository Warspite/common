var Keyboard = function(renderer)
{
	mixin(new EventDispatcher(), this);
	this.renderer = renderer;
	this.keyDownHandler = this.keyDown.bind(this);
	this.keyPressHandler = this.keyPress.bind(this);
	this.keyUpHandler = this.keyUp.bind(this);
	document.addEventListener("keydown", this.keyDownHandler, false);
	document.addEventListener("keypress", this.keyPressHandler, false);
	document.addEventListener("keyup", this.keyUpHandler, false);

	this.keysDown = {};
	this.keysReleased = {};
	
	this.htmlNodesWithFocus = {};
	
	this.setupFocusListeners();
	
	this.keyCodes = {};
	for(i in Key)
		this.keyCodes[Key[i].val] = Key[i];

	this.holdThreshold = 280;
	this.timeOfLastTick = 0;
};

Keyboard.prototype.keyDown = function(e)
{
	if (!this.isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey)
	{
		this.processKey(e, e.keyCode);
	}
};

Keyboard.prototype.keyPress = function(e)
{
	if (this.isMozilla && !e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey)
	{
		this.processKey(e, (e.keyCode != 0) ? e.keyCode : (e.charCode === 32) ? 32 : 0);
	}
};

Keyboard.prototype.keyUp = function(e)
{
	this.removeKey(e.keyCode);
};

Keyboard.prototype.processKey = function(e, keyCode)
{
	if( this.anyInputElementHasFocus() )
		return;

	stopEvent(e);
	this.addKey(keyCode);
};

Keyboard.prototype.addKey = function(keyCode)
{
	if(this.keysDown[keyCode] == null)
		this.keysDown[keyCode] = new Date().getTime();
};

Keyboard.prototype.removeKey = function(keyCode)
{
	this.keysReleased[keyCode] = true;
};

Keyboard.prototype.tick = function(elapsedTime)
{
	var holdThreshold = new Date().getTime()- this.holdThreshold;
	for(i = 0; i < 256; i++)
	{
		if(this.keysReleased[i])
		{
			this.keysDown[i] = null;
			this.keysReleased[i] = false;
			
			this.dispatchEvent(EventType.KEY_UP, {key: this.keyCodes[i], elapsedTime: elapsedTime});
		}
		
		if(this.keysDown[i] != null) {
			if(this.keysDown[i] > this.timeOfLastTick)
				this.dispatchEvent(EventType.KEY_PRESSED, {key: this.keyCodes[i], elapsedTime: elapsedTime});
				
			this.dispatchEvent(EventType.KEY_DOWN, {key: this.keyCodes[i], elapsedTime: elapsedTime});

			if(this.keysDown[i] < holdThreshold)
				this.dispatchEvent(EventType.KEY_HELD, {key: this.keyCodes[i], elapsedTime: elapsedTime});
		}
	}
	
	this.timeOfLastTick = new Date().getTime();
};

Keyboard.prototype.anyInputElementHasFocus = function()
{
	for(i in this.htmlNodesWithFocus)
		if(this.htmlNodesWithFocus[i])
			return true;

	return false;
};

Keyboard.prototype.isKeyDown = function(key)
{
	return this.keysDown[key.val] != null;
};

Keyboard.prototype.setupFocusListeners = function()
{
    var keyboard = this;

	var inputs = document.getElementsByTagName('input');
	for (i in inputs) {
    	if (inputs[i].type == 'text' || inputs[i].type == 'password' || inputs[i].type == 'select') {
    		inputs[i].onfocus = function() { keyboard.htmlNodesWithFocus[this.id] = true; }
    		inputs[i].onblur = function() { keyboard.htmlNodesWithFocus[this.id] = false; }
        }
	}
};
