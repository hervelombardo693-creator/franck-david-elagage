(function () {
  'use strict';

  var config = window.SITE_CONFIG || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Informations configurables ---------- */

  function applyConfig() {
    var services = config.services || {};

    // Prestations désactivées : retirées de la page et du formulaire
    document.querySelectorAll('[data-service]').forEach(function (el) {
      if (services[el.getAttribute('data-service')] === false) el.remove();
    });

    var phone = (config.phone || '').trim();
    var email = (config.email || '').trim();
    var hours = (config.hours || '').trim();
    var commune = (config.commune || '').trim();

    if (phone) {
      var tel = document.querySelector('[data-config-link="phone"]');
      tel.textContent = phone;
      tel.href = 'tel:' + phone.replace(/[^\d+]/g, '');
      show('phone');
    }
    if (email) {
      var mail = document.querySelector('[data-config-link="email"]');
      mail.textContent = email;
      mail.href = 'mailto:' + email;
      show('email');
    }
    if (hours) {
      document.querySelector('[data-config-text="hours"]').textContent = hours;
      show('hours');
    }
    if (commune) {
      var phrase = document.querySelector('[data-config="commune-phrase"]');
      if (phrase) {
        phrase.textContent = ', depuis ' + commune;
        phrase.hidden = false;
      }
    }
  }

  function show(key) {
    document.querySelectorAll('[data-config="' + key + '"]').forEach(function (el) {
      el.hidden = false;
    });
  }

  /* ---------- En-tête et menu mobile ---------- */

  function initHeader() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('menu-principal');
    var toTop = document.querySelector('.to-top');

    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      if (toTop) toTop.hidden = y < window.innerHeight * 1.2;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle__label').textContent = open ? 'Fermer' : 'Menu';
      header.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Retour à l'affichage bureau : on referme le menu mobile
    window.matchMedia('(min-width: 1180px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- Liens « Demander un devis » des prestations ---------- */

  function initQuoteLinks() {
    var select = document.getElementById('f-travaux');
    document.querySelectorAll('[data-travaux]').forEach(function (link) {
      link.addEventListener('click', function () {
        var value = link.getAttribute('data-travaux');
        var exists = Array.prototype.some.call(select.options, function (o) { return o.value === value; });
        if (exists) select.value = value;
      });
    });
  }

  /* ---------- Apparitions au défilement ---------- */

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    root.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Galerie : visionneuse ---------- */

  function initLightbox() {
    var dialog = document.getElementById('lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return; // sans support : le lien ouvre l'image

    var links = Array.prototype.slice.call(document.querySelectorAll('.gallery__link'));
    var img = dialog.querySelector('.lightbox__img');
    var caption = dialog.querySelector('.lightbox__caption');
    var current = 0;
    var opener = null;

    function render() {
      var link = links[current];
      var thumb = link.querySelector('img');
      img.src = link.getAttribute('href');
      img.alt = thumb.alt;
      caption.textContent = link.getAttribute('data-caption') + ' — photographie d\'illustration (' + (current + 1) + '/' + links.length + ')';
    }

    function go(step) {
      current = (current + step + links.length) % links.length;
      render();
    }

    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        opener = link;
        current = i;
        render();
        dialog.showModal();
        document.body.classList.add('no-scroll');
      });
    });

    dialog.querySelector('.lightbox__close').addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.lightbox__prev').addEventListener('click', function () { go(-1); });
    dialog.querySelector('.lightbox__next').addEventListener('click', function () { go(1); });

    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    // Clic sur le fond : fermeture
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('no-scroll');
      if (opener) opener.focus();
    });

    // Balayage sur mobile
    var startX = null;
    dialog.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
      startX = null;
    });
  }

  /* ---------- Formulaire de demande de devis ---------- */

  var MESSAGES = {
    nom: 'Indiquez votre nom.',
    commune: 'Indiquez la commune du chantier.',
    email: 'Indiquez votre adresse e-mail.',
    emailFormat: 'L\'adresse e-mail semble incorrecte (exemple : nom@domaine.fr).',
    telephone: 'Le numéro de téléphone semble incorrect.',
    travaux: 'Choisissez un type de travaux.',
    message: 'Décrivez votre projet en quelques mots.'
  };
  var LABELS = { nom: 'Nom', commune: 'Commune', email: 'E-mail', telephone: 'Téléphone', travaux: 'Type de travaux', message: 'Votre projet' };

  function initForm() {
    var form = document.getElementById('devis-form');
    var summary = document.getElementById('form-summary');
    var status = document.getElementById('form-status');

    function setError(field, message) {
      var err = document.getElementById(field.id + '-err');
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      field.closest('.field').classList.toggle('has-error', !!message);
      err.textContent = message || '';
      err.hidden = !message;
    }

    function validateField(field) {
      var v = field.value.trim();
      var name = field.name;
      if (field.required && !v) return MESSAGES[name];
      if (name === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MESSAGES.emailFormat;
      if (name === 'telephone' && v && !/^[+\d][\d\s.\-()]{7,}$/.test(v)) return MESSAGES.telephone;
      return '';
    }

    var fields = Array.prototype.slice.call(form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select, textarea'));

    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        if (field.value.trim() || field.getAttribute('aria-invalid') === 'true') setError(field, validateField(field));
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') setError(field, validateField(field));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      var errors = [];
      fields.forEach(function (field) {
        var msg = validateField(field);
        setError(field, msg);
        if (msg) errors.push({ field: field, msg: msg });
      });

      var list = summary.querySelector('ul');
      list.innerHTML = '';
      if (errors.length) {
        errors.forEach(function (item) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + item.field.id;
          a.textContent = LABELS[item.field.name] + ' : ' + item.msg;
          a.addEventListener('click', function (ev) { ev.preventDefault(); item.field.focus(); });
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        return;
      }
      summary.hidden = true;

      var to = (config.email || '').trim();
      if (!to) {
        status.classList.add('form-status--warn');
        status.textContent = 'Votre demande est complète, mais l\'adresse e-mail de Franck David n\'est pas encore configurée sur ce site : le message ne peut pas être préparé pour le moment. Merci de réessayer ultérieurement.';
        return;
      }

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };
      var subject = 'Demande de devis élagage — ' + get('commune');
      var body = [
        'Bonjour,',
        '',
        'Je souhaite obtenir un devis pour des travaux d\'élagage.',
        '',
        'Nom : ' + get('nom'),
        'E-mail : ' + get('email'),
        'Téléphone : ' + (get('telephone') || 'non précisé'),
        'Commune du chantier : ' + get('commune'),
        'Type de travaux : ' + get('travaux'),
        'Photos du chantier : ' + get('photos'),
        '',
        'Mon projet :',
        get('message'),
        '',
        'Cordialement,',
        get('nom')
      ].join('\r\n');

      var href = 'mailto:' + encodeURIComponent(to).replace(/%40/g, '@') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      status.classList.add('form-status--ok');
      status.textContent = 'Votre logiciel de messagerie devrait s\'ouvrir avec votre demande déjà rédigée. Vérifiez-la, joignez éventuellement vos photos, puis envoyez-la. Si rien ne s\'ouvre, écrivez directement à ' + to + '.';
      window.location.href = href;
    });
  }

  /* ---------- Année du copyright ---------- */

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  applyConfig();
  initHeader();
  initQuoteLinks();
  initReveal();
  initLightbox();
  initForm();
  initYear();
})();
