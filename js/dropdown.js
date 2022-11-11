const drop_btn = document.querySelectorAll('.dropdown-title')
const drop_content = document.querySelectorAll('.dropdown-content')
const dropdown_arrow = document.querySelectorAll('#dropdown-arrow')

for (let index = 0; index < drop_btn.length; index++) {
  drop_btn[index].addEventListener('click', ()=>{
    drop_content[index].classList.toggle('open-dropdown')
    dropdown_arrow[index].classList.toggle('rotate-arrow')
  })
}