const title = document.querySelector(".lifestyle-item-column1 h1")
const image = document.querySelector(".lifestyle-images2")
const btnDot = document.querySelectorAll(".lifestyle-images--dots .dot")

btnDot[0].addEventListener("click", ()=>{
    title.textContent = "Previous Issues"
    image.style.opacity = "0"
    btnDot[1].style.backgroundColor = "#1A1C20"
    btnDot[0].style.backgroundColor = "#E0BB4C"
})

btnDot[1].addEventListener("click", ()=>{
    title.textContent = "Latest Issue"
    image.style.opacity = "1"
    btnDot[0].style.backgroundColor = "#1A1C20"
    btnDot[1].style.backgroundColor = "#E0BB4C"
})