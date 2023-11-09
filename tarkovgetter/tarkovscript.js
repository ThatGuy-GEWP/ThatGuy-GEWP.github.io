var gridSize = 56;

var lastTime = Date.now();

var lastOffsetx = 0;
var lastOffsety = 0;

var BlackList = ["BEAR", "USEC", "MB", "GPSA", "DSPT", "Repeater", "Dogtag"]

var requiredSize = 0;

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

gridResized()
window.onresize = gridResized
document.getElementById("SearchBar").addEventListener('input', textChanged)
document.getElementById("IsFuzzy").addEventListener('change', textChanged)

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
  let testText = document.createElement("div")
  let testImg = document.createElement("img")
  let tempDiv = document.createElement("div")
  
  testImg.src = item.gridImageLink
  testImg.style.width = gridSize * item.width + "px"
  testImg.style.height = gridSize * item.height + "px"

  tempDiv.style.display = "block"
  tempDiv.style.alignItems = "flex"
  tempDiv.style.width = gridSize * item.width + "px"
  tempDiv.style.height = gridSize * item.height + "px"
  tempDiv.style.padding = gridSize * 1
  tempDiv.id = item.shortName.toLowerCase()

  tempDiv.style.gridColumn = "span " + item.width
  tempDiv.style.gridRow = "span " + item.height

  testText.id = "priceText"
  testText.style.width = gridSize
  testText.style.height = gridSize
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
  
  
  testText.innerHTML = quickFormat(price)

  
  tempDiv.appendChild(testText)
  tempDiv.appendChild(testImg)
  document.getElementById(targDiv).appendChild(tempDiv)
}

function itemFilter(item, colors, width, height, elementsDone) {
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

function filterItems(targDiv, data, colors, width, height, itemsDone) {
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

function runInsertBarter(data, targDivA, targDivB) {
  let ItemsDone = []

  filterItems(targDivA, data, ["blue", "grey", "orange"], 1, 1, ItemsDone)
  filterItems(targDivA, data, ["blue", "grey", "orange"], 2, 1, ItemsDone)
  filterItems(targDivA, data, ["blue", "grey", "red", "green", "orange"], 1, 2, ItemsDone)
  filterItems(targDivA, data, ["blue", "grey", "orange"], 2, 2, ItemsDone)
  filterItems(targDivA, data, ["blue", "grey", "orange"], 55, 55, ItemsDone)

  ItemsDone = []

  filterItems(targDivB, data, ["violet"], 1, 1, ItemsDone)
  filterItems(targDivB, data, ["violet"], 2, 1, ItemsDone)
  filterItems(targDivB, data, ["violet"], 1, 2, ItemsDone)
  filterItems(targDivB, data, ["violet"], 2, 2, ItemsDone)
  filterItems(targDivB, data, ["violet"], 55, 55, ItemsDone)

  afterFetch()
}

function runInsert(data, targDiv) {
  let ItemsDone = []

  filterItems(targDiv, data, ["blue", "grey", "default", "orange"], 1, 1, ItemsDone)
  filterItems(targDiv, data, ["blue", "grey", "default", "orange"], 2, 1, ItemsDone)
  filterItems(targDiv, data, ["blue", "grey", "default", "orange"], 1, 2, ItemsDone)
  filterItems(targDiv, data, ["blue", "grey", "default", "orange"], 2, 2, ItemsDone)
  filterItems(targDiv, data, ["blue", "grey", "default", "orange"], 55, 55, ItemsDone)

  ItemsDone = []

  filterItems(targDiv, data, ["violet"], 1, 1, ItemsDone)
  filterItems(targDiv, data, ["violet"], 2, 1, ItemsDone)
  filterItems(targDiv, data, ["violet"], 1, 2, ItemsDone)
  filterItems(targDiv, data, ["violet"], 2, 2, ItemsDone)
  filterItems(targDiv, data, ["violet"], 55, 55, ItemsDone)
}

function afterFetch(){
  setTimeout(5)
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
      .then(data => runInsert(data, "barterItems2"))
}

function getItems(){
  if(Date.now() - lastTime > 1000){
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
      items(categoryNames:[BarterItem, SpecialItem, Info, Jewelry]) {
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
  }`})
  })
    .then(r => r.json())
    .then(data => runInsertBarter(data, "barterItems", "barterItems2"))
}
lastTime = 0
getItems()