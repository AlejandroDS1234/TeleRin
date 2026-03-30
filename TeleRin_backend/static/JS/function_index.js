console.clear();
const texto = document.querySelector(".hii")
const letras = texto.dataset.titulo.split("")

texto.textContent = ""

letras.forEach((letra)=>{
    const l = document.createElementNS("http://www.w3.org/2000/svg", "tspan")
    l.textContent = letra
    texto.appendChild(l)
})

const tl = gsap.timeline({
    repeat: 0,
    repeatDelay: 0.5,
    defaults: { duration: 0.6, ease: "power2.inOut" }
});

const mensajePromocional = document.getElementById("mensaje_promocional")


gsap.set("#target1", { rotation: 45, svgOrigin: "50 50" });
gsap.set("#target2", { rotation: 135, svgOrigin: "50 50" });
tl.to("line", { attr: { x2: 100 } });
tl.to("#target1", { rotation: 0 }, "turn");
tl.to("#target2", { rotation: 180 }, "turn");
tl.to("#target1", { y: -20 }, "move");
tl.to("#target2", { y: 20 }, "move");
tl.to("#theSquare", { attr: { height: 30, y: 35 } }, "move");
tl.to("line", { attr: { x1: 50, x2: 50 } });


tl.set(".hii", {visibility: "visible"})
tl.set(".hii tspan", {opacity: 0})
tl.to(".hii tspan", {
    opacity: 1,
    duration: 0.05,
    stagger: 0.1,
    ease: "none"
})

tl.fromTo("#mensaje_promocional",
    {opacity: 0},
    {opacity: 1, duration: 1}
)

tl.to(".degradado", {
    opacity: 1,
    duration: 1,
    ease: "power2.inOut"
}, "-=0.9")

tl.to("#enlaces", {
    height: 20,
    duration: 0.8,
    ease: "power2.inOut"
}, "-=0.8")