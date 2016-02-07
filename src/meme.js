var $ = require("jquery");
var defaultImg = require("./img/default.png");
var Konva = require("konva");

function Meme(div_id, defaultImage) {
    
    //init
    this.div_id = div_id
    this.initCanvas();
    this.initMenu();

}

Meme.prototype.defaultImage = defaultImg;

Meme.prototype.initCanvas = function() {

    var deviceWidth = window.innerWidth;
    var self = this;

    this.canvasWidth = Math.min(600, deviceWidth-20);
    this.canvasHeight = Math.min(480, deviceWidth-20);
    
    this.stage = new Konva.Stage({
      container: this.div_id,
      width: this.canvasWidth,
      height: this.canvasHeight
    });

    this.backgroundLayer = new Konva.Layer();
    this.textLayer = new Konva.Layer();

    this.backgroundLayer.on("dblclick dbltap", function(evt) {
        var mousePos = self.stage.getPointerPosition();
        self.addText("#BERN", mousePos.x, mousePos.y);
    });

    this.stage.add(this.backgroundLayer);
    this.stage.add(this.textLayer)
    
    // background image + layer
    var backgroundImage = new Image();
    //backgroundImage.crossOrigin = "Anonymous";
    backgroundImage.src = this.defaultImage;

    backgroundImage.onload = function() {

        self.backgroundImage = new Konva.Image({
            x: 0,
            y: 0,
            image: backgroundImage,
            width: this.canvasWidth,
            height: this.canvasHeight
        });

        self.backgroundLayer.add(self.backgroundImage)
        self.backgroundLayer.draw();
    }
}

Meme.prototype.initMenu = function() {

    $("#"+this.div_id).append("<div id='meme-menu'></div>");
    var menuDiv = $("#meme-menu").get(0);
    $(menuDiv).width(this.canvasWidth);

    var menuWidth = this.canvasWidth;

    $(menuDiv).append("<button id=\"new\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-plus\"></i> \
        </button>");

    $(menuDiv).append("<a><button id=\"save\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-floppy-o\"></i> \
        </button></a>");

    $(menuDiv).append("<button id=\"clear\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-close\"></i> \
        </button>");

    $(menuDiv).append("<button id=\"help\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-question\"></i> \
        </button>");

    var self = this;

    function downloadCanvas(link, filename) {
        console.log("DL");
        link.href = self.stage.toDataURL();
        link.download = filename;
    }
    
    $("#save").on('click tap', function() {
        downloadCanvas(this, "berning-meme.png");
    });

    $("#clear").on('click tap', function(){
        self.textLayer.clear();
    }); 
}

Meme.prototype.addText = function(text, x, y) {

    var newText = new Konva.Text({
      x: x,
      y: y,
      text: '#BERN',
      fontSize: 50,
      fontFamily: 'Impact',
      fill: 'white',
      stroke: 'black',
      draggable: true
    });

    newText.on('dblclick dbltap', function(evt) {
        this.setText("#BERN#BERN");
        this.draw();
    });

    this.textLayer.add(newText);
    newText.draw();
}


module.exports = Meme;