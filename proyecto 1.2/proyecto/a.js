var swiper = new Swiper(".mySwiper", {
    loop: true, // Hace que el carrusel sea infinito
    autoplay: {
        delay: 3000, // Cambia cada 3 segundos
        disableOnInteraction: false, // Sigue el autoplay después de interactuar
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});
