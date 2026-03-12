/*
Selecciona todas las paletas
*/
const paletas = document.querySelectorAll(".icono");

paletas.forEach(paleta => {

    paleta.addEventListener("click", function() {

        const idPaleta = this.dataset.id;

        let col1, col2, col3;

        if (idPaleta == 1) {
            col1 = "#187999";
            col2 = "#ffffe7";
            col3 = "#e3ad6f";

        } else if (idPaleta == 2) {
            col1 = "#2476fe";
            col2 = "#ffffe7";
            col3 = "#2ce9b6";

        } else if (idPaleta == 3) {
            col1 = "#75eeff";
            col2 = "#b6ffc7";
            col3 = "#ffff55";

        } else if (idPaleta == 4) {
            col1 = "#e2baba";
            col2 = "#ffffe7";
            col3 = "#f2b2b2";

        } else if (idPaleta == 5) {
            col1 = "#feb6b9";
            col2 = "#fae4d9";
            col3 = "#bbded7";

        } else if (idPaleta == 6) {
            col1 = "#f9f6d0";
            col2 = "#eddfb8";
            col3 = "#bbbbbb";
        }
        /*
        CAMBIAR VARIABLES ROOT
        */
        document.documentElement.style.setProperty("--color1", col1);
        document.documentElement.style.setProperty("--color2", col2);
        document.documentElement.style.setProperty("--color3", col3);
    });

});