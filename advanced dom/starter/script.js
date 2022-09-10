'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const imgTargets = document.querySelector('.features').querySelectorAll('.features__img');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//// added

document.querySelector('.nav__links').addEventListener('click', (event) => {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains('nav__link')) {
    const linkLocation = target.getAttribute('href');
    document.querySelector(linkLocation).scrollIntoView();
  }
});

const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = opacity;
    });
  }
};

nav.addEventListener('mouseover', (e) => handleHover(e, 0.5));
nav.addEventListener('mouseout', (e) => handleHover(e, 1));

// the below would also work, using "this" instead of "opacity" in the handleHover function
// nav.addEventListener('mouseout', (e) => handleHover.bind(1));

//// intersection observers

const headerObserverCallback = (entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(headerObserverCallback, { root: null, threshold: 0.01 });
headerObserver.observe(header);

//

const imgObserverCallback = (entries) => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('lazy-img');
  } else {
    entry.target.classList.add('lazy-img');
  }
};
const imgObserver = new IntersectionObserver(imgObserverCallback, { root: null, threshold: 0, rootMargin: '100px' });
imgTargets.forEach((img) => {
  imgObserver.observe(img);
});
