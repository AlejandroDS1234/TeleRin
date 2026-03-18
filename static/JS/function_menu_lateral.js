let pagina = document.getElementsByTagName("main")[0].id

let menu_lateral = document.getElementById("menu_lateral")
let liS = Array.from(menu_lateral.getElementsByTagName("li"))

liS.forEach(li => {
    let liPagina = li.id
    if (liPagina == pagina) {
        let svg = li.querySelector("svg")
        li.style.borderBottom = "1px solid var(--color3)"
        li.style.padding = "20%"
        svg.style.fill = "var(--color3)"
        svg.style.stroke = "var(--color_bordes)" 
    } 
    
});

