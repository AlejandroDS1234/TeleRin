let sagas = document.querySelectorAll(".libro_saga")
sagas.forEach(saga => {
    saga.addEventListener("click", () => {
        let id_historia = saga.getAttribute("data-id")
        window.location.href = `/historia/${id_historia}`
    })
})