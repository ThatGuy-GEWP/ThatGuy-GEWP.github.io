// Items that should not show up, but are still in the barter query category for some reason
var BlackList = ["BEAR", "USEC", "MB", "GPSA", "DSPT", "Repeater", "Dogtag", "Sacred Amulet", "Amulet"]

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

  if (item.lastLowPrice <= 0) {
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

function filterItems(data, colors, width, height) {
  let itemsDone = []

  // adds items to a div if they match a filter, and are not in the itemsDone array
  for (let i = 0; i < data.data.items.length; i++) {
    // For the 1x1s that are not special
    let item = data.data.items[i];

    if (itemFilter(item, colors, width, height, itemsDone)) {
      if (itemsDone != undefined) {
        itemsDone.push(item);
      }
    }
  }
  return itemsDone
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function setItemInfo(selectedItem){
    var shortName = document.getElementById("itemShortName")
    var fullName = document.getElementById("itemFullName")
    var cost = document.getElementById("itemCost")
    var costPerSlot = document.getElementById("itemCostPerSlot")

    fullName.innerHTML = selectedItem.name
    shortName.innerHTML = "Short Name: " + selectedItem.shortName
    cost.innerHTML = "Last lowest flea price: ₽" + numberWithCommas(selectedItem.lastLowPrice)

    if(selectedItem.width == 1 && selectedItem.height == 1){
        costPerSlot.innerHTML = "&nbsp;"
        return
    }

    costPerSlot.innerHTML = "Price Per Slot: ₽" + numberWithCommas(Math.floor(selectedItem.lastLowPrice / (selectedItem.width * selectedItem.height)))
}

function addItemImage(item, targDiv, order) {
    let itemDiv = document.createElement("div")
    itemDiv.className = "item"
    
    itemDiv.style.backgroundImage = "url("+ item.gridImageLink + ")"
    itemDiv.style.width = 64 * item.width + "px"
    itemDiv.style.height = 64 * item.height + "px"

    itemDiv.onclick = function(){
        setItemInfo(item)
    }

    itemDiv.style.gridColumn = "span " + item.width
    itemDiv.style.gridRow = "span " + item.height

    //itemDiv.style.order = order
  
    targDiv.appendChild(itemDiv)
}

function addItemsToDiv(data, div){
    for(let i = 0; i < data.length; i++){
        let item = data[i]
        addItemImage(item, div, 0)
    }
}

function getSizesInOrder(itemData, filter, div){
    addItemsToDiv(filterItems(itemData, filter, 1, 1), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 1), div)
    addItemsToDiv(filterItems(itemData, filter, 1, 2), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 2), div)
    addItemsToDiv(filterItems(itemData, filter, 3, 2), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 3), div)
    addItemsToDiv(filterItems(itemData, filter, 3, 3), div)
    addItemsToDiv(filterItems(itemData, filter, 1, 3), div)
    addItemsToDiv(filterItems(itemData, filter, 4, 2), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 4), div)
    addItemsToDiv(filterItems(itemData, filter, 4, 3), div)
    addItemsToDiv(filterItems(itemData, filter, 5, 2), div)
    addItemsToDiv(filterItems(itemData, filter, 2, 5), div)
}


function FinalizeLoad(itemData){
    allBarterItems = itemData

    addItemsToDiv(filterItems(itemData, ["orange"], 1, 1), document.getElementById("common"))
    getSizesInOrder(itemData, ["blue", "yellow", "grey", "default"], document.getElementById("common"))

    getSizesInOrder(itemData, ["violet"], document.getElementById("rare"))
}

function FetchCategory(category){ // returns a data[] table with all the items
    setTimeout(2.5) // so we dont get ddos prevented from another fetch

    let lastBit = `]) {
        name
        shortName
        width
        height
        gridImageLink
        avg24hPrice
        lastLowPrice
        backgroundColor
        sellFor{
          price
          vendor{name:name}
        }
     }
    }`
    let outStr = `{
        items(categoryNames:[`+category+lastBit


    fetch('https://api.tarkov.dev/graphql', {
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
        }).then(r => r.json()).then(r => FinalizeLoad(r))
}

FetchCategory("BarterItem, SpecialItem, Info, Jewelry, Fuel, Electronics")