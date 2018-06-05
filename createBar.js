var progressBarUrl = "http://pb-api.herokuapp.com/bars";
var pbBarLimit = 0;

function calculatePercentage(input) {
    var res = Math.round((input / pbBarLimit) * 100);
    if(res < 0) {
        res = 0;
    } else if(res > 100) {
        res = 100;
    }
    return res;
}

function generateBootstrapPB(barPercent) {
    var Elem = document.createElement("div");
    barPercent = (barPercent < 0)? 0 : barPercent;
    if(barPercent > 100) {
        Elem.setAttribute("class","progress-bar bg-danger");
    } else {
        Elem.setAttribute("class","progress-bar");
    }
    Elem.setAttribute("data-percent-value",barPercent);
    Elem.setAttribute("style","width:"+barPercent+"%");
    Elem.innerHTML = barPercent + "%";
    return Elem;
}

function generateJavascriptPB(barPercent) {
    var Elem = document.createElement("div");
    barPercent = (barPercent < 0)? 0 : barPercent;
    if(barPercent > 100) {
        Elem.setAttribute("class","myBar bgDanger");
    } else {
        Elem.setAttribute("class","myBar");
    }
    Elem.setAttribute("data-percent-value",barPercent);
    Elem.setAttribute("style","width:"+barPercent+"%");
    Elem.innerHTML = barPercent + "%";
    return Elem;
}

function createProgresBarContent(bars) {
    var destinationDiv = document.getElementById("pbBars");
    for(var b=0; b < bars.length; b++) {
        var percentValue = calculatePercentage(bars[b]);
        var pDivElem = document.createElement("div");
        pDivElem.setAttribute("class","progress");
        pDivElem.setAttribute("id","progressbar_"+b);
        // var pbElem = generateBootstrapPB(percentValue);
        var pbElem = generateJavascriptPB(percentValue);
        pDivElem.appendChild(pbElem);
        destinationDiv.appendChild(pDivElem);
        var brElem = document.createElement("br");
        destinationDiv.appendChild(brElem);
    }
}

function createProgresBarList(bars) {
    var destinationDiv = document.getElementById("pbList");
    var divElem = document.createElement("div");
    divElem.setAttribute("class","form-group");
    var labelElem = document.createElement("label");
    labelElem.setAttribute("for","selectPB");
    labelElem.innerHTML = "Select Progress Bar:";
    divElem.appendChild(labelElem);
    var selectElem = document.createElement("select");
    selectElem.setAttribute("class","form-control");
    selectElem.setAttribute("id","pbselect");
    for(var l = 0; l < bars.length; l++) {
        var optionElem = document.createElement("option");
        optionElem.value = l;
        optionElem.text = "Progress Bar #"+(l+1);
        selectElem.appendChild(optionElem);
    }
    divElem.appendChild(selectElem);
    destinationDiv.appendChild(divElem);
}

function createLimitButtons(buttons) {
    var destinationDiv = document.getElementById("pbButtons");
    var labelElem = document.createElement("label");
    labelElem.setAttribute("for","selectPBLimit");
    labelElem.innerHTML = "Progress Bar Limits:";
    destinationDiv.appendChild(labelElem);
    var divElem = document.createElement("div");
    for(var x=0; x < buttons.length; x++) {
        var btnElem = document.createElement("button");
        btnElem.setAttribute("class","btn btn-primary btn-sm btnMargin");
        btnElem.setAttribute("onClick","updateProgressBar("+ buttons[x] +")");
        btnElem.value = buttons[x];
        btnElem.innerHTML = buttons[x];
        divElem.appendChild(btnElem);
    }
    destinationDiv.appendChild(divElem);
}

function updateProgressBar(progressPercent) {
    var pbSelectElem = document.getElementById("pbselect");
    if(pbSelectElem.value != "") {
        var destinationDiv = document.getElementById("progressbar_"+pbSelectElem.value);
        var childElem = destinationDiv.firstChild;
        var prevPercent = childElem.getAttribute("data-percent-value");

        destinationDiv.innerHTML = "";
        var updatedProgressPercent = parseInt(prevPercent) + parseInt(progressPercent);
        
        // var pbElem = generateBootstrapPB(updatedProgressPercent);
        var pbElem = generateJavascriptPB(updatedProgressPercent);
        destinationDiv.appendChild(pbElem);
    }
}

function getProgressBarInfo() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var parsedText = JSON.parse(this.responseText);
            if(parsedText) {
                pbBarLimit = parsedText.limit;
                if(parsedText.bars && parsedText.bars.length > 0) {
                    createProgresBarContent(parsedText.bars);
                    createProgresBarList(parsedText.bars);
                }
                if(parsedText.buttons && parsedText.buttons.length > 0) {
                    createLimitButtons(parsedText.buttons);
                }
            }
        }
    };
    xhttp.open("GET", progressBarUrl, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send("");
}

getProgressBarInfo();