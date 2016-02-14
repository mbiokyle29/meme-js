var $ = require("jquery");
var defaultImg = require("./img/default.png");
var Konva = require("konva");

function Meme(div_id, defaultImage, templateUrl, memeUrl) {
    
    //init
    this.div_id = div_id;

    if(defaultImage === undefined) {
        this.defaultImage = defaultImg;    
    } else {
        this.defaultImage = defaultImage;
    }

    this.templateUrl = templateUrl;
    this.memeUrl = memeUrl;

    this.initCanvas();
    this.initMenu();

}

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
            width: self.canvasWidth,
            height: self.canvasHeight
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

    $(menuDiv).append(
        "<button id=\"new\"  class=\"btn\">\
            <i class=\"fa fa-4x fa-fw fa-plus\"></i> \
        </button> \
        <input type=\"file\" id=\"hidden-input\"></input>");

    $(menuDiv).append("<a><button id=\"save\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-floppy-o\"></i> \
        </button></a>");

    $(menuDiv).append("<a><button id=\"upload\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-upload\"></i> \
        </button></a>");

    $(menuDiv).append("<button id=\"clear\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-close\"></i> \
        </button>");

    $(menuDiv).append("<button id=\"help\" class=\"btn\"> \
        <i class=\"fa fa-4x fa-fw fa-question\"></i> \
        </button>");

    var self = this;

    function downloadCanvas(link, filename) {
        link.href = self.stage.toDataURL();
        link.download = filename;
    }

    function handleImage(e){

        var reader = new FileReader();
        reader.onload = function(event){
            
            var img = new Image();
            img.onload = function(){

                self.backgroundImage = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: img,
                    width: self.canvasWidth,
                    height: self.canvasHeight
                });

                self.backgroundLayer.clear();
                self.backgroundLayer.add(self.backgroundImage)
                self.backgroundLayer.draw();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);     
    }

    function sendTemplateToServer() {
        var dataUrl = self.stage.toDataURL();
        $.ajax({
          type: "POST",
          url: self.templateUrl,
          data: { 
             imgBase64: dataURL
          }
        }).done(function(o) {
          console.log('template saved'); 
        });
    }

    function sendMemeToServer() {
        var dataUrl = self.stage.toDataURL();
        $.ajax({
          type: "POST",
          url: self.memeUrl,
          data: { 
             imgBase64: dataURL
          }
        }).done(function(o) {
          console.log('meme saved'); 
        });
    }
    
    // pending CORS    
    $("#save").on('click tap', function() {
        downloadCanvas(this, "berning-meme.png");
    });

    // upload
    $("#upload").on('click tap', function() {

    });

    // HACK
    $("#new").on('click tap', function(e) {
        $("#hidden-input").click();
    });

    $("#hidden-input").on('change', function(e) {
        handleImage(e);
    });
    // END HACK

    $("#clear").on('click tap', function(){
        self.textLayer.clear();
    }); 
}

Meme.prototype.addText = function(text, x, y) {
     savedUserText = prompt('Enter your text');
    var newText = new Konva.Text({
      x: x,
      y: y,
      text: savedUserText,
      fontSize: 50,
      fontFamily: 'Impact',
      fill: 'white',
      stroke: 'black',
      draggable: true
    });

    newText.on('dblclick dbltap', function(evt) {
       console.log('double tapped');
        this.setText.text("#BERN#BERN");
        this.draw();
    });
  
    this.textLayer.add(newText);
    newText.draw();
}


module.exports = Meme;