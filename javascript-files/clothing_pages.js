// Shared by the initial palettes and the product design handlers.
var colorMap = {
    'White': '#FFFFFF', 'Black': '#111111', 'Grey': '#808080',
    'Khaki': '#F0E68C', 'Beige': '#F0E68C', 'Pink': '#FFB6C1',
    'Red': '#FF0000', 'Royal Blue': '#4169E1', 'Yellow': '#FFDB58',
    'Mustard Yellow': '#E1AD01', 'Orange': '#FF8C00', 'Navy Blue': '#1F3C68'
};

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
        element.classList.remove('selected');
    });

    // Select the clicked color
    colorElement.classList.add('selected-color');
    colorElement.classList.add('selected');
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

function updateSweatpantsDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!palette) return;

    var design = /wolf head/i.test(selectElement.value) ? 'wolf-head' :
        /typography/i.test(selectElement.value) ? 'typography' : 'emblem';
    var variants = {
        emblem: {
            White: ['../sweatpants/white-lw-emblem-sweatpants.webp', '../sweatpants/white-red-lw-emblem-sweatpants.webp'],
            Black: ['../sweatpants/black-white-lw-emblem-sweatpants.webp', '../sweatpants/black-red-lw-emblem-sweatpants.webp', '../sweatpants/black-gold-lw-emblem-sweatpants.webp'],
            Grey: ['../sweatpants/grey-lw-emblem-sweatpants.webp'],
            Pink: ['../sweatpants/pink-lw-emblem-sweatpants.webp'],
            Red: ['../sweatpants/red-blk-lw-emblem-sweatpants.webp', '../sweatpants/red-white-lw-emblem-sweatpants.webp'],
            'Royal Blue': ['../sweatpants/royal-blue-white-lw-emblem-sweatpants.webp'],
            Yellow: ['../sweatpants/yellow-lw-emblem-sweatpants.webp']
        },
        'wolf-head': {
            White: ['../sweatpants/white-blk-wolf-head-sweatpants.webp', '../sweatpants/white-red-wolf-head-sweatpants.webp'],
            Black: ['../sweatpants/black-white-wolf-head-sweatpants.webp', '../sweatpants/black-red-wolf-head-sweatpants.webp', '../sweatpants/black-gold-wolf-head-sweatpants.webp'],
            Grey: ['../sweatpants/grey-wolf-head-sweatpants.webp'],
            Pink: ['../sweatpants/pink-wolf-head-sweatpants.webp'],
            Red: ['../sweatpants/red-blk-wolf-head-sweatpants.webp', '../sweatpants/red-white-wolf-head-sweatpants.webp'],
            'Royal Blue': ['../sweatpants/royal-blue-white-wolf-head-sweatpants.webp'],
            Yellow: ['../sweatpants/yellow-wolf-head-sweatpants.webp']
        },
        typography: {
            White: ['../sweatpants/white-blk-lw-type-sweatpants.webp'],
            Black: ['../sweatpants/black-white-lw-type-sweatpants.webp', '../sweatpants/black-gold-lw-type-sweatpants.webp'],
            Grey: ['../sweatpants/grey-lw-type-sweatpants.webp'],
            Pink: ['../sweatpants/pink-lw-type-sweatpants.webp'],
            Red: ['../sweatpants/red-blk-lw-type-sweatpants.webp', '../sweatpants/red-white-lw-type-sweatpants.webp'],
            'Royal Blue': ['../sweatpants/royal-blue-white-lw-type-sweatpants.webp'],
            Yellow: ['../sweatpants/yellow-lw-type-sweatpants.webp']
        }
    };

    palette.querySelectorAll('.color[data-color]').forEach(function (swatch) {
        var images = variants[design][swatch.getAttribute('data-color')];
        swatch.setAttribute('data-variants', images ? images.join('|') : '');
        swatch.removeAttribute('data-img');
    });
    var selectedColor = palette.querySelector('.selected-color') || palette.querySelector('.color');
    if (selectedColor) selectedColor.click();
}

function updateShortsDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!palette) return;

    var design = /wolf head/i.test(selectElement.value) ? 'wolf-head' :
        /typography/i.test(selectElement.value) ? 'typography' : 'emblem';
    var variants = {
        emblem: {
            White: ['../shorts/white-blk-lw-emblem-shorts.webp', '../shorts/white-red-lw-emblem-shorts.webp'],
            Black: ['../shorts/black-white-lw-emblem-shorts.webp', '../shorts/black-red-lw-emblem-shorts.webp', '../shorts/black-gold-lw-emblem-shorts.webp'],
            Grey: ['../shorts/grey-blk-lw-emblem-shorts.webp'],
            Pink: ['../shorts/pink-blk-lw-emblem-shorts.webp'],
            Red: ['../shorts/red-blk-lw-emblem-shorts.webp', '../shorts/red-white-lw-emblem-shorts.webp'],
            'Royal Blue': ['../shorts/royal-blue-white-lw-emblem-shorts.webp'],
            Yellow: ['../shorts/yellow-blk-lw-emblem-shorts.webp']
        },
        'wolf-head': {
            White: ['../shorts/white-blk-wolf-head-shorts.webp', '../shorts/white-red-wolf-head-shorts.webp'],
            Black: ['../shorts/black-white-wolf-head-shorts.webp', '../shorts/black-red-wolf-head-shorts.webp', '../shorts/black-gold-wolf-head-shorts.webp'],
            Grey: ['../shorts/grey-blk-wolf-head-shorts.webp'],
            Pink: ['../shorts/pink-blk-wolf-head-shorts.webp'],
            Red: ['../shorts/red-blk-wolf-head-shorts.webp', '../shorts/red-white-wolf-head-shorts.webp'],
            'Royal Blue': ['../shorts/royal-blue-white-wolf-head-shorts.webp'],
            Yellow: ['../shorts/yellow-blk-wolf-head-shorts.webp']
        },
        typography: {
            White: ['../shorts/white-blk-lw-type-shorts.webp'],
            Black: ['../shorts/black-white-lw-type-shorts.webp', '../shorts/black-gold-lw-type-shorts.webp'],
            Grey: ['../shorts/grey-blk-lw-type-shorts.webp'],
            Pink: ['../shorts/pink-blk-lw-type-shorts.webp'],
            Red: ['../shorts/red-blk-lw-type-shorts.webp', '../shorts/red-white-lw-type-shorts.webp'],
            'Royal Blue': ['../shorts/royal-blue-white-lw-type-shorts.webp'],
            Yellow: ['../shorts/yellow-blk-lw-type-shorts.webp']
        }
    };

    palette.querySelectorAll('.color[data-color]').forEach(function (swatch) {
        var images = variants[design][swatch.getAttribute('data-color')];
        swatch.setAttribute('data-variants', images ? images.join('|') : '');
        swatch.removeAttribute('data-img');
    });
    var selectedColor = palette.querySelector('.selected-color') || palette.querySelector('.color');
    if (selectedColor) selectedColor.click();
}

function updateTracksuitDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!item || !palette) return;

    var design = /wolf head/i.test(selectElement.value) ? 'wolf-head' :
        /typography/i.test(selectElement.value) ? 'typography' :
        /pocket size/i.test(selectElement.value) ? 'lone-wolf-emblem-pocket-size' : 'lone-wolf-emblem-large-print';
    var variants = {
        'lone-wolf-emblem-large-print': {
            White: ['../tracksuits/white-blk-a4-lw-emblem-tracksuit.webp', '../tracksuits/white-red-a4-lw-emblem-tracksuit.webp'],
            Black: ['../tracksuits/black-white-a4-lonewolf-emblem-tracksuit.webp', '../tracksuits/black-red-a4-lw-emblem-tracksuit.webp', '../tracksuits/black-gold-a4-lw-emblem-tracksuit.webp'],
            Grey: ['../tracksuits/grey-blk-a4-lw-emblem-tracksuit.webp', '../tracksuits/grey-red-a4-lw-emblem-tracksuit.webp'],
            Pink: ['../tracksuits/pink-a4-lw-emblem-tracksuit.webp'],
            Red: ['../tracksuits/red-a4-white-lw-emblem-tracksuit.webp', '../tracksuits/red-black-a4-lw-emblem-tracksuit.webp'],
            Yellow: ['../tracksuits/yellow-a4-lw-emblem-tracksuits.webp']
        },
        'lone-wolf-emblem-pocket-size': {
            White: ['../tracksuits/white-blk-lw-emblem-tracksuit.webp', '../tracksuits/white-red-lw-emblem-tracksuit.webp'],
            Black: ['../tracksuits/black-white-lw-emblem-tracksuit.webp', '../tracksuits/black-red-lw-emblem-tracksuit.webp', '../tracksuits/black-gold-lw-emblem-tracksuit.webp'],
            Grey: ['../tracksuits/grey-blk-lw-emblem-tracksuit.webp', '../tracksuits/grey-red-lw-emblem-tracksuit.webp'],
            Pink: ['../tracksuits/pink-lw-emblem-tracksuit.webp'],
            Red: ['../tracksuits/red-black-lw-emblem-tracksuit.webp', '../tracksuits/red-white-lw-emblem-tracksuit.webp'],
            Yellow: ['../tracksuits/yellow-lw-emblem-tracksuit.webp']
        },
        'wolf-head': {
            White: ['../tracksuits/white-blk-wolf-head-tracksuit.webp', '../tracksuits/white-red-wolf-head-tracksuit.webp'],
            Black: ['../tracksuits/black-white-wolf-head-tracksuit.webp', '../tracksuits/black-red-wolf-head-tracksuit.webp', '../tracksuits/black-gold-wolf-head-tracksuit.webp'],
            Grey: ['../tracksuits/grey-blk-wolf-head-tracksuit.webp', '../tracksuits/grey-red-wolf-head-tracksuit.webp'],
            Pink: ['../tracksuits/pink-wolf-head-tracksuit.webp'],
            Red: ['../tracksuits/red-blk-wolf-head-tracksuit.webp', '../tracksuits/red-white-wolf-head-tracksuit.webp'],
            Yellow: ['../tracksuits/yellow-wolf-head-tracksuit.webp']
        },
        typography: {
            White: ['../tracksuits/white-blk-wolf-head-sleeve-lw-type-tracksuit.webp', '../tracksuits/white-red-wolf-head-sleeve-lw-type-tracksuit.webp'],
            Black: ['../tracksuits/black-gold-wolf-head-sleeve-lw-type-tracksuit.webp', '../tracksuits/black-red-wolf-head-sleeve-lw-type-tracksuit.webp', '../tracksuits/black-white-wolf-head-sleeve-lw-type-tracksuit.webp'],
            Grey: ['../tracksuits/grey-blk-lw-type-tracksuit.webp', '../tracksuits/grey-red-wolf-head-sleeve-lw-type-tracksuit.webp'],
            Pink: ['../tracksuits/pink-blk-wolf-head-sleeve-lw-type-tracksuit.webp'],
            Red: ['../tracksuits/red-black-gold-wolf-head-sleeve-lw-type-tracksuit.webp', '../tracksuits/red-white-wolf-head-sleeve-lw-type-tracksuit.webp'],
            Yellow: ['../tracksuits/yellow-lw-type-tracksuit.webp']
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
            White: ['../beanies/white-blk-lw-emblem-beanie.webp', '../beanies/white-red-lw-emblem-beanie.webp'],
            Grey: ['../beanies/grey-blk-lw-emblem-beanie.webp'],
            Black: ['../beanies/black-gold-lw-emblem-beanie.webp', '../beanies/black-white-lw-emblem-beanie.webp', '../beanies/black-red-lw-emblem-beanie.webp'],
            Pink: ['../beanies/pink-blk-lw-emblem-beanie.webp'],
            Red: ['../beanies/red-blk-lw-emblem-beanie.webp', '../beanies/red-white-lw-emblem-beanie.webp'],
            'Royal Blue': ['../beanies/royal-blue-lw-emblem-beanie.webp'],
            Yellow: ['../beanies/yellow-blk-lw-emblem-beanie.webp']
        },
        'wolf-head': {
            White: ['../beanies/white-blk-wolf-head-beanie.webp', '../beanies/white-red-wolf-head-beanie.webp'],
            Grey: ['../beanies/grey-blk-wolf-head-beanie.webp'],
            Black: ['../beanies/black-white-wolf-head-beanie.webp', '../beanies/black-red-wolf-head.webp', '../beanies/black-gold-wolf-head-beanie.webp'],
            Pink: ['../beanies/pink-blk-wolf-head-beanie.webp'],
            Red: ['../beanies/red-blk-wolf-head-beanie.webp', '../beanies/red-white-wolf-head-beanie.webp'],
            'Royal Blue': ['../beanies/royal-blue-wolf-head-beanie.webp'],
            Yellow: ['../beanies/yellow-blk-wolf-head-beanie.webp']
        },
        typography: {
            White: ['../beanies/white-blk-lw-type-beanie.webp'],
            Grey: ['../beanies/grey-blk-lw-type-beanie.webp'],
            Black: ['../beanies/black-white-lw-type-beanie.webp', '../beanies/black-gold-lw-type-beanie.webp'],
            Pink: ['../beanies/pink-lw-type-beanie.webp'],
            Red: ['../beanies/red-blk-lw-type-beanie.webp', '../beanies/red-white-lw-type-beanie.webp'],
            'Royal Blue': ['../beanies/royal-blue-lw-type-beanie.webp'],
            Yellow: ['../beanies/yellow-blk-lw-type-beanie.webp']
        }
    };

    palette.querySelectorAll('.color').forEach(function (swatch) {
        var colorName = swatch.getAttribute('data-color');
        var colorVariants = variants[design][colorName];
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
        White: ['../bucket-hats/white-blk-wolf-head-logo.webp', '../bucket-hats/white-red-wolf-head-bucket-hat.webp'],
        Black: ['../bucket-hats/black-white-wolf-head-logo.webp', '../bucket-hats/black-red-wolf-head-bucket-hat.webp', '../bucket-hats/black-gold-wolf-head-bucket-hat.webp'],
        Pink: ['../bucket-hats/pink-lw-wolf-head-bucket-hat.webp'],
        Red: ['../bucket-hats/red-blk-wolf-bucket-hat.webp', '../bucket-hats/red-white-wolf-head-bucket-hat.webp'],
        Yellow: ['../bucket-hats/yellow-blk-wolf-head-bucket-hat.webp']
    } : isTypography ? {
        White: ['../bucket-hats/white-blk-lw-type-bucket-hat.webp'],
        Black: ['../bucket-hats/black-white-lw-type-bucket-hat.webp', '../bucket-hats/black-gold-lw-type-bucket-hat.webp'],
        Pink: ['../bucket-hats/pink-blk-lw-type-bucket-hat.webp'],
        Red: ['../bucket-hats/red-blk-lw-type-bucket-hat.webp', '../bucket-hats/red-white-lw-type-bucket-hat.webp'],
        Yellow: ['../bucket-hats/yellow-blk-lw-type-logo-bucket-hat.webp']
    } : {
        White: ['../bucket-hats/white-blk-lw-emblem-bucket-hat.webp', '../bucket-hats/white-red-lw-emblem-bucket-hat.webp'],
        Black: ['../bucket-hats/black-white-lw-emblem-bucket-hat.webp', '../bucket-hats/black-red-lw-emblem-bucket-hat.webp', '../bucket-hats/black-gold-lw-emblem-bucket-hat.webp'],
        Pink: ['../bucket-hats/pink-lw-emblem-bucket-hat.webp'],
        Red: ['../bucket-hats/red-blk-lw-emblem-bucket-hat.webp', '../bucket-hats/red-white-lw-emblem-bucket-hat.webp'],
        Yellow: ['../bucket-hats/yellow-blk-lw-emblem-bucket-hat.webp']
    };

    if (!variants) return;
    palette.querySelectorAll('.color').forEach(function (swatch) {
        var colorName = swatch.getAttribute('data-color');
        var colorVariants = variants[colorName];
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
            White: ['../vests/white-blk-lw-emblem-vest.webp', '../vests/white-red-lw-emblem-vest.webp'],
            Black: ['../vests/black-white-lw-emblem-vest.webp', '../vests/black-red-lw-emblem-vest.webp', '../vests/black-gold-lw-emblem-vest.webp'],
            Grey: ['../vests/grey-blk-lw-emblem-vest.webp', '../vests/grey-red-lw-emblem-vest.webp'],
            Red: ['../vests/red-blk-lw-emblem-vest.webp', '../vests/red-white-lw-emblem-vest.webp']
        },
        'wolf-head': {
            White: ['../vests/white-blk-wolf-head-vest.webp', '../vests/white-red-wolf-head-vest.webp'],
            Black: ['../vests/black-white-wolf-head-vest.webp', '../vests/black-red-wolf-head-vest.webp', '../vests/black-gold-wolf-head-vest.webp'],
            Grey: ['../vests/grey-blk-wolf-head-vest.webp', '../vests/grey-red-wolf-head-vest.webp'],
            Red: ['../vests/red-blk-wolf-head-vest.webp', '../vests/red-white-wolf-head-vest.webp']
        },
        typography: {
            White: ['../vests/white-blk-lw-type-vest.webp'],
            Black: ['../vests/black-whte-lw-type-vest.webp', '../vests/black-gold-lw-type-vest.webp'],
            Grey: ['../vests/grey-blk-lw-type-vest.webp', '../vests/grey-red-lw-type-vest.webp'],
            Red: ['../vests/red-blk-lw-type-vest.webp', '../vests/red-white-lw-type-vest.webp']
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

function updateHoodieDesign(selectElement) {
    var item = selectElement.closest('.item');
    if (!item) return;
    
    var palette = item.querySelector('.colors');
    var imgEl = item.querySelector('img');
    var priceElement = item.querySelector('.price');
    
    var selected = selectElement.value;
    var key = null;
    var isPremiumDesign = /large print|isolation breeds growth/i.test(selected);

    if (priceElement) {
        priceElement.textContent = isPremiumDesign ? 'R549.95' : 'R499.95';
    }
    
    if (/large print/i.test(selected)) {
        key = 'lone-wolf-emblem-large-print';
    } else if (/pocket size/i.test(selected)) {
        key = 'lone-wolf-emblem-pocket-size';
    } else if (/wolf head/i.test(selected)) {
        key = 'wolf-head';
    } else if (/typography/i.test(selected)) {
        key = 'lone-wolf-typography';
    } else if (/isolation breeds growth/i.test(selected)) {
        key = 'isolation-breeds-growth';
    }
    
    if (!key || !window.hoodieDesignData || !window.hoodieDesignData[key]) return;
    
    var data = window.hoodieDesignData[key];
    
    palette.innerHTML = '';
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
                    el.classList.remove('selected');
                });
                swatch.classList.add('selected-color');
                swatch.classList.add('selected');
                showVariantNav(item, varAttr.split('|'));
            } else {
                removeVariantNav(item);
                handleColorSelection(swatch, imgEl.id);
            }
        });
        
        palette.appendChild(swatch);
    });
    
    // Click first color to set image
    var firstSwatch = palette.querySelector('.color');
    if (firstSwatch) firstSwatch.click();
}

function updateCrewneckDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    var imgEl = item ? item.querySelector('img') : null;
    var priceElement = item ? item.querySelector('.price') : null;
    if (!item || !palette || !imgEl) return;

    var selected = selectElement.value;
    var isPremiumDesign = /large print|isolation breeds growth/i.test(selected);
    if (priceElement) {
        priceElement.textContent = isPremiumDesign ? 'R499.95' : 'R449.95';
    }
    var design = /isolation breeds growth/i.test(selected) ? 'isolation-breeds-growth' :
        /large print/i.test(selected) ? 'lone-wolf-emblem-large-print' :
        /pocket size/i.test(selected) ? 'lone-wolf-emblem-pocket-size' :
        /wolf head/i.test(selected) ? 'wolf-head' :
        /typography/i.test(selected) ? 'lone-wolf-typography' : 'lone-wolf-emblem-pocket-size';
    var data = window.crewneckDesignData && window.crewneckDesignData[design];
    if (!data) return;

    var swatchColors = {
        White: '#FFFFFF', Black: '#111111', Grey: '#808080', Pink: '#FFB6C1',
        Red: '#FF0000', 'Royal Blue': '#4169E1', Yellow: '#FFDB58'
    };
    removeVariantNav(item);
    palette.innerHTML = '';
    data.colors.forEach(function (color) {
        var swatch = document.createElement('span');
        swatch.className = 'color';
        swatch.setAttribute('data-color', color.name);
        swatch.style.backgroundColor = swatchColors[color.name] || '';
        swatch.setAttribute('data-variants', color.variants);
        swatch.addEventListener('click', function () {
            Array.from(palette.children).forEach(function (element) {
                element.classList.remove('selected-color', 'selected');
            });
            swatch.classList.add('selected-color', 'selected');
            showVariantNav(item, color.variants.split('|'));
        });
        palette.appendChild(swatch);
    });
    var firstSwatch = palette.querySelector('.color');
    if (firstSwatch) firstSwatch.click();
}

function updateCapDesign(selectElement) {
    var item = selectElement.closest('.item');
    var palette = item ? item.querySelector('.colors') : null;
    if (!item || !palette) return;

    var design = /wolf head/i.test(selectElement.value) ? 'wolf-head' : 'typography';
    var variants = {
        'wolf-head': {
            Black: ['../6-panel-caps/black-white-wolf-head-front-cap.webp', '../6-panel-caps/black-white-lw-type-side-cap.webp', '../6-panel-caps/black-red-wolf-head-front-cap.webp', '../6-panel-caps/black-gold-wolf-head-front-cap.webp', '../6-panel-caps/black-gold-lw-type-side-cap.webp'],
            Khaki: ['../6-panel-caps/beige-blk-wolf-head-front-cap.webp', '../6-panel-caps/beige-blk-lw-type-side-cap.webp'],
            'Royal Blue': ['../6-panel-caps/royal-blue-wolf-head-front-cap.webp', '../6-panel-caps/royal-blue-white-lw-type-side-cap.webp'],
            Red: ['../6-panel-caps/red-blk-wolf-head-front-cap.webp', '../6-panel-caps/red-blk-lw-type-side-cap.webp', '../6-panel-caps/red-white-wolf-head-front-cap.webp', '../6-panel-caps/red-white-lw-type-side-cap.webp'],
            White: ['../6-panel-caps/white-blk-wolf-head-front-cap.webp', '../6-panel-caps/white-blk-lw-type-side-cap.webp', '../6-panel-caps/white-red-wolf-head-front-cap.webp'],
            Yellow: ['../6-panel-caps/yellow-blk-wolf-head-front-cap.webp', '../6-panel-caps/yellow-blk-lw-type-side-cap.webp', '../6-panel-caps/yellow-white-wolf-head-front-cap.webp', '../6-panel-caps/yellow-white-lw-type-side-cap.webp']
        },
        typography: {
            Black: ['../6-panel-caps/black-white-lw-type-front-cap.webp', '../6-panel-caps/black-white-wolf-head-side-cap.webp', '../6-panel-caps/black-gold-lw-type-front-cap.webp', '../6-panel-caps/black-gold-wolf-head-side-cap.webp'],
            Khaki: ['../6-panel-caps/beige-blk-lw-type-front-cap.webp', '../6-panel-caps/beige-blk-wolf-head-side-cap.webp'],
            'Royal Blue': ['../6-panel-caps/royal-blue-lw-type-front-cap.webp', '../6-panel-caps/royal-blue-white-wolf-head-side-cap.webp'],
            Red: ['../6-panel-caps/red-blk-lw-type-front-cap.webp', '../6-panel-caps/red-blk-wolf-head-side-cap.webp', '../6-panel-caps/red-white-lw-type-front-cap.webp', '../6-panel-caps/red-white-wolf-head-side-cap.webp'],
            White: ['../6-panel-caps/white-blk-lw-type-front-cap.webp', '../6-panel-caps/white-blk-wolf-head-side-cap.webp'],
            Yellow: ['../6-panel-caps/yellow-blk-lw-type-front-cap.webp', '../6-panel-caps/yellow-blk-wolf-head-side-cap.webp', '../6-panel-caps/yellow-white-lw-type-front-cap.webp', '../6-panel-caps/yellow-white-wolf-head-side-cap.webp']
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
                Black: ['../puffer-jackets/black-white-lw-emblem-puffer-jacket.webp', '../puffer-jackets/black-red-lw-emblem-puffer-jacket.webp', '../puffer-jackets/black-gold-lw-emblem-puffer-jacket.webp'],
                Grey: ['../puffer-jackets/grey-lw-emblem-alaskan-puffer-jacket.webp'],
                'Navy Blue': ['../puffer-jackets/navy-lw-emblem-puffee-jacket.webp'],
                Red: ['../puffer-jackets/red-white-lw-emblem-puffer-jacket.webp', '../puffer-jackets/red-blk-lw-puffer-jacket.webp']
            },
            typography: {
                Black: ['../puffer-jackets/Black-white-lw-type-puffer-jacket.webp', '../puffer-jackets/black-gold-lw-tye-puffer-alaskan-jacket.webp'],
                Grey: ['../puffer-jackets/grey-lw-type-alaskan-puffer-jacket.webp'],
                'Navy Blue': ['../puffer-jackets/navy-lw-type-puffer-jacket.webp'],
                Red: ['../puffer-jackets/red-white-lw-type-puffer-jacket.webp', '../puffer-jackets/red-blk-lw-type-puffer-jacket.webp']
            },
            'wolf-head': {
                Black: ['../puffer-jackets/black-wolf-head-puffer-jacket.webp', '../puffer-jackets/black-red-wolf-head-puffer-jacket.webp', '../puffer-jackets/black-gold-wolf-head-puffer-alaskan-jacket.webp'],
                Grey: ['../puffer-jackets/grey-wolf-head-alaskan-puffer-jacket.webp'],
                'Navy Blue': ['../puffer-jackets/navy-wolf-head-puffer-jacket.webp'],
                Red: ['../puffer-jackets/red-white-wolf-head-puffer-jacket.webp', '../puffer-jackets/red-blk-wolf-head-puffer-jacket.webp']
            }
        },
        'body-warmer': {
            emblem: { Black: ['../body-warmers/black-white-lw-emblem-body-warmer.webp', '../body-warmers/black-red-lw-emblem-body-warmer.webp', '../body-warmers/black-gold-lw-emblem-body-warmer.webp'] },
            typography: { Black: ['../body-warmers/black-white-lw-type-body-warmer.webp', '../body-warmers/black-gold-lw-type-body-warmer.webp'] },
            'wolf-head': { Black: ['../body-warmers/black-white-wolf-head-body-warmer.webp', '../body-warmers/black-red-wolf-head-body-warmer.webp', '../body-warmers/black-gold-wolf-head-body-warmer.webp'] }
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
// Keep rebuilt palettes and pointer-driven selections accessible as well.
function enableKeyboardColors(palette) {
    function syncSwatches() {
        palette.querySelectorAll('.color').forEach(function (swatch) {
            swatch.setAttribute('role', 'button');
            swatch.setAttribute('tabindex', '0');
            swatch.setAttribute('aria-label', swatch.getAttribute('data-color') || 'Colour');
            swatch.setAttribute('aria-pressed', String(
                swatch.classList.contains('selected-color') || swatch.classList.contains('selected')
            ));
        });
    }
    palette.setAttribute('role', 'group');
    palette.setAttribute('aria-label', 'Product colour');
    palette.addEventListener('keydown', function (event) {
        const swatch = event.target.closest('.color');
        if (!swatch || !palette.contains(swatch)) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!event.repeat) swatch.click();
        }
    });
    // Existing click handlers own product images, variants and selection classes.
    // Only observe their inputs, so writing ARIA attributes cannot retrigger this.
    new MutationObserver(syncSwatches).observe(palette, {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ['class', 'data-color']
    });
    syncSwatches();
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.item .colors').forEach(enableKeyboardColors);
    // Add extra swatches to product palettes (selective by page)
    const extraColors = [
        { name: 'Royal Blue', value: '#4169E1', className: 'royal-blue' },
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

            if (isGolfers && (color.className === 'royal-blue' || color.className === 'orange' || color.className === 'beige')) {
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
                    el.classList.remove('selected');
                });
                colorElement.classList.add('selected-color');
                colorElement.classList.add('selected');
                showVariantNav(item, variantsAttr.split('|'));
            } else {
                removeVariantNav(item);
                handleColorSelection(colorElement, imgId);
            }
        });
    });

    document.querySelectorAll('.colors').forEach(function (palette) {
        if (!palette.querySelector('.selected-color, .selected')) {
            var firstSwatch = palette.querySelector('.color');
            if (firstSwatch) firstSwatch.click();
        }
    });

    // Design dropdown data for T-Shirts color switching
    var designData = {
        'lone-wolf-emblem-large-print': {
            colors: [
                { name: 'White', img: null, variants: '../t-shirts/white-a4-red-lw-emblem-t-shirt.webp|../t-shirts/white-black-a4-lw-emblem-t-shirt.webp' },
                { name: 'Black', img: null, variants: '../t-shirts/black-a4-white-lw-emblem-t-shirt.webp|../t-shirts/black-a4-red-lw-emblem-t-shirt.webp|../t-shirts/black-a4-gold-lw-emblem-t-shirt.webp' },
                { name: 'Grey', img: null, variants: '../t-shirts/grey-a4-red-lw-emblem-t-shirt.webp|../t-shirts/grey-a4-blk-lw-emblem-t-shirt.webp' },
                { name: 'Red', img: null, variants: '../t-shirts/red-blk-a4-lw-emblem-t-shirt.webp|../t-shirts/red-white-a4-lw-emblem-t-shirt.webp' },
                { name: 'Beige', img: null, variants: '../t-shirts/beige-a4-lw-emblem-t-shirt.webp' },
                { name: 'Yellow', img: null, variants: '../t-shirts/yellow-a4-lw-emblem-t-shirt.webp' },
                { name: 'Royal Blue', img: null, variants: '../t-shirts/royal-blue-a4-lw-emblem-t-shirt.webp' },
                { name: 'Pink', img: null, variants: '../t-shirts/pink-a4-lw-emblem-t-shirt.webp' }
            ]
        },
        'lone-wolf-emblem-pocket-size': {
            colors: [
                { name: 'White', img: null, variants: '../t-shirts/white-blk-lw-emblem-t-shirt.webp|../t-shirts/white-red-lw-emblem-t-shirt.webp' },
                { name: 'Black', img: null, variants: '../t-shirts/black-white-lw-emblem-t-shirt.webp|../t-shirts/black-red-lw-emblem-t-shirt.webp|../t-shirts/black-gold-lw-emblem-t-shirt.webp' },
                { name: 'Grey', img: null, variants: '../t-shirts/grey-red-lw-emblem-t-shirt.webp|../t-shirts/grey-blk-lw-emblem-t-shirt.webp' },
                { name: 'Red', img: null, variants: '../t-shirts/red-white-lw-emblem-t-shirt.webp|../t-shirts/red-blk-lw-emblem.webp' },
                { name: 'Beige', img: null, variants: '../t-shirts/beige-lw-emblem-t-shirt.webp' },
                { name: 'Yellow', img: null, variants: '../t-shirts/yellow-lw-emblem-t-shirt.webp' },
                { name: 'Royal Blue', img: null, variants: '../t-shirts/royal-blue-lw-emblem-t-shirt.webp' },
                { name: 'Pink', img: null, variants: '../t-shirts/pink-lw-emblem-t-shirt.webp' }
            ]
        },
        'wolf-head': {
            colors: [
                { name: 'White', img: null, variants: '../t-shirts/white-blk-wolf-head-t-shirt.webp|../t-shirts/white-red-wolf-head-t-shirt.webp' },
                { name: 'Black', img: null, variants: '../t-shirts/black-white-wolf-head-t-shirt.webp|../t-shirts/black-red-wolf-head-t-shirt.webp|../t-shirts/black-gold-wolf-head-t-shirt.webp' },
                { name: 'Grey', img: null, variants: '../t-shirts/grey-blk-wolf-head-t-shirt.webp|../t-shirts/grey-red-wolf-head-t-shirt.webp' },
                { name: 'Red', img: null, variants: '../t-shirts/red-blk-wolf-head-t-shirt.webp|../t-shirts/Red-white-wolf-head-t-shirt.webp' },
                { name: 'Beige', img: '../t-shirts/beige-wolf-head-t-shirt.webp', variants: null },
                { name: 'Yellow', img: '../t-shirts/yellow-wolf-head-t-shirt.webp', variants: null },
                { name: 'Royal Blue', img: '../t-shirts/royal-blue-wolf-head-t-shirt.webp', variants: null },
                { name: 'Pink', img: '../t-shirts/pink-wolf-head-t-shirt.webp', variants: null }
            ]
        },
        'lone-wolf-typography': {
            colors: [
                { name: 'White', img: '../t-shirts/white-lw-type-t-shirt.webp', variants: null },
                { name: 'Black', img: null, variants: '../t-shirts/black-white-lw-type-t-shirt.webp|../t-shirts/black-gold-lw-type-t-shirt.webp' },
                { name: 'Grey', img: null, variants: '../t-shirts/grey-blk-lw-type-t-shirt.webp|../t-shirts/grey-red-lw-type-t-shirt.webp' },
                { name: 'Red', img: null, variants: '../t-shirts/red-white-lw-type-t-shirt.webp|../t-shirts/red-blk-lw-type-t-shirt.webp' },
                { name: 'Beige', img: '../t-shirts/beige-lw-type-t-shirt.webp', variants: null },
                { name: 'Yellow', img: '../t-shirts/yellow-lw-type-t-shirt.webp', variants: null },
                { name: 'Royal Blue', img: '../t-shirts/royal-blue-lw-type-t-shirt.webp', variants: null },
                { name: 'Pink', img: '../t-shirts/pink-lw-type-t-shirt.webp', variants: null }
            ]
        },
        'isolation-breeds-growth': {
            colors: [
                { name: 'White', img: null, variants: '../t-shirts/white-a4-red-ibg-t-shirt.webp|../t-shirts/white-a4-black-ibg-t-shirt.webp' },
                { name: 'Black', img: null, variants: '../t-shirts/black-a4-white-ibg-t-shirt.webp|../t-shirts/black-a4-gold-ibg-t-shirt.webp|../t-shirts/black-red-ibg-t-shirt.webp' },
                { name: 'Grey', img: '../t-shirts/grey-ibg-t-shirt.webp', variants: null },
                { name: 'Red', img: null, variants: '../t-shirts/red-a4-ibg-t-shirt.webp|../t-shirts/red-a4-white-ibg-t-shirt.webp' },
                { name: 'Beige', img: '../t-shirts/beige-ibg-t-shirt.webp', variants: null },
                { name: 'Yellow', img: '../t-shirts/yellow-ibg-t-shirt.webp', variants: null },
                { name: 'Royal Blue', img: '../t-shirts/royal-blue-a4-ibg-t-shirt.webp', variants: null },
                { name: 'Pink', img: '../t-shirts/pink-a4-ibg-t-shirt.webp', variants: null }
            ]
        }
    };

    var golfer_designData = {
        'lone-wolf-emblem': {
            colors: [
                { name: 'White', img: null, variants: '../golfers/white-blk-lw-emblem-golfer.webp|../golfers/white-red-lw-emblem-golfer.webp' },
                { name: 'Grey', img: '../golfers/grey-lw-emblem-golfer.webp', variants: null },
                { name: 'Black', img: null, variants: '../golfers/black-white-lw-emblem-golfer.webp|../golfers/black-red-lw-emblem-golfer.webp|../golfers/black-gold-lw-emblem-golfer.webp' },
                { name: 'Pink', img: '../golfers/pink-lw-emblem-golfer.webp', variants: null },
                { name: 'Red', img: null, variants: '../golfers/red-blk-lw-emblem-golfer.webp|../golfers/red-white-lw-emblem-golfer.webp' },
                { name: 'Yellow', img: '../golfers/yellow-blk-lw-emblem-golfer.webp', variants: null }
            ]
        },
        'wolf-head': {
            colors: [
                { name: 'White', img: null, variants: '../golfers/white-blk-wolf-head-golfer.webp|../golfers/white-red-wolf-head-golfer.webp' },
                { name: 'Grey', img: '../golfers/grey-wolf-head-golfer.webp', variants: null },
                { name: 'Black', img: null, variants: '../golfers/black-white-wolf-head-golfer.webp|../golfers/black-red-wolf-head-golfer.webp|../golfers/black-gold-wolf-head-golfer.webp' },
                { name: 'Pink', img: '../golfers/pink-wolf-head-golfer.webp', variants: null },
                { name: 'Red', img: null, variants: '../golfers/red-blk-wolf-head-golfer.webp|../golfers/red-white-wolf-head-golfer.webp' },
                { name: 'Yellow', img: '../golfers/yellow-blk-wolf-head-golfer.webp', variants: null }
            ]
        },
        'lone-wolf-typography': {
            colors: [
                { name: 'White', img: '../golfers/white-blk-lw-type-golfer.webp', variants: null },
                { name: 'Grey', img: '../golfers/grey-lw-type-golfer.webp', variants: null },
                { name: 'Black', img: null, variants: '../golfers/black-white-lw-type-golfer.webp|../golfers/black-gold-lw-type-golfer.webp' },
                { name: 'Pink', img: '../golfers/pink-lw-type-golfer.webp', variants: null },
                { name: 'Red', img: null, variants: '../golfers/red-blk-lw-type-golfer.webp|../golfers/red-white-lw-type-golfer.webp' },
                { name: 'Yellow', img: '../golfers/yellow-blk-lw-type-golfer.webp', variants: null }
            ]
        }
    };

    window.crewneckDesignData = {
        'lone-wolf-emblem-large-print': {
            colors: [
                { name: 'White', variants: '../crewnecks/white-blk-a4-lw-emblem-crewneck.webp|../crewnecks/white-red-a4-lw-emblem-crewneck.webp' },
                { name: 'Black', variants: '../crewnecks/black-white-a4-lw-emblem-crewneck.webp|../crewnecks/black-red-a4-lw-emblem-crewneck.webp|../crewnecks/black-gold-a4-lw-emblem-crewneck.webp' },
                { name: 'Grey', variants: '../crewnecks/grey-a4-lw-emblem-crewneck.webp' },
                { name: 'Pink', variants: '../crewnecks/pink-a4-lw-emblem-crewneck.webp' },
                { name: 'Red', variants: '../crewnecks/red-blk-a4-lw-emblem-crewneck.webp|../crewnecks/red-white-a4-lw-emblem-crewneck.webp' },
                { name: 'Royal Blue', variants: '../crewnecks/royal-blue-a4-lw-emblem-crewneck.webp' },
                { name: 'Yellow', variants: '../crewnecks/yellow-a4-lw-emblem-crewneck.webp' }
            ]
        },
        'lone-wolf-emblem-pocket-size': {
            colors: [
                { name: 'White', variants: '../crewnecks/white-blk-lw-emblem-crewneck.webp|../crewnecks/white-red-lw-emblem-crewneck.webp' },
                { name: 'Black', variants: '../crewnecks/black-white-lw-emblem-crewneck.webp|../crewnecks/black-gold-lw-emblem-crewneck.webp|../crewnecks/black-red-lw-emblem-crewneck.webp' },
                { name: 'Grey', variants: '../crewnecks/grey-lw-emblem-crewneck.webp' },
                { name: 'Pink', variants: '../crewnecks/pink-lw-emblem-crewneck.webp' },
                { name: 'Red', variants: '../crewnecks/red-blk-lw-emblem-crewneck.webp|../crewnecks/red-white-lw-crewneck.webp' },
                { name: 'Royal Blue', variants: '../crewnecks/royal-blue-lw-emblem-crewneck.webp' },
                { name: 'Yellow', variants: '../crewnecks/yellow-lw-emblem-crewneck.webp' }
            ]
        },
        'wolf-head': {
            colors: [
                { name: 'White', variants: '../crewnecks/white-blk-wolf-head-crewneck.webp|../crewnecks/white-red-wolf-head-emblem-crewneck.webp' },
                { name: 'Black', variants: '../crewnecks/black-white-wolf-head-crewneck.webp|../crewnecks/black-gold-wolf-head-crewneck.webp|../crewnecks/black-red-wolf-head-crewneck.webp' },
                { name: 'Grey', variants: '../crewnecks/grey-wolf-head-crewneck.webp' },
                { name: 'Pink', variants: '../crewnecks/pink-blk-wolf-head-crewneck.webp' },
                { name: 'Red', variants: '../crewnecks/red-blk-wolf-wead-crewneck.webp|../crewnecks/red-white-wolf-wead-crewneck.webp' },
                { name: 'Royal Blue', variants: '../crewnecks/royal-blue-wolf-head-crewneck.webp' },
                { name: 'Yellow', variants: '../crewnecks/yellow-wolf-head-crewneck.webp' }
            ]
        },
        'lone-wolf-typography': {
            colors: [
                { name: 'White', variants: '../crewnecks/white-black-wolf-head-sleeve-lw-type-crewneck.webp|../crewnecks/white-red-wolf-head-sleeve-lw-type-crewneck.webp' },
                { name: 'Black', variants: '../crewnecks/black-white-wolf-head-sleeve-lw-type-crewneck.webp|../crewnecks/black-gold-wolf-head-sleeve-lw-type-crewneck.webp|../crewnecks/black-red-wolf-head-sleeve-lw-type-crewneck.webp' },
                { name: 'Grey', variants: '../crewnecks/grey-lw-type-crewneck.webp' },
                { name: 'Pink', variants: '../crewnecks/pink-lw-type-crewneck.webp' },
                { name: 'Red', variants: '../crewnecks/red-black-wolf-head-sleeve-lw-type-crewneck.webp|../crewnecks/red-white-wolf-head-sleeve-lw-type-crewneck.webp' },
                { name: 'Royal Blue', variants: '../crewnecks/royal-blue-lw-type-crewneck.webp' },
                { name: 'Yellow', variants: '../crewnecks/yellow-blk-lw-type-crewneck.webp' }
            ]
        },
        'isolation-breeds-growth': {
            colors: [
                { name: 'White', variants: '../crewnecks/white-a4-ibg-crewneck.webp|../crewnecks/white-red-ibg-crewneck.webp' },
                { name: 'Black', variants: '../crewnecks/black-white-ibg-crewneck.webp|../crewnecks/black-red-ibg-crewneck.webp|../crewnecks/black-gold-ibg-crewneck.webp' },
                { name: 'Grey', variants: '../crewnecks/grey-a4-ibg-crewneck.webp' },
                { name: 'Pink', variants: '../crewnecks/pink-ibg-crewneck.webp' },
                { name: 'Red', variants: '../crewnecks/red-a4-ibg-crewneck.webp|../crewnecks/red-white-ibg-crewneck.webp' },
                { name: 'Royal Blue', variants: '../crewnecks/royalr-blue-ibg-crewneck.webp' },
                { name: 'Yellow', variants: '../crewnecks/yellow-blk-ibg-crewneck.webp' }
            ]
        }
    };

    window.hoodieDesignData = {
        'lone-wolf-emblem-large-print': {
            colors: [
                { name: 'White', img: null, variants: '../hoodies/white-blk-a4-lw-emblem-hoodie.webp|../hoodies/white-red-a4-lw-emblem-hoodie.webp' },
                { name: 'Black', img: null, variants: '../hoodies/black-a4-lw-emblem-hoodie.webp|../hoodies/black-a4-gold-lw-emblem-hoodie.webp|../hoodies/black-red-a4-lw-emblem-hoodie.webp' },
                { name: 'Grey', img: '../hoodies/grey-a4-lw-emblem-hoodie.webp', variants: null },
                { name: 'Red', img: null, variants: '../hoodies/red-white-a4-lw-emblem-hoodie.webp|../hoodies/red-blk-a4-lw-emblem-hoodie.webp' },
                { name: 'Pink', img: '../hoodies/pink-a4-lw-emblem-hoodie.webp', variants: null },
                { name: 'Yellow', img: '../hoodies/yellow-a4-lw-emblem-hoodie.webp', variants: null },
                { name: 'Royal Blue', img: '../hoodies/royal-blue-a4-lw-emblem-hoodie.webp', variants: null }
            ]
        },
        'lone-wolf-emblem-pocket-size': {
            colors: [
                { name: 'White', img: null, variants: '../hoodies/white-blk-lw-emblem-hoodie.webp|../hoodies/white-red-lw-emblem-hoodie.webp' },
                { name: 'Black', img: null, variants: '../hoodies/black-white-lw-emblem-hoodie.webp|../hoodies/black-gold-lw-emblem-hoodie.webp|../hoodies/black-red-lw-emblem-hoodie.webp' },
                { name: 'Grey', img: '../hoodies/grey-blk-lw-emblem-hoodie.webp', variants: null },
                { name: 'Red', img: null, variants: '../hoodies/red-blk-lw-emblem-hoodie.webp|../hoodies/red-white-lw-emblem-hoodie.webp' },
                { name: 'Pink', img: '../hoodies/pink-blk-lw-emblem-hoodie.webp', variants: null },
                { name: 'Yellow', img: '../hoodies/yellow-lw-emblem-hoodie.webp', variants: null },
                { name: 'Royal Blue', img: '../hoodies/Royal-Blue-LW-Emblem-Hoodie.webp', variants: null }
            ]
        },
        'wolf-head': {
            colors: [
                { name: 'White', img: null, variants: '../hoodies/white-blk-wolf-head-hoodie.webp|../hoodies/white-red-wolf-head-hoodie.webp' },
                { name: 'Black', img: null, variants: '../hoodies/black-white-wolf-head-hoodie.webp|../hoodies/black-gold-wolf-head-hoodie.webp|../hoodies/black-red-wolf-head-hoodie.webp' },
                { name: 'Grey', img: '../hoodies/grey-wolf-head-hoodie.webp', variants: null },
                { name: 'Pink', img: '../hoodies/pink-blk-wolf-head-hoodie.webp', variants: null },
                { name: 'Red', img: null, variants: '../hoodies/red-blk-wolf-head-hoodie.webp|../hoodies/red-white-wolf-head-hoodie.webp' },
                { name: 'Royal Blue', img: '../hoodies/Royal-Blue-Wolf-Head-Hoodie.webp', variants: null },
                { name: 'Yellow', img: '../hoodies/yellow-wolf-head-hoodie.webp', variants: null }
            ]
        },
        'lone-wolf-typography': {
            colors: [
                { name: 'White', img: null, variants: '../hoodies/white-blk-wolf-head-sleeve-lw-type-hoodie.webp|../hoodies/white-red-wolf-head-sleeve-lw-type-hoodie.webp' },
                { name: 'Black', img: null, variants: '../hoodies/black-white-lw-type-white-wolf-head-sleeve-hoodie.webp|../hoodies/black-gold-wolf-head-sleeve-lw-type-hoodie.webp|../hoodies/black-red-wolf-head-sleeve-lw-type-hoodie.webp' },
                { name: 'Grey', img: '../hoodies/grey-lw-type-hoodie.webp', variants: null },
                { name: 'Pink', img: '../hoodies/pink-lw-type-blk-wolf-head-sleeve-hoodie.webp', variants: null },
                { name: 'Red', img: null, variants: '../hoodies/red-blk-wolf-head-sleeve-lw-type-hoodie.webp|../hoodies/red-white-wolf-head-sleeve-lw-type-hoodie.webp' },
                { name: 'Royal Blue', img: '../hoodies/royal-blue-lw-type-hoodie.webp', variants: null },
                { name: 'Yellow', img: '../hoodies/yellow-lw-type-hoodie.webp', variants: null }
            ]
        },
        'isolation-breeds-growth': {
            colors: [
                { name: 'White', img: null, variants: '../hoodies/white-blk-ibg-hoodie.webp|../hoodies/white-red-ibg-hoodie.webp' },
                { name: 'Black', img: null, variants: '../hoodies/black-white-a4-ibg-hoodie.webp|../hoodies/black-gold-ibg-hoodie.webp|../hoodies/black-red-ibg-hoodie.webp' },
                { name: 'Grey', img: '../hoodies/grey-ibg-hoodie.webp', variants: null },
                { name: 'Pink', img: '../hoodies/pink-a4-ibg-hoodie.webp', variants: null },
                { name: 'Red', img: null, variants: '../hoodies/red-blk-igb-hoodie.webp|../hoodies/red-white-ibg-hoodie.webp' },
                { name: 'Royal Blue', img: '../hoodies/Royal-Blue-IBG-Hoodie.webp', variants: null },
                { name: 'Yellow', img: '../hoodies/yellow-ibg-hoodie.webp', variants: null }
            ]
        }
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

    // Hook into dynamically created design dropdowns for T-Shirts and Golfers.
    // Headwear uses its own design handlers and image datasets above.
    function attachDesignSwitch() {
        document.querySelectorAll('.item').forEach(function (item) {
            var designSelect = item.querySelector('select[name="design"]');
            if (!designSelect || designSelect._designSwitchAttached) return;
            var itemHeading = item.querySelector('h3');
            var isCapItem = itemHeading && /6-panel caps?/i.test(itemHeading.textContent);
            var isBucketHatItem = item.classList.contains('bucket-hats-item');
            var isBeanieItem = itemHeading && /beanies?/i.test(itemHeading.textContent);
            var isHoodieItem = itemHeading && /hoodies?/i.test(itemHeading.textContent);
            var isCrewneckItem = itemHeading && /crewnecks?/i.test(itemHeading.textContent);
            var isSweatpantsItem = itemHeading && /sweatpants?/i.test(itemHeading.textContent);
            var isShortsItem = itemHeading && /shorts?/i.test(itemHeading.textContent);

            // These products use dedicated handlers attached when their selector
            // is created. A second generic handler would replace their mappings
            // with the T-shirt dataset.
            if (isCapItem || isBucketHatItem || isBeanieItem || isHoodieItem || isCrewneckItem || isSweatpantsItem || isShortsItem) return;

            designSelect._designSwitchAttached = true;

            designSelect.addEventListener('change', function () {
                var selected = this.value;
                var key = null;
                var isGolferItem = itemHeading && /golfers?/i.test(itemHeading.textContent);

                if (/isolation breeds growth/i.test(selected)) {
                    key = 'isolation-breeds-growth';
                } else if (/lone wolf typography/i.test(selected)) {
                    key = 'lone-wolf-typography';
                } else if (/wolf head/i.test(selected)) {
                    key = 'wolf-head';
                } else if (/large print/i.test(selected)) {
                    key = 'lone-wolf-emblem-large-print';
                } else if (/pocket size/i.test(selected)) {
                    key = 'lone-wolf-emblem-pocket-size';
                } else if (/lone wolf emblem/i.test(selected)) {
                    key = isGolferItem ? 'lone-wolf-emblem' : 'lone-wolf-emblem-large-print';
                }
                if (!key) return;

                var data = isGolferItem ? golfer_designData[key] : designData[key];
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
                                el.classList.remove('selected');
                            });
                            swatch.classList.add('selected-color');
                            swatch.classList.add('selected');
                            showVariantNav(item, varAttr.split('|'));
                        } else {
                            removeVariantNav(item);
                            handleColorSelection(swatch, imgEl.id);
                        }
                    });

                    palette.appendChild(swatch);
                });

                sortColorSwatches(palette);

                // Use the selected swatch's mapping for both the image and carousel.
                // A separate default image can disagree with the highlighted colour.
                if (palette.children.length > 0) {
                    palette.children[0].click();
                }
            });
        });
    }

    // Run after a short delay to let addToCart.js create the design dropdowns first
    setTimeout(attachDesignSwitch, 100);
});
