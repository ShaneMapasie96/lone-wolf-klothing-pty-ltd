// Function to handle adding items to cart and sending to WhatsApp
function addToCart(itemId) {
    const productImage = document.getElementById(itemId);
    if (!productImage) {
        return;
    }

    // Find the relevant item container based on the provided itemId
    const itemContainer = productImage.closest('.item');
    if (!itemContainer) {
        return;
    }

    // Retrieve selected size and quantity scoped to this item card
    const sizeSelect = itemContainer.querySelector('select[name="size"]');
    const quantitySelect = itemContainer.querySelector('select[name="quantity"]');
    const size = sizeSelect ? sizeSelect.value : 'N/A';
    const quantity = quantitySelect ? quantitySelect.value : '1';

    // Resolve selected color from the color swatch; fallback to current image filename
    const selectedColor = itemContainer.querySelector('.colors .selected-color, .colors .selected');
    const colorImagePath = selectedColor ? selectedColor.getAttribute('data-img') : productImage.getAttribute('src');
    const color = colorImagePath ? colorImagePath.split('/').pop() : 'Default';

    // Construct message with each input field on its own line
    const fullMessage = 'Size: ' + size + '\nQuantity: ' + quantity + '\nColor: ' + color;

    // Encode the message for use in a URL
    const encodedMessage = encodeURIComponent(fullMessage);

    // Prepare the WhatsApp link with the pre-filled message
    const whatsappLink = 'https://wa.me/27610500641?text=' + encodedMessage;

    // Open WhatsApp with the pre-filled message
    window.open(whatsappLink, '_blank');
}

// Keep a selected swatch state per product card for cart lookups
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.item').forEach(function (item) {
        const colors = item.querySelectorAll('.colors .color');
        if (colors.length > 0) {
            colors[0].classList.add('selected-color');
        }

        colors.forEach(function (color) {
            color.addEventListener('click', function () {
                colors.forEach(function (c) {
                    c.classList.remove('selected-color');
                    c.classList.remove('selected');
                });
                color.classList.add('selected-color');
            });
        });
    });
});
