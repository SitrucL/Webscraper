console.log("connected to the item watclist.js ")

$("ul").on("click", ".fa-pencil-alt", function (event) {
    /* use the .on method to apply js to new items, not just existing ones on the page */
   console.log("clicked on edit icon")
   $(this).parent().parent().prev().children().children("input").prop("disabled", function(index, value){
       return !value;
   });
   
   $(this).parent().parent().prev().children().children("input").focus()
})

$("li.mainListItem").mouseenter(function () { //when you over over a list item
$(this).children("ul.fullInfo").removeClass("cloaked"); //shows extra info
$(this).children("span.listItemContainer").children("span.iconBox").children("span.AdditionalOptions").removeClass("cloaked"); //shows extra options
})



$("li.mainListItem").mouseleave(function () { // when you hover off a list item
    $(this).children("ul.fullInfo").addClass("cloaked");   // hides the extra info
    $(this).children("span.listItemContainer").children("span.iconBox").children("span.AdditionalOptions").addClass("cloaked"); //hides the extra options
})

// Adds icon when deal is available
$("ul.fullInfo").siblings("span.listItemContainer").children("span.iconBox").children("i.fa-tags").css("visibility", "visible")


























