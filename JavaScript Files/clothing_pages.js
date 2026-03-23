// Function to change the image source based on selected color
function changeImage(imgId, newSrc) {
    const imgElement = document.getElementById(imgId);
    if (imgElement) {
        imgElement.src = newSrc;
    }
}

// Function to handle color selection
function handleColorSelection(colorElement, imgId) {
    const newImageSrc = colorElement.getAttribute('data-img');
    changeImage(imgId, newImageSrc);

    // Deselect all colors
    const allColorElements = colorElement.parentElement.children;
    Array.from(allColorElements).forEach((element) => {
        element.classList.remove('selected-color');
    });

    // Select the clicked color
    colorElement.classList.add('selected-color');
}

// Add click event listeners to all color elements after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const allColorElements = document.querySelectorAll('.color');
    allColorElements.forEach((colorElement) => {
        colorElement.addEventListener('click', function () {
            const imgId = colorElement.closest('.item').querySelector('img').id;
            handleColorSelection(colorElement, imgId);
        });
    });
});
