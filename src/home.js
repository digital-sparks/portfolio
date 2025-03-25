import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

window.Webflow ||= [];
window.Webflow.push(() => {
  // gsap.registerPlugin(Observer);
  gsap.registerPlugin(ScrollTrigger);

  // ————— MARQUEE SLIDER  ————— //

  document.querySelectorAll('.marquee_component').forEach((item) => {
    // clone marquee_wrapper to fill up space
    item.append(item.querySelector('.marquee_wrapper').cloneNode(true));

    let tl = gsap.timeline({ repeat: -1, onReverseComplete: () => tl.progress(1) });

    tl.to(item.querySelectorAll('.marquee_wrapper'), {
      xPercent: -100,
      duration: 200,
      ease: 'none',
    });
  });
  // ————— MARQUEE SLIDER  ————— //

  const button = document.querySelector('.portfolio_component .button');
  const items = document.querySelectorAll('.portfolio_component .portfolio_item');
  let itemShown = 4;

  button.addEventListener('click', () => {
    // Show next 4 items
    for (let i = itemShown; i < itemShown + 4 && i < items.length; i++) {
      items[i].style.display = 'block';
    }

    itemShown += 4;

    // If all items are shown, hide the button
    if (itemShown >= items.length) {
      button.parentNode.style.display = 'none';
    }
  });

  let testimonialSwiper = new Swiper('.testimonial_container', {
    modules: [Mousewheel, Keyboard, Pagination, Navigation],
    wrapperClass: 'testimonial_wrapper',
    slideClass: 'testimonial_slide',
    slidesPerView: 'auto',
    direction: 'horizontal',
    spaceBetween: 16,
    grabCursor: true,
    loop: true,
    loopAddBlankSlides: true,
    speed: 350,
    breakpoints: {
      768: {
        spaceBetween: 24,
        speed: 500,
      },
    },
    mousewheel: {
      enabled: true,
      forceToAxis: true,
      thresholdDelta: 5,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    pagination: {
      el: '.swiper-controls_pagination',
      type: 'bullets',
      bulletClass: 'pagination-bullet',
      bulletActiveClass: 'is-active',
      clickable: true,
    },
    navigation: {
      nextEl: document.querySelectorAll('.navigation-button')[1],
      prevEl: document.querySelectorAll('.navigation-button')[0],
    },
    on: {
      beforeInit: function (swiper) {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
      },
    },
  });

  ScrollTrigger.create({
    trigger: '.testimonial_container',
    start: 'top center',
    once: true,
    onEnter: () => {
      testimonialSwiper.slideNext();
    },
  });
});
