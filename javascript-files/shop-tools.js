(() => {
    'use strict';
    const collections = [
        ['T-Shirts & Vests', '/clothing-pages/t-shirts_and_vests.html'],
        ['Golfers', '/clothing-pages/golfers.html'],
        ['Crews & Hoodies', '/clothing-pages/crews_and_hoodies.html'],
        ['Sweatpants & Shorts', '/clothing-pages/sweatpants_and_shorts.html'],
        ['Tracksuits', '/clothing-pages/tracksuits.html'],
        ['Puffer Jackets & Body Warmers', '/clothing-pages/puffer_jackets_and_body_warmers.html'],
        ['Bucket Hats & Beanies', '/accessories-pages/bucket-hats-and-beanies.html'],
        ['6-Panel Caps', '/accessories-pages/6-panel-caps.html']
    ];
    // Cloudflare serves HTML pages at extensionless URLs.
    const collectionPath = url => {
        const pathname = url.split('#')[0].toLowerCase().replace(/\.html$/, '');
        return collections.find(([, path]) => path.replace(/\.html$/, '') === pathname)?.[1];
    };
    const key = 'lw-shop-v1';
    let state = { cart: [], wishlist: [], profile: { name: '', email: '' } };
    const validItem = item => item && typeof item.name === 'string' && typeof item.id === 'string'
        && typeof item.design === 'string' && typeof item.size === 'string' && typeof item.color === 'string'
        && typeof item.url === 'string' && Boolean(collectionPath(item.url))
        && Number.isFinite(item.price) && item.price > 0 && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99;
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        if (saved) {
            state.cart = Array.isArray(saved.cart) ? saved.cart.filter(validItem) : [];
            state.wishlist = Array.isArray(saved.wishlist) ? saved.wishlist.filter(validItem) : [];
            if (saved.profile && typeof saved.profile.name === 'string' && typeof saved.profile.email === 'string') state.profile = saved.profile;
        }
    } catch (_) { /* Use an empty basket when storage is unavailable or damaged. */ }
    function variantImageName(item) {
        let source = item.image;
        try { source ||= JSON.parse(item.id)[4]; } catch (_) { /* Older cart entry. */ }
        if (typeof source !== 'string') return '';
        // Asset names identify the exact displayed colour/artwork variant, including carousel choices.
        return source.split(/[?#]/)[0].split('/').pop().replace(/\.(webp|png|jpe?g)$/i, '');
    }
    function variantDescription(item) {
        const filename = variantImageName(item);
        if (!filename) return item.design.replace(/[-_]/g, ' ');
        const vest = filename.match(/^(red|white|black|grey)-(blk|white|whte|red|gold)-(lw-emblem|wolf-head|lw-type)-vest$/i);
        if (vest) {
            const logoColour = { blk: 'black', whte: 'white' }[vest[2]] || vest[2];
            const artwork = { 'lw-emblem': 'Lone Wolf Emblem', 'wolf-head': 'Wolf Head', 'lw-type': 'Lone Wolf Typography' }[vest[3]];
            return vest[1][0].toUpperCase() + vest[1].slice(1) + ' vest with ' + logoColour + ' ' + artwork;
        }
        return filename.replace(/[-_]/g, ' ').replace(/\bblk\b/gi, 'black').replace(/\bwhte\b/gi, 'white')
            .replace(/\blw\b/gi, 'Lone Wolf').replace(/\btype\b/gi, 'Typography')
            .replace(/\bibg\b/gi, 'Isolation Breeds Growth').replace(/\ba4\b/gi, 'A4')
            .replace(/^./, letter => letter.toUpperCase());
    }
    const money = value => 'R' + value.toFixed(2);
    function element(tag, text, parent) {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (parent) parent.append(node);
        return node;
    }
    function button(text, parent, action) {
        const node = element('button', text, parent);
        node.type = 'button';
        node.addEventListener('click', action);
        return node;
    }
    const dialog = element('dialog', undefined, document.body);
    dialog.className = 'shop-dialog';
    dialog.setAttribute('aria-labelledby', 'shop-title');
    const top = element('div', undefined, dialog);
    top.className = 'shop-dialog-top';
    const title = element('h2', '', top);
    title.id = 'shop-title';
    const closeButton = button('Close', top, () => dialog.close());
    closeButton.setAttribute('aria-label', 'Close');
    const content = element('div', undefined, dialog);
    const notice = element('p', '', dialog);
    notice.setAttribute('role', 'status');
    let opener;
    dialog.addEventListener('close', () => opener?.focus());
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
    });
    function persist() {
        try { localStorage.setItem(key, JSON.stringify(state)); }
        catch (_) { notice.textContent = 'Browser storage is unavailable. Your changes will last only on this page.'; }
        updateCounts();
    }
    function updateCounts() {
        for (const [label, count] of [['Shopping cart', state.cart.reduce((sum, item) => sum + item.quantity, 0)], ['Wishlist', state.wishlist.length]]) {
            const control = document.querySelector(`.nav-tools [aria-label="${label}"]`);
            if (!control) continue;
            let badge = control.querySelector('.shop-count');
            if (!badge) { badge = element('span', '', control); badge.className = 'shop-count'; }
            badge.textContent = count;
            badge.hidden = !count;
            control.title = `${label}: ${count} items`;
        }
    }
    function open(view) {
        if (!dialog.open) opener = document.activeElement;
        title.textContent = view;
        dialog.classList.toggle('shop-wishlist', view === 'Wishlist');
        dialog.classList.add('shop-collection');
        dialog.classList.toggle('shop-search-panel', view === 'Search');
        dialog.classList.toggle('shop-account-panel', view === 'Account');
        closeButton.textContent = '\u00d7';
        content.replaceChildren();
        notice.textContent = '';
        if (view === 'Search') renderSearch();
        else if (view === 'Account') renderProfile();
        else renderItems(view === 'Wishlist' ? 'wishlist' : 'cart');
        if (!dialog.open) dialog.showModal();
    }
    function renderSearch() {
        const icon = element('span', undefined, title);
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></svg>';
        title.prepend(icon);
        element('p', 'Find your next favourite collection.', content).className = 'shop-wishlist-intro';
        const label = element('label', 'Search collections', content);
        const input = element('input', undefined, label);
        input.type = 'search';
        input.id = 'shop-collection-search';
        input.name = 'collection-search';
        input.placeholder = 'Try hoodies, caps or golfers';
        const results = element('div', undefined, content);
        results.className = 'shop-search-results';
        results.setAttribute('aria-live', 'polite');
        const render = () => {
            results.replaceChildren();
            const matches = collections.filter(([name]) => input.value.toLowerCase().trim().split(/\s+/).every(word => name.toLowerCase().includes(word)));
            matches.forEach(([name, url]) => {
                const link = element('a', name, results);
                link.href = url; link.className = 'shop-result';
                const arrow = element('span', '\u2192', link);
                arrow.setAttribute('aria-hidden', 'true');
            });
            if (!matches.length) element('p', 'No collections found. Try another search.', results).className = 'shop-empty';
        };
        input.addEventListener('input', render);
        render();
        setTimeout(() => input.focus(), 0);
    }
    function renderItems(type) {
        {
            title.textContent = type === 'wishlist' ? 'Your Wishlist' : 'Shopping cart';
            const heart = element('span', type === 'wishlist' ? '\u2661' : '', title);
            heart.className = 'shop-heading-heart';
            if (type === 'cart') {
                heart.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h3l3 13h11l3-10H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>';
            }
            heart.setAttribute('aria-hidden', 'true');
            title.prepend(heart);
            const count = type === 'wishlist' ? state.wishlist.length : state.cart.reduce((sum, item) => sum + item.quantity, 0);
            element('span', `${count} ${count === 1 ? 'item' : 'items'}`, title).className = 'shop-list-count';
            element('p', type === 'wishlist' ? 'Your favourites, ready when you are.' : 'Your picks, one step closer.', content).className = 'shop-wishlist-intro';
        }
        if (!state[type].length) {
            const empty = element('div', undefined, content);
            empty.className = 'shop-empty';
            element('h3', type === 'cart' ? 'Your cart is empty.' : 'Your wishlist is empty. Save a favourite from any product card.', empty);
            element('p', 'Find your next favourite in our collections.', empty);
            const link = element('a', 'Browse T-Shirts & Vests', empty);
            link.className = 'shop-checkout';
            link.href = collections[0][1];
            return;
        }
        state[type].forEach((item, index) => {
            const row = element('article', undefined, content);
            row.className = 'shop-item';
            let details = row;
            {
                const preview = element('a', undefined, row);
                preview.className = 'shop-preview';
                preview.href = item.url;
                preview.setAttribute('aria-label', `View ${item.name}`);
                // Earlier saved items already contain the selected image path in their ID.
                let source = item.image;
                try { source ||= JSON.parse(item.id)[4]; } catch (_) { /* Show fallback. */ }
                let imageURL;
                try {
                    const url = new URL(source, new URL(item.url, location.origin));
                    if (typeof source === 'string' && url.origin === location.origin && /\.(webp|png|jpe?g)$/i.test(url.pathname)) imageURL = url.href;
                } catch (_) { /* Show fallback. */ }
                if (imageURL) {
                    const image = element('img', undefined, preview);
                    image.alt = item.name;
                    image.src = imageURL;
                    image.addEventListener('error', () => { preview.textContent = 'Preview unavailable'; }, { once: true });
                } else preview.textContent = 'Preview unavailable';
                details = element('div', undefined, row);
                details.className = 'shop-item-details';
            }
            const link = element('a', item.name, details);
            link.href = item.url;
            {
                element('p', item.design.replace(/[-_]/g, ' '), details).className = 'shop-design';
                element('p', 'Selected variant: ' + variantDescription(item), details).className = 'shop-variant';
                const tags = element('div', undefined, details);
                tags.className = 'shop-option-tags';
                element('span', item.color, tags);
                element('span', `Size ${item.size}`, tags);
            }
            element('p', money(item.price * (type === 'cart' ? item.quantity : 1)), details).className = 'shop-item-price';
            if (type === 'cart') element('p', `${money(item.price)} each`, details).className = 'shop-unit-price';
            const actions = element('div', undefined, details);
            actions.className = 'shop-item-actions';
            if (type === 'cart') {
                const label = element('label', 'Quantity ', actions);
                const input = element('input', undefined, label);
                input.id = `shop-cart-quantity-${index}`;
                input.name = `cart-quantity-${index}`;
                input.type = 'number'; input.min = '1'; input.max = '99'; input.value = item.quantity;
                input.setAttribute('aria-label', `Quantity for ${item.name}`);
                input.addEventListener('change', () => {
                    if (!input.checkValidity() || !input.value) { input.value = item.quantity; return; }
                    item.quantity = Number(input.value); open('Shopping cart'); persist();
                });
            } else button('Add to cart', actions, () => { add(item); });
            button('Remove', actions, () => { state[type] = state[type].filter(entry => entry.id !== item.id); open(type === 'cart' ? 'Shopping cart' : 'Wishlist'); persist(); }).className = 'shop-remove';
        });
        if (type === 'cart') {
            const summary = element('div', undefined, content);
            summary.className = 'shop-order-summary';
            element('h3', 'Subtotal: ' + money(state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)), summary);
            element('p', 'Delivery and availability will be confirmed on WhatsApp.', summary);
            const checkout = element('a', 'Order on WhatsApp', summary);
            checkout.className = 'shop-checkout';
            const message = ['Hello, I would like to order:', ...state.cart.map(item => `${item.name}\nDesign: ${item.design}\nDescription: ${variantImageName(item) || variantDescription(item)}\nColor: ${item.color}\nSize: ${item.size}\nQuantity: ${item.quantity}\nUnit price: ${money(item.price)}\nLine total: ${money(item.price * item.quantity)}`), 'Subtotal: ' + money(state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0))].join('\n\n');
            checkout.href = 'https://wa.me/27615816059?text=' + encodeURIComponent(message);
            checkout.target = '_blank'; checkout.rel = 'noopener noreferrer';
            element('p', 'Your cart stays saved until you remove its items.', summary).className = 'shop-cart-note';
        }
    }
    function renderProfile() {
        const icon = element('span', undefined, title);
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>';
        title.prepend(icon);
        element('p', 'Save your profile on this device. Online sign-in and order history are not available yet.', content).className = 'shop-wishlist-intro';
        const form = element('form', undefined, content);
        for (const [field, labelText] of [['name', 'Name'], ['email', 'Email']]) {
            const label = element('label', labelText, form);
            const input = element('input', undefined, label);
            input.name = field; input.type = field === 'email' ? 'email' : 'text';
            input.autocomplete = field; input.maxLength = 150; input.value = state.profile[field];
        }
        element('button', 'Save profile', form).type = 'submit';
        form.addEventListener('submit', event => {
            event.preventDefault();
            state.profile = { name: form.elements.name.value.trim(), email: form.elements.email.value.trim() };
            notice.textContent = 'Profile saved on this device.'; persist();
        });
        button('Clear profile', form, () => { state.profile = { name: '', email: '' }; open('Account'); persist(); }).className = 'shop-clear-profile';
    }
    function capture(image) {
        const card = image.closest('.item');
        const value = name => card.querySelector(`select[name="${name}"]`)?.value;
        const item = {
            name: card.querySelector('h3')?.textContent.trim() || image.alt,
            design: value('design') || 'Standard', size: value('size') || 'One size',
            quantity: Number(value('quantity') || 1),
            color: card.querySelector('.colors .selected-color, .colors .selected')?.dataset.color || image.getAttribute('src').split('/').pop(),
            price: Number(card.querySelector('.price')?.textContent.replace(/[^\d.]/g, '')),
            image: image.getAttribute('src'),
            url: (collectionPath(location.pathname) || location.pathname) + '#' + image.id
        };
        item.id = JSON.stringify([item.url, item.design, item.size, item.color, image.getAttribute('src'), item.price]);
        return item;
    }
    function add(item) {
        if (!validItem(item)) { open('Shopping cart'); notice.textContent = 'Please select a valid product, size and quantity before adding to cart.'; return; }
        const existing = state.cart.find(entry => entry.id === item.id);
        if (existing) existing.quantity = Math.min(99, existing.quantity + item.quantity);
        else state.cart.push({ ...item });
        open('Shopping cart'); persist(); notice.textContent += ' Added to your cart.';
    }
    window.LoneWolfShop = { addFromImage: image => add(capture(image)) };
    document.querySelectorAll('.nav-tools button').forEach(control => {
        control.setAttribute('aria-haspopup', 'dialog');
        control.addEventListener('click', () => open(control.getAttribute('aria-label')));
    });
    document.querySelectorAll('.item').forEach(card => {
        const image = card.querySelector('img[id]');
        const purchase = card.querySelector('.buy_container');
        if (!image || !purchase) return;
        const save = button('Add to Wishlist', purchase, () => {
            const item = capture(image);
            if (!validItem(item)) { open('Wishlist'); notice.textContent = 'Please select a valid product first.'; return; }
            if (!state.wishlist.some(entry => entry.id === item.id)) state.wishlist.push(item);
            open('Wishlist'); persist();
        });
        save.className = 'shop-save';
        const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        heart.setAttribute('viewBox', '0 0 24 24');
        heart.setAttribute('aria-hidden', 'true');
        heart.setAttribute('focusable', 'false');
        const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        outline.setAttribute('d', 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z');
        heart.append(outline);
        save.prepend(heart);
        card.querySelector('.add-to-cart-button')?.after(save);
    });
    updateCounts();
})();
