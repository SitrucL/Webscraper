/* Go to Londis.com
find out how many pages exist

Loop through all pages 
  collect items from each page
  check if 
*/

/* chrome extension that lets you add watchlist from londis
 when items are on salelist, desktop notification is given

    can be either webpage or extension
    front end - shopping list type input form  - crayon font - red lined paper
    icons to add and delete list items
 
*/


// https://itnext.io/https-medium-com-popov4ik4-what-about-promises-in-loops-e94c97ad39c0
// https://codeburst.io/asynchronous-code-inside-an-array-loop-c5d704006c99
// https://levelup.gitconnected.com/web-scraping-with-node-js-c93dcf76fe2b
// https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/

var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var NameStart;
var NameEnd;
var priceStart;
var priceEnd;
var itemName;
var itemPrice;
var item;
var DealItemContainer;

var SaleProducts = [
    /*    {name: ,
       price: },
       {name: ,
      price: } */
]

////////////////////////////////////////////////////////
const userList = ["strongbow", "milk"] // known match items

// showMeResults (userList);
//////////////////////////////////////////////////////////////
async function showMeResults(referenceList) {
    console.log('.......................................calling');
    var result = await collectDeals(referenceList);

    // console.log("result: ");/////////////////////////////////////////////////////////////////////
    console.log(result);/////////////////////////////////////////////////////////////////////
    return result;
  }


function collectDeals(referenceList2) {
    
    const TestPromise0 = new Promise(function (resolve, reject) {
        request.get('https://www.londis.co.uk/special-offers?page=0', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                parseData(body);
            }
            else {
                console.log(err);
            }
            // console.log("finished storing in SaleProducts Array 0");
            resolve();
        })
    });

    const TestPromise1 = new Promise(function (resolve, reject) {
        request.get('https://www.londis.co.uk/special-offers?page=1', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                parseData(body);
            }
            else {
                console.log(err);
            }
            // console.log("finished storing in SaleProducts Array1");
            resolve();
        })
    });

    const TestPromise2 = new Promise(function (resolve, reject) {
        request.get('https://www.londis.co.uk/special-offers?page=2', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                parseData(body);
            }
            else {
                console.log(err);
            }
            // console.log("finished storing in SaleProducts Array2");
            resolve();
        })
    });

    const TestPromise3 = new Promise(function (resolve, reject) {
        request.get('https://www.londis.co.uk/special-offers?page=3', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                parseData(body);
            }
            else {
                console.log(err);
            }
            // console.log("finished storing in SaleProducts Array3");
            resolve();
        })
    });

    return Promise.all([TestPromise0, TestPromise1, TestPromise2, TestPromise3]).then(function () {
        console.log("Completed Promise.all");
        return CheckSaleProducts(SaleProducts, referenceList2); // returns the resultant array
    });

}


function CheckSaleProducts(SaleList, favItems) {
    var results = [];
    
    favItems.forEach(function (itemToSearch, index) { //loops through array of user fav items
        // console.log('............item being searched for..............' + itemToSearch);
        for (var i = 0; i < SaleList.length; i++) { //iterates through each object
                var currentValue = SaleList[i].name;
                currentValue = currentValue.toLowerCase();
                if (currentValue.indexOf(itemToSearch.toLowerCase()) != -1) { // checks that the searched term is in the current object
                    SaleList[i].originatedFrom = index; //adds object property which contains the search term that it matched against
                    results.push(SaleList[i]); // adds object to the results array
                }
           
        }
    })
    SaleProducts = [];
    return results;
}


function parseData(incomingPage) {

    const $ = cheerio.load(incomingPage); /* allows jquery functions to be used to select DOM elements */

    DealItemContainer = $("#specialOffersWrapper > div > ul > li > a:first-of-type");

    DealItemContainer.each(function (i, element) {
        item = $(element).attr('title');
        
        NameStart = item.search(/((?<=(DEALS?: ?))(?=[A-Z]))|(?<=View )((?!DIAMOND|MEGA|NO|CELEBRATE))|((?<=TREATS: )(?=[A-Z]))|(?<=(CHRISTMAS: ))/gi);
        NameEnd = item.search(/(?=(,? (Was| ?RRP| ?-)))/ig);

        priceStart = item.search(/(?<=((Now)? Only £)|Any )/ig);
        priceEnd = item.search(/(?=(p)? at Londis)/ig);

        itemName = item.slice(NameStart, NameEnd);
        itemPrice = item.slice(priceStart, priceEnd);

        SaleProducts.push({
            name: itemName,
            price: itemPrice
        });
    })

}



module.exports = showMeResults;