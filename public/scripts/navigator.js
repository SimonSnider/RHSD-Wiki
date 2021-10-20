//https://codemyui.com/directory-list-with-collapsible-nested-folders-and-files/
var allFolders = $(".directory-list li > ul");
allFolders.each(function () {

    // add the folder class to the parent <li>
    var folderAndName = $(this).parent();
    folderAndName.addClass("folder");

    // backup this inner <ul>
    var backupOfThisFolder = $(this);
    // then delete it
    $(this).remove();
    // add an <a> tag to whats left ie. the folder name
    folderAndName.wrapInner("<a href='#' />");
    // then put the inner <ul> back
    folderAndName.append(backupOfThisFolder);


    // now add a slideToggle to the <a> we just added
    folderAndName.find("a").click(function (e) {
        $(this).siblings("ul").slideToggle("fast");
        e.preventDefault();
    });
    folderAndName.find("a").trigger('click');

});

var listOpen = false;
document.querySelector("#navButton").onclick = (event) => {
    if (!listOpen) {
        document.querySelector(".body").style.display = "none";
        document.querySelector(".leftNavigator").style.display = "contents";
        document.querySelector("body").style.backgroundColor = "#a7a7a7";
    } else {
        document.querySelector(".body").style.display = "contents";
        document.querySelector(".leftNavigator").style.display = "none";
        document.querySelector("body").style.backgroundColor = "#DDDDDD";
    }
    listOpen = !listOpen;
};

function myFunction(x) {
    if (x.matches) { // If media query matches
        document.querySelector(".body").style.display = "flex";
        document.querySelector(".leftNavigator").style.display = "flex";
        document.querySelector("body").style.backgroundColor = "#DDDDDD";
    } else {
        document.querySelector(".leftNavigator").style.display = "none";
        document.querySelector(".body").style.display = "contents";
        listOpen = false;
    }
}

var x = window.matchMedia("(min-width: 450px)");
myFunction(x); // Call listener function at run time
x.addListener(myFunction); // Attach listener function on state changes