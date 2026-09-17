const heroImages = [...document.querySelectorAll('.hero-image')];
const heroButtons = [...document.querySelectorAll('.hero-image-button')];

heroButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedIndex = Number(button.dataset.heroImage);

        heroImages.forEach((image, index) => {
            if (index === selectedIndex && image.dataset.src) {
                image.src = image.dataset.src;
                delete image.dataset.src;
            }
            image.hidden = index !== selectedIndex;
        });

        heroButtons.forEach((option, index) => {
            option.setAttribute('aria-pressed', String(index === selectedIndex));
        });
    });
});
