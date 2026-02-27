let pagina = document.getElementsByTagName("main")[0].id

let menu_lateral = document.getElementById("menu_lateral")
let liS = Array.from(menu_lateral.getElementsByTagName("li"))

console.log(typeof(liS))
console.log(liS)

liS.forEach(li => {
    let liPagina = li.id
    if (liPagina == pagina) {
        let svg = li.querySelector("svg")
        li.style.borderBottom = "1px solid var(--color_letras_claras)"
        li.style.padding = "20%"
        svg.style.fill = "var(--color_contraste_claro)"
        svg.style.stroke = "var(--color_bordes)"
    } 
    
});
