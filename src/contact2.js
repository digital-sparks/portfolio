import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import Swiper from 'swiper';
import { Navigation, Pagination, Mousewheel, Keyboard, A11y } from 'swiper/modules';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(Observer, ScrollTrigger);

  const slideCount = document.querySelectorAll('.testimonial_slide').length;

  document.querySelectorAll('.testimonial_slide').forEach((slide) => {
    const clonedSlide = slide.cloneNode(true);
    document.querySelector('.testimonial_wrapper').appendChild(clonedSlide);
  });

  // Create pagination bullets upfront (only the original count)
  const paginationContainer = document.querySelector('.swiper-controls_pagination');
  paginationContainer.innerHTML = '';
  for (let i = 0; i < slideCount; i++) {
    const bullet = document.createElement('button');
    bullet.type = 'button';
    bullet.className = 'pagination-bullet';
    bullet.setAttribute('aria-label', 'Go to slide ' + i);
    bullet.setAttribute('tabindex', 0);
    bullet.dataset.index = i;
    paginationContainer.appendChild(bullet);
  }

  let testimonialSwiper = new Swiper('.testimonial_container', {
    modules: [Mousewheel, Keyboard, Pagination, Navigation, A11y],
    wrapperClass: 'testimonial_wrapper',
    slideClass: 'testimonial_slide',
    slidesPerView: 'auto',
    direction: 'horizontal',
    spaceBetween: 16,
    grabCursor: true,
    loop: true,
    initialSlide: slideCount - 1,
    speed: 350,
    breakpoints: {
      768: {
        spaceBetween: 24,
        speed: 400,
      },
    },
    mousewheel: {
      enabled: true,
      forceToAxis: true,
      thresholdDelta: 5,
      releaseOnEdges: false,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    pagination: {
      clickable: false,
      bulletClass: 'pagination-bullet',
      bulletActiveClass: 'is-active',
    },
    navigation: {
      nextEl: document.querySelectorAll('.section_success-stories .navigation-button')[1],
      prevEl: document.querySelectorAll('.section_success-stories .navigation-button')[0],
    },
    on: {
      beforeInit: function (swiper) {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
        // swiper.wrapperEl.style.transitionTimingFunction = 'cubic-bezier(0.62, 0.01, 0.41, 0.99)';
      },
      init: function (swiper) {
        swiper.slides.forEach((slide) => {
          const logo = slide.querySelector('.logo_icon');
          logo.width = logo.dataset.width;
          logo.height = logo.dataset.height;
        });
        // Set initial active bullet
        updateActiveBullet(swiper);
      },
      slideChange: function (swiper) {
        updateActiveBullet(swiper);
      },
    },
  });

  // Helper function to update the active bullet
  function updateActiveBullet(swiper) {
    // Get current actual index and map it to the original slide count range
    const mappedIndex = swiper.realIndex % slideCount;

    // Remove active class from all bullets
    document.querySelectorAll('.section_success-stories .pagination-bullet').forEach((bullet) => {
      bullet.classList.remove('is-active');
      bullet.removeAttribute('aria-current');
    });

    // Add active class to the correct bullet
    document
      .querySelectorAll('.section_success-stories .pagination-bullet')
      [mappedIndex].classList.add('is-active');
    document
      .querySelectorAll('.section_success-stories .pagination-bullet')
      [mappedIndex].setAttribute('aria-current', true);
  }

  ScrollTrigger.create({
    trigger: '.testimonial_container',
    start: 'top center',
    once: true,
    onEnter: () => {
      testimonialSwiper.slideNext();
    },
  });
});
