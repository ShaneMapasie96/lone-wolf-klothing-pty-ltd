/* Catalogue filters are independent of the purchase controls inside each card. */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.items_container').forEach(initProductFilters);
});

function initProductFilters(grid) {
    if (grid.dataset.filtersReady) return;
    grid.dataset.filtersReady = 'true';
    const colourOptions = { White: '#ffffff', Black: '#111111', Grey: '#808080', Cream: '#fff1cf', 'Baby Pink': '#ffb6c1', Red: '#da2231', 'Royal Blue': '#4169e1', 'Mustard Yellow': '#ffdb58' };
    const colourName = name => ({ Beige: 'Cream', Pink: 'Baby Pink', Yellow: 'Mustard Yellow' }[name] || name);
    const designName = name => /isolation breeds growth/i.test(name) ? 'Isolation Breeds Growth' :
        /wolf[ -]head/i.test(name) ? 'Wolf Head' :
        /typography/i.test(name) ? 'Lone Wolf Typography' :
        /emblem.*large print/i.test(name) ? 'Lone Wolf Emblem - Large Print' :
        /emblem.*pocket size/i.test(name) ? 'Lone Wolf Emblem - Pocket Size' :
        /emblem/i.test(name) ? 'Lone Wolf Emblem' : name;
    const products = Array.from(grid.querySelectorAll('.item'), element => ({
        element,
        type: [element.dataset.productType || element.querySelector('h3').textContent.trim().replace(/^(Lone Wolf|Wolf)\s+/, '').replace(/^Tracksuit$/, 'Tracksuits')],
        size: Array.from(element.querySelectorAll('select[name="size"] option'), option => option.textContent.trim()),
        design: Array.from(element.querySelectorAll('select[name="design"] option'), option => designName(option.textContent)),
        colour: Array.from(element.querySelectorAll('.color[data-color]'), swatch => colourName(swatch.dataset.color))
    }));
    const state = { type: '', size: '', colour: '', design: '' };
    const availableColoursOnly = grid.dataset.filterColours === 'available';
    const section = document.createElement('section');
    section.className = 'product-filters';
    section.setAttribute('aria-label', 'Filter products');
    section.innerHTML = '<div class="product-filter-header"><h2>Filter products</h2><button type="button" class="product-filter-toggle" aria-expanded="false">Filter products</button><span class="product-filter-count" role="status" aria-live="polite" aria-atomic="true"></span></div><div class="product-filter-panel"><div class="product-filter-controls"></div><div class="product-filter-active"><div class="product-filter-tags" aria-label="Active filters"></div><button type="button" class="product-filter-clear" hidden>Clear all</button></div></div>';
    const panel = section.querySelector('.product-filter-panel');
    panel.id = 'product-filter-panel-' + Array.from(document.querySelectorAll('.items_container')).indexOf(grid);
    const toggle = section.querySelector('.product-filter-toggle');
    toggle.setAttribute('aria-controls', panel.id);
    const controls = section.querySelector('.product-filter-controls');
    const selects = {};
    function addSelect(key, title, options) {
        const label = document.createElement('label');
        label.className = 'product-filter-field';
        const caption = document.createElement('span');
        caption.textContent = title;
        const select = document.createElement('select');
        select.dataset.filter = key;
        select.setAttribute('aria-label', title);
        select.add(new Option('All', ''));
        options.forEach(option => select.add(new Option(option, option)));
        select.value = '';
        label.append(caption, select);
        controls.append(label);
        selects[key] = select;
    }
    addSelect('type', 'Product Type', [...new Set(products.flatMap(product => product.type))]);
    addSelect('size', 'Size', ['XS', 'S', 'M', 'L', 'XL', '2XL']);
    const colours = document.createElement('fieldset');
    colours.className = 'product-filter-colours';
    colours.innerHTML = '<legend>Colour</legend><div class="product-filter-palette"></div>';
    const palette = colours.querySelector('div');
    // Include category-specific colours, such as navy, without changing the shared palette.
    products.forEach(product => product.colour.forEach(name => { if (!colourOptions[name]) colourOptions[name] = name === 'Navy Blue' ? '#000080' : name.replace(/\s/g, ''); }));
    const paletteNames = availableColoursOnly ? [...new Set(products.flatMap(product => product.colour))] : Object.keys(colourOptions);
    ['', ...paletteNames].forEach(name => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = name ? 'product-filter-swatch' : 'product-filter-all';
        button.dataset.colour = name;
        button.setAttribute('aria-label', name || 'All colours');
        button.title = name || 'All colours';
        if (name) {
            button.style.backgroundColor = colourOptions[name];
            const tooltip = document.createElement('span');
            tooltip.className = 'product-filter-tooltip';
            tooltip.textContent = name;
            button.append(tooltip);
        } else button.textContent = 'All';
        palette.append(button);
    });
    controls.append(colours);
    const availableDesigns = new Set(products.flatMap(product => product.design));
    const designOptions = ['Wolf Head', 'Lone Wolf Typography', 'Lone Wolf Emblem',
        'Lone Wolf Emblem - Large Print', 'Lone Wolf Emblem - Pocket Size', 'Isolation Breeds Growth'];
    addSelect('design', 'Design', designOptions.filter(name => availableDesigns.has(name)));
    if (availableDesigns.has('Lone Wolf Emblem - Large Print') || availableDesigns.has('Lone Wolf Emblem - Pocket Size')) {
        selects.design.parentElement.classList.add('product-filter-field-long-design');
    }
    grid.before(section);
    const empty = document.createElement('p');
    empty.className = 'product-filter-empty';
    empty.textContent = 'No products match your selected filters.';
    grid.after(empty);
    const tags = section.querySelector('.product-filter-tags');
    const clear = section.querySelector('.product-filter-clear');
    function render() {
        if (availableColoursOnly) {
            const available = new Set(products.filter(product => !state.type || product.type.includes(state.type)).flatMap(product => product.colour));
            // A newly selected type must not retain an unavailable, hidden colour filter.
            if (state.colour && !available.has(state.colour)) state.colour = '';
            palette.querySelectorAll('button').forEach(button => {
                button.hidden = Boolean(button.dataset.colour) && !available.has(button.dataset.colour);
            });
        }
        let count = 0;
        products.forEach(product => {
            const matches = Object.entries(state).every(([key, value]) => !value || product[key].includes(value));
            product.element.hidden = !matches;
            count += Number(matches);
        });
        grid.hidden = count === 0;
        empty.hidden = count !== 0;
        section.querySelector('.product-filter-count').textContent = count + (count === 1 ? ' product' : ' products');
        Object.entries(selects).forEach(([key, select]) => { select.value = state[key]; });
        palette.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.colour === state.colour)));
        tags.replaceChildren();
        Object.entries(state).filter(([, value]) => value).forEach(([key, value]) => {
            const tag = document.createElement('button');
            tag.type = 'button';
            tag.className = 'product-filter-tag';
            tag.dataset.remove = key;
            tag.textContent = value + ' ×';
            tag.setAttribute('aria-label', 'Remove ' + value + ' filter');
            tags.append(tag);
        });
        clear.hidden = !Object.values(state).some(Boolean);
    }
    section.addEventListener('change', event => {
        if (!event.target.dataset.filter) return;
        state[event.target.dataset.filter] = event.target.value;
        if (event.target.dataset.filter === 'design' && state.design) {
            products.forEach(product => {
                const select = product.element.querySelector('select[name="design"]');
                if (!select) return;
                const option = Array.from(select.options).find(option => designName(option.textContent) === state.design);
                if (!option) return;
                select.value = option.value;
                // Reuse the card's image, palette, price and cart-configuration handlers.
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
        render();
    });
    section.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button === toggle) {
            const open = toggle.getAttribute('aria-expanded') !== 'true';
            toggle.setAttribute('aria-expanded', String(open));
            section.classList.toggle('is-open', open);
            return;
        }
        if ('colour' in button.dataset) state.colour = button.dataset.colour;
        else if (button.dataset.remove) {
            const key = button.dataset.remove;
            state[key] = '';
            (selects[key] || palette.querySelector('button')).focus();
        } else if (button === clear) {
            Object.keys(state).forEach(key => { state[key] = ''; });
            selects.type.focus();
        } else return;
        render();
    });
    section.addEventListener('keydown', event => {
        if (event.key === 'Escape' && section.classList.contains('is-open')) {
            section.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
    render();
}
