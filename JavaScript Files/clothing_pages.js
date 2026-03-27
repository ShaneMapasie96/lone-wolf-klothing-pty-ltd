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

// Add click event listeners to all color elements after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Add extra swatches to product palettes (selective by page)
    const extraColors = [
        { name: 'Royal Blue', value: '#4169E1', className: 'royal-blue' },
        { name: 'Orange', value: '#FF8C00', className: 'orange' },
        { name: 'Beige', value: '#F5F5DC', className: 'beige' }
    ];

    document.querySelectorAll('.colors').forEach((palette) => {
        const item = palette.closest('.item');
        const isCrewsHoodies = item && item.closest('.crews-and-hoodies-container');
        const isBeanies = item && item.closest('.beanies-container');
        
        extraColors.forEach((color) => {
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
                { name: 'White', img: null, variants: '/T-Shirts Images/White Pocket Size LW T-Shirt.png|/T-Shirts Images/White Pocket Size LW Emblem RMBD.png' },
                { name: 'Grey', img: '/T-Shirts Images/Grey Pocket Size LW T-Shirt.png', variants: null },
                { name: 'Black', img: null, variants: '/T-Shirts Images/BLK Pocket Size White LW T-Shirt.png|/T-Shirts Images/Black RMD Full LW Emblem.jpg|/T-Shirts Images/Black Full GLW Emblem T-Shirt.png' },
                { name: 'Pink', img: '/T-Shirts Images/Pink Full LW Emblem.png', variants: null },
                { name: 'Red', img: null, variants: '/T-Shirts Images/Red Pocket Size LW T-Shirt.png|/T-Shirts Images/Red White PS LW T-Shirt.png' },
                { name: 'Mustard Yellow', img: '/T-Shirts Images/Mustard Yellow Pocket Size LW T-Shirt.png', variants: null }
            ],
            defaultImg: '/T-Shirts Images/White Pocket Size LW T-Shirt.png'
        },
        'wolf-head': {
            colors: [
                { name: 'Beige', img: '/T-Shirts Images/Beige Pocket Size BLK Wolf T-Shirt.png', variants: null },
                { name: 'Black', img: null, variants: '/T-Shirts Images/Black Gold Wolf Head Logo T-Shirt.png|/T-Shirts Images/BLK Pocket Size Red Wolf T-Shirt.png|/T-Shirts Images/BLK Pocket Size White Wolf T-Shirt.png' },
                { name: 'Pink', img: '/T-Shirts Images/FPINK Pocket Size Wolf T-Shirt.png', variants: null },
                { name: 'Grey', img: '/T-Shirts Images/Grey Pocket Size Wolf T-Shirt.png', variants: null },
                { name: 'Orange', img: '/T-Shirts Images/Orange PS Wolf Head Logo T-Shirt.png', variants: null },
                { name: 'Red', img: '/T-Shirts Images/Red Blk Pocket Size Wolf T-Shirt.png', variants: null },
                { name: 'Royal Blue', img: '/T-Shirts Images/Royal Blue - Wolf Head Logo T-Shirt.png', variants: null },
                { name: 'White', img: '/T-Shirts Images/White Pocket Size Wolf T-Shirt.png', variants: null },
                { name: 'Mustard Yellow', img: '/T-Shirts Images/Yellow Pocket Size BLK Wolf T-Shirt.png', variants: null }
            ],
            defaultImg: '/T-Shirts Images/Beige Pocket Size BLK Wolf T-Shirt.png'
        }
    };

    var colorMap = {
        'White': '#FFFFFF', 'Grey': '#808080', 'Black': '#000000',
        'Pink': '#FFB6C1', 'Red': '#FF0000', 'Mustard Yellow': '#E1AD01',
        'Royal Blue': '#4169E1', 'Orange': '#FF8C00', 'Beige': '#F5F5DC'
    };

    // Hook into dynamically created design dropdowns for T-Shirts
    function attachDesignSwitch() {
        document.querySelectorAll('.t-shirts_and_tops-container .item').forEach(function (item) {
            var designSelect = item.querySelector('select[name="design"]');
            if (!designSelect || designSelect._designSwitchAttached) return;
            designSelect._designSwitchAttached = true;

            designSelect.addEventListener('change', function () {
                var selected = this.value;
                var key = null;
                if (/wolf head/i.test(selected)) {
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
