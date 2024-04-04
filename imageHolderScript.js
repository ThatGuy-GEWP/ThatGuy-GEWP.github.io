let images = document.getElementsByClassName("imageHolderImg")

let modal = document.getElementById("modal")
let modalImage = document.getElementById("modalImage")


modal.onclick = function() {
    modal.style.display = "none"
    modalImage.style.display = "none"
}

function onClickFunc(imgsrc){
    modal.style.display = "block"
    modalImage.src = imgsrc.src
    modalImage.style.display = "block"
}

// for(i = 0; i < images.length; i++){
//     let curImg = images[i]
//     curImg.onclick = "onClickFunc(this)"
// }