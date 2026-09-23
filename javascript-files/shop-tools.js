(() => {
    'use strict';
    // Resolve from this script so both domain-root and project-folder hosting work.
    const siteRoot = new URL('../', document.currentScript.src);
    const collections = [
        ['T-Shirts & Vests', '/clothing-pages/t-shirts_and_vests.html'],
        ['Golfers', '/clothing-pages/golfers.html'],
        ['Crews & Hoodies', '/clothing-pages/crews_and_hoodies.html'],
        ['Sweatpants & Shorts', '/clothing-pages/sweatpants_and_shorts.html'],
        ['Tracksuits', '/clothing-pages/tracksuits.html'],
        ['Puffer Jackets & Body Warmers', '/clothing-pages/puffer_jackets_and_body_warmers.html'],
        ['Bucket Hats & Beanies', '/accessories-pages/bucket-hats-and-beanies.html'],
        ['6-Panel Caps', '/accessories-pages/6-panel-caps.html']
    ].map(([name, path]) => [name, new URL(path.slice(1), siteRoot).pathname]);
    // Cloudflare serves HTML pages at extensionless URLs.
    const collectionPath = url => {
        const pathname = url.split('#')[0].toLowerCase().replace(/\.html$/, '');
        return collections.find(([, path]) => path.replace(/\.html$/, '') === pathname)?.[1];
    };
    const orderDetails = { name: '', phone: '', method: 'locker', locker: '' };
    const key = 'lw-shop-v1';
    const referenceKey = 'lw-order-reference-v1';
    let draftReference;
    function orderReference(forceNew = false) {
        const signature = JSON.stringify(state.cart.map(item => [item.id, item.quantity]).sort((a, b) => a[0].localeCompare(b[0])));
        try { draftReference ||= JSON.parse(localStorage.getItem(referenceKey)); } catch (_) { /* Keep the reference in memory. */ }
        if (forceNew || draftReference?.signature !== signature || !/^LWK-[A-F0-9]{12}$/.test(draftReference?.reference || '')) {
            const bytes = crypto.getRandomValues(new Uint8Array(6));
            const reference = 'LWK-' + Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
            draftReference = { signature, reference };
            try { localStorage.setItem(referenceKey, JSON.stringify(draftReference)); } catch (_) { /* Keep the reference in memory. */ }
        }
        return draftReference.reference;
    }
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
    function logoColours(source) {
        const filename = variantImageName({ image: source }).toLowerCase();
        // Strip the garment colour first so it cannot be mistaken for the artwork.
        const garment = filename.match(/^(royalr?-blue|navy-blue|mustard-yellow|white|black|grey|khaki|beige|pink|red|yellow|orange)-/);
        if (!garment) return [];
        const artwork = filename.slice(garment[0].length);
        const colours = (artwork.match(/\b(white|whte|black|blk|red|gold)\b/g) || [])
            .map(colour => ({ blk: 'black', whte: 'white' }[colour] || colour));
        // The catalogue's unqualified artwork uses these contrast colours.
        return [...new Set(colours.length ? colours : [/^(black|royalr?-blue|navy-blue)$/.test(garment[1]) ? 'white' : 'black'])];
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
            const reference = orderReference();
            element('p', 'Order reference: ' + reference, summary).className = 'shop-order-reference';
            element('p', 'Keep this reference for your confirmed quote, deposit, balance and proof of payment. This enquiry is not yet a confirmed order.', summary);
            button('New order reference', summary, () => {
                orderReference(true);
                open('Shopping cart');
            });
            const subtotalCents = state.cart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
            const freeDelivery = subtotalCents > 75000;
            element('h3', 'Subtotal: ' + money(subtotalCents / 100), summary);
            // Round the deposit to cents, then subtract so the two amounts total exactly.
            const depositCents = Math.round(subtotalCents / 2);
            const balanceCents = subtotalCents - depositCents;
            const depositText = 'Estimated 50% deposit: ' + money(depositCents / 100);
            const balanceText = 'Estimated remaining balance: ' + money(balanceCents / 100);
            const estimateNote = 'Estimates are based on the product subtotal and exclude any delivery charges. The final order total, deposit and balance depend on confirmed availability and delivery costs.';
            const paymentTerms = 'A 50% deposit is required before processing your confirmed order. The remaining balance is due before dispatch or collection. Please wait for order confirmation and payment details before paying.';
            element('p', depositText, summary).className = 'shop-deposit';
            element('p', balanceText, summary).className = 'shop-balance';
            element('p', estimateNote, summary).className = 'shop-estimate-note';
            element('p', paymentTerms, summary).className = 'shop-payment-terms';
            const delivery = element('p', freeDelivery
                ? 'Free locker delivery - Lone Wolf Klothing pays your delivery fee.'
                : 'Spend ' + money((75001 - subtotalCents) / 100) + ' more to qualify for free locker delivery. Orders of R750 or less carry the courier delivery charge.', summary);
            delivery.className = 'shop-delivery-status';
            delivery.setAttribute('aria-live', 'polite');
            const deliveryNote = element('p', '', summary);
            const form = element('form', undefined, summary);
            form.className = 'shop-order-details';
            element('h4', 'Your order details', form);
            function orderInput(field, caption, type, autocomplete) {
                const label = element('label', caption, form);
                const input = element('input', undefined, label);
                input.name = field; input.type = type; input.autocomplete = autocomplete;
                input.required = true; input.maxLength = 150; input.value = orderDetails[field];
                input.addEventListener('input', () => { orderDetails[field] = input.value; input.setCustomValidity(''); });
                return input;
            }
            const customerName = orderInput('name', 'Customer name', 'text', 'name');
            const phone = orderInput('phone', 'Phone number', 'tel', 'tel');
            const methodLabel = element('label', 'Delivery method', form);
            const method = element('select', undefined, methodLabel);
            method.name = 'method'; method.setAttribute('aria-label', 'Delivery method');
            method.add(new Option('Courier Guy locker delivery', 'locker'));
            method.add(new Option('Collection from LWK', 'collection'));
            method.value = orderDetails.method;
            const locker = orderInput('locker', 'Preferred Courier Guy locker (name and location)', 'text', 'off');
            const finder = element('a', 'Find a Courier Guy locker', form);
            finder.href = 'https://thecourierguy.co.za/locations/';
            finder.target = '_blank'; finder.rel = 'noopener noreferrer';
            function updateMethod() {
                orderDetails.method = method.value;
                deliveryNote.textContent = method.value === 'collection' ? 'Availability and collection arrangements will be confirmed on WhatsApp.' : freeDelivery ? 'Availability and locker details will be confirmed on WhatsApp.' : 'Delivery cost and availability will be confirmed on WhatsApp.';
                const useLocker = method.value === 'locker';
                locker.required = useLocker; locker.disabled = !useLocker;
                locker.parentElement.hidden = !useLocker; finder.hidden = !useLocker;
                locker.setCustomValidity('');
                if (!useLocker) delivery.textContent = 'Free collection from LWK. Collection arrangements will be confirmed on WhatsApp.';
                else delivery.textContent = freeDelivery ? 'Free locker delivery - Lone Wolf Klothing pays your delivery fee.'
                    : 'Spend ' + money((75001 - subtotalCents) / 100) + ' more to qualify for free locker delivery. Orders of R750 or less carry the courier delivery charge.';
            }
            method.addEventListener('change', updateMethod);
            updateMethod();
            const checkout = element('button', 'Order on WhatsApp', form);
            checkout.type = 'submit'; checkout.className = 'shop-checkout';
            element('p', 'Review your message and press Send in WhatsApp to place your enquiry.', form);
            form.addEventListener('submit', event => {
                event.preventDefault();
                customerName.setCustomValidity(customerName.value.trim() ? '' : 'Please enter your name.');
                const digits = phone.value.replace(/\D/g, '');
                phone.setCustomValidity(/^[+\d\s().-]+$/.test(phone.value) && digits.length >= 7 && digits.length <= 15 ? '' : 'Please enter a valid phone number.');
                locker.setCustomValidity(method.value !== 'locker' || locker.value.trim() ? '' : 'Please enter your preferred locker name and location.');
                if (!form.reportValidity()) return;
            const message = ['Hello, I would like to order:', ...state.cart.map(item => `${item.name}\nDesign: ${item.design}\nDescription: ${variantImageName(item) || variantDescription(item)}\nColor: ${item.color}\nSize: ${item.size}\nQuantity: ${item.quantity}\nUnit price: ${money(item.price)}\nLine total: ${money(item.price * item.quantity)}`), 'Subtotal: ' + money(subtotalCents / 100), depositText, balanceText, estimateNote, paymentTerms].join('\n\n');
                const customer = ['Order reference: ' + reference, 'Please include this reference on my confirmed quote and payment instructions.', 'Payment reference for deposit and balance: ' + reference, 'Customer name: ' + customerName.value.trim(), 'Phone number: ' + phone.value.trim(),
                    method.value === 'locker' ? 'Delivery: Courier Guy locker\nPreferred locker: ' + locker.value.trim() + '\nDelivery fee: ' + (freeDelivery ? 'Free - paid by LWK' : 'Courier quote to be confirmed') : 'Delivery: Collection from LWK\nDelivery fee: Free collection'].join('\n');
                window.open('https://wa.me/27615816059?text=' + encodeURIComponent(customer + '\n\n' + message), '_blank', 'noopener,noreferrer');
                thanks.textContent = 'Thank you for choosing Lone Wolf Klothing. Your Werewolf journey starts here! Send your enquiry in WhatsApp, then wait for confirmation and payment details. Your reference is ' + reference + '.';
            });
            const thanks = element('p', '', form);
            thanks.className = 'shop-enquiry-thanks';
            thanks.setAttribute('aria-live', 'polite');
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
        const selection = element('div');
        selection.className = 'product-logo-colour';
        selection.setAttribute('role', 'status');
        selection.setAttribute('aria-live', 'polite');
        selection.setAttribute('aria-atomic', 'true');
        const colourRow = purchase.querySelector('.color-row');
        if (colourRow) colourRow.after(selection);
        else purchase.insertBefore(selection, purchase.querySelector('.design-selector-row, .add-to-cart-button'));
        function updateLogoColour() {
            selection.replaceChildren();
            element('span', 'Logo color:', selection);
            const colours = logoColours(image.getAttribute('src'));
            colours.forEach(colour => {
                const chip = element('span', undefined, selection);
                chip.className = 'product-logo-chip';
                const swatch = element('span', undefined, chip);
                swatch.className = 'product-logo-swatch';
                swatch.style.backgroundColor = { white: '#fff', black: '#111', red: '#e32636', gold: '#d4af37' }[colour];
                swatch.setAttribute('aria-hidden', 'true');
                element('span', colour[0].toUpperCase() + colour.slice(1), chip);
            });
            if (!colours.length) element('span', 'See artwork preview', selection);
        }
        updateLogoColour();
        new MutationObserver(updateLogoColour).observe(image, { attributes: true, attributeFilter: ['src'] });
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
