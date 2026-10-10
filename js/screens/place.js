// Pizzería detail: info, photos, reviews, favorite, check-in, write a review.

import { s } from '../strings.js';
import { navigate } from '../router.js';
import { get, isFavorite, toggleFavorite, reviewsFor, addReview, earn, hasCheckedIn, checkIn } from '../state.js';
import { places } from '../../data/places.js';
import { $, $$, esc, icon, ratingRow, stars, pizzaArt, toast, openSheet, requireAuth, notifyEarn, fmtDate, field, fieldError, emptyState } from '../ui.js';

let tab = 'about';

export function render(el, { params }) {
  const p = places.find((x) => x.id === Number(params.id));
  if (!p) { navigate('/home', { replace: true }); return; }
  let current = tab;

  const reviewItem = (r, mine) => `<li class="review">
    <div class="row row--between"><b>${mine ? esc(s.place.userReview) : esc(r.user)}</b><span class="muted small">${esc(fmtDate(r.date))}</span></div>
    ${stars(r.rating, 14)}<span class="sr-only">${esc(s.common.ratingOf(r.rating))}</span>
    <p>${esc(r.text)}</p>${r.photo ? `<p class="muted small">${icon('camera', { size: 14 })} ${esc(s.review.photoAdded)}</p>` : ''}</li>`;

  function panel() {
    if (current === 'about') {
      return `<p>${esc(p.desc)}</p>
        <dl class="facts">
          <div><dt>${icon('map-pin', { size: 18 })}${esc(s.place.address)}</dt><dd>${esc(p.address)}, ${esc(s.cities[p.city])}</dd></div>
          <div><dt>${icon('clock', { size: 18 })}${esc(s.place.hours)}</dt><dd>${esc(p.hours)}</dd></div>
          <div><dt>${icon('award', { size: 18 })}${esc(s.place.price)}</dt><dd>${esc(p.price)}</dd></div>
        </dl>`;
    }
    if (current === 'photos') {
      return `<div class="photos">${[0, 1, 2, 3, 4, 5].map((i) => `<div class="photos__item">${pizzaArt(p.id * 10 + i + 1, s.place.photoAlt(p.name, i + 1))}</div>`).join('')}</div>`;
    }
    const mine = reviewsFor(p.id);
    const all = [...mine.map((r) => reviewItem(r, true)), ...p.reviews.map((r) => reviewItem(r, false))];
    return `<div class="row row--between"><h2 class="h2">${esc(s.place.reviewsHeading(p.reviewCount + mine.length))}</h2></div>
      ${all.length ? `<ul class="reviews">${all.join('')}</ul>` : emptyState({ title: s.place.noReviews, text: '', art: true })}`;
  }

  function paint() {
    const fav = isFavorite(p.id);
    el.innerHTML = `
      <div class="place-hero">${pizzaArt(p.id, `Ilustración de pizza de ${p.name}`)}
        <div class="place-hero__bar">
          <button class="icon-btn icon-btn--float" data-back="/home" aria-label="${esc(s.place.back)}">${icon('chevron-left')}</button>
          <div class="row">
            <button class="icon-btn icon-btn--float" type="button" id="share" aria-label="${esc(s.place.share)}">${icon('share')}</button>
            <button class="icon-btn icon-btn--float" type="button" id="fav" aria-pressed="${fav}" aria-label="${esc(fav ? s.home.favRemove : s.home.favAdd)}">${icon('heart', { fill: fav })}</button>
          </div>
        </div>
      </div>
      <div class="page place-body">
        <div>
          <h1 class="h1">${esc(p.name)}</h1>
          <div class="row row--wrap">${ratingRow(p.rating, p.reviewCount)}<span class="status ${p.open ? 'status--ok' : 'status--off'}">${esc(p.open ? s.common.open : s.common.closed)}</span></div>
          <p class="muted small">${esc(p.area)} · ${esc(s.common.km(p.km))} · ${esc(p.price)}</p>
          <div class="tags">${p.styles.map((x) => `<span class="tag">${esc(s.styles[x])}</span>`).join('')}</div>
        </div>
        <div class="actions">
          <button class="btn btn--primary" type="button" id="write">${icon('message', { size: 20 })}${esc(s.place.write)}</button>
          <button class="btn btn--secondary" type="button" id="dir">${icon('navigation', { size: 20 })}${esc(s.place.directions)}</button>
          <button class="btn btn--secondary" type="button" id="checkin" ${hasCheckedIn(p.id) ? 'aria-disabled="true"' : ''}>${icon('check-circle', { size: 20 })}${esc(hasCheckedIn(p.id) ? s.place.checkedIn : s.place.checkin)}</button>
        </div>
        <div class="tabs" role="tablist" aria-label="${esc(s.place.tabsLabel)}">
          ${['about', 'photos', 'reviews'].map((k) => `<button class="tab" role="tab" id="tab-${k}" aria-selected="${k === current}" aria-controls="panel" tabindex="${k === current ? 0 : -1}" data-tab="${k}">${esc(s.place[k])}</button>`).join('')}
        </div>
        <div id="panel" role="tabpanel" aria-labelledby="tab-${current}" tabindex="0">${panel()}</div>
      </div>`;
    bind();
  }

  function bind() {
    $('#fav', el).addEventListener('click', () => {
      if (!requireAuth()) return;
      const on = toggleFavorite(p.id);
      toast(on ? s.home.favSaved : s.home.favRemoved, { type: on ? 'success' : 'info' });
      const st = el.scrollTop; paint(); el.scrollTop = st; $('#fav', el).focus();
    });
    $('#share', el).addEventListener('click', () => toast(s.place.shareToast, { type: 'info' }));
    $('#dir', el).addEventListener('click', () => toast(s.place.directionsToast, { type: 'info' }));
    $('#write', el).addEventListener('click', () => { if (requireAuth()) openReview(); });
    $('#checkin', el).addEventListener('click', () => {
      if (!requireAuth()) return;
      if (hasCheckedIn(p.id)) { toast(s.place.checkinAgain, { type: 'info' }); return; }
      checkIn(p.id);
      notifyEarn(earn('eating', p.name, { item: ['place', p.id] }), 'eating');
      paint();
    });
    const tabs = $$('[data-tab]', el);
    tabs.forEach((b, i) => {
      b.addEventListener('click', () => { current = tab = b.dataset.tab; const y = el.scrollTop; paint(); el.scrollTop = y; $(`#tab-${current}`, el).focus(); });
      b.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); tabs[(i + d + tabs.length) % tabs.length].click(); }
      });
    });
  }

  function openReview() {
    let rating = 0, photo = false;
    const r = s.review;
    openSheet({
      title: `${r.title} · ${p.name}`,
      html: `<form id="rf" class="stack" novalidate>
        <fieldset class="starinput"><legend class="label">${esc(r.rating)}</legend>
          <div class="starinput__row">${[1, 2, 3, 4, 5].map((i) => `<label class="starinput__star"><input type="radio" name="rating" value="${i}"><span class="sr-only">${esc(r.starsN(i))}</span>${icon('star', { size: 34 })}</label>`).join('')}</div>
          <p class="error" id="rating-err" role="alert" hidden></p></fieldset>
        ${field({ id: 'rtext', label: r.text, tag: 'textarea', ph: r.ph, attrs: 'required aria-required="true"' })}
        <button class="btn btn--secondary" type="button" id="photo" aria-pressed="false">${icon('camera', { size: 20 })}<span>${esc(r.photo)}</span></button>
        <button class="btn btn--primary btn--block" type="submit">${esc(r.cta)}</button></form>`,
      onMount: (sh, close) => {
        const labels = $$('.starinput__star', sh);
        const ratingErr = $('#rating-err', sh);
        $$('input[name=rating]', sh).forEach((inp) => inp.addEventListener('change', () => {
          rating = Number(inp.value);
          labels.forEach((l, i) => l.classList.toggle('is-on', i < rating));
          ratingErr.hidden = true;
        }));
        const text = $('#rtext', sh);
        text.addEventListener('blur', () => { if (text.value) fieldError(text, text.value.trim().length >= 10 ? '' : r.errText); });
        $('#photo', sh).addEventListener('click', (e) => {
          photo = !photo;
          e.currentTarget.setAttribute('aria-pressed', String(photo));
          $('span', e.currentTarget).textContent = photo ? `${r.photoAdded} · ${r.photoRemove}` : r.photo;
        });
        $('#rf', sh).addEventListener('submit', (e) => {
          e.preventDefault();
          let ok = true;
          if (!rating) { ratingErr.textContent = r.errRating; ratingErr.hidden = false; ok = false; $('input[name=rating]', sh).focus(); }
          if (text.value.trim().length < 10) { fieldError(text, r.errText); if (ok) text.focus(); ok = false; }
          if (!ok) return;
          addReview(p.id, { rating, text: text.value.trim(), photo });
          const res = earn('review', p.name, { item: ['place', p.id] });
          close();
          current = tab = 'reviews';
          paint();
          notifyEarn(res, 'review', r.thanks(res.awarded));
        });
      },
    });
  }

  paint();
}
