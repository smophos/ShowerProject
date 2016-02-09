// within the code below I assume I am drawing into a 1860x990 box
// then I can scale the group to whatever size the final canvas is
// in this case 4140 x 2200 for the wall
// you should pick an appropriate local size and canvas size that are easy for you to work with



// ShowerControls
var HUDControls;
var StartButton;
var showerHead;
var bathSpout;
var waterControl;
var showerControl, bathControl;
var showerButton, bathButton;
var canvas;
var localHeight = 990;
var localWidth = 1860;
var temperatureGauge, temperatureText;
var waterTemp = 99, temperatureMode = "fahrenheit";
var childSafety, childSafetyWall;
var startButtonWall, showerHeadWall, HUDControlsWall, bathControlWall, showerButtonWall, bathButtonWall, temperatureGaugeWall,
    temperatureTextWall;

//var PositionVector = [];



//Working mode flags
var waterIsOn = false;
var bathMode = true, showerMode = false;
var tempCurrent = 0, bathLevel = 0;

function init() {
    "use strict";

    canvas = new fabric.Canvas('c');
    canvas.hoverCursor = 'pointer';
    //setupCanvas();
    createWalls();
    //setupWaterControls();
    //zoomAll(canvas.height / localHeight);
    setupWallControls();

}

function zoomIndividually(objects,SCALE_FACTOR) {

    var scaleX = objects.scaleX;
    var scaleY = objects.scaleY;
    var left = objects.left;
    var top = objects.top;

    var tempScaleX = scaleX * SCALE_FACTOR;
    var tempScaleY = scaleY * SCALE_FACTOR;
    var tempLeft = left * SCALE_FACTOR;
    var tempTop = top * SCALE_FACTOR;

    objects.scaleX = tempScaleX;
    objects.scaleY = tempScaleY;
    objects.left = tempLeft;
    objects.top = tempTop;

    objects.setCoords();
}
function zoomAll(SCALE_FACTOR) {

    var objects = canvas.getObjects();
    console.log(objects);
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * SCALE_FACTOR;
        var tempScaleY = scaleY * SCALE_FACTOR;
        var tempLeft = left * SCALE_FACTOR;
        var tempTop = top * SCALE_FACTOR;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }


    canvas.renderAll();
}


function updateWaterTemp() {
    if (temperatureMode === "fahrenheit" && waterTemp > 100) {
        childSafety.setFill('red');
    }
    else if(temperatureMode === "celsius" && waterTemp > 37) {
        childSafety.setFill('red');
    }else{
        childSafety.setFill('aqua');
    }

}
function updateWaterTempWall() {
    if (temperatureMode === "fahrenheit" && waterTemp > 100) {
        childSafetyWall.setFill('red');
    }
    else if(temperatureMode === "celsius" && waterTemp > 37) {
        childSafetyWall.setFill('red');
    }else{
        childSafetyWall.setFill('aqua');
    }

}

function setupWallControls(){

    fabric.loadSVGFromURL("icons/ink14.svg", function(objects, options) {

        startButtonWall = fabric.util.groupSVGElements(objects, options);

        startButtonWall.set({
            left: 730,
            top: 780,
            originX: 'center',
            originY: 'center',
        }).scale(0.15);

        startButtonWall.hasControls = startButtonWall.hasBorders = false;
        startButtonWall.lockMovementX = startButtonWall.lockMovementY = true;

        startButtonWall.setFill('grey');

        startButtonWall.on('selected', function () {

            if(waterIsOn === false) {

                startButtonWall.setFill('aqua');
                waterIsOn = true;
                console.log('Water is on!');

                if(bathMode === true){
                    bathSpoutWall.setFill('aqua');

                }else if(showerMode === true){
                    showerHeadWall.setFill('aqua');

                }

            }else if(waterIsOn === true){

                startButtonWall.setFill('grey');
                bathSpoutWall.setFill('grey');
                showerHeadWall.setFill('grey');

                waterIsOn = false;

                console.log('Water is not on!');


            }
            canvas.deactivateAll(); // deselect everything
            canvas.renderAll();
        });

        canvas.add(startButtonWall);
    });

    fabric.loadSVGFromURL("icons/showers2.svg", function(objects, options) {

        var img = fabric.util.groupSVGElements(objects, options);
        img.set({
            left:820,
            top: 740,
            originX: 'center',
            originY: 'center',
            visible: true,
            fill: 'grey'
        }).scale(0.25);

        fabric.loadSVGFromURL("icons/bath1.svg", function(objects, options) {
            var img2 = fabric.util.groupSVGElements(objects, options);
            img2.set({
                left: 820,
                top: 740,
                originX: 'center',
                originY: 'center',
                visible: false,
                fill: 'grey'
            });

            showerButtonWall = new fabric.Circle({
                left: 820,
                top: 740,
                originX: 'center',
                originY: 'center',
                fill: 'white',
                stroke: 'grey',
                strokeWidth: 3,
                radius: 35

            });

            if(showerMode === true)
                showerButtonWall.setFill('aqua');

            //zoomIndividually(showerButtonWall, (canvas.height / localHeight) );
            //zoomIndividually(img, (canvas.height / localHeight) );
            //zoomIndividually(img2, (canvas.height / localHeight) );

            showerControlWall = new fabric.Group([showerButtonWall,img,img2],{
                //lockMovementX: true,
                //lockMovementY: true,
                hasControls: false,
                hasBorders: false}).on('selected', function () {

                console.log("shower mode on!");

                if(showerMode === false) {

                    showerButtonWall.setFill('aqua');
                    bathButtonWall.setFill('white');

                    showerMode = true;
                    bathMode = false;

                    if (waterIsOn === true) {
                        bathSpoutWall.setFill('grey');
                        showerHeadWall.setFill('aqua');
                    }

                }
                else if(showerMode === true){

                    console.log("Trying to load images");

                    if(img.visible === true){
                        img2.visible = true;
                        img.visible = false;
                    }else if(img2.visible === true){
                        img2.visible = false;
                        img.visible = true;
                    }

                    /*bathButtonWall.setFill('aqua');
                     showerButtonWall.setFill('white');
                     showerMode = false;
                     bathMode = true;

                     if(waterIsOn === true) {
                     bathSpoutWall.setFill('grey');
                     showerHeadWall.setFill('aqua');
                     }*/
                }
                canvas.deactivateAll().renderAll();
            });

            canvas.add(showerControlWall);


        });

    });

    fabric.loadSVGFromURL("icons/bathtub.svg", function(objects, options) {

        var img = fabric.util.groupSVGElements(objects, options);
        img.set({
            left: 900,
            top: 740,
            originX: 'center',
            originY: 'center'
        }).scale(1);

        /*startButton.hasControls = startButton.hasBorders = false;
         startButton.lockMovementX = startButton.lockMovementY = true;*/

        img.setFill('grey');

        bathButtonWall = new fabric.Circle({
            left: 900,
            top: 740,
            originX: 'center',
            originY: 'center',
            fill: 'white',
            stroke: 'grey',
            strokeWidth: 3,
            radius: 35
        })
        if(bathMode === true)
            bathButtonWall.setFill('aqua');

        bathControlWall = new fabric.Group([bathButtonWall,img],{//lockMovementX: true,
            //lockMovementY: true,
            hasControls: false,
            hasBorders: false})
            .on('selected', function () {

                if(bathMode === false) {
                    bathButtonWall.setFill('aqua');
                    showerButtonWall.setFill('white');

                    bathMode = true;
                    showerMode = false;

                    if(waterIsOn === true) {
                        bathSpoutWall.setFill('aqua');
                        showerHeadWall.setFill('grey');
                    }
                }
                /*else if(bathMode === true){
                 bathButtonWall.setFill('white');
                 showerButtonWall.setFill('aqua');

                 bathMode = false;
                 showerMode = true;

                 if(waterIsOn === true) {
                 bathSpoutWall.setFill('grey');
                 showerHeadWall.setFill('aqua');
                 }
                 }*/

                canvas.deactivateAll(); // deselect everything
                canvas.renderAll();

            });

        //bathSpoutWall.setFill('#668cff');
        canvas.add(bathControlWall);
        //zoomIndividually(bathControlWall, (canvas.height / localHeight) );
        //canvas.calcOffset();
        canvas.renderAll();
    });

    HUDControlsWall = new fabric.Rect({

        left: 900,
        top: 780,
        originX: 'center',
        originY: 'center',
        fill: 'transparent',
        stroke: 'grey',
        strokeWidth: 5,
        rx: 3,
        ry: 3,
        width: 500,
        height: 200,
        angle: 0

    });

    HUDControlsWall.hasControls = HUDControlsWall.hasBorders = false;
    HUDControlsWall.lockMovementX = HUDControlsWall.lockMovementY = false;
    HUDControlsWall.selectable = false;
    HUDControlsWall.evented = false;


    LangTextWall = new fabric.Text('default', {
        left: 1100,top: 716, fontFamily: 'helvetica', fontSize: 20, originX: 'center',
        originY: 'center', fill: 'grey'
    });

    LangTextWall.text = "ENG";

    LangTextWall.on('selected',function(){
        if(LangTextWall.text === "ENG")
            LangTextWall.text = "SCH";
        else if(LangTextWall.text === "SCH")
            LangTextWall.text = "ENG";

        canvas.deactivateAll().renderAll();
    });

    fabric.loadSVGFromURL("icons/kid14.svg", function(objects, options) {
        childSafetyWall = fabric.util.groupSVGElements(objects, options);
        childSafetyWall.set({
            left: 1125,
            top: 740,
            originX: 'center',
            originY: 'center',
            fill: 'grey'
        }).scale(.07);

        childSafetyWall.hasControls = childSafetyWall.hasBorders = false;
         childSafetyWall.lockMovementX = childSafetyWall.lockMovementY = true;

        canvas.add(childSafetyWall);
        //zoomIndividually(childSafetyWall, (canvas.height / localHeight));

    });

    temperatureTextWall = new fabric.Text(waterTemp + 'F', {
        left: 1085,top: 740, fontFamily: 'helvetica', fontSize: 20, originX: 'center',
        originY: 'center', fill: 'grey'
    });

    temperatureTextWall.on('selected', function(){

        if(temperatureMode === "celsius"){
            waterTemp = waterTemp * 1.8 + 32;
            waterTemp = Math.round(waterTemp);
            temperatureTextWall.text = waterTemp + "F";
            temperatureMode = "fahrenheit";
        }
        else if(temperatureMode === "fahrenheit"){
            waterTemp = ( waterTemp - 32 ) * 0.55;
            waterTemp = Math.round(waterTemp);
            temperatureTextWall.text = waterTemp + "C";
            temperatureMode = "celsius";
        }
        canvas.deactivateAll().renderAll();

    });


    temperatureGaugeWall = new fabric.Rect({
        left: 800,
        top: 800,
        fill: 'white',
        width: 200,
        height: 50,
        id: 'controls',
        stroke: 'grey',
        strokeWidth: 2
    }).setGradient('fill',{
        x1: 50,
        y1: 0,
        x2: 150,
        y2: 0,
        colorStops: {
            0: "red",
            1: "aqua"
        }
    });


    temperatureGaugeWall.hasControls = temperatureGaugeWall.hasBorders = false;
     temperatureGaugeWall.lockMovementX = temperatureGaugeWall.lockMovementY = true;

    canvas.on('mouse:down' , function(e) {
        // if mouse down is the temperature controls
        if (e.target && e.target.id == 'controls'){
            // get the position of the mouse
            // subtract the bounds
            var pointer = canvas.getPointer(event.e);
            var posX = pointer.x;
            var clipX = posX- e.target.left;
            var posY = pointer.y;
            var clipY = posY - e.target.top;

            var startX = clipX, stopX = e.target.width;

            if(clipX < e.target.width / 2)
            {
                stopX = (e.target.width/2) + clipX;
            }

            console.log("The value recorded is " + clipX);

            e.target.setGradient('fill', {
                x1: startX,
                y1: 0,
                x2: stopX,
                y2: 0,
                colorStops: {
                    0: "aqua",
                    1: "red"
                }
            });

            //waterTemp = startX
            //scaling water temperature

            var tempVal = (clipX/200 * 100) + 50;
            if(temperatureMode === "fahrenheit"){

                tempVal = Math.round(tempVal);
                waterTemp = tempVal;
                temperatureTextWall.text = waterTemp +"F";
            }else if(temperatureMode === "celsius"){
                tempVal = ( tempVal - 32 ) * 0.55;
                tempVal = Math.round(tempVal);
                waterTemp = tempVal;
                temperatureTextWall.text = waterTemp + "C";
            }

            updateWaterTempWall();

            canvas.renderAll();

        }
    });

    canvas.add(LangTextWall);
    canvas.add(temperatureTextWall);
    canvas.add(HUDControlsWall);
    canvas.add(temperatureGaugeWall);

    canvas.renderAll();
}

function setupWaterControls(){

    fabric.loadSVGFromURL("icons/ink14.svg", function(objects, options) {

        startButton = fabric.util.groupSVGElements(objects, options);

        startButton.set({
            left: 1590,
            top: 500,
            originX: 'center',
            originY: 'center'
        }).scale(0.15);

        //PositionVector.push({left:1590, top:500, object: startButton});

        startButton.hasControls = startButton.hasBorders = false;
        startButton.lockMovementX = startButton.lockMovementY = true;

        startButton.setFill('grey');

        startButton.on('selected', function () {

            if(waterIsOn === false) {

                startButton.setFill('aqua');
                waterIsOn = true;
                console.log('Water is on!');

                if(bathMode === true){
                    bathSpout.setFill('aqua');

                }else if(showerMode === true){
                    showerHead.setFill('aqua');

                }

            }else if(waterIsOn === true){

                startButton.setFill('grey');
                bathSpout.setFill('grey');
                showerHead.setFill('grey');

                waterIsOn = false;

                console.log('Water is not on!');

                /*if(bathMode === true){
                    bathMode = false;
                }else if(showerMode === true){
                    showerMode = false;
                }*/

            }
            canvas.deactivateAll(); // deselect everything
            canvas.renderAll();
        });

        //canvas.calcOffset();
        //bathSpout.setFill('#668cff');

        canvas.add(startButton);
        canvas.renderAll();
        //zoomIndividually(startButton, (canvas.height / localHeight) );

    });

    fabric.loadSVGFromURL("icons/showers2.svg", function(objects, options) {

        var img = fabric.util.groupSVGElements(objects, options);
        img.set({
            left: 1730,
            top: 360,
            originX: 'center',
            originY: 'center',
            visible: true,
            fill: 'grey'
        }).scale(0.25);

            fabric.loadSVGFromURL("icons/bath1.svg", function(objects, options) {
                var img2 = fabric.util.groupSVGElements(objects, options);
                img2.set({
                    left: 1725,
                    top: 370,
                    originX: 'center',
                    originY: 'center',
                    visible: false,
                    fill: 'grey'
                });

                showerButton = new fabric.Circle({
                    left: 1725,
                    top: 360,
                    originX: 'center',
                    originY: 'center',
                    fill: 'white',
                    stroke: 'grey',
                    strokeWidth: 3,
                    radius: 35

                });

                if(showerMode === true)
                    showerButton.setFill('aqua');

                //zoomIndividually(showerButton, (canvas.height / localHeight) );
                //zoomIndividually(img, (canvas.height / localHeight) );
                //zoomIndividually(img2, (canvas.height / localHeight) );

                showerControl = new fabric.Group([showerButton,img,img2],{
                    lockMovementX: true,
                    lockMovementY: true,
                    hasControls: false,
                    hasBorders: false}).on('selected', function () {

                    console.log("shower mode on!");

                    if(showerMode === false) {

                        showerButton.setFill('aqua');
                        bathButton.setFill('white');

                        showerMode = true;
                        bathMode = false;

                        if (waterIsOn === true) {
                            bathSpout.setFill('grey');
                            showerHead.setFill('aqua');
                        }

                    }
                    else if(showerMode === true){

                        console.log("Trying to load images");

                        if(img.visible === true){
                            img2.visible = true;
                            img.visible = false;
                        }else if(img2.visible === true){
                            img2.visible = false;
                            img.visible = true;
                        }

                        /*bathButton.setFill('aqua');
                         showerButton.setFill('white');
                         showerMode = false;
                         bathMode = true;

                         if(waterIsOn === true) {
                         bathSpout.setFill('grey');
                         showerHead.setFill('aqua');
                         }*/
                    }
                    canvas.deactivateAll().renderAll();
                });

                canvas.add(showerControl);


            });

    });

    fabric.loadSVGFromURL("icons/bathtub.svg", function(objects, options) {

        var img = fabric.util.groupSVGElements(objects, options);
        img.set({
            left: 1725,
            top: 435,
            originX: 'center',
            originY: 'center'
        }).scale(1);

        startButton.hasControls = startButton.hasBorders = false;
        startButton.lockMovementX = startButton.lockMovementY = true;

        img.setFill('grey');

        bathButton = new fabric.Circle({
            left: 1725,
            top: 435,
            originX: 'center',
            originY: 'center',
            fill: 'white',
            stroke: 'grey',
            strokeWidth: 3,
            radius: 35
        });
        if(bathMode === true)
            bathButton.setFill('aqua');

        bathControl = new fabric.Group([bathButton,img],{//lockMovementX: true,
            //lockMovementY: true,
            hasControls: false,
            hasBorders: false})
            .on('selected', function () {

                if(bathMode === false) {
                    bathButton.setFill('aqua');
                    showerButton.setFill('white');

                    bathMode = true;
                    showerMode = false;

                    if(waterIsOn === true) {
                        bathSpout.setFill('aqua');
                        showerHead.setFill('grey');
                    }
                }
                /*else if(bathMode === true){
                    bathButton.setFill('white');
                    showerButton.setFill('aqua');

                    bathMode = false;
                    showerMode = true;

                    if(waterIsOn === true) {
                        bathSpout.setFill('grey');
                        showerHead.setFill('aqua');
                    }
                }*/

                canvas.deactivateAll(); // deselect everything
                canvas.renderAll();

            });

        //bathSpout.setFill('#668cff');
        canvas.add(bathControl);
        //zoomIndividually(bathControl, (canvas.height / localHeight) );
        //canvas.calcOffset();
        canvas.renderAll();
    });

    HUDControls = new fabric.Rect({

        left: 1645,
        top: 490,
        originX: 'center',
        originY: 'center',
        fill: 'transparent',
        stroke: 'grey',
        strokeWidth: 5,
        rx: 3,
        ry: 3,
        width: 250,
        height: 350,
        angle: 0

    });

    HUDControls.hasControls = HUDControls.hasBorders = false;
    HUDControls.lockMovementX = HUDControls.lockMovementY = false;
    HUDControls.selectable = false;
    HUDControls.evented = false;


    LangText = new fabric.Text('default', {
        left: 1555,top: 340, fontFamily: 'helvetica', fontSize: 20, originX: 'center',
        originY: 'center', fill: 'grey'
    });

    LangText.text = "ENG";

    LangText.on('selected',function(){
        if(LangText.text === "ENG")
        LangText.text = "SCH";
        else if(LangText.text === "SCH")
        LangText.text = "ENG";

        canvas.deactivateAll().renderAll();
    });

    fabric.loadSVGFromURL("icons/kid14.svg", function(objects, options) {
        childSafety = fabric.util.groupSVGElements(objects, options);
        childSafety.set({
            left: 1595,
            top: 363,
            originX: 'center',
            originY: 'center',
            fill: 'grey'
        }).scale(.07);

        childSafety.hasControls = childSafety.hasBorders = false;
        childSafety.lockMovementX = childSafety.lockMovementY = true;

        canvas.add(childSafety);
        //zoomIndividually(childSafety, (canvas.height / localHeight));

    });

    temperatureText = new fabric.Text(waterTemp + 'F', {
        left: 1555,top: 365, fontFamily: 'helvetica', fontSize: 20, originX: 'center',
    originY: 'center', fill: 'grey'
    });

    temperatureText.on('selected', function(){

        if(temperatureMode === "celsius"){
            waterTemp = waterTemp * 1.8 + 32;
            waterTemp = Math.round(waterTemp);
            temperatureText.text = waterTemp + "F";
            temperatureMode = "fahrenheit";
        }
        else if(temperatureMode === "fahrenheit"){
            waterTemp = ( waterTemp - 32 ) * 0.55;
            waterTemp = Math.round(waterTemp);
            temperatureText.text = waterTemp + "C";
            temperatureMode = "celsius";
        }
        canvas.deactivateAll().renderAll();

    });


    temperatureGauge = new fabric.Rect({
        left: 1545,
        top: 585,
        fill: 'white',
        width: 200,
        height: 50,
        id: 'controls',
        stroke: 'grey',
        strokeWidth: 2
    }).setGradient('fill',{
        x1: 50,
        y1: 0,
        x2: 150,
        y2: 0,
        colorStops: {
            0: "red",
            1: "aqua"
        }
    });


    /*temperatureGauge.hasControls = temperatureGauge.hasBorders = false;
    temperatureGauge.lockMovementX = temperatureGauge.lockMovementY = true;*/

    canvas.on('mouse:down' , function(e) {
        // if mouse down is the temperature controls
        if (e.target && e.target.id == 'controls'){
            // get the position of the mouse
            // subtract the bounds
            var pointer = canvas.getPointer(event.e);
            var posX = pointer.x;
            var clipX = posX- e.target.left;
            var posY = pointer.y;
            var clipY = posY - e.target.top;

            var startX = clipX, stopX = e.target.width;

            if(clipX < e.target.width / 2)
            {
                stopX = (e.target.width/2) + clipX;
            }

            console.log("The value recorded is " + clipX);

            e.target.setGradient('fill', {
                x1: startX,
                y1: 0,
                x2: stopX,
                y2: 0,
                colorStops: {
                    0: "aqua",
                    1: "red"
                }
            });

            //waterTemp = startX
            //scaling water temperature

            var tempVal = (clipX/200 * 100) + 50;
            if(temperatureMode === "fahrenheit"){

                tempVal = Math.round(tempVal);
                waterTemp = tempVal;
                temperatureText.text = waterTemp +"F";
            }else if(temperatureMode === "celsius"){
                tempVal = ( tempVal - 32 ) * 0.55;
                tempVal = Math.round(tempVal);
                waterTemp = tempVal;
                temperatureText.text = waterTemp + "C";
            }

            updateWaterTemp();

            canvas.renderAll();

        }
    });

    canvas.add(LangText);
    canvas.add(temperatureText);
    canvas.add(HUDControls);
    canvas.add(temperatureGauge);

    canvas.renderAll();
}

function loadPatternwithFilter(url,rect) {

    fabric.Image.fromURL(url, function (img) {

        var oImg = img.set({
            left: 0,
            top: 0,
            fill: 'transparent',
            stroke: 'black',
            width: 450,
            height: localHeight,
            angle: 0,
            id: 'backWall'

        });

        canvas.add(oImg).renderAll();
        canvas.setActiveObject(oImg);

        var obj = canvas.getActiveObject();

        var filters = fabric.Image.filters;

        var filter = new filters.GradientTransparency({
            threshold: 10
        });

        obj.filters.push(filter);
        obj.applyFilters(canvas.renderAll.bind(canvas));




        //rect.fill = new fabric.Pattern({
        //    source: img
        //    //repeat: document.getElementById('repeat').value
        //});
        //



       //// canvas.setActiveObject(img);
       //
       // rect.filters.push(new fabric.Image.filters.GradientTransparency({
       //     threshold: 10
       // }));
       //
       // rect.applyFilters((function(){
       //      canvas.add(rect);
       //      canvas.renderAll();
       // }));





    });
}

function setupCanvas(){

    fabric.Image.fromURL("./img/background3.jpg", (function(image){

        image.filters.push(new fabric.Image.filters.GradientTransparency({
            threshold: 10
        }));


        image.applyFilters((function(){
            canvas.setOverlayImage(image, canvas.renderAll.bind(canvas), {
                originX: 'left',
                originY: 'top',
                width: canvas.width,
                height: canvas.height

            });
        }));

    }));

    /*canvas.setBackgroundColor({
        source: 'http://fabricjs.com/assets/escheresque_ste.png',
        repeat: 'repeat',
        offsetX: 200,
        offsetY: 100
    }, canvas.renderAll.bind(canvas));*/
}

function createWalls(){

    var backWall = new fabric.Rect({
        left: 0,
        top: 0,
        fill: 'white',
        stroke: 'black',
        width: 450,
        height: localHeight,
        angle: 0,
        id: 'backWall'

    });

     backWall.hasControls = backWall.hasBorders = false;
     backWall.lockMovementX = backWall.lockMovementY = true;
    canvas.add(backWall);

    var sideWall = new fabric.Rect({
        left: 450,
        top: 0,
        fill: 'white',
        stroke: 'black',
        width: 960,
        height: localHeight,
        angle: 0
    });

    sideWall.hasControls = sideWall.hasBorders = false;
    sideWall.lockMovementX = sideWall.lockMovementY = true;


    var frontWall = new fabric.Rect({
        left: 1410,
        top: 0,
        fill: 'white',
        stroke: 'black',
        width: 450,
        height: localHeight,
        angle: 0
    });

    frontWall.hasControls = frontWall.hasBorders = false;
    frontWall.lockMovementX = frontWall.lockMovementY = true;



    /*bathSpout = new fabric.Rect({
        left: 1635,
        top: 950,
        originX: 'center',
        originY: 'center',
        fill: 'grey',
        stroke: 'black',
        width: 60,
        height: 30,
        angle: 0
    });*/


    canvas.add(backWall);
    canvas.add(sideWall);
    canvas.add(frontWall);

    //Loading the SVG elements

    fabric.loadSVGFromURL("icons/faucet.svg", function(objects, options) {
        bathSpout = fabric.util.groupSVGElements(objects, options);
        bathSpout.set({
            left: 1635,
            top: 930,
            originX: 'center',
            originY: 'center'

        }).scale(0.2);

        bathSpout.hasControls = bathSpout.hasBorders = false;
        bathSpout.lockMovementX = bathSpout.lockMovementY = true;

       /* if(bathMode === true && waterIsOn == true)
            bathSpout.setFill('aqua');
        else*/

        bathSpout.setFill('grey');

        //bathSpout.setFill('#668cff');
        canvas.add(bathSpout);
        //canvas.calcOffset();
        //zoomIndividually(bathSpout, (canvas.height / localHeight) );
        canvas.renderAll();
    });




    fabric.loadSVGFromURL("icons/showers2.svg", function(objects, options) {

        showerHead = fabric.util.groupSVGElements(objects, options);
        showerHead.set({
            left: 1635,
            top: 100,
            originX: 'center',
            originY: 'center'
        }).scale(0.5);

        /*if(showerMode === true && waterIsOn == true)
            showerHead.setFill('aqua');
        else*/

        showerHead.setFill('grey');
        //showerHead.setFill('#668cff');
        showerHead.hasControls = showerHead.hasBorders = false;
        showerHead.lockMovementX = showerHead.lockMovementY = true;
        canvas.add(showerHead);

        //canvas.calcOffset();
        //zoomIndividually(showerHead, (canvas.height / localHeight) );
        canvas.renderAll();

    });


}


//canvas.backgroundColor = "#5555F5"; // background blue to help find it

//fabric.Object.prototype.transparentCorners = false;



/* canvas.setBackgroundImage('background.jpg', function() {
 canvas.renderAll();
 _canvasBrowser_update();
 });*/
/* canvas.on('mouse:over', function(e) {
 console.log(e.target);
 canvas.renderAll();
 });

 canvas.on('mouse:out', function(e) {
 console.log(e.target);
 canvas.renderAll();
 });*/



//loadPattern('background.jpg', sideWall);