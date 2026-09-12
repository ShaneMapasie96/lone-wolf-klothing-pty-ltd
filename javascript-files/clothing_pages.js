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
    if (newImageSrc) {
        changeImage(imgId, newImageSrc);
    }

    // Deselect all colors
    const allColorElements = colorElement.parentElement.children;
    Array.from(allColorElements).forEach((element) => {
        element.classList.remove('selected-color');
    });

    // Select the clicked color
    colorElement.classList.add('selected-color');
}

// Show prev/next navigation when a swatch has multiple image variants
function showVariantNav(item, variants) {
    removeVariantNav(item);
    variants = variants.map(function (variant) {
        return variant.trim();
    }).filter(Boolean);
    if (variants.length === 0) return;

    item._variantIndex = 0;
    item._variants = variants;

    const imgEl = item.querySelector('img');
    imgEl.src = variants[0];

    if (variants.length <= 1) return;

    const figure = item.querySelector('figure');
    const nav = document.createElement('div');
    nav.className = 'variant-nav';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'variant-btn variant-prev';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.setAttribute('aria-label', 'Previous variant');
    prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        item._variantIndex = (item._variantIndex - 1 + item._variants.length) % item._variants.length;
        imgEl.src = item._variants[item._variantIndex];
        updateVariantDots(nav, item._variantIndex);
    });

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'variant-btn variant-next';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.setAttribute('aria-label', 'Next variant');
    nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        item._variantIndex = (item._variantIndex + 1) % item._variants.length;
        imgEl.src = item._variants[item._variantIndex];
        updateVariantDots(nav, item._variantIndex);
    });

    const dots = document.createElement('div');
    dots.className = 'variant-dots';
    for (var i = 0; i < variants.length; i++) {
        var dot = document.createElement('span');
        dot.className = 'variant-dot' + (i === 0 ? ' active' : '');
        dots.appendChild(dot);
    }

    nav.appendChild(prevBtn);
    nav.appendChild(dots);
    nav.appendChild(nextBtn);
    figure.appendChild(nav);
}

function updateVariantDots(nav, activeIndex) {
    nav.querySelectorAll('.variant-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === activeIndex);
    });
}

function removeVariantNav(item) {
    var existing = item.querySelector('.variant-nav');
    if (existing) existing.remove();
    item._variantIndex = undefined;
    item._variants = undefined;
}

function updateTracksuitDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!item || !palette) return;

    var design = /wolf head/i.test(selectElement.value) ? 'wolf-head' :
        /typography/i.test(selectElement.value) ? 'typography' :
        /isolation breeds growth/i.test(selectElement.value) ? 'isolation-breeds-growth' : 'emblem';
    var variants = {
        emblem: {
            White: ['/tracksuits/white-blk-a4-lw-emblem-tracksuit.jpg', '/tracksuits/white-red-a4-lw-emblem-tracksuit.jpg', '/tracksuits/white-blk-lw-emblem-tracksuit.jpg', '/tracksuits/white-red-lw-emblem-tracksuit.jpg'],
            Black: ['/tracksuits/black-white-a4-lonewolf-emblem-tracksuit.jpg', '/tracksuits/black-red-a4-lw-emblem-tracksuit.jpg', '/tracksuits/black-gold-lw-emblem-tracksuit.jpg', '/tracksuits/black-red-lw-emblem-tracksuit.jpg', '/tracksuits/black-white-lw-emblem-tracksuit.jpg'],
            Grey: ['/tracksuits/grey-blk-a4-lw-emblem-tracksuit.jpg', '/tracksuits/grey-red-a4-lw-emblem-tracksuit.jpg', '/tracksuits/grey-blk-lw-emblem-tracksuit.jpg', '/tracksuits/grey-red-lw-emblem-tracksuit.jpg'],
            Pink: ['/tracksuits/pink-a4-lw-emblem-tracksuit.jpg', '/tracksuits/pink-lw-emblem-tracksuit.jpg'],
            Red: ['/tracksuits/red-a4-white-lw-emblem-tracksuit.jpg', '/tracksuits/red-black-a4-lw-emblem-tracksuit.jpg', '/tracksuits/red-black-lw-emblem-tracksuit.jpg', '/tracksuits/red-white-lw-emblem-tracksuit.jpg'],
            Yellow: ['/tracksuits/yellow-a4-lw-emblem-tracksuits.jpg', '/tracksuits/yellow-lw-emblem-tracksuit.jpg']
        },
        'wolf-head': {
            White: ['/tracksuits/white-blk-wolf-head-tracksuit.jpg', '/tracksuits/white-red-wolf-head-tracksuit.jpg'],
            Black: ['/tracksuits/black-white-wolf-head-tracksuit.jpg', '/tracksuits/black-red-wolf-head-tracksuit.jpg', '/tracksuits/black-gold-wolf-head-tracksuit.jpg'],
            Grey: ['/tracksuits/grey-blk-wolf-head-tracksuit.jpg', '/tracksuits/grey-red-wolf-head-tracksuit.jpg'],
            Pink: ['/tracksuits/pink-wolf-head-tracksuit.jpg'],
            Red: ['/tracksuits/red-blk-wolf-head-tracksuit.jpg', '/tracksuits/red-white-wolf-head-tracksuit.jpg'],
            Yellow: ['/tracksuits/yellow-wolf-head-tracksuit.jpg']
        },
        typography: {
            White: ['/tracksuits/white-blk-wolf-head-sleeve-lw-type-tracksuit.png.jpg', '/tracksuits/white-red-wolf-head-sleeve-lw-type-tracksuit.png.jpg'],
            Black: ['/tracksuits/black-gold-wolf-head-sleeve-lw-type-tracksuit.png.jpg', '/tracksuits/black-red-wolf-head-sleeve-lw-type-tracksuit.png.jpg', '/tracksuits/black-white-wolf-head-sleeve-lw-type-tracksuit.png.jpg'],
            Grey: ['/tracksuits/grey-blk-lw-type-tracksuit.jpg', '/tracksuits/grey-red-wolf-head-sleeve-lw-type-tracksuit.png.jpg'],
            Pink: ['/tracksuits/pink-blk-wolf-head-sleeve-lw-type-tracksuit.png.jpg'],
            Red: ['/tracksuits/red-black-gold-wolf-head-sleeve-lw-type-tracksuit.png.jpg', '/tracksuits/red-white-wolf-head-sleeve-lw-type-tracksuit.png.jpg'],
            Yellow: ['/tracksuits/yellow-lw-type-tracksuit.jpg']
        },
        'isolation-breeds-growth': {
            White: ['/tracksuits/black-white-a4-lonewolf-emblem-tracksuit.jpg', '/tracksuits/white-red-a4-lw-emblem-tracksuit.jpg'],
            Black: ['/tracksuits/black-gold-a4-lw-emblem-tracksuit.jpg', '/tracksuits/black-red-a4-lw-emblem-tracksuit.jpg'],
            Grey: ['/tracksuits/grey-blk-a4-lw-emblem-tracksuit.jpg', '/tracksuits/grey-red-a4-lw-emblem-tracksuit.jpg'],
            Pink: ['/tracksuits/pink-a4-lw-emblem-tracksuit.jpg'],
            Red: ['/tracksuits/red-a4-white-lw-emblem-tracksuit.jpg', '/tracksuits/red-black-a4-lw-emblem-tracksuit.jpg'],
            Yellow: ['/tracksuits/yellow-a4-lw-emblem-tracksuits.jpg']
        }
    };

    var designVariants = variants[design];
    palette.querySelectorAll('.color').forEach(function (swatch) {
        var colorVariants = designVariants[swatch.getAttribute('data-color')];
        swatch.setAttribute('data-variants', colorVariants ? colorVariants.join('|') : '');
    });

    var selectedColor = palette.querySelector('.selected-color') || palette.querySelector('.color');
    if (selectedColor) selectedColor.click();
}

function updateBeanieDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!item || !palette) return;

    var design = /wolf head/i.test(selectElement.value) ? 'wolf-head' : /typography/i.test(selectElement.value) ? 'typography' : 'emblem';
    var variants = {
        emblem: {
            White: ['/beanies/white-blk-lw-emblem-beanie.jpg', '/beanies/white-red-lw-emblem-beanie.jpg'], Grey: ['/beanies/grey-blk-lw-emblem-beanie.png'], Black: ['/beanies/black-gold-lw-emblem-beanie.jpg', '/beanies/black-white-lw-emblem-beanie.jpg', '/beanies/black-red-lw-emblem-beanie.jpg'], Pink: ['/beanies/pink-blk-lw-emblem-beanie.png'], Red: ['/beanies/red-blk-lw-emblem-beanie.jpg', '/beanies/red-white-lw-emblem-beanie.jpg'], 'Royal Blue': ['/beanies/royal-blue-lw-emblem-beanie.jpg'], Yellow: ['/beanies/yellow-blk-lw-emblem-beanie.jpg']
        },
        'wolf-head': {
            White: ['/beanies/white-blk-wolf-head-beanie.jpg', '/beanies/white-red-wolf-head-beanie.jpg'], Grey: ['/beanies/grey-blk-wolf-head-beanie.jpg'], Black: ['/beanies/black-white-wolf-head-beanie.jpg', '/beanies/black-red-wolf-head.jpg', '/beanies/black-gold-wolf-head-beanie.jpg'], Pink: ['/beanies/pink-blk-wolf-head-beanie.jpg'], Red: ['/beanies/red-blk-wolf-head-beanie.jpg', '/beanies/red-white-wolf-head-beanie.jpg'], 'Royal Blue': ['/beanies/royal-blue-wolf-head-beanie.jpg'], Yellow: ['/beanies/yellow-blk-wolf-head-beanie.jpg']
        },
        typography: {
            White: ['/beanies/white-blk-lw-type-beanie.jpg'], Grey: ['/beanies/grey-blk-lw-type-beanie.png'], Black: ['/beanies/black-white-lw-type-beanie.jpg', '/beanies/black-gold-lw-type-beanie.jpg'], Pink: ['/beanies/pink-lw-type-beanie.png'], Red: ['/beanies/red-blk-lw-type-beanie.jpg', '/beanies/red-white-lw-type-beanie.jpg'], 'Royal Blue': ['/beanies/royal-blue-lw-type-beanie.jpg'], Yellow: ['/beanies/yellow-blk-lw-type-beanie.jpg']
        }
    };

    palette.querySelectorAll('.color').forEach(function (swatch) {
        var colorVariants = variants[design][swatch.getAttribute('data-color')];
        swatch.setAttribute('data-variants', colorVariants ? colorVariants.join('|') : '');
    });
    var selectedColor = palette.querySelector('.selected-color') || palette.querySelector('.color');
    if (selectedColor) selectedColor.click();
}

function updateBucketHatDesign(selectElement) {
    var item = selectElement.closest('.bucket-hats-item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!item || !palette) return;

    var isWolfHead = /wolf head/i.test(selectElement.value);
    var isTypography = /typography/i.test(selectElement.value);
    var variants = isWolfHead ? {
        White: ['/bucket-hats/white-blk-wolf-head-logo.jpg', '/bucket-hats/white-red-wolf-head-bucket-hat.jpg'],
        Black: ['/bucket-hats/black-white-wolf-head-logo.png', '/bucket-hats/black-red-wolf-head-bucket-hat.png', '/bucket-hats/black-gold-wolf-head-bucket-hat.png'],
        Pink: ['/bucket-hats/pink-lw-wolf-head-bucket-hat.png'],
        Red: ['/bucket-hats/red-blk-wolf-bucket-hat.png', '/bucket-hats/red-white-wolf-head-bucket-hat.png'],
        Yellow: ['/bucket-hats/yellow-blk-wolf-head-bucket-hat.png']
    } : isTypography ? {
        White: ['/bucket-hats/white-blk-lw-type-bucket-hat.png'],
        Black: ['/bucket-hats/black-white-lw-type-bucket-hat.jpg', '/bucket-hats/black-gold-lw-type-bucket-hat.jpg'],
        Pink: ['/bucket-hats/pink-blk-lw-type-bucket-hat.png'],
        Red: ['/bucket-hats/red-blk-lw-type-bucket-hat.jpg', '/bucket-hats/red-white-lw-type-bucket-hat.jpg'],
        Yellow: ['/bucket-hats/yellow-blk-lw-type-logo-bucket-hat.jpg']
    } : {
        White: ['/bucket-hats/white-blk-lw-emblem-bucket-hat.jpg', '/bucket-hats/white-red-lw-emblem-bucket-hat.jpg'],
        Black: ['/bucket-hats/black-white-lw-emblem-bucket-hat.png', '/bucket-hats/black-red-lw-emblem-bucket-hat.png', '/bucket-hats/black-gold-lw-emblem-bucket-hat.png'],
        Pink: ['/bucket-hats/pink-lw-emblem-bucket-hat.png'],
        Red: ['/bucket-hats/red-blk-lw-emblem-bucket-hat.jpg', '/bucket-hats/red-white-lw-emblem-bucket-hat.jpg'],
        Yellow: ['/bucket-hats/yellow-blk-lw-emblem-bucket-hat.png']
    };

    if (!variants) return;
    palette.querySelectorAll('.color').forEach(function (swatch) {
        var colorVariants = variants[swatch.getAttribute('data-color')];
        swatch.setAttribute('data-variants', colorVariants ? colorVariants.join('|') : '');
    });
    var selectedColor = palette.querySelector('.selected-color') || palette.querySelector('.color');
    if (selectedColor) selectedColor.click();
}

function updateVestDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!item || !palette) return;

    var design = /wolf[-\s]head/i.test(selectElement.value) ? 'wolf-head' : /typography/i.test(selectElement.value) ? 'typography' : 'emblem';
    var variants = {
        emblem: {
            White: ['../vests/white-blk-lw-emblem-vest.jpg', '../vests/white-red-lw-emblem-vest.jpg'],
            Black: ['../vests/black-white-lw-emblem-vest.jpg', '../vests/black-red-lw-emblem-vest.jpg', '../vests/black-gold-lw-emblem-vest.jpg'],
            Grey: ['../vests/grey-blk-lw-emblem-vest.jpg', '../vests/grey-red-lw-emblem-vest.jpg'],
            Red: ['../vests/red-blk-lw-emblem-vest.jpg', '../vests/red-white-lw-emblem-vest.jpg']
        },
        'wolf-head': {
            White: ['../vests/white-blk-wolf-head-vest.jpg', '../vests/white-red-wolf-head-vest.jpg'],
            Black: ['../vests/black-white-wolf-head-vest.jpg', '../vests/black-red-wolf-head-vest.jpg', '../vests/black-gold-wolf-head-vest.jpg'],
            Grey: ['../vests/grey-blk-wolf-head-vest.jpg', '../vests/white-red-wolf-head-vest.jpg'],
            Red: ['../vests/red-blk-wolf-head-vest.png', '../vests/red-white-wolf-head-vest.png']
        },
        typography: {
            White: ['../vests/white-blk-lw-type-vest.jpg'],
            Black: ['../vests/black-whte-lw-type-vest.jpg', '../vests/black-gold-lw-type-vest.jpg'],
            Grey: ['../vests/grey-blk-lw-type-vest.jpg', '../vests/grey-red-lw-type-vest.jpg'],
            Red: ['../vests/red-blk-lw-type-vest.png', '../vests/red-white-lw-type-vest.png']
        }
    };

    var designVariants = variants[design];
    palette.querySelectorAll('.color').forEach(function (swatch) {
        var colorVariants = designVariants[swatch.getAttribute('data-color')];
        swatch.setAttribute('data-variants', colorVariants ? colorVariants.join('|') : '');
    });
    var selectedColor = palette.querySelector('.selected-color') || palette.querySelector('.color');
    if (selectedColor) {
        selectedColor.click();
        var variantsAttribute = selectedColor.getAttribute('data-variants');
        var image = item.querySelector('img');
        if (variantsAttribute && image) {
            image.src = variantsAttribute.split('|')[0];
        }
    }
}

function updateCapDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!item || !palette) return;

    var design = /wolf head/i.test(selectElement.value) ? 'wolf-head' : 'typography';
    var variants = {
        'wolf-head': {
            Black: ['/6-panel-caps/black-white-wolf-head-front-cap.jpg', '/6-panel-caps/black-red-wolf-head-front-cap.jpg', '/6-panel-caps/black-white-lw-type-side-cap.jpg', '/6-panel-caps/black-gold-wolf-head-front-cap.jpg', '/6-panel-caps/black-gold-lw-type-side-cap.jpg'],
            Khaki: ['/6-panel-caps/beige-blk-wolf-head-front-cap.png', '/6-panel-caps/beige-blk-lw-type-side-cap.jpg'],
            'Royal Blue': ['/6-panel-caps/royal-blue-wolf-head-front-cap.jpg', '/6-panel-caps/royal-blue-white-lw-type-side-cap.png'],
            Red: ['/6-panel-caps/red-blk-wolf-head-front-cap.jpg', '/6-panel-caps/red-blk-lw-type-side-cap.jpg', '/6-panel-caps/red-white-wolf-head-front-cap.jpg', '/6-panel-caps/red-white-lw-type-side-cap.jpg'],
            White: ['/6-panel-caps/white-red-wolf-head-front-cap.jpg', '/6-panel-caps/white-blk-wolf-head-front-cap.jpg', '/6-panel-caps/white-blk-lw-type-side-cap.jpg'],
            Yellow: ['/6-panel-caps/yellow-blk-wolf-head-front-cap.jpg', '/6-panel-caps/yellow-blk-lw-type-side-cap.jpg', '/6-panel-caps/yellow-white-wolf-head-front-cap.jpg', '/6-panel-caps/yellow-white-lw-type-side-cap.jpg']
        },
        typography: {
            Black: ['/6-panel-caps/black-white-lw-type-front-cap.jpg', '/6-panel-caps/black-white-wolf-head-side-cap.jpg', '/6-panel-caps/black-red-wolf-head-side-cap.jpg', '/6-panel-caps/black-gold-lw-type-front-cap.jpg', '/6-panel-caps/black-gold-wolf-head-side-cap.jpg'],
            Khaki: ['/6-panel-caps/beige-blk-lw-type-front-cap.png', '/6-panel-caps/beige-blk-lw-type-side-cap.jpg'],
            'Royal Blue': ['/6-panel-caps/royal-blue-lw-type-front-cap.jpg', '/6-panel-caps/royal-blue-white-lw-type-side-cap.png'],
            Red: ['/6-panel-caps/red-blk-lw-type-front-cap.jpg', '/6-panel-caps/red-blk-wolf-head-side-cap.jpg', '/6-panel-caps/red-white-lw-type-front-cap.jpg', '/6-panel-caps/red-white-wolf-head-side-cap.jpg'],
            White: ['/6-panel-caps/white-blk-lw-type-front-cap.png', '/6-panel-caps/white-blk-wolf-head-side-cap.jpg', '/6-panel-caps/white-red-wolf-head-side-cap.jpg'],
            Yellow: ['/6-panel-caps/yellow-blk-lw-type-front-cap.jpg', '/6-panel-caps/yellow-blk-lw-type-side-cap.jpg']
        }
    };

    palette.querySelectorAll('.color').forEach(function (swatch) {
        var colorVariants = variants[design][swatch.getAttribute('data-color')];
        swatch.setAttribute('data-variants', colorVariants ? colorVariants.join('|') : '');
    });
    var selectedColor = palette.querySelector('.selected-color') || palette.querySelector('.color');
    if (selectedColor) selectedColor.click();
}

function updateOuterwearDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.outerwear-colors') : null;
    var productType = palette ? palette.getAttribute('data-outerwear-colors') : null;
    if (!item || !palette || !productType) return;

    var variants = {
        puffer: {
            emblem: {
                Black: ['/puffer-jackets/black-white-lw-emblem-puffer-jacket.jpg', '/puffer-jackets/black-red-lw-emblem-puffer-jacket.jpg', '/puffer-jackets/black-gold-lw-emblem-puffer-jacket.jpg'],
                Grey: ['/puffer-jackets/grey-lw-emblem-alaskan-puffer-jacket.jpg'],
                'Navy Blue': ['/puffer-jackets/navy-lw-emblem-puffee-jacket.jpg'],
                Red: ['/puffer-jackets/red-white-lw-emblem-puffer-jacket.jpg', '/puffer-jackets/red-blk-lw-puffer-jacket.jpg']
            },
            typography: {
                Black: ['/puffer-jackets/black-white-lw-type-puffer-jacket.jpg', '/puffer-jackets/black-gold-lw-tye-puffer-alaskan-jacket.jpg'],
                Grey: ['/puffer-jackets/grey-lw-type-alaskan-puffer-jacket.jpg'],
                'Navy Blue': ['/puffer-jackets/navy-lw-type-puffer-jacket.jpg'],
                Red: ['/puffer-jackets/red-white-lw-type-puffer-jacket.jpg', '/puffer-jackets/red-blk-lw-type-puffer-jacket.jpg']
            },
            'wolf-head': {
                Black: ['/puffer-jackets/black-wolf-head-puffer-jacket.jpg', '/puffer-jackets/black-red-wolf-head-puffer-jacket.jpg', '/puffer-jackets/black-gold-wolf-head-puffer-alaskan-jacket.jpg'],
                Grey: ['/puffer-jackets/grey-wolf-head-alaskan-puffer-jacket.jpg'],
                'Navy Blue': ['/puffer-jackets/navy-wolf-head-puffer-jacket.jpg'],
                Red: ['/puffer-jackets/red-white-wolf-head-puffer-jacket.jpg', '/puffer-jackets/red-blk-wolf-head-puffer-jacket.jpg']
            }
        },
        'body-warmer': {
            emblem: { Black: ['/body-warmers/black-white-lw-emblem-body-warmer.jpg', '/body-warmers/black-red-lw-emblem-body-warmer.jpg', '/body-warmers/black-gold-lw-emblem-body-warmer.jpg'] },
            typography: { Black: ['/body-warmers/black-white-lw-type-body-warmer.jpg', '/body-warmers/black-gold-lw-type-body-warmer.jpg'] },
            'wolf-head': { Black: ['/body-warmers/black-white-wolf-head-body-warmer.jpg', '/body-warmers/black-red-wolf-head-body-warmer.jpg', '/body-warmers/black-gold-wolf-head-body-warmer.jpg'] }
        }
    };

    var selectedVariants = variants[productType][selectElement.value];
    if (!selectedVariants) return;
    palette.querySelectorAll('.color').forEach(function (swatch) {
        var color = swatch.getAttribute('data-color');
        swatch.setAttribute('data-variants', (selectedVariants[color] || []).join('|'));
    });
    var firstSwatch = palette.querySelector('.color');
    if (firstSwatch) firstSwatch.click();
}

// Add click event listeners to all color elements after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Add extra swatches to product palettes (selective by page)
    const extraColors = [
        { name: 'Royal Blue', value: '#4169E1', className: 'royal-blue' },
        { name: 'Orange', value: '#FF8C00', className: 'orange' },
        { name: 'Beige', value: '#F0E68C', className: 'beige' }
    ];

    document.querySelectorAll('.colors').forEach((palette) => {
        const item = palette.closest('.item');
        const isCrewsHoodies = item && item.closest('.crews-and-hoodies-container');
        const isBeanies = item && item.closest('.beanies-container');
        const isGolfers = item && item.querySelector('h3') && /golfers?/i.test(item.querySelector('h3').textContent);
        const isVests = item && item.querySelector('h3') && /vests?/i.test(item.querySelector('h3').textContent);
        const isOuterwear = item && item.closest('.outerwear-container');
        const isTracksuits = item && item.closest('.sweatpants_and_shorts-container');
        const isBucketHat = item && item.closest('.bucket-hats-item');
        
        extraColors.forEach((color) => {
            if (isOuterwear) {
                return;
            }

            if (isTracksuits && (color.className === 'royal-blue' || color.className === 'orange' || color.className === 'beige')) {
                return;
            }

            if (isBucketHat && color.className === 'royal-blue') {
                return;
            }

            if (isGolfers && (color.className === 'orange' || color.className === 'beige')) {
                return;
            }

            if (isVests) {
                return;
            }

            // Skip Orange and Beige for Crews, Hoodies, and Beanies
            if ((isCrewsHoodies || isBeanies) && (color.className === 'orange' || color.className === 'beige')) {
                return;
            }

            // Skip if this color already exists in the palette
            if (palette.querySelector('[data-color="' + color.name + '"]')) {
                return;
            }
            
            const swatch = document.createElement('span');
            swatch.className = 'color ' + color.className;
            swatch.setAttribute('data-color', color.name);
            swatch.style.backgroundColor = color.value;
            palette.appendChild(swatch);
        });
    });

    const allColorElements = document.querySelectorAll('.color');
    allColorElements.forEach((colorElement) => {
        colorElement.addEventListener('click', function () {
            const item = colorElement.closest('.item');
            const imgId = item.querySelector('img').id;
            const variantsAttr = colorElement.getAttribute('data-variants');
            if (variantsAttr) {
                // Deselect all swatches in this palette then mark this one active
                Array.from(colorElement.parentElement.children).forEach(function (el) {
                    el.classList.remove('selected-color');
                });
                colorElement.classList.add('selected-color');
                showVariantNav(item, variantsAttr.split('|'));
            } else {
                removeVariantNav(item);
                handleColorSelection(colorElement, imgId);
            }
        });
    });

    // Design dropdown data for T-Shirts color switching
    var designData = {
        'lone-wolf-emblem': {
            colors: [
                { name: 'White', img: null, variants: '../t-shirts/white-a4-red-lw-emblem-t-shirt.jpg|../t-shirts/white-black-a4-lw-emblem-t-shirt.jpg|../t-shirts/white-blk-lw-emblem-t-shirt.jpg|../t-shirts/white-red-lw-emblem-t-shirt.jpg' },
                { name: 'Black', img: null, variants: '../t-shirts/black-a4-white-lw-emblem-t-shirt.png|../t-shirts/black-a4-red-lw-emblem-t-shirt.png|../t-shirts/black-a4-gold-lw-emblem-t-shirt.png|../t-shirts/black-white-lw-emblem-t-shirt.png|../t-shirts/black-red-lw-emblem-t-shirt.jpg|../t-shirts/black-gold-lw-emblem-t-shirt.png' },
                { name: 'Grey', img: null, variants: '../t-shirts/grey-a4-lw-emblem-t-shirt.png|../t-shirts/grey-lw-emblem-t-shirt.png' },
                { name: 'Red', img: null, variants: '../t-shirts/red-blk-a4-lw-emblem-t-shirt.png|../t-shirts/red-white-a4-lw-emblem-t-shirt.png|../t-shirts/red-blk-lw-emblem.png|../t-shirts/red-white-lw-emblem-t-shirt.png' },
                { name: 'Beige', img: null, variants: '../t-shirts/beige-a4-lw-emblem-t-shirt.png|../t-shirts/beige-lw-emblem-t-shirt.png' },
                { name: 'Yellow', img: null, variants: '../t-shirts/yellow-a4-lw-emblem-t-shirt.png|../t-shirts/yellow-lw-emblem-t-shirt.png' },
                { name: 'Orange', img: null, variants: '../t-shirts/orange-a4-lw-emblem-t-shirt.png|../t-shirts/orange-lw-emblem-t-shirt.png' },
                { name: 'Royal Blue', img: null, variants: '../t-shirts/royal-blue-a4-lw-emblem-t-shirt.png|../t-shirts/royal-blue-lw-emblem-t-shirt.png' },
                { name: 'Pink', img: null, variants: '../t-shirts/pink-a4-lw-emblem-t-shirt.png|../t-shirts/pink-lw-emblem-t-shirt.png' }
            ],
            defaultImg: '../t-shirts/white-a4-red-lw-emblem-t-shirt.jpg'
        },
        'wolf-head': {
            colors: [
                { name: 'Beige', img: '/T-Shirts Images/Beige Pocket Size BLK Wolf T-Shirt.png', variants: null },
                { name: 'Black', img: null, variants: '/T-Shirts Images/Black Gold Wolf Head Logo T-Shirt.png|/T-Shirts Images/BLK Pocket Size Red Wolf T-Shirt.png|/T-Shirts Images/BLK Pocket Size White Wolf T-Shirt.png' },
                { name: 'Pink', img: '/T-Shirts Images/FPINK Pocket Size Wolf T-Shirt.png', variants: null },
                { name: 'Grey', img: '/T-Shirts Images/Grey Pocket Size Wolf T-Shirt.png', variants: null },
                { name: 'Orange', img: '/T-Shirts Images/Orange PS Wolf Head Logo T-Shirt.png', variants: null },
                { name: 'Red', img: null, variants: '/T-Shirts Images/Red Blk Pocket Size Wolf T-Shirt.png|/T-Shirts Images/Red White Wolf Head T-Shirt.png' },
                { name: 'Royal Blue', img: '/T-Shirts Images/Royal Blue - Wolf Head Logo T-Shirt.png', variants: null },
                { name: 'White', img: null, variants: '/T-Shirts Images/White Pocket Size Wolf T-Shirt.png|/T-Shirts Images/White RMBD Wolf Head-T-Shirt.png' },
                { name: 'Mustard Yellow', img: '/T-Shirts Images/Yellow Pocket Size BLK Wolf T-Shirt.png', variants: null }
            ],
            defaultImg: '/T-Shirts Images/Beige Pocket Size BLK Wolf T-Shirt.png'
        },
        'lone-wolf-typography': {
            colors: [
                { name: 'Beige', img: '/T-Shirts Images/Beige Lone Wolf Typography-T-Shirt.png', variants: null },
                { name: 'Black', img: null, variants: '/T-Shirts Images/Black Gold Lone Wolf Typography-T-Shirt.png|/T-Shirts Images/Black White Lone Wolf Typography-T-Shirt.png' },
                { name: 'Grey', img: '/T-Shirts Images/Grey Lone Wolf Typography-T-Shirt.png', variants: null },
                { name: 'Orange', img: '/T-Shirts Images/Orange Lone Wolf Typography-T-Shirt.png', variants: null },
                { name: 'Pink', img: '/T-Shirts Images/Pink Lone Wolf Typography T-Shirt.png', variants: null },
                { name: 'Red', img: null, variants: '/T-Shirts Images/Red Lone Wolf Blk Typography-T-Shirt.png|/T-Shirts Images/Red Lone Wolf  White Typography-T-Shirt.png' },
                { name: 'Royal Blue', img: '/T-Shirts Images/Royal Blue Lone Wolf White Typography-T-Shirt.png', variants: null },
                { name: 'White', img: '/T-Shirts Images/White Lone Wolf Typography-T-Shirt.png', variants: null }
            ],
            defaultImg: '/T-Shirts Images/Beige Lone Wolf Typography-T-Shirt.png'
        },
        'isolation-breeds-growth': {
            colors: [
                { name: 'Beige', img: '/T-Shirts Images/Beige-IBG-Tee.png', variants: null },
                { name: 'Black', img: null, variants: '/T-Shirts Images/Black-IBG-RMBD-Tee.png|/T-Shirts Images/Black-IBG-WMBD-Tee.png' },
                { name: 'Grey', img: '/T-Shirts Images/Grey-IBG-Tee.png', variants: null },
                { name: 'Mustard Yellow', img: '/T-Shirts Images/M-Yellow-IBG-Tee.PNG', variants: null },
                { name: 'Orange', img: '/T-Shirts Images/Orange-IBG-Tee.png', variants: null },
                { name: 'Pink', img: '/T-Shirts Images/Pink-IBG-Tee.png', variants: null },
                { name: 'Red', img: null, variants: '/T-Shirts Images/Red-Black-IBG-Tee.png|/T-Shirts Images/Red-White-IBG-Tee.png' },
                { name: 'Royal Blue', img: '/T-Shirts Images/Royal-Blue-IBG-Tee.png', variants: null },
                { name: 'White', img: null, variants: '/T-Shirts Images/White-blk-IBG-Tee.png|/T-Shirts Images/White-red-IBG-Tee.png' }
            ],
            defaultImg: '/T-Shirts Images/Beige-IBG-Tee.png'
        }
    };

    var colorMap = {
        'White': '#FFFFFF', 'Black': '#111111', 'Grey': '#808080',
        'Khaki': '#F0E68C', 'Beige': '#F0E68C', 'Pink': '#FFB6C1',
        'Red': '#FF0000', 'Royal Blue': '#4169E1', 'Yellow': '#FFDB58',
        'Mustard Yellow': '#E1AD01', 'Orange': '#FF8C00', 'Navy Blue': '#1F3C68'
    };

    var colorOrder = ['White', 'Black', 'Grey', 'Navy Blue', 'Khaki', 'Beige', 'Pink', 'Red', 'Royal Blue', 'Yellow', 'Mustard Yellow', 'Orange'];

    function sortColorSwatches(palette) {
        var swatches = Array.from(palette.querySelectorAll('.color'));
        swatches.sort(function (first, second) {
            var firstIndex = colorOrder.indexOf(first.getAttribute('data-color'));
            var secondIndex = colorOrder.indexOf(second.getAttribute('data-color'));
            return (firstIndex < 0 ? colorOrder.length : firstIndex) - (secondIndex < 0 ? colorOrder.length : secondIndex);
        });
        swatches.forEach(function (swatch) {
            var colorName = swatch.getAttribute('data-color');
            if (colorMap[colorName]) {
                swatch.style.backgroundColor = colorMap[colorName];
            }
            palette.appendChild(swatch);
        });
    }

    document.querySelectorAll('.colors').forEach(sortColorSwatches);

    // Hook into dynamically created design dropdowns for T-Shirts
    function attachDesignSwitch() {
        document.querySelectorAll('.t-shirts_and_tops-container .item').forEach(function (item) {
            var designSelect = item.querySelector('select[name="design"]');
            if (!designSelect || designSelect._designSwitchAttached) return;
            designSelect._designSwitchAttached = true;

            designSelect.addEventListener('change', function () {
                var selected = this.value;
                var key = null;
                if (/isolation breeds growth/i.test(selected)) {
                    key = 'isolation-breeds-growth';
                } else if (/lone wolf typography/i.test(selected)) {
                    key = 'lone-wolf-typography';
                } else if (/wolf head/i.test(selected)) {
                    key = 'wolf-head';
                } else if (/lone wolf emblem/i.test(selected)) {
                    key = 'lone-wolf-emblem';
                }
                if (!key) return;

                var data = designData[key];
                if (!data) return;

                var imgEl = item.querySelector('img');
                var palette = item.querySelector('.colors');

                // Remove variant nav
                removeVariantNav(item);

                // Clear existing swatches
                palette.innerHTML = '';

                // Build new swatches
                data.colors.forEach(function (c) {
                    var swatch = document.createElement('span');
                    swatch.className = 'color';
                    swatch.setAttribute('data-color', c.name);
                    if (colorMap[c.name]) {
                        swatch.style.backgroundColor = colorMap[c.name];
                    }
                    if (c.variants) {
                        swatch.setAttribute('data-variants', c.variants);
                    } else if (c.img) {
                        swatch.setAttribute('data-img', c.img);
                    }

                    swatch.addEventListener('click', function () {
                        var varAttr = swatch.getAttribute('data-variants');
                        if (varAttr) {
                            Array.from(palette.children).forEach(function (el) {
                                el.classList.remove('selected-color');
                            });
                            swatch.classList.add('selected-color');
                            showVariantNav(item, varAttr.split('|'));
                        } else {
                            removeVariantNav(item);
                            handleColorSelection(swatch, imgEl.id);
                        }
                    });

                    palette.appendChild(swatch);
                });

                sortColorSwatches(palette);

                // Select first swatch
                if (palette.children.length > 0) {
                    palette.children[0].classList.add('selected-color');
                }

                // Set default image
                imgEl.src = data.defaultImg;
            });
        });
    }

    // Run after a short delay to let addToCart.js create the design dropdowns first
    setTimeout(attachDesignSwitch, 100);
});
