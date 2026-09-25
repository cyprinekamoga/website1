/* JAGAA's Munchies — site behaviour */
(function () {
  'use strict';

  const PHONE = '0766189177';

  // Prices come straight from the JAGAA's Munchies snack menu poster.
  const MENU = [
    { id: 'donut', name: 'Donut', cat: 'sweet', img: 'images/donuts.jpg', icons: '🔥',
      desc: 'Golden, fluffy donuts fried fresh to order.',
      options: [{ label: '1 pc', price: 10 }, { label: '5 for', price: 50 }] },
    { id: 'mandazi', name: 'Mandazi', cat: 'sweet', img: 'images/mandazi.jpg', icons: '🔥',
      desc: 'Soft, lightly sweet fried dough bites — perfect with tea.',
      options: [{ label: '1 pc', price: 5 }, { label: '5 for', price: 30 }] },
    { id: 'pancake', name: 'Pancake', cat: 'sweet', img: 'images/pancakes.jpg',
      desc: 'Thick, fluffy pancakes — golden outside, soft inside.',
      options: [{ label: '1 pc', price: 10 }, { label: '5 for', price: 50 }] },
    { id: 'daddies', name: 'Daddies', cat: 'sweet', emoji: '🥨', icons: '🔥',
      desc: 'Crunchy bite-sized snacks, packed and ready to share.',
      options: [{ label: 'Small', price: 100 }, { label: 'Medium', price: 300 }, { label: 'Big', price: 500 }] },
    { id: 'samosa', name: 'Samosa', cat: 'savoury', img: 'images/samosa.jpg', icons: '🔥',
      desc: 'Crispy golden triangles with a savoury filling.',
      options: [{ label: '1 pc', price: 20 }, { label: '5 for', price: 100 }] },
    { id: 'eggroll', name: 'Egg Roll', cat: 'savoury', img: 'images/egg-roll.jpg', icons: '🥚 🔥',
      desc: 'A whole egg wrapped in seasoned potato, crumbed and fried.',
      options: [{ label: '1 pc', price: 50 }, { label: '5 for', price: 300 }] },
    { id: 'chapati', name: 'Chapati', cat: 'chapati', img: 'images/chapati.jpg',
      desc: 'Soft, layered flatbread cooked fresh on the pan.',
      options: [{ label: '1 pc', price: 15 }, { label: '5 for', price: 80 }] },
    { id: 'rolex', name: 'Rolex', cat: 'chapati', img: 'images/chapati.jpg', icons: '🥚',
      desc: 'The street classic: 1 chapati rolled up with 1 egg.',
      options: [{ label: '1 Rolex', price: 50 }] },
    { id: 'kikomando', name: 'Kikomando', cat: 'chapati', img: 'images/chapati.jpg', icons: '🫘',
      desc: '1 chapati served with beans — hearty and filling.',
      options: [{ label: '1 plate', price: 50 }] }
  ];
  const byId = Object.fromEntries(MENU.map(m => [m.id, m]));

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const kr = n => `${n} kr`;
  const optLabel = (o) => o.label === '5 for' ? `5 for ${kr(o.price)}` : `${o.label} · ${kr(o.price)}`;
  const thumb = (item, cls) => item.img
    ? `<img class="${cls}" src="${item.img}" alt="" loading="lazy">`
    : `<div class="${cls} ${cls === 'menu-item__img' ? 'menu-item__img--placeholder' : 'ph'}">${item.emoji}</div>`;

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2200);
  }

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger');
  const mobileMenu = $('#mobile-menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Menu tabs ---------- */
  const grid = $('#menu-grid');
  function renderMenu(cat) {
    const items = cat === 'all' ? MENU : MENU.filter(m => m.cat === cat);
    grid.innerHTML = items.map((m, i) => `
      <article class="menu-item" style="animation-delay:${i * 40}ms">
        ${thumb(m, 'menu-item__img')}
        <div>
          <div class="menu-item__top">
            <h3>${m.name}${m.icons ? `<span class="menu-item__icons">${m.icons}</span>` : ''}</h3>
            <span class="from">${m.options.length > 1 ? 'from ' : ''}${kr(m.options[0].price)}</span>
          </div>
          <p>${m.desc}</p>
          <div class="options">
            ${m.options.map((o, oi) => `
              <button class="opt" data-add="${m.id}" data-opt="${oi}" aria-label="Add ${m.name} ${o.label} ${kr(o.price)} to order">
                <svg aria-hidden="true"><use href="#i-plus"/></svg>${optLabel(o)}
              </button>`).join('')}
          </div>
        </div>
      </article>`).join('');
  }
  function selectTab(cat) {
    $$('.tab').forEach(t => {
      const on = t.dataset.tab === cat;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
      if (on) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
    renderMenu(cat);
  }
  $$('.tab').forEach(t => t.addEventListener('click', () => selectTab(t.dataset.tab)));
  $$('[data-tab-link]').forEach(a => a.addEventListener('click', () => selectTab(a.dataset.tabLink)));
  renderMenu('all');

  /* ---------- Cart ---------- */
  const STORE_KEY = 'jagaas-cart';
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { cart = {}; }

  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } };
  const lineKey = (id, opt) => `${id}:${opt}`;
  const lines = () => Object.entries(cart)
    .map(([key, qty]) => {
      const [id, opt] = key.split(':');
      const item = byId[id];
      const o = item && item.options[+opt];
      return o ? { key, item, opt: o, qty } : null;
    })
    .filter(Boolean);

  function addToCart(id, opt) {
    const key = lineKey(id, opt);
    cart[key] = (cart[key] || 0) + 1;
    save();
    renderCart(true);
    const item = byId[id];
    toast(`Added ${item.name} (${optLabel(item.options[opt])})`);
  }

  function changeQty(key, delta) {
    cart[key] = (cart[key] || 0) + delta;
    if (cart[key] <= 0) delete cart[key];
    save();
    renderCart();
  }

  function orderMessage(ls, total) {
    const rows = ls.map(l => `- ${l.qty} x ${l.item.name} (${optLabel(l.opt)}) = ${kr(l.qty * l.opt.price)}`);
    return `Hi JAGAA's Munchies! I'd like to order:\n${rows.join('\n')}\nTotal: ${kr(total)}\n\nPlease let me know how to pay and arrange delivery. Thank you!`;
  }

  function renderCart(bump) {
    const ls = lines();
    const count = ls.reduce((s, l) => s + l.qty, 0);
    const total = ls.reduce((s, l) => s + l.qty * l.opt.price, 0);

    $$('[data-cart-count]').forEach(b => {
      b.textContent = count;
      b.classList.toggle('has-items', count > 0);
      if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
    $$('[data-cart-total]').forEach(t => { t.textContent = kr(total); });

    const body = $('#cart-items');
    body.innerHTML = ls.length ? ls.map(l => `
      <div class="cart-line">
        ${thumb(l.item, '')}
        <div>
          <h4>${l.item.name}</h4>
          <small>${optLabel(l.opt)}</small>
        </div>
        <div class="qty">
          <button data-qty="${l.key}" data-delta="-1" aria-label="Remove one"><svg><use href="#i-minus"/></svg></button>
          <span>${l.qty}</span>
          <button data-qty="${l.key}" data-delta="1" aria-label="Add one"><svg><use href="#i-plus"/></svg></button>
        </div>
      </div>`).join('')
      : `<div class="drawer__empty"><div>🥯</div><p>Your order is empty.<br>Add some munchies from the menu!</p></div>`;

    const send = $('#send-order');
    send.classList.toggle('is-disabled', !ls.length);
    send.href = ls.length ? `sms:${PHONE}?body=${encodeURIComponent(orderMessage(ls, total))}` : `sms:${PHONE}`;
  }

  function setCart(open) {
    document.body.classList.toggle('cart-open', open);
    $('#cart').setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      addToCart(add.dataset.add, +add.dataset.opt || 0);
      if (add.classList.contains('opt')) {
        add.classList.add('is-added');
        setTimeout(() => add.classList.remove('is-added'), 900);
      }
      return;
    }
    const qty = e.target.closest('[data-qty]');
    if (qty) { changeQty(qty.dataset.qty, +qty.dataset.delta); return; }
    if (e.target.closest('[data-open-cart]')) { setMenu(false); setCart(true); return; }
    if (e.target.closest('[data-close-cart]')) { setCart(false); return; }
    const lb = e.target.closest('[data-lightbox-src]');
    if (lb) openLightbox(lb.dataset.lightboxSrc, lb.dataset.lightboxCaption || '');
  });

  renderCart();

  /* ---------- Lightbox ---------- */
  const lightbox = $('#lightbox');
  const lbImg = $('img', lightbox);
  const lbCap = $('figcaption', lightbox);
  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCap.textContent = caption;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    $('.lightbox__close', lightbox).focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeLightbox();
    setCart(false);
    setMenu(false);
  });

  /* ---------- Reviews carousel ---------- */
  const carousel = $('#carousel');
  const track = $('.carousel__track', carousel);
  const slides = $$('.review', track);
  const dotsWrap = $('.carousel__dots', carousel);
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Review ${i + 1}`);
    d.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(d);
  });
  const dots = $$('button', dotsWrap);

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.setAttribute('aria-selected', di === index));
  }
  const start = () => { stop(); timer = setInterval(() => go(index + 1), 5000); };
  const stop = () => clearInterval(timer);
  const restart = () => start();

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  // Swipe
  let startX = null;
  const viewport = $('.carousel__viewport', carousel);
  viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; stop(); });
  viewport.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    startX = null;
    start();
  });
  viewport.addEventListener('pointercancel', () => { startX = null; start(); });

  go(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
})();
