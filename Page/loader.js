var showVideo = function (file) {
    /*<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
Your browser does not support the video tag.
</video>*/
    var vid = document.createElement("video");
    var src = document.createElement("source");
    src.src = file;
    vid.appendChild(src);
    vid.appendChild(document.createTextNode("Ihr Browser unterstützt kein Video-Tag (HTML-5)"));
    document.getElementsByClassName("content")[0].appendChild(vid);
    vid.play();
    vid.ontimeupdate = function (evt, obj) {
        Debug.writeln(evt);
    };
}

var handleMenuClicked = function (content) {
    switch (content.type) {
        case "1":
            //video
            document.getElementById("greeting").style.display = "none";
            showVideo(document.file);
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
            a.onclick = function (evt,obj) {
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