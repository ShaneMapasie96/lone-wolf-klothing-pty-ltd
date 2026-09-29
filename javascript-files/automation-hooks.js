/* Public automation hooks. Keep existing functional IDs and accessible names intact. */
(() => {
    'use strict';
    const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const hash = value => {
        let result = 2166136261;
        for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
        return (result >>> 0).toString(16);
    };
    const scopes = '.navbar-container, footer, main, form, .item, .shop-item, .product-filters, .shop-dialog, .hero-visual';
    const targets = 'a, button, input, select, textarea, summary, img, h1, h2, h3, nav, section, [role="button"], [role="status"], .color[data-color], .price, .shop-item-price, .shop-deposit, .shop-balance, .shop-order-reference';
    function identify(node, testid, scope = '') {
        if (!node.dataset.testid) node.dataset.testid = testid;
        if (node.id) return;
        const base = 'auto-' + [scope, node.dataset.testid].filter(Boolean).join('-');
        let id = base, suffix = 2;
        while (document.getElementById(id)) id = `${base}-${suffix++}`;
        node.id = id;
    }
    function annotate() {
        document.querySelectorAll(scopes).forEach(node => {
            let key;
            if (node.matches('.item')) {
                node.dataset.productId ||= node.querySelector('img[id]')?.id || slug(node.querySelector('h3')?.textContent);
                key = 'product-' + node.dataset.productId;
            } else if (node.matches('.shop-item')) {
                key = `${node.dataset.collection}-item-${hash(node.dataset.itemKey || '')}`;
            } else if (node.matches('.navbar-container')) key = 'site-header';
            else if (node.matches('footer')) key = 'site-footer';
            else if (node.matches('main')) key = 'main-content';
            else key = node.id || node.classList[0] || node.tagName.toLowerCase();
            identify(node, key);
        });
        document.querySelectorAll(targets).forEach(node => {
            const scope = node.parentElement?.closest(scopes)?.dataset.testid || 'page';
            const tag = node.tagName.toLowerCase();
            if (node.matches('.color[data-color]')) node.dataset.testid = 'colour-' + slug(node.dataset.color);
            let key = node.dataset.testid;
            if (!key && node.matches('.color[data-color]')) key = 'colour-' + slug(node.dataset.color);
            if (!key && node.hasAttribute('data-hero-image')) key = 'hero-slide-' + node.dataset.heroImage;
            if (!key && node.hasAttribute('data-colour')) key = 'filter-colour-' + (slug(node.dataset.colour) || 'all');
            if (!key && node.matches('input, select, textarea')) key = 'field-' + (node.closest('.shop-item') ? 'quantity' : slug(node.name || node.id || node.type));
            if (!key && node.id && !node.id.startsWith('auto-')) key = node.id;
            if (!key && node.matches('button, [role="button"], summary')) key = slug(node.getAttribute('aria-label') || node.textContent || node.classList[0] || tag);
            if (!key && tag === 'a') key = 'link-' + slug(node.getAttribute('aria-label') || node.textContent || node.classList[0] || node.getAttribute('href'));
            if (!key) key = node.classList[0] || slug(node.getAttribute('aria-label')) || tag;
            identify(node, key, scope);
            // Connect existing visible labels without replacing their accessible names.
            if (node.matches('input, select, textarea')) {
                const label = node.closest('label');
                if (label && !label.htmlFor) label.htmlFor = node.id;
            }
            if (node.matches('button') && !node.hasAttribute('type') && !node.closest('form')) node.type = 'button';
        });
        document.documentElement.dataset.automationReady = 'true';
    }
    annotate();
    // Product designs and dialog views replace controls after initial page load.
    new MutationObserver(records => {
        if (records.some(record => record.type === 'attributes' || record.addedNodes.length)) annotate();
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-color', 'data-colour'] });
})();
