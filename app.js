var express = require("express"); // brings in express module into use
var app = express(); // excutes module as a function and stores it - allows us to use the methods
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var crossReferenceLists = require("./Londis2.js");
const methodOverride = require('method-override');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true)
mongoose.connect("mongodb://localhost/WebScraper", { useNewUrlParser: true }); //connects mongoose to database (creates one if named one doesnt exist)

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/assets'));
app.use(methodOverride("_method"));

//SCHEMA set up
var shoppingListSchema = new mongoose.Schema({
    name: String
});
//MODEL set up
var shoppingListItem = mongoose.model("DesiredItem", shoppingListSchema); //creates model using schema, has methods


//ROUTES
app.get("/", function (req, res) {
    shoppingListItem.find({}, function (err, allDesiredItems) { //finding ALL items in the shoppingList model
        if (err) {
            console.log(err);
        }
        else {
            var tempArray = [];
            allDesiredItems.forEach(function (element) {
                tempArray.push(element.name);
            })

            asyncCall(tempArray);


            /* pass in tempArrray into crossRefercene list
            wait for it to finish executing
            store result in another variable 
            pass new var that into res.render ("index", ...........)
            */
            
            async function asyncCall(incomingArray) {
               var tempArray2 = await crossReferenceLists(incomingArray);
                res.render("index2", { thingsToWatch: allDesiredItems, checkedList: tempArray2 }); //generates index.ejs and passes in
            }
        }
    })
})

app.post("/", function (req, res) { //POST requests on the home page
    var itemToAdd = req.body.addListItem; // grabs data from the form 
    var newItem = { name: itemToAdd } //pairs form data with schema created for item


    shoppingListItem.create(newItem, function (err, newlyCreated) { //creates a shopping list item using the data from the form and the schema
        if (err) {
            console.log(err);
        }
        else {
            // console.log(newlyCreated);
            res.redirect("/") //redirects to the page showing the newly added list item
        }
    })

})



/* paste  EDIT and UPDATE routes */
app.put("/:id", function (req, res) {
    // console.log(req.body);

    shoppingListItem.findByIdAndUpdate(req.params.id, req.body.item, function (err, updatedListItem) {
        if (err) {
            res.send("error has occured");
            console.log(err);
        }
        else {
            console.log("enterd UPDATE");
            console.log(req.body.item.name);

            res.redirect("/")
        }
    })
})







app.get("/:id/delete", function(req, res){ // change to a proper delete request
    shoppingListItem.findByIdAndDelete(req.params.id, function(err, foundListItem){
        if(err){
            console.log(err)
        }else{
            res.redirect("/")
        }
    })    
})



var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});