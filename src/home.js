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

  const slideCount = document.querySelectorAll('.testimonial_slide').length;

  document.querySelectorAll('.testimonial_slide').forEach((slide) => {
    const clonedSlide = slide.cloneNode(true);
    document.querySelector('.testimonial_wrapper').appendChild(clonedSlide);
  });

  // Create pagination bullets upfront (only the original count)
  const paginationContainer = document.querySelector('.swiper-controls_pagination');
  paginationContainer.innerHTML = '';
  for (let i = 0; i < slideCount; i++) {
    const bullet = document.createElement('span');
    bullet.className = 'pagination-bullet';
    bullet.dataset.index = i;
    paginationContainer.appendChild(bullet);
  }

  let testimonialSwiper = new Swiper('.testimonial_container', {
    modules: [Mousewheel, Keyboard, Pagination, Navigation],
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
    navigation: {
      nextEl: document.querySelectorAll('.navigation-button')[1],
      prevEl: document.querySelectorAll('.navigation-button')[0],
    },
    on: {
      beforeInit: function (swiper) {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
      },
      init: function (swiper) {
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
    document.querySelectorAll('.pagination-bullet').forEach((bullet) => {
      bullet.classList.remove('is-active');
    });

    // Add active class to the correct bullet
    document.querySelectorAll('.pagination-bullet')[mappedIndex].classList.add('is-active');
  }

  ScrollTrigger.create({
    trigger: '.testimonial_container',
    start: 'top center',
    once: true,
    onEnter: () => {
      testimonialSwiper.slideNext();
    },
  });

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  gsap.matchMedia().add('(min-width: 992px)', () => {
    const scrollCards = gsap.utils.toArray('.scroll_card-item');
    const cardButtons = gsap.utils.toArray('.scroll_card-item .button');
    const nav = document.querySelector('.nav_component');
    const servicesTopWrapper = document.querySelector('.services_top-wrapper');
    const scrollComponent = document.querySelector('.scroll_component');
    const servicesSection = document.querySelector('.section_services');
    const scrollTriggers = [];
    const offset = 96; //184;

    const checkScrollCardsFit = () => {
      const viewportHeight = window.innerHeight - offset;
      const servicesTopWrapperHeight = servicesTopWrapper ? servicesTopWrapper.offsetHeight : 0;
      const gapBetweenElements = 64; // 4rem gap between services wrapper and cards

      // Find the tallest card
      const tallestCardHeight = scrollCards.reduce(
        (maxHeight, card) => Math.max(maxHeight, card.offsetHeight),
        0
      );

      // Check if both services wrapper and tallest card fit together (including gap)
      const bothFit =
        servicesTopWrapper &&
        servicesTopWrapperHeight + gapBetweenElements + tallestCardHeight + 40 <= viewportHeight; // 40px extra buffer

      // Check if just the tallest card fits (without services wrapper)
      const onlyCardsFit = tallestCardHeight <= viewportHeight;

      // Set sticky position for services top wrapper if both fit
      if (servicesTopWrapper) {
        gsap.set(servicesTopWrapper, {
          position: bothFit ? 'sticky' : 'static',
          top: bothFit ? `${offset / 16}rem` : 'auto',
        });
      }

      // Calculate top position for cards based on which elements are sticky
      const cardTopPosition = bothFit
        ? `${(offset + servicesTopWrapperHeight + gapBetweenElements) / 16}rem` // Position after services wrapper + 4rem gap
        : `${offset / 16}rem`; // Default position

      // Set card positions
      scrollCards.forEach((card) => {
        gsap.set(card, {
          position: bothFit || onlyCardsFit ? 'sticky' : 'static',
          top: bothFit || onlyCardsFit ? cardTopPosition : 'auto',
        });
      });

      // Create a scroll trigger to handle the services wrapper visibility
      // when reaching the last card
      if (scrollTriggers.length === 0 && bothFit && scrollCards.length > 0) {
        const lastCard = scrollCards[scrollCards.length - 1];

        scrollTriggers.push(
          ScrollTrigger.create({
            trigger: lastCard,
            start: `top ${offset + servicesTopWrapperHeight + gapBetweenElements}px`,
            end: `top ${offset + servicesTopWrapperHeight + gapBetweenElements - 100}px`,
            scrub: 1,
            animation: gsap.to(servicesTopWrapper, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out',
            }),
          })
        );
      }
    };

    const setupScrollAnimation = () => {
      // Add navigation animation for the services section
      if (servicesSection && nav) {
        scrollTriggers.push(
          ScrollTrigger.create({
            trigger: servicesSection,
            start: 'top 120',
            end: 'bottom 120',
            onEnter: () => {
              // Hide navigation when entering the section
              gsap.to(nav, {
                yPercent: -100,
                opacity: 1,
                ease: 'power1.out',
                duration: 0.35,
              });
            },
            onEnterBack: () => {
              // Hide navigation when scrolling back up into the section
              gsap.to(nav, {
                yPercent: -100,
                opacity: 1,
                ease: 'power1.out',
                duration: 0.35,
              });
            },
            onLeaveBack: () => {
              // Show navigation when scrolling above the section
              gsap.to(nav, {
                yPercent: 0,
                opacity: 1,
                ease: 'power1.out',
                duration: 0.35,
              });
            },
            onLeave: () => {
              // Show navigation when scrolling past the section
              gsap.to(nav, {
                yPercent: 0,
                opacity: 1,
                ease: 'power1.out',
                duration: 0.35,
              });
            },
          })
        );
      }

      scrollCards.forEach((card, index) => {
        scrollTriggers.push(
          ScrollTrigger.create({
            animation: gsap.to(card, {
              scale: 0.85,
              opacity: 0.5,
              transformOrigin: 'center 25%',
              ease: 'none',
            }),
            scrub: true,
            trigger: card,
            start: `10% ${offset}px`,
            end: 'bottom 64px',
            onLeave: () => gsap.set(card, { opacity: 0 }),
          })
        );
      });
    };

    checkScrollCardsFit();
    setupScrollAnimation();
    window.addEventListener('resize', debounce(checkScrollCardsFit, 250));

    return () => {
      gsap.set([...scrollCards, '.scroll_card-grid > div:last-child', nav, servicesTopWrapper], {
        clearProps: 'all',
      });
      gsap.set(scrollCards, {
        position: 'static',
        top: 'auto',
      });
      if (servicesTopWrapper) {
        gsap.set(servicesTopWrapper, {
          position: 'static',
          top: 'auto',
        });
      }
      scrollTriggers.forEach((trigger) => trigger.kill());
    };
  });
});
