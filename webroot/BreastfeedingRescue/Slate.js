$(document).ready(function () {

    $('div').on('swiperight', swipeHandler);
    function swipeHandler() {
        history.go(-1);
    }

    $("#m1-Index li").each(function () {
        if (!(($(this).parents("ul").siblings("a").contents().filter(function () { return this.nodeType === 3 }).text()) == "")) {
            $(this).hide();
        }
        else {
            $(this).show();
        }
    });
    var tagArray = null;
    $(window).bind('hashchange', function () {
        if (window.location.hash.indexOf("Index") > 0) {
            tagArray = [];
            $("#taglist li a").each(function () { // Performed on every list item, nested or otherwise
                var tagCell = new Object(); // For each list item, create an object 
                tagCell.listItem = $(this).contents().filter(function () { return this.nodeType === 3 }).text(); // Converts the <li> into only the text value inside of it
                tagCell.parent = $(this).parents("ul").siblings("a").contents().filter(function () { return this.nodeType === 3 }).text(); // Grabs the parent <a> text value; if it has no parent, this will be ""
                tagCell.listItem = tagCell.listItem.replace(/(\r\n|\n|\r)/g, ""); // Removes line breaks in the text
                tagCell.listItem = tagCell.listItem.replace(/\s+/g, " "); // Removes all non-single spaces in the text
                tagCell.parent = tagCell.parent.replace(/(\r\n|\n|\r)/g, ""); // Removes line breaks in the parent text
                tagCell.parent = tagCell.parent.replace(/\s+/g, " "); // Removes all non-single spaces in the parent text
                tagCell.reference = $(this).parent("li"); // Creates a reference to the original list item
                tagCell.parentReference = $(this).parents("li"); // Creates a reference to the original parent item
                tagCell.match = true; // Sets the filter match value to true to start
                tagArray.push(tagCell); // Pushes all the previous data into the array cell
                if (tagCell.parent != "") {
                    (tagCell.reference).hide();
                }
            });
        }
        else {
            tagArray = null;
            $("#filter").val("");
            $("#m1-Index li").each(function () {
                if (!(($(this).parents("ul").siblings("a").contents().filter(function () { return this.nodeType === 3 }).text()) == "")) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
        }
    });

    //Main

    //Help Questions

    //Help Links

    //Index
    $("ul#taglist a").css({ "cursor": "pointer", "text-decoration": "underline" });
    $("ul#taglist a:not(.taglist-parent)").css({ "text-decoration": "underline", "color": "blue" });
    $("ul#taglist a:active").css({ "text-decoration": "underline", "color": "rgb(200,0,200)" });

    $(".taglist-parent").tap(function () {
        var childAnchors = $(this).siblings("ul").children("li")
        for (var i = 0; i < childAnchors.length; i++) {
            if ($("#filter").val() != "") {
                if (!filterCheck(childAnchors[i])) {
                    $(childAnchors[i]).toggle();
                }
            }
            else {
                $(childAnchors[i]).toggle();
            }
        }
    });
    // Update the tags displayed each time a keyup event fires using hide/show.
    $("#live-search").submit(function () {

        if ($("#filter").val() != "") {
            // Grabs the text value from the search input field and splits it into substrings by space, stored in an array
            var filter = $("#filter").val().split(" ");

            // Searches each <li> array cell and executes the hide or show based on the filter value
            $(tagArray).each(function () {
                searchKeyword(this, filter);
                showHide(this);
            });
        }
        else {
            $(tagArray).each(function () {
                if (this.parent != "") {
                    (this.reference).hide();
                }
                else {
                    (this.reference).show();
                }
            });
        }
    });


    // For each substring within the filter array, look for a match in the current list item and its parent text
    // Since the search bar should only return tags whose keywords match all substrings, a single false check will
    // return false and break the loop.
    function searchKeyword(cell, filter) {
        for (i = 0; i < filter.length; i++) {
            check = ((cell.listItem.search(new RegExp(filter[i], "i")) >= 0)
                  || (cell.parent.search(new RegExp(filter[i], "i")) >= 0));
            if (!check) {
                cell.match = false;
                break;
            }
            else {
                cell.match = true;
            }
        }
    }

    // Show or hide the given list item depending on the match bool. If all substrings in filter find a match in
    // either the list item or the parent text, it will show the original list item and its parent.
    // Otherwise, it will hide it.
    function showHide(cell) {
        if (cell.match) {
            cell.reference.show();
            cell.parentReference.show();
        }
        else {
            // Note: if the parent item returns false in its match, the sub-list items will be hidden as well.
            // However, since the list items contain a call to show the parent reference on a match, this will
            // retroactively display the parent node. This occurs too fast to be seen by the user, but is 
            // important to understand when dealing with the internal logic of the functions.
            cell.reference.hide();
        }
    }
    function filterCheck(cell) {
        var filter = $("#filter").val().split(" ");
        var cellText = $(cell).children().contents().filter(function () { return this.nodeType === 3 }).text();
        var isFilter = false;
        for (var j = 0; j < filter.length; j++) {
            check = ((cellText.search(new RegExp(filter[j], "i")) >= 0));
            if (check) {
                isFilter = true;
            }
            else {
                isFilter = false;
                break;
            }
        }
        return isFilter;
    }

    //Read All Section Lists

    //Read All Pages

    //Title
    $("div[id*='Problem'].m1-text:first-child").css({ "display": "inline-block" });
    //Text
    $("div[id*='Problem'].m1-text:not(:first-child)").css({ "display": "inline-block", "float": "left", "margin": "3px", "position": "static", "clear": "both" });
    //Links
    $("div[id*='Problem'].m1-hyperlink-container").css({ "display": "inline-block", "float": "left", "margin": "3px", "position": "static", "clear": "both" });
    $("div[id*='Problem'].m1-hyperlink-container > a.m1-hyperlink").css({});
    //Images
    $("img[id*='Problem'].m1-image").css({ "margin": "3px", "position": "static" });

    //Read All Learn More
    //Title
    $("div[id*='Learn'].m1-text:first-child").css({ "display": "inline-block", "position": "static" });
    //Text
    $("div[id*='Learn'].m1-text:not(:first-child)").css({ "display": "inline-block", "float": "left", "margin": "3px", "position": "static", "clear": "both" });
    //Links
    $("div[id*='Learn'].m1-hyperlink-container").css({ "display": "inline-block", "float": "left", "margin": "3px", "position": "static", "clear": "both" });
    $("div[id*='Learn'].m1-hyperlink-container > a.m1-hyperlink").css({});
    //Images
    $("img[id*='Learn'].m1-image").css({ "margin": "3px", "position": "static" });

    //Learn13
    $("img[id='m1-Learn13-image1']").css({ "float": "right" });
    $("div[id='m1-Learn13-text6']").css({ "clear": "" });

    //Learn15
    $("img[id*='m1-Learn15-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn15-text']").css({ "clear": "right" });

    //Learn22
    $("img[id*='m1-Learn22-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn22-text']").css({ "clear": "right" });

    //Learn33
    $("img[id*='m1-Learn33-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn33-text']").css({ "clear": "right" });

    //Learn34
    $("img[id*='m1-Learn34-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn34-text']").css({ "clear": "right" });

    //Learn35
    $("img[id*='m1-Learn35-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn35-text']").css({ "clear": "right" });
    $("div[id*='m1-Learn35-text'].m1-font-7").css({ "clear": "left" });

    //Learn36
    $("img[id*='m1-Learn36-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn36-text'].m1-font-3").css({ "clear": "right" });

    //Learn49
    $("img[id*='m1-Learn49-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn49-text']").css({ "clear": "right" });

    //Learn53
    $("img[id*='m1-Learn53-image'].m1-image").css({ "float": "left", "clear": "left" });
    $("div[id*='m1-Learn53-text']").css({ "clear": "right" });
    $("div[id*='m1-Learn53-text'].m1-font-7").css({ "clear": "left" });

    //Learn72
    $("div[id='Learn72Table']").css({ "display": "inline-block", "float": "left", "margin": "3px", "position": "static", "clear": "both" });

});