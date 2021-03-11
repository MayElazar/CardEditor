$(document).ready(function () {


    let ctx,// משתנה ליצירת התוכן - כיתוב ומונה בקנבס
        canvas, // הקנבס
        userTextTop,// הכיתוב שממשתמש מכניס
        userTextBottom, // הכיתוב שממשתמש מכניס
        cardContainer = document.querySelector('#cardCanvas'),// דיב שמכיל את התמונה 
        imageNum = 0,
        parentPos,//משתנים לבדיקת המיקום של הכיתוב
        TXTnum = 0,
        relativePos,
        parentPosB,

        currentItem,
        childPosB,
        relativePosB,
        imgSrcCopy,//משתנה להעתק של מקור הקובץ
        family,// משתנה לשמירת הפונט הנבחר
        imageSticker = document.querySelector('#stickers');

    let resizing = false;
    var handleNum = 0;

    $("#deleteImage").hide();
    $("#deleteTXT").hide();
    $("#deleteSticker").hide();

    /*--------------------------------------------------------------------*/
    /*--------------------------------------------------------------------*/

    //----------------העלאת תמונה --------------------//



    document.getElementById('file').onchange = function (e) {


        var ext = this.value.match(/\.([^\.]+)$/)[1];
        switch (ext) {
            case 'JPG':
            case 'jpg':
            case 'jpeg':
            case 'JPEG':
            case 'BMP':
            case 'bmp':
            case 'PNG':
            case 'png':
            case 'tif':
            case 'TIF':
            case 'GIF':
            case 'gif':

                if (this.files && this.files[0]) {

                    var reader = new FileReader();

                    reader.onload = function (e) {

                        //$("#downloadBTN").removeClass("hidden");
                        //$("#btnDeleteTXT").removeClass("hidden");
                        //$("#lowerTXT").removeClass("hidden");
                        //$("#upperTXT").removeClass("hidden");
                        //$("#fontProporties").removeClass("hidden");


                        var image = document.createElement('img');
                        image.id = "userImage" + imageNum;
                        image.classList = "userImageClass " + imageNum;
                        image.src = e.target.result;

                        imgSrcCopy = image.src;

                        image.onload = function () {

                            var resizeDiv = document.createElement('div');
                            resizeDiv.classList = "resizerHandels " + handleNum;
                            resizeDiv.id = "resizerHandelsDiv" + handleNum;

                            cardContainer.appendChild(resizeDiv);
                            resizeDiv.appendChild(image);

                            var resizerNe = document.createElement('span');
                            resizerNe.classList = "resizer ne " + handleNum;
                            var resizerNw = document.createElement('span');
                            resizerNw.classList = "resizer nw " + handleNum;
                            var resizerSw = document.createElement('span');
                            resizerSw.classList = "resizer sw " + handleNum;
                            var resizerSe = document.createElement('span');
                            resizerSe.classList = "resizer se " + handleNum;

                            resizeDiv.appendChild(resizerNe);
                            resizeDiv.appendChild(resizerNw);
                            resizeDiv.appendChild(resizerSw);
                            resizeDiv.appendChild(resizerSe);


                            console.log(document.getElementById("userImage" + imageNum).clientHeight)
                            console.log(document.getElementById("userImage" + imageNum).clientWidth)

                            if (document.getElementById("userImage" + imageNum).clientHeight < document.getElementById("userImage" + imageNum).clientWidth) {
                                $("#userImage" + imageNum).css("width", "10vw");
                                $("#userImage" + imageNum).css("height", "auto");
                                //$("#image-container").css("width", "10vw");
                                console.log("רוחב")

                            } else {
                                $("#userImage" + imageNum).css("width", "auto");
                                $("#userImage" + imageNum).css("height", "10vw");
                                //$("#image-container").css("height", "10vw");
                                console.log("אורך")
                            }

                            //$("#userImage" + imageNum).css("position", "absolute");
                            $(".resizerHandels").css("position", "absolute");

                            $(".resizerHandels " + handleNum).height = $("#userImage" + imageNum).height;

                            dragElement(document.getElementById("resizerHandelsDiv" + handleNum)); //image drag Func

                            //Resize();


                            const resizers = document.querySelectorAll(".resizer");
                            for (let resizer of resizers) {
                                console.log("ONE");
                                resizer.addEventListener("click", Resize);
                            }
                            document.getElementById("container").addEventListener("click", removeResizer);

                            //document.getElementById("cardCanvas").addEventListener("click", removeResizer);

                            imageNum++;
                            handleNum++;
                        };

                        //  return false;
                    }
                    reader.readAsDataURL(this.files[0]);
                }
                // לאחר הבחירה בקובת טוב יש לוודא שהכפתורים לא לחיצים

                break;
            default:
                this.value = '';

        }
    };

    var currentTXTitem;
    $("#addTxtBtn").click(function () {
        var textAreaDiv = document.createElement('div');
        textAreaDiv.classList = "textAreaDiv " + TXTnum;
        textAreaDiv.id = "textAreaDivID" + TXTnum;
        var textArea = document.createElement('textarea');
        textArea.classList = "textAreaClass " + TXTnum;
        textArea.id = "textArea" + TXTnum;
        cardContainer.appendChild(textAreaDiv);
        textAreaDiv.appendChild(textArea);

        currentTXTitem = textArea.id;
        console.log(currentTXTitem);
        // dragElement(textAreaDiv);
        //var doneWriting = document.createElement('span');
        //document.getElementById("textArea").addEventListener("mousemove", dragElement(textAreaDiv));
        textAreaDiv.addEventListener("mousedown", Drag);
        document.getElementById("textArea" + TXTnum).addEventListener("dblclick", removeDrag);

        var resizerNe = document.createElement('span');
        resizerNe.classList = "TXTresizer ne ";
        var resizerNw = document.createElement('span');
        resizerNw.classList = "TXTresizer nw ";
        var resizerSw = document.createElement('span');
        resizerSw.classList = "TXTresizer sw ";
        var resizerSe = document.createElement('span');
        resizerSe.classList = "TXTresizer se ";

        textAreaDiv.appendChild(resizerNe);
        textAreaDiv.appendChild(resizerNw);
        textAreaDiv.appendChild(resizerSw);
        textAreaDiv.appendChild(resizerSe);

        const resizers = document.querySelectorAll(".TXTresizer");
        for (let resizer of resizers) {
            console.log("ONE");
            resizer.addEventListener("click", TXTresizer);
        }

        //  removeResizer()
        document.getElementById("container").addEventListener("click", removeResizer);
        setTimeout(function () {
            if ($(".textAreaDiv " + (TXTnum - 1))) {
                console.log('Element exists');
                // console.log(document.getElementsByClassName("textAreaDiv 0"));
                var TXTdiv = document.getElementsByClassName("textAreaDiv " + (TXTnum - 1))
                var TXTdivJQ = $(TXTdiv).find(".TXTresizer").show();
                console.log(TXTdivJQ)
                $("#textArea" + (TXTnum - 1)).css("border", "solid black");
                // $("textArea" + (TXTnum - 1)).css("border-color", "black");
                //(TXTdivJQ).find(".TXTresizer").show();
            }

        }, 10);
        //$(("textAreaClass" + TXTnum).parentElement).find(".TXTresizer").show();
        //$((".textAreaClass" + 0).parentElement).find(".TXTresizer").show();

        TXTnum++

    });
    var currentNum;
    function Drag(e) {
        var currentT = e.target;
        currentTXTitem = e.target.id;
        // console.log(currentTXTitem);
        // currentT = $((e.target).id);
        console.log(((e.target).parentElement));
        console.log(document.getElementById((e.target).id).parentElement.classList.value)
        if (document.getElementById((e.target).id).parentElement.classList.contains("textAreaDiv")) {
            currentNum = (document.getElementById((e.target).id).parentElement.classList.value).slice(12, 13);
            //console.log(currentNum);

            // $('#textAreaDivID').draggable({ cancel: 'text' });
            var TXTA = document.getElementById("textAreaDivID" + currentNum);
            //console.log("textAreaDivID" + currentNum)
            dragElement(TXTA);
            //  $("#textArea" + currentNum).blur();
            $("#textArea" + currentNum).focus();

            //console.log("drag");
            // else {
            //    break;
            //}
        }
    }

    function removeDrag() {
        //console.log("REMOVEdrag")
        //var TXTA = document.getElementById("textAreaDivID");

        //document.getElementById("textArea").removeEventListener("mousedown", dragElement(TXTA));
        //document.getElementById("textArea").disabled = false;
        // console.log("TWO")
        // $("#textArea" + currentNum).select();
    }

    function borderText() {
        $(".textAreaClass").mousemove(function () {
            console.log("HOVER")
            $(".textAreaClass").css("border", "solid black");
        });
        $(".textAreaClass").mouseout(function () {
            console.log("OUT")
            $(".textAreaClass").css("border", "none");
        });
    }

    /*-------start--------------Delete Selcected Item--------------start------------------------*/

    $(".deleteImageClass").click(function () {
        console.log("deleteImage");
        // console.log(currentItem);
        currentItem.remove();

    });


    $("#deleteTXT").click(function () {
        console.log("deleteImage");
        // console.log(currentItem);
        currentItem.remove();

    });
    /*-------END-----------------Delete Selcected Item----------------------END-------------*/

    //--------------start----------remove resize handels from images-------------start------------------//
    function removeResizer(e) {
        console.log("YAY")
        $(".resizer").hide();
        $(".TXTresizer").hide();
        $("#deleteImage").hide();
        $("#deleteSticker").hide();
        $("#deleteTXT").hide();
        $(".textAreaClass").css("border", "none");

        borderText();
        console.log((e.target).classList);
        var container; //= $(".userImageClass ");
        //var container;
        if ($(e.target).hasClass("textAreaClass")) {

            for (var i = 0; i < TXTnum; i++) {
                console.log("FOR");
                if (i == ((e.target).id).slice(8, 9)) {
                    console.log(i);
                    container = document.getElementsByClassName("textAreaClass " + i)
                    container = $(container);
                    //container = $(".userImageClass " + i);
                    console.log(e.target);



                    console.log("if");
                    console.log(e.target.id);
                    if (container.is(e.target) /*&& ((e.target.parentElement).id= "resizerHandelsDiv0")*/) { /*container.has(e.target).length === 0*/
                        console.log("MOUSE");
                        //  if ($(".resizer ").is("0")) {
                        // console.log($("#resizerHandelsDiv0"))
                        console.log(($(e.target.parentElement).find(".TXTresizer")));
                        currentItem = $(e.target.parentElement);
                        //console.log(currentItem);
                        $(".TXTresizer").hide();
                        $("#deleteTXT").show();
                        container.css("border", "none");
                        ($(e.target.parentElement).find(".TXTresizer")).show();
                        break;
                        // }
                    } else {
                        $("#deleteTXT").hide();
                        container.css("border", "solid black");
                        ($(e.target.parentElement).find(".TXTresizer")).hide();
                    }

                }
            }
        }

        if ($(e.target).hasClass("userImageClass")) {

            for (var i = 0; i < imageNum; i++) {
                console.log("FOR");
                if (i == ((e.target).id).slice(9, 10)) {
                    console.log(i);
                    container = document.getElementsByClassName("userImageClass " + i)
                    container = $(container);
                    //container = $(".userImageClass " + i);
                    console.log(e.target);

                    console.log("if");
                    if (container.is(e.target) /*&& ((e.target.parentElement).id= "resizerHandelsDiv0")*/) { /*container.has(e.target).length === 0*/
                        console.log("MOUSE");
                        //  if ($(".resizer ").is("0")) {
                        // console.log($("#resizerHandelsDiv0"))
                        console.log(($(e.target.parentElement).find(".resizer")));
                        currentItem = $(e.target.parentElement);
                        //console.log(currentItem);
                        $(".resizer").hide();
                        $("#deleteImage").show();
                        $("#deleteSticker").show();

                        ($(e.target.parentElement).find(".resizer")).show();
                        break;
                        // }
                    } else {
                        $("#deleteImage").hide();
                        $("#deleteSticker").hide();
                        ($(e.target.parentElement).find(".resizer")).hide();
                    }

                }
            }
        }
    };
    //--------------END----------remove resize handels from images-------------END------------------//

    //--------------start----------remove resize handels from TEXT-------------start------------------//
    //function removeResizerTXT(e) {

    //    console.log("YAY")
    //    $(".resizer").hide();
    //    $(".TXTresizer").hide();



    //    // ($(".textAreaDiv 0")).find(".TXTresizer").show();

    //    // $(e.target.parentElement).find(".TXTresizer")
    //    // $("#deleteImage").hide();


    //    //var txtxWarpDiv = $((".textAreaClass" + 0).parentElement);
    //    //txtxWarpDiv.find(".TXTresizer").show();

    //    //console.log(txtxWarpDiv);
    //    var container; //= $(".userImageClass ");
    //    //var container;
    //    for (var i = 0; i < TXTnum; i++) {
    //        console.log("FOR");
    //        if (i == ((e.target).id).slice(8, 9)) {
    //            console.log(i);
    //            container = document.getElementsByClassName("textAreaClass " + i)
    //            container = $(container);
    //            //container = $(".userImageClass " + i);
    //            console.log(e.target);

    //            console.log("if");
    //            console.log(e.target.id);
    //            if (container.is(e.target) /*&& ((e.target.parentElement).id= "resizerHandelsDiv0")*/) { /*container.has(e.target).length === 0*/
    //                console.log("MOUSE");
    //                //  if ($(".resizer ").is("0")) {
    //                // console.log($("#resizerHandelsDiv0"))
    //                console.log(($(e.target.parentElement).find(".TXTresizer")));
    //                currentItem = $(e.target.parentElement);
    //                //console.log(currentItem);
    //                $(".TXTresizer").hide();
    //                // $("#deleteImage").show();
    //                ($(e.target.parentElement).find(".TXTresizer")).show();
    //                break;
    //                // }
    //            } else {
    //                //$("#deleteImage").hide();
    //                ($(e.target.parentElement).find(".TXTresizer")).hide();
    //            }

    //        }
    //    }

    //};
    //--------------END----------remove resize handels from TEXT-------------END------------------//

    document.querySelector("#BcakgroundColor").addEventListener('input', () => {

        $("#cardCanvas").css("background-color", $('#BcakgroundColor').val());
        //document.querySelector(currentTXTitem).style.color = $('#fontColor').val();
        $("#cardCanvas").css("background-image", "none");
        console.log($('#BcakgroundColor').val());
        if ($('#BcakgroundColor').val() == "#ffffff") {
            $("#cardCanvas").css("border", "solid black 1px");
        } else {
            $("#cardCanvas").css("border", "none");
        }


        //console.log("HI")
    });

    document.querySelector("#bg1").addEventListener('click', () => {
        console.log(document.querySelector("#bg1").src)
        $("#cardCanvas").css("background-color", "none");
        $("#cardCanvas").css("background-image", 'url(' + document.querySelector("#bg1").src + ')');
    });

    document.querySelector("#bg2").addEventListener('click', () => {

        $("#cardCanvas").css("background-color", "none");
        $("#cardCanvas").css("background-image", 'url(' + document.querySelector("#bg2").src + ')');
    });

    document.querySelector("#bg3").addEventListener('click', () => {

        $("#cardCanvas").css("background-color", "none");
        $("#cardCanvas").css("background-image", 'url(' + document.querySelector("#bg3").src + ')');
    });

    /*---------start-----------Font color picker----------------start--------------------*/
    document.querySelector("#fontColor").addEventListener('input', () => {

        document.getElementById(currentTXTitem).style.color = $('#fontColor').val();
        //document.querySelector(currentTXTitem).style.color = $('#fontColor').val();

        //console.log("HI")
    });

    /*---------End-----------Font color picker----------------end--------------------*/


    /*------------start-------------- change Font----------start--------------*/
    $("#selectFont").change(function () {
        var selector = document.getElementById('selectFont');
        family = selector.options[selector.selectedIndex].value;

        document.getElementById(currentTXTitem).style.fontFamily = family;

    });
    /*------------END-------------- change Font----------END--------------*/

    $("#selectFont").change(function () {
        var selector = document.getElementById('selectFont');
        family = selector.options[selector.selectedIndex].value;

        document.getElementById(currentTXTitem).style.fontFamily = family;

    });

    /*------START----------change font size---------START-----------*/
    for (var i = 1; i < 101; i++) {
        var fontSizeOption = document.createElement("option");
        fontSizeOption.text += i;
        document.getElementById("SelectFontSize").appendChild(fontSizeOption);

    }
    var chosenFontSize;
    $("#SelectFontSize").change(function () {
        console.log("fontSize")
        var selector = document.getElementById('SelectFontSize');
        chosenFontSize = selector.options[selector.selectedIndex].value;

        document.getElementById(currentTXTitem).style.fontSize = chosenFontSize + "px";

    });
    /*------END----------change font size---------END-----------*/

    /*---------------START---------------DRAG FUNC------------------START--------------*/

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        /* if present, the header is where you move the DIV from:*/
        console.log("HERE")
        elmnt.onmousedown = dragMouseDown;
        elmnt.touchstart = dragMouseDown;
        //bottomP.onmousedown = dragMouseDown;


        function dragMouseDown(e) {
            console.log("HERE2")
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.touchcancel = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;

        }

        function elementDrag(e) {
            if (!resizing) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:

                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


                parentPos = document.getElementById('cardCanvas').getBoundingClientRect(),
                    childrenPos = elmnt.getBoundingClientRect();
                relativePos = {};

                relativePos.top = childrenPos.top - parentPos.top,
                    relativePos.right = childrenPos.right - parentPos.right,
                    relativePos.bottom = childrenPos.bottom - parentPos.bottom,
                    relativePos.left = childrenPos.left - parentPos.left;

                // console.log('Object {top: ' + relativePos.top + ', right: ' + relativePos.right + ', bottom: ' + relativePos.bottom + ', left: ' + relativePos.left + '}');

                //if (childrenPos.top - 5 < parentPos.top) {
                //    console.log("1")
                //    closeDragElement();
                //}
                //if (childrenPos.right + 5 > parentPos.right) {
                //    console.log("2")
                //    closeDragElement();
                //}
                //if (childrenPos.bottom + 5 > parentPos.bottom) {
                //    console.log("3")
                //    closeDragElement();
                //}
                //if (childrenPos.left - 5 < parentPos.left) {
                //    console.log("4")
                //    closeDragElement();
                //}
            }
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /*-------------END-----------------DRAG FUNC------------------END--------------*/



    /*-------------start-----------------resize pic FUNC------------------start--------------*/

    function Resize() {
        const element = document.querySelector(".resizerHandels");

        const resizers = document.querySelectorAll(".resizer");
        let currentResizer;

        for (let resizer of resizers) {
            console.log("for");
            resizer.addEventListener("mousedown", mousedown);

            function mousedown(e) {
                console.log("down")
                currentResizer = e.target;
                resizing = true;
                let prevX = e.clientX;
                let prevY = e.clientY;

                window.addEventListener("mousemove", mousemove);
                window.addEventListener("mouseup", mouseup);

                function mousemove(e) {
                    console.log(document.getElementById((currentResizer.parentElement).id));
                    console.log(((currentResizer.parentElement).id).slice(17, 18));
                    const rec = (document.getElementById((currentResizer.parentElement).id)).getBoundingClientRect();

                    if (currentResizer.classList.contains("se")) {
                        console.log("se");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
                    }
                    if (currentResizer.classList.contains("sw")) {
                        console.log("sw");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
                    }
                    if (currentResizer.classList.contains("ne")) {
                        console.log("ne");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
                    }
                    if (currentResizer.classList.contains("nw")) {
                        console.log("nw");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
                    }

                    prevX = e.clientX;
                    prevY = e.clientY;
                }

                function mouseup() {
                    resizing = false;
                    window.removeEventListener("mousemove", mousemove);
                    window.removeEventListener("mouseup", mouseup);
                }


            }
        }
    }

    /*-------------END-----------------resize pic FUNC------------------END--------------*/

    /*-------------start-----------------resize TXT FUNC------------------start--------------*/

    function TXTresizer() {
        console.log("HI");
        const element = document.querySelector(".resizerHandels");

        const resizers = document.querySelectorAll(".TXTresizer");
        let currentResizer;

        for (let resizer of resizers) {
            console.log("for");
            resizer.addEventListener("mousedown", mousedown);

            function mousedown(e) {
                console.log("down")
                currentResizer = e.target;
                resizing = true;
                let prevX = e.clientX;
                let prevY = e.clientY;

                window.addEventListener("mousemove", mousemove);
                window.addEventListener("mouseup", mouseup);

                function mousemove(e) {
                    console.log(((currentResizer.parentElement).id).slice(13, 14))
                    const rec = (document.getElementById((currentResizer.parentElement).id)).getBoundingClientRect();

                    if (currentResizer.classList.contains("se")) {
                        console.log("se");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = rec.height - (prevY - e.clientY) + "px";

                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.height = (document.getElementById((currentResizer.parentElement).id)).clientHeight + "px";
                    }
                    if (currentResizer.classList.contains("sw")) {
                        console.log("sw");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = rec.height - (prevY - e.clientY) + "px";

                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.height = (document.getElementById((currentResizer.parentElement).id)).clientHeight + "px";
                    }
                    if (currentResizer.classList.contains("ne")) {
                        console.log("ne");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = rec.height - (prevY - e.clientY) + "px";

                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.height = (document.getElementById((currentResizer.parentElement).id)).clientHeight + "px";
                    }
                    if (currentResizer.classList.contains("nw")) {
                        console.log("nw");
                        (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
                        (document.getElementById((currentResizer.parentElement).id)).style.height = rec.height - (prevY - e.clientY) + "px";

                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
                        document.getElementById("textArea" + ((currentResizer.parentElement).id).slice(13, 14)).style.height = (document.getElementById((currentResizer.parentElement).id)).clientHeight + "px";
                    }

                    prevX = e.clientX;
                    prevY = e.clientY;
                }

                function mouseup() {
                    resizing = false;
                    window.removeEventListener("mousemove", mousemove);
                    window.removeEventListener("mouseup", mouseup);
                }


            }
        }
    }

    /*-------------END-----------------resize TXT FUNC------------------END--------------*/



    /* */

    /* */








    /*-------------Start-----------------collapse  FUNC------------------Start--------------*/
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
    /*-------------END-----------------collapse  FUNC------------------END--------------*/

    /*--------------------------------------------Stickers FUNC-------------------------------------------------------------*/

    $("#sticker1").click(function () {
        var addSticker = document.createElement("img");
        // console.log($("#sticker1").src);
        addSticker.src = document.getElementById("sticker1").src;
        addSticker.id = "userImage" + imageNum;
        addSticker.classList = "userImageClass " + imageNum;
        addSticker.onload = function () {



            var resizeDiv = document.createElement('div');
            resizeDiv.classList = "resizerHandels " + handleNum;
            resizeDiv.id = "resizerHandelsDiv" + handleNum;



            cardContainer.appendChild(resizeDiv);
            resizeDiv.appendChild(addSticker);

            var resizerNe = document.createElement('span');
            resizerNe.classList = "resizer ne " + handleNum;
            var resizerNw = document.createElement('span');
            resizerNw.classList = "resizer nw " + handleNum;
            var resizerSw = document.createElement('span');
            resizerSw.classList = "resizer sw " + handleNum;
            var resizerSe = document.createElement('span');
            resizerSe.classList = "resizer se " + handleNum;

            resizeDiv.appendChild(resizerNe);
            resizeDiv.appendChild(resizerNw);
            resizeDiv.appendChild(resizerSw);
            resizeDiv.appendChild(resizerSe);

            $(".resizerHandels").css("position", "absolute");

            dragElement(document.getElementById("resizerHandelsDiv" + handleNum));

            const resizers = document.querySelectorAll(".resizer");
            for (let resizer of resizers) {
                console.log("ONE");
                resizer.addEventListener("click", Resize);
            }
            document.getElementById("container").addEventListener("click", removeResizer);
            handleNum++
            imageNum++
        };
    });

    $("#sticker2").click(function () {
        var addSticker = document.createElement("img");
        console.log($("#sticker2").src);
        addSticker.src = document.getElementById("sticker2").src;
        addSticker.id = "userImage" + imageNum;
        addSticker.classList = "userImageClass " + imageNum;

        addSticker.onload = function () {
            var resizeDiv = document.createElement('div');
            resizeDiv.classList = "resizerHandels " + handleNum;
            resizeDiv.id = "resizerHandelsDiv" + handleNum;

            cardContainer.appendChild(resizeDiv);
            resizeDiv.appendChild(addSticker);

            var resizerNe = document.createElement('span');
            resizerNe.classList = "resizer ne " + handleNum;
            var resizerNw = document.createElement('span');
            resizerNw.classList = "resizer nw " + handleNum;
            var resizerSw = document.createElement('span');
            resizerSw.classList = "resizer sw " + handleNum;
            var resizerSe = document.createElement('span');
            resizerSe.classList = "resizer se " + handleNum;

            resizeDiv.appendChild(resizerNe);
            resizeDiv.appendChild(resizerNw);
            resizeDiv.appendChild(resizerSw);
            resizeDiv.appendChild(resizerSe);

            $(".resizerHandels").css("position", "absolute");

            dragElement(document.getElementById("resizerHandelsDiv" + handleNum));

            const resizers = document.querySelectorAll(".resizer");
            for (let resizer of resizers) {
                console.log("ONE");
                resizer.addEventListener("click", Resize);
            }
            document.getElementById("container").addEventListener("click", removeResizer);
            handleNum++
            imageNum++
        };
    });


    $("#sticker3").click(function () {
        var addSticker = document.createElement("img");
        console.log($("#sticker3").src);
        addSticker.src = document.getElementById("sticker3").src;
        addSticker.id = "userImage" + imageNum;
        addSticker.classList = "userImageClass " + imageNum;

        addSticker.onload = function () {
            var resizeDiv = document.createElement('div');
            resizeDiv.classList = "resizerHandels " + handleNum;
            resizeDiv.id = "resizerHandelsDiv" + handleNum;

            cardContainer.appendChild(resizeDiv);
            resizeDiv.appendChild(addSticker);

            var resizerNe = document.createElement('span');
            resizerNe.classList = "resizer ne " + handleNum;
            var resizerNw = document.createElement('span');
            resizerNw.classList = "resizer nw " + handleNum;
            var resizerSw = document.createElement('span');
            resizerSw.classList = "resizer sw " + handleNum;
            var resizerSe = document.createElement('span');
            resizerSe.classList = "resizer se " + handleNum;

            resizeDiv.appendChild(resizerNe);
            resizeDiv.appendChild(resizerNw);
            resizeDiv.appendChild(resizerSw);
            resizeDiv.appendChild(resizerSe);

            $(".resizerHandels").css("position", "absolute");

            dragElement(document.getElementById("resizerHandelsDiv" + handleNum));

            const resizers = document.querySelectorAll(".resizer");
            for (let resizer of resizers) {
                console.log("ONE");
                resizer.addEventListener("click", Resize);
            }
            document.getElementById("container").addEventListener("click", removeResizer);
            handleNum++
            imageNum++
        };
    });

    /*-------------start-----------------resize Stickers FUNC------------------start--------------*/

    //function ResizeStickers() {
    //    const element = document.querySelector(".resizerHandels");


    //    const resizers = document.querySelectorAll(".resizer");
    //    let currentResizer;


    //    for (let resizer of resizers) {
    //        console.log("for");
    //        resizer.addEventListener("mousedown", mousedown);

    //        function mousedown(e) {
    //            console.log("down")
    //            currentResizer = e.target;
    //            resizing = true;
    //            let prevX = e.clientX;
    //            let prevY = e.clientY;

    //            window.addEventListener("mousemove", mousemove);
    //            window.addEventListener("mouseup", mouseup);

    //            function mousemove(e) {
    //                console.log(((currentResizer.parentElement).id).slice(17, 18))
    //                const rec = (document.getElementById((currentResizer.parentElement).id)).getBoundingClientRect();

    //                if (currentResizer.classList.contains("se")) {
    //                    console.log("se");
    //                    (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
    //                    (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
    //                }
    //                if (currentResizer.classList.contains("sw")) {
    //                    console.log("sw");
    //                    (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
    //                    (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
    //                }
    //                if (currentResizer.classList.contains("ne")) {
    //                    console.log("ne");
    //                    (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
    //                    (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
    //                }
    //                if (currentResizer.classList.contains("nw")) {
    //                    console.log("nw");
    //                    (document.getElementById((currentResizer.parentElement).id)).style.width = rec.width - (prevX - e.clientX) + "px";
    //                    (document.getElementById((currentResizer.parentElement).id)).style.height = "auto";

    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.width = (document.getElementById((currentResizer.parentElement).id)).clientWidth + "px";
    //                    document.getElementById("userImage" + ((currentResizer.parentElement).id).slice(17, 18)).style.height = "auto";
    //                }

    //                prevX = e.clientX;
    //                prevY = e.clientY;
    //            }

    //            function mouseup() {
    //                resizing = false;
    //                window.removeEventListener("mousemove", mousemove);
    //                window.removeEventListener("mouseup", mouseup);
    //            }


    //        }
    //    }
    //}

    /*-------------END-----------------resize Stickers FUNC------------------END--------------*/

    /*-------------START-----------------DOWNLOAD CARD FUNC------------------START--------------*/
    $("#downloadBTN").click(function () {
        html2canvas(document.querySelector("#cardCanvas")).then(canvas => {

            document.body.appendChild(canvas)
            $("canvas").hide();

            var canvasImg = canvas.toDataURL("image/jpg");
            // $('#canvasImg').html('<img src="' + canvasImg + '" alt="">');
            var linkToDownload = document.createElement("a");
            linkToDownload.id = "linkToDownload";
            var imageDownload = document.querySelector('#buttonDiv');
            imageDownload.appendChild(linkToDownload);
            document.getElementById("linkToDownload").href = canvasImg;
            linkToDownload.download = "image.png";

        
            setTimeout(function () {
                linkToDownload.click();
                $("#linkToDownload").remove();
            }, 3000);
            //document.querySelector("#downloadBTN").setAttribute('href', canvasImg);

        });
    });

    /*-------------END-----------------DOWNLOAD CARD FUNC------------------END--------------*/
});