var gridSize = 56;

var lastTime = Date.now();

var lastOffsetx = 0;
var lastOffsety = 0;

// Items that should not show up, but are still in the barter query category for some reason
var BlackList = ["BEAR", "USEC", "MB", "GPSA", "DSPT", "Repeater", "Dogtag"]

var requiredSize = 0;

// THIS IS A MESS I MADE IN ONE SITTING AT 3AM
// im trying to comment/fix it in prep for an attachments page

function gridResized(){
  let barters = document.getElementById("barterItems")
  let barters2 = document.getElementById("barterItems2")
  let gs = gridSize
  barters.style.width = (gs * Math.floor((document.body.clientWidth/2.1)/gs)) + "px"
  barters2.style.width = (gs * Math.floor((document.body.clientWidth/2.1)/gs)) + "px"
  
  console.log(barters.style.width)
}

function highlight(searchText){
  if(searchText == '' || searchText == undefined){
    for (const child of document.getElementById("barterItems").children) {
      child.style.filter = ""
    }
    for (const child of document.getElementById("barterItems2").children) {
      child.style.filter = ""
    }
    return
  }

  let fuzzy = document.getElementById("IsFuzzy").checked
  let result
  if(fuzzy){
    result = document.querySelectorAll('[id*="'+searchText+'"]');
  }else{
    result = document.querySelectorAll('[id^="'+searchText+'"]');
  }
  
  //filter: blur(5px);
  for (const child of document.getElementById("barterItems").children) {
    child.style.filter = "blur(4px)"
  }
  for (const child of document.getElementById("barterItems2").children) {
    child.style.filter = "blur(4px)"
  }
  
  for(let i=0; i<result.length; i++){
    result[i].style.filter = ""
  }
}

function textChanged(e){
  highlight(document.getElementById("SearchBar").value.toLowerCase())
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

function addItemImage(item, targDiv) {
  let itemText = document.createElement("div")
  let itemImg = document.createElement("img")
  let tempDiv = document.createElement("div")
  
  itemImg.src = item.gridImageLink
  itemImg.style.width = gridSize * item.width + "px"
  itemImg.style.height = gridSize * item.height + "px"

  tempDiv.style.display = "block"
  tempDiv.style.alignItems = "flex"
  tempDiv.style.width = gridSize * item.width + "px"
  tempDiv.style.height = gridSize * item.height + "px"
  tempDiv.style.padding = gridSize * 1
  tempDiv.id = item.shortName.toLowerCase()

  tempDiv.style.gridColumn = "span " + item.width
  tempDiv.style.gridRow = "span " + item.height

  tempDiv.title = item.name

  itemText.id = "priceText"
  itemText.style.width = gridSize
  itemText.style.height = gridSize
  let price = item.lastLowPrice
  let lastHighest = -100000
    
  if(price == 0 || price == undefined){
    for(let i=0; i<item.sellFor.length; i++){
      if(item.sellFor[i].price > lastHighest){
        lastHighest = item.sellFor[i].price
      }
    }
    price = lastHighest
  }
  
  
  itemText.innerHTML = quickFormat(price)

  
  tempDiv.appendChild(itemText)
  tempDiv.appendChild(itemImg)
  document.getElementById(targDiv).appendChild(tempDiv)
}

function itemFilter(item, colors, width, height, elementsDone) { // Returns true/false if an item matches a filter.
  if (elementsDone == undefined) {
    elementsDone = []
  }
  let colorCorrect = false
  for (let i = 0; i < colors.length; i++) {
    if (item.backgroundColor == colors[i]) {
      colorCorrect = true
      break
    }
  }
  for (let i = 0; i<BlackList.length; i++){
    if(item.shortName == BlackList[i]){
      return false
    }
  }

  return ((item.height <= height && item.width <= width) && colorCorrect && elementsDone.indexOf(item.name) == -1)
}

function filterItems(targDiv, data, colors, width, height, itemsDone) { // adds items to a div if they match a filter, and are not in the itemsDone array
  for (let i = 0; i < data.data.items.length; i++) { // For the 1x1s that are not special
    let item = data.data.items[i]

    if (itemFilter(item, colors, width, height, itemsDone)) {
      addItemImage(item, targDiv)
      if (itemsDone != undefined) {
        itemsDone.push(item.name)
      }
    }
  }
}

function runInsertFood(data, targDiv) { // Same as runInsertBarter, but for the food items, split off for readability.
  let ItemsDone = []

  filterItems(targDiv, data, ["orange"], 1, 1, ItemsDone) // puts stims at the top of the consumables list

  filterItems(targDiv, data, ["blue", "yellow", "grey", "default"], 1, 1, ItemsDone)
  filterItems(targDiv, data, ["blue", "yellow", "grey", "default"], 2, 1, ItemsDone)
  filterItems(targDiv, data, ["blue", "yellow", "grey", "default"], 1, 2, ItemsDone)
  filterItems(targDiv, data, ["blue", "yellow", "grey", "default"], 2, 2, ItemsDone)
  filterItems(targDiv, data, ["blue", "yellow", "grey", "default"], 55, 55, ItemsDone)

  ItemsDone = []

  filterItems(targDiv, data, ["violet"], 1, 1, ItemsDone)
  filterItems(targDiv, data, ["violet"], 2, 1, ItemsDone)
  filterItems(targDiv, data, ["violet"], 1, 2, ItemsDone)
  filterItems(targDiv, data, ["violet"], 2, 2, ItemsDone)
  filterItems(targDiv, data, ["violet"], 55, 55, ItemsDone)
}

function runInsertBarter(data, targDivA, targDivB) {
  let ItemsDoneDivA = [] // Below orders the items into a div, also keeps track of done items to prevent repeats of the same item

  filterItems(targDivA, data, ["blue", "grey", "red", "orange"], 1, 1, ItemsDoneDivA)
  filterItems(targDivA, data, ["blue", "grey", "orange"], 2, 1, ItemsDoneDivA)
  filterItems(targDivA, data, ["blue", "grey", "red", "green", "orange"], 1, 2, ItemsDoneDivA)
  filterItems(targDivA, data, ["blue", "grey", "red", "green", "orange"], 1, 3, ItemsDoneDivA)
  filterItems(targDivA, data, ["blue", "grey", "orange"], 2, 2, ItemsDoneDivA)
  filterItems(targDivA, data, ["yellow"], 55, 55, ItemsDoneDivA)
  filterItems(targDivA, data, ["blue", "grey", "orange"], 55, 55, ItemsDoneDivA)

  ItemsDoneDivA = [] // Same as above but for the right side of the screen.
  
  filterItems(targDivB, data, ["violet"], 1, 1, ItemsDoneDivA)
  filterItems(targDivB, data, ["violet"], 2, 1, ItemsDoneDivA)
  filterItems(targDivB, data, ["violet"], 1, 2, ItemsDoneDivA)
  filterItems(targDivB, data, ["violet"], 2, 2, ItemsDoneDivA)
  filterItems(targDivB, data, ["violet"], 55, 55, ItemsDoneDivA)

  foodAndStimsFetch()
}

function foodAndStimsFetch(){
  setTimeout(2.5) // so we dont get ddos prevented from another fetch
  fetch('https://api.tarkov.dev/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `{
            items(categoryNames:[FoodAndDrink, Stimulant]) {
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
          }`})
      })
        .then(r => r.json())
      .then(data => runInsertFood(data, "barterItems2"))
}

function barterItemsFetch(){ // Fetch and display barter items.
  if(Date.now() - lastTime > 5000){
    // attempt to prevent spamming
    console.log(Date.now() - lastTime)
    lastTime = Date.now()
  }else{
    return;
  }
  
  document.getElementById("barterItems").innerHTML = ''
  document.getElementById("barterItems2").innerHTML = ''
  
  fetch('https://api.tarkov.dev/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        items(categoryNames:[BarterItem, SpecialItem, Info, Jewelry, Fuel, Electronics]) {
              name
              shortName
              width
              height
              gridImageLink
              lastLowPrice
              avg24hPrice
              backgroundColor
              sellFor{
                price
                vendor{name:name}
              }
          }
      }`
    })
  })
    .then(r => r.json())
    .then(data => runInsertBarter(data, "barterItems", "barterItems2"))
}

// For resizing stuffs
gridResized()
window.onresize = gridResized

// Searchbar and fuzzy things
document.getElementById("SearchBar").addEventListener('input', textChanged)
document.getElementById("IsFuzzy").addEventListener('change', textChanged)

// Setup the barter items!
lastTime = 0
barterItemsFetch()