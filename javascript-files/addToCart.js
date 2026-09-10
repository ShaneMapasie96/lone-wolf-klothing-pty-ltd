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
    const designSelect = itemContainer.querySelector('select[name="design"]');
    const size = sizeSelect ? sizeSelect.value : 'N/A';
    const quantity = quantitySelect ? quantitySelect.value : '1';
    const design = designSelect ? designSelect.value : 'Standard';

    // Resolve selected color from the color swatch; fallback to current image filename
    const selectedColor = itemContainer.querySelector('.colors .selected-color, .colors .selected');
    const namedColor = selectedColor ? selectedColor.getAttribute('data-color') : null;
    const colorImagePath = selectedColor ? selectedColor.getAttribute('data-img') : productImage.getAttribute('src');
    const color = namedColor || (colorImagePath ? colorImagePath.split('/').pop() : 'Default');

    // Construct message with each input field on its own line
    const fullMessage = 'Design: ' + design + '\nSize: ' + size + '\nQuantity: ' + quantity + '\nColor: ' + color;

    // Encode the message for use in a URL
    const encodedMessage = encodeURIComponent(fullMessage);

    // Prepare the WhatsApp link with the pre-filled message
    const whatsappLink = 'https://wa.me/27615816059?text=' + encodedMessage;

    // Open WhatsApp with the pre-filled message
    window.open(whatsappLink, '_blank');
}

function getProductType(itemContainer, productImage) {
    if (itemContainer && itemContainer.closest('.tracksuits-container')) {
        return 'Tracksuits';
    }

    const heading = itemContainer.querySelector('h3');
    const headingText = heading ? heading.textContent.trim() : '';

    if (/t-?shirts?/i.test(headingText)) {
        return 'T-Shirts';
    }
    if (/golfers?/i.test(headingText)) {
        return 'Golfers';
    }
    if (/hoodies?/i.test(headingText)) {
        return 'Hoodies';
    }
    if (/sweaters?/i.test(headingText)) {
        return 'Sweaters';
    }
    if (/crews?/i.test(headingText)) {
        return 'Crews';
    }
    if (/sweatpants?/i.test(headingText)) {
        return 'Sweatpants';
    }
    if (/shorts?/i.test(headingText)) {
        return 'Shorts';
    }
    if (/beanies?/i.test(headingText)) {
        return 'Beanies';
    }
    if (/bucket\s*hats?/i.test(headingText)) {
        return 'Bucket Hats';
    }

    const src = productImage ? (productImage.getAttribute('src') || '') : '';
    if (/t-shirts/i.test(src)) {
        return 'T-Shirts';
    }
    if (/golfers/i.test(src)) {
        return 'Golfers';
    }
    if (/hoodie/i.test(src)) {
        return 'Hoodies';
    }
    if (/sweater/i.test(src)) {
        return 'Sweaters';
    }
    if (/sweatpants/i.test(src)) {
        return 'Sweatpants';
    }
    if (/shorts/i.test(src)) {
        return 'Shorts';
    }
    if (/beanie/i.test(src)) {
        return 'Beanies';
    }
    if (/bucket\s*hats?/i.test(src)) {
        return 'Bucket Hats';
    }

    return 'Item';
}

function ensureDesignSelector(itemContainer) {
    if (!itemContainer || itemContainer.querySelector('select[name="design"]')) {
        return;
    }

    const productImage = itemContainer.querySelector('img');
    const productType = getProductType(itemContainer, productImage);
    const isOuterwear = Boolean(itemContainer.closest('.outerwear-container'));
    const isTracksuit = Boolean(itemContainer.closest('.tracksuits-container'));
    const designOptions = [
        'Lone Wolf Emblem - ' + productType,
        'Wolf Head - ' + productType,
        'Lone Wolf Typography - ' + productType
    ];

    if (!isOuterwear && !['Golfers', 'Sweatpants', 'Shorts', 'Tracksuits', 'Beanies'].includes(productType)) {
        designOptions.push('Isolation Breeds Growth - ' + productType);
    }

    if (['T-Shirts', 'Hoodies', 'Sweaters'].includes(productType)) {
        designOptions.push('A4 Lone Wolf Emblem - ' + productType);
    }

    const buyContainer = itemContainer.querySelector('.buy_container');
    const actionButton = itemContainer.querySelector('.add-to-cart-button');
    if (!buyContainer || !actionButton) {
        return;
    }

    const selectorRow = document.createElement('div');
    selectorRow.className = 'design-selector-row';

    const label = document.createElement('label');
    label.setAttribute('for', 'design-select-' + Math.random().toString(36).slice(2, 9));
    label.textContent = 'Design:';

    const select = document.createElement('select');
    select.name = 'design';
    select.id = label.getAttribute('for');
    select.className = 'input-style';

    if (isTracksuit) {
        select.addEventListener('change', function () {
            if (typeof updateTracksuitDesign === 'function') {
                updateTracksuitDesign(this);
            }
        });
    }

    if (itemContainer.closest('.beanies-container')) {
        select.addEventListener('change', function () {
            if (typeof updateBeanieDesign === 'function') {
                updateBeanieDesign(this);
            }
        });
    }

    designOptions.forEach(function (optionValue) {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        select.appendChild(option);
    });

    selectorRow.appendChild(label);
    selectorRow.appendChild(select);
    buyContainer.insertBefore(selectorRow, actionButton);
}

// Keep a selected swatch state per product card for cart lookups
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.item').forEach(function (item) {
        ensureDesignSelector(item);

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
