var $ = require("jquery");
var defaultImg = require("./img/default.png");

function Meme(div_id, defaultImage) {

    //init
    this.div_id = div_id
    this.initCanvas();
    this.loadDefaultMeme();

    // variables used to get mouse position on the canvas
    this.canvas = $("#foreground");
    this.offset = this.canvas.offset();
    this.offsetX = this.offset.left;
    this.offsetY = this.offset.top;
    this.scrollX = this.canvas.scrollLeft();
    this.scrollY = this.canvas.scrollTop();

    // variables to save last mouse position
    // used to see how far the user dragged the mouse
    // and then move the text by that distance
    this.startX;
    this.startY;

    // an array to hold text objects
    this.texts = []

    // this var will hold the index of the hit-selected text
    this.selectedText = -1;
    var self = this;

    // listen for mouse events
    $("#foreground").mousedown(function (e) {
        self._handleMouseDown(e);
    });
    $("#foreground").mousemove(function (e) {
        self._handleMouseMove(e);
    });
    $("#foreground").mouseup(function (e) {
        self._handleMouseUp(e);
    });
    $("#foreground").mouseout(function (e) {
        self._handleMouseOut(e);
    });
    $("#foreground").dblclick(function(e) {
        self._handleMoustDoubleClick(e);
    });
}

Meme.prototype.defaultImage = defaultImg;

Meme.prototype.initCanvas = function() {

    // fetch the root div element
    var div = $("#"+this.div_id).get(0);
    $(div).empty();

    if(div === null) {
        console.log("Cannot fetch div element by id: "+div_id);
        return;
    }

    // set up layers
    this.background = $("<canvas id=\"background\"></canvas>").appendTo(div).get(0);
    this.foreground = $("<canvas id=\"foreground\"></canvas>").appendTo(div).get(0);

    this.backgroundCtx = this.background.getContext('2d');
    this.foregroundCtx = this.foreground.getContext('2d');

    var deviceWidth = window.innerWidth;
    
    canvasWidth = Math.min(600, deviceWidth-20);
    canvasHeight = Math.min(480, deviceWidth-20);
    
    this.background.width = canvasWidth;
    this.background.height = canvasHeight;

    this.foreground.width = canvasWidth;
    this.foreground.height = canvasHeight;

    // make the menu
    $("<div id='meme-menu'></div>").insertAfter(this.foreground);
    var menuDiv = $("#meme-menu").get(0);
    $(menuDiv).width(canvasWidth);

    var menuWidth = canvasWidth;

    $(menuDiv).append("<button class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-plus\"></i> \
        </button>");

    $(menuDiv).append("<button class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-floppy-o\"></i> \
        </button>");

    $(menuDiv).append("<button class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-close\"></i> \
        </button>");

    $(menuDiv).append("<button class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-question\"></i> \
        </button>"); 
}

Meme.prototype.loadDefaultMeme = function() {
    
    var image = new Image();
    image.src = this.defaultImage;

    var self = this;

    image.onload = function() {
        self.backgroundCtx.drawImage(image, 0, 0, image.width, image.height, 
            0, 0, self.background.width, self.background.height);
    } 
}

Meme.prototype.addText = function(text, x, y) {

    // get the text from the input element
    var text = {
        text: text,
        x: x,
        y: y
    };

    // calc the size of this text for hit-testing purposes
    this.foregroundCtx.font = "30px verdana";
    text.width = this.foregroundCtx.measureText(text.text).width;
    text.height = 30;

    // put this new text in the texts array
    this.texts.push(text);

    // redraw everything
    this._draw();

}

// clear the canvas & redraw all texts
Meme.prototype._draw = function() {
    this.foregroundCtx.clearRect(0, 0, this.foreground.width, this.foreground.height);
    for (var i = 0; i < this.texts.length; i++) {
        var text = this.texts[i];
        this.foregroundCtx.fillText(text.text, text.x, text.y);
    }
}

// test if x,y is inside the bounding box of texts[textIndex]
Meme.prototype._textHittest = function(x, y, textIndex) {
    var text = this.texts[textIndex];
    return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
}

// handle mousedown events
// iterate through texts[] and see if the user
// mousedown'ed on one of them
// If yes, set the selectedText to the index of that text
Meme.prototype._handleMouseDown = function(e) {
    
    e.preventDefault();
    
    this.startX = parseInt(e.clientX - this.offsetX);
    this.startY = parseInt(e.clientY - this.offsetY);

    // Put your mousedown stuff here
    for (var i = 0; i < this.texts.length; i++) {
        if (this._textHittest(this.startX, this.startY, i)) {
            this.selectedText = i;
        }
    }
}

// done dragging
Meme.prototype._handleMouseUp = function(e) {
    e.preventDefault();
    this.selectedText = -1;
}

// also done dragging
Meme.prototype._handleMouseOut = function(e) {
    e.preventDefault();
    this.selectedText = -1;
}

// handle mousemove events
// calc how far the mouse has been dragged since
// the last mousemove event and move the selected text
// by that distance
Meme.prototype._handleMouseMove = function(e) {

    if (this.selectedText < 0) {
        return;
    }

    e.preventDefault();
    mouseX = parseInt(e.clientX - this.offsetX);
    mouseY = parseInt(e.clientY - this.offsetY);

    // Put your mousemove stuff here
    var dx = mouseX - this.startX;
    var dy = mouseY - this.startY;
    this.startX = mouseX;
    this.startY = mouseY;

    var text = this.texts[this.selectedText];
    text.x += dx;
    text.y += dy;
    this._draw();
}

Meme.prototype._handleMoustDoubleClick = function(e) {
    mouseX = parseInt(e.clientX - this.offsetX);
    mouseY = parseInt(e.clientY - this.offsetY);

    // Put your mousedown stuff here
    for (var i = 0; i < this.texts.length; i++) {
        if (this._textHittest(mouseX, mouseY, i)) {
            this.selectedText = i;
        }
    }

    if(this.selectedText < 0) {
        this.addText("#BERN", mouseX, mouseY);
        return;
    }

    e.preventDefault();

    // do text editing here
}

module.exports = Meme;