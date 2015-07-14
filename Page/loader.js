String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = minutes + ':' + seconds + ':00';
    if (hours > 0) {
        time = hours + ':' + time;
    }
    return time;
}

var clearContent = function () {
    var dataCell = document.getElementById("dataContend");
    dataCell.innerHTML = '';
    var timeCell = document.getElementById("timeDisplay");
    timeCell.innerHTML = '';
}

var showVideo = function (file, detail) {
    var dataCell = document.getElementById("dataContend");
    var timeCell = document.getElementById("timeDisplay");
    var vid = document.createElement("video");
    var src = document.createElement("source");
    src.src = file;
    vid.appendChild(src);
    vid.appendChild(document.createTextNode("Ihr Browser unterstützt kein Video-Tag (HTML-5)"));
    dataCell.innerHTML = '';
    dataCell.appendChild(vid);
    var progr = document.createElement("div");
    vid.progr = progr;
    vid.dataDetail = detail;
    vid.dataTimes = Object.keys(detail).sort();
    progr.className = "progress";

    timeCell.innerHTML = '';
    timeCell.appendChild(progr);
    progr.style.height = timeCell.offsetHeight + "px";
    document.getElementById("timeContend").lastIdx = 0;

    vid.play();
    vid.ontimeupdate = function (evt, obj) {
        var perc = evt.srcElement.currentTime / evt.srcElement.duration * 100;
        evt.srcElement.progr.style.backgroundImage = "linear-gradient(black " + perc + "%,white " + (perc + 1) + "%)";

        var time = (""+evt.srcElement.currentTime).toHHMMSS();
        var timeCont = document.getElementById("timeContend");
        if(evt.srcElement.dataTimes[timeCont.lastIdx] < time){
            timeCont.innerHTML = '';
            timeCont.appendChild(document.createTextNode(evt.srcElement.dataDetail[evt.srcElement.dataTimes[timeCont.lastIdx]].file));
            timeCont.lastIdx++;
        }
    };
}

var handleMenuClicked = function (content) {
    clearContent();
    if (!content || !content.type) {
        document.getElementById("greeting").style.display = "";
        return;
    }
    switch (content.type) {
        case "1":
            //video
            document.getElementById("greeting").style.display = "none";
            showVideo(content.file, content.detail);
            break;
    }
};

var buildMenu = function (chapters) {
    var navDiv = document.getElementsByClassName("nav")[0];
    var nav = document.createElement("nav");
    for (var i = 0; i < chapters.chapter.length; i++) {
        var curChapt = chapters.chapter[i];
        var ul = document.createElement("ul");
        nav.appendChild(ul);
        var il = document.createElement("li");
        var h2 = document.createElement("h2");
        h2.appendChild(document.createTextNode("Chapter:" + i));
        il.appendChild(h2);
        ul.appendChild(il);
        for (var secI = 0; secI < curChapt.section.length; secI++) {
            var section = curChapt.section[secI];
            var il = document.createElement("li");
            ul.appendChild(il);
            var a = document.createElement("a");
            a.href = "#";
            a.sect = section;
            a.onclick = function (evt, obj) {
                handleMenuClicked(evt.srcElement.sect.content);
            };
            a.appendChild(document.createTextNode(section.title));
            il.appendChild(a);
            //alert("Chapter:" + i + " section:" + i + " title:" + section.title);
        }
    }
    navDiv.appendChild(nav);
};


var request = new XMLHttpRequest();
request.onload = function () {
    var data = JSON.parse(request.responseText);
    buildMenu(data);
};
request.open("GET", "data.json", true);
request.send(null);