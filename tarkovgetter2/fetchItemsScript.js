// Items that should not show up, but are still in the barter query category for some reason
var BlackList = ["BEAR", "USEC", "MB", "GPSA", "DSPT", "Repeater", "Dogtag", "Sacred Amulet", "Amulet", "Primorsky"]

var loaded = false;
var allBarterItems;

var ones = [];
var rareOnes = [];

function itemFilter(item, colors, width, height, elementsDone) {
  // Returns true/false if an item matches a filter.
  if (elementsDone == undefined) {
    elementsDone = [];
  }
  let colorCorrect = false;
  for (let i = 0; i < colors.length; i++) {
    if (item.backgroundColor == colors[i]) {
      colorCorrect = true;
      break;
    }
  }

  for (let i = 0; i < BlackList.length; i++) {
    if (item.shortName == BlackList[i]) {
      return false;
    }
  }

  if (item.fleaMarketFee == null) {
    console.log("OI PISSOFF")
    // IDK WHY I DIDNT THINK OF THIS SOONER
    return false;
  }

  return (
    item.height == height &&
    item.width == width &&
    colorCorrect &&
    elementsDone.indexOf(item.name) == -1
  );
}

function filterItems(data, colors, width, height, categoryName, blackList = false) {
  let itemsDone = []

  

  // adds items to a div if they match a filter, and are not in the itemsDone array
  for (let i = 0; i < data.data.items.length; i++) {
    // For the 1x1s that are not special
    let item = data.data.items[i];

    if (itemFilter(item, colors, width, height, itemsDone)) {
      if(categoryName != null) {
        if(blackList == false){
            if(item.category.name == categoryName){
                itemsDone.push(item);
            } 
        } else {
            if(item.category.name != categoryName){
                itemsDone.push(item);
            } 
        }
      } else {
        if (itemsDone != undefined) {
            itemsDone.push(item);
          }
      }
    }
  }
  return itemsDone
}

function itemsPriceSort(itemA, itemB){
    if(itemA.lastLowPrice < itemB.lastLowPrice){
        return 1
    }
    if(itemA.lastLowPrice > itemB.lastLowPrice){
        return -1
    }
    return 0
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function quickFormat(number) {
    if (number > 1000000) {
      return ((number * 0.000001).toFixed(1)) + "m"
    }
    if (number > 1000) {
      return ((number * 0.001).toFixed(1)) + "k"
    }
    return number
  }


function setItemInfo(selectedItem, itemDiv){
    //var shortName = document.getElementById("itemShortName")
    var fullName = document.getElementById("itemFullName")
    var cost = document.getElementById("itemCost")
    var costPerSlot = document.getElementById("itemCostPerSlot")


    var therapistCost = document.getElementById("itemTherapistCost")
    var peacekeeperCost = document.getElementById("itemPeaceCost")
    var traderfleaDiff = document.getElementById("fleaCostDiffrence")
    
    let therThin = "Therapist Sell Price: ";

    therapistCost.innerHTML = "Cant sell to therapist";

    let sellToTraderPrice = -1

    for(i = 0; i < selectedItem.sellFor.length; i++){
      let cur = selectedItem.sellFor[i]
      if(cur.vendor.name == "Therapist"){
        therapistCost.innerHTML = therThin + '₽<mark>' + numberWithCommas(cur.price) + '</mark>'
        sellToTraderPrice = cur.price
        
      }
    }

    traderfleaDiff.innerHTML = "Sell to Flea vs Sell to Trader: 0"
    
    

    fullName.innerHTML = selectedItem.name
    //shortName.innerHTML = 'Short Name: <mark class="standout">' + selectedItem.shortName + "</mark>"

    var RealCost = 0

    console.log(itemDiv.dataset)

    if(itemDiv.dataset.avg == "true"){
        console.log("WORK!!!! PLEASE!!!")
        RealCost = selectedItem.avg24hPrice

        cost.innerHTML = "Average 24h flea price: ₽<mark>" + numberWithCommas(selectedItem.avg24hPrice) +  "</mark>"
    } else {
        RealCost = selectedItem.lastLowPrice

        cost.innerHTML = "Last lowest flea price: ₽<mark>" + numberWithCommas(selectedItem.lastLowPrice) +  "</mark>"
    }

    let fullDif = sellToTraderPrice - RealCost
    let markText

    if(fullDif < 0){
      markText = '<mark class="badPrice">'
    } 
    if(fullDif > 0) {
      markText = '<mark class="goodPrice">'
    }

    if(Math.abs(fullDif) < 5000){
      markText = '<mark class="okayPrice">'
    }

    if(sellToTraderPrice > -1){
      traderfleaDiff.innerHTML = "Sell to Trader Profit: ₽" + markText + numberWithCommas(sellToTraderPrice - RealCost) + "</mark>"
    }

    if(therapistCost.innerHTML == "Cant sell to therapist"){
      traderfleaDiff.innerHTML = ""; 
    }

    costPerSlot.innerHTML = "Price Per Slot: ₽<mark>" + numberWithCommas(Math.floor(RealCost / (selectedItem.width * selectedItem.height))) + "</mark>"
}

function addItemImage(item, targDiv, use24hr) {
    let itemDiv = document.createElement("div")
    let itemCost = document.createElement("div")

    if(use24hr == null){
        use24hr = false
    }

    itemDiv.className = "item"
    
    itemDiv.style.backgroundImage = "url("+ item.gridImageLink + ")"
    itemDiv.style.width = 64 * item.width + "px"
    itemDiv.style.height = 64 * item.height + "px"

    itemDiv.style.backgroundSize = itemDiv.style.width + " " + itemDiv.style.height

    itemCost.className = "itemText"
    itemCost.style.width = 64 * item.width + "px"
    itemCost.style.height = 64 * item.height + "px"

    if(use24hr == true) {
        itemCost.innerHTML = quickFormat(item.avg24hPrice)
    } else {
        itemCost.innerHTML = quickFormat(item.lastLowPrice)
    }

    itemCost.style.top = ((64 * item.height) - 20) + "px"

    itemDiv.dataset.fullName = item.name
    itemDiv.dataset.shortName = item.shortName
    itemDiv.dataset.avg = use24hr

    itemDiv.style.gridColumn = "span " + item.width
    itemDiv.style.gridRow = "span " + item.height

    //itemDiv.style.order = order
  
    targDiv.appendChild(itemDiv)
    itemDiv.appendChild(itemCost)

    itemDiv.onclick = function(){
        setItemInfo(item, itemDiv)
    }
}

function addItemsToDiv(data, div, use24hr){
    for(let i = 0; i < data.length; i++){
        let item = data[i]
        addItemImage(item, div, use24hr)
    }
}

function getSizesInOrder(itemData, filter, div, catfilter){
    addItemsToDiv(filterItems(itemData, filter, 1, 1, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 1, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 1, 2, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 2, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 3, 2, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 3, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 3, 3, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 1, 3, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 4, 2, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 4, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 4, 3, catfilter, true), div)
    addItemsToDiv(filterItems(itemData, filter, 5, 2, catfilter, true), div)
}


function FinishLoadingBarterItems(itemData){
    allBarterItems = itemData

    let firsts = filterItems(itemData, ["orange"], 1, 1)
    addItemsToDiv(firsts, document.getElementById("common"))
    getSizesInOrder(itemData, ["blue", "yellow", "grey", "default"], document.getElementById("common"))

    addItemsToDiv(filterItems(itemData, ["violet"], 2, 5), document.getElementById("rare"))
    getSizesInOrder(itemData, ["violet"], document.getElementById("rare"))
}

function FinishLoadingFoodItems(itemData){
    addItemsToDiv(filterItems(itemData, ["orange"], 1, 1), document.getElementById("food"))

    getSizesInOrder(itemData, ["blue", "yellow", "grey", "default", "violet"], document.getElementById("food"))
}

function FinishLoadingMedItems(itemData){
    addItemsToDiv(filterItems(itemData, ["orange"], 1, 1, "Stimulant").sort(itemsPriceSort), document.getElementById("meds"))

    getSizesInOrder(itemData, ["orange", "blue", "yellow", "grey", "default", "violet"], document.getElementById("meds"), "Stimulant")
}

function FinishLoadingKeyItems(itemData){
    addItemsToDiv(filterItems(itemData, ["orange", "blue", "yellow", "grey", "default", "violet"], 1, 1).sort(itemsPriceSort), document.getElementById("keys"), true)
}

async function FetchCategory(category, func){ // returns a data[] table with all the items
    setTimeout(2.5) // so we dont get ddos prevented from another fetch

    let lastBit = `]) {
        name
        shortName
        width
        height
        gridImageLink
        lastLowPrice
        fleaMarketFee
        avg24hPrice
        category {
          name
        }
        backgroundColor
        sellFor{
          currency,
          price,
          vendor{
            name
          }
        }
     }
    }`
    let outStr = `{
        items(categoryNames:[`+category+lastBit


    await fetch('https://api.tarkov.dev/graphql', {
            method: 'POST',

            headers: 
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
                body: JSON.stringify({
                query: outStr
                }
            )
        }).then(r => r.json()).then(r => func(r))
    console.log("Finished "+category)
}

FetchCategory("BarterItem, SpecialItem, Info, Jewelry, Fuel, Electronics", FinishLoadingBarterItems)
FetchCategory("FoodAndDrink", FinishLoadingFoodItems) //Mechanical Key
FetchCategory("Meds, Stimulant", FinishLoadingMedItems)
FetchCategory("Keycard, MechanicalKey", FinishLoadingKeyItems)