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
    if (/vests?/i.test(headingText)) {
        return 'Vests';
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
    if (/6-panel\s*caps?/i.test(headingText)) {
        return '6-Panel Caps';
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
    if (/6-panel[-\s]caps?/i.test(src)) {
        return '6-Panel Caps';
    }
    if (/vests?/i.test(src)) {
        return 'Vests';
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
    const isCap = productType === '6-Panel Caps';
    const isCrewneck = productType === 'Crews';
    const isSweatpants = productType === 'Sweatpants';
    const isShorts = productType === 'Shorts';
    const isVest = productType === 'Vests';
    const isTShirtOrHoodie = ['T-Shirts', 'Hoodies', 'Crewnecks'].includes(productType);
    const isHoodie = productType === 'Hoodies';
    const designOptions = [];

    // Add design options based on product type
    if (productType === 'Hoodies' || isCrewneck) {
        designOptions.push('Lone Wolf Emblem - Large Print - ' + productType);
        designOptions.push('Lone Wolf Emblem - Pocket Size - ' + productType);
        designOptions.push('Wolf Head - ' + productType);
        designOptions.push('Lone Wolf Typography - ' + productType);
        designOptions.push('Isolation Breeds Growth - ' + productType);
    } else if (isTracksuit) {
        designOptions.push('Lone Wolf Emblem - Large Print - ' + productType);
        designOptions.push('Lone Wolf Emblem - Pocket Size - ' + productType);
        designOptions.push('Wolf Head - ' + productType);
        designOptions.push('Lone Wolf Typography - ' + productType);
    } else {
        if (!isHoodie) {
            designOptions.push('Wolf Head - ' + productType);
            designOptions.push('Lone Wolf Typography - ' + productType);
        }

        if (!isCap) {
            if (isTShirtOrHoodie) {
                designOptions.unshift('Lone Wolf Emblem - Pocket Size - ' + productType);
                designOptions.unshift('Lone Wolf Emblem - Large Print - ' + productType);
            } else {
                designOptions.unshift('Lone Wolf Emblem - ' + productType);
            }
        }

        if (!isCap && !isOuterwear && !['Golfers', 'Sweatpants', 'Shorts', 'Tracksuits', 'Beanies', 'Bucket Hats', 'Vests', 'Hoodies', 'Crewnecks'].includes(productType)) {
            designOptions.push('Isolation Breeds Growth - ' + productType);
        }
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

    if (isSweatpants) {
        select.addEventListener('change', function () {
            if (typeof updateSweatpantsDesign === 'function') {
                updateSweatpantsDesign(this);
            }
        });
    }

    if (isShorts) {
        select.addEventListener('change', function () {
            if (typeof updateShortsDesign === 'function') {
                updateShortsDesign(this);
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

    if (itemContainer.closest('.bucket-hats-item')) {
        select.addEventListener('change', function () {
            if (typeof updateBucketHatDesign === 'function') {
                updateBucketHatDesign(this);
            }
        });
    }

    if (isVest) {
        select.addEventListener('change', function () {
            if (typeof updateVestDesign === 'function') {
                updateVestDesign(this);
            }
        });
    }

    if (isCap) {
        select.addEventListener('change', function () {
            if (typeof updateCapDesign === 'function') {
                updateCapDesign(this);
            }
        });
    }

    // Add hoodie design handler
    if (isHoodie) {
        select.addEventListener('change', function () {
            if (typeof updateHoodieDesign === 'function') {
                updateHoodieDesign(this);
            }
        });
    }

    if (isCrewneck) {
        select.addEventListener('change', function () {
            if (typeof updateCrewneckDesign === 'function') {
                updateCrewneckDesign(this);
            }
        });
    }

    // Add price update logic for T-Shirts only (Hoodies handle their own via updateHoodieDesign)
    if (productType === 'T-Shirts') {
        select.addEventListener('change', function () {
            const priceElement = itemContainer.querySelector('.price');
            if (priceElement) {
                if (/large print|isolation breeds growth/i.test(this.value)) {
                    priceElement.textContent = 'R299.95';
                } else if (/pocket size|wolf head|typography/i.test(this.value)) {
                    priceElement.textContent = 'R249.95';
                }
            }
        });
    }

    designOptions.forEach(function (optionValue) {
        const option = document.createElement('option');
        option.value = optionValue;
        const categorySuffix = ' - ' + productType;
        option.textContent = optionValue.endsWith(categorySuffix)
            ? optionValue.slice(0, -categorySuffix.length)
            : optionValue;
        select.appendChild(option);
    });

    selectorRow.appendChild(label);
    selectorRow.appendChild(select);
    buyContainer.insertBefore(selectorRow, actionButton);

    // Set initial price based on first selected design option
    if (isTShirtOrHoodie && select.options.length > 0) {
        const firstOption = select.options[0].value;
        const priceElement = itemContainer.querySelector('.price');
        if (priceElement) {
            if (/large print|isolation breeds growth/i.test(firstOption)) {
                priceElement.textContent = 'R299.95';
            } else if (/pocket size|wolf head|typography/i.test(firstOption)) {
                priceElement.textContent = 'R249.95';
            }
        }
    }

    if (isCap && typeof updateCapDesign === 'function') {
        updateCapDesign(select);
    }

    if (isVest && typeof updateVestDesign === 'function') {
        window.setTimeout(function () {
            updateVestDesign(select);
        }, 0);
    }

    if (isHoodie && typeof updateHoodieDesign === 'function') {
        window.setTimeout(function () {
            updateHoodieDesign(select);
        }, 0);
    }

    if (isCrewneck && typeof updateCrewneckDesign === 'function') {
        window.setTimeout(function () {
            updateCrewneckDesign(select);
        }, 0);
    }
}

// Keep a selected swatch state per product card for cart lookups
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.item').forEach(function (item) {
        ensureDesignSelector(item);

        const colors = item.querySelectorAll('.colors .color');
        if (colors.length > 0) {
            colors[0].classList.add('selected-color');
            colors[0].classList.add('selected');
        }

        colors.forEach(function (color) {
            color.addEventListener('click', function () {
                colors.forEach(function (c) {
                    c.classList.remove('selected-color');
                    c.classList.remove('selected');
                });
                color.classList.add('selected-color');
                color.classList.add('selected');
            });
        });

        const vestDesign = item.querySelector('select#vest-design');
        if (vestDesign && typeof updateVestDesign === 'function') {
            vestDesign.addEventListener('change', function () {
                updateVestDesign(this);
            });
            updateVestDesign(vestDesign);
        }
    });
});
