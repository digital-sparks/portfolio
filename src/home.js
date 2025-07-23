import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import Swiper from 'swiper';
import { Navigation, Pagination, Mousewheel, Keyboard, A11y } from 'swiper/modules';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(Observer, ScrollTrigger);

  document.querySelectorAll('.case-study_slide').forEach((slide, index) => {
    // const defaultWrap = slide.querySelector('.case-study_default-wrap');
    const hoverWrap = slide.querySelector('.case-study_hover-wrap');
    const cursor = slide.querySelector('.case-study_popup-open-button');
    const row1 = slide.querySelectorAll(
      '.case-study_hover-content h3, .case-study_hover-content .case-study_metrics-wrap'
    );
    const row2 = slide.querySelector('.case-study_hover-image-wrap');

    gsap.set(hoverWrap, { display: 'none', opacity: 0 });
    gsap.set(cursor, {
      y: '0.25rem',
      x: '-0.25rem',
    });
    gsap.set(row1, { yPercent: 15, opacity: 0 });
    gsap.set([row2], { yPercent: 5, opacity: 0 });

    let hasAnimatedNumbers = false;

    slide.addEventListener('mouseenter', () => {
      gsap
        .timeline({ defaults: { overwrite: true } })
        .to(hoverWrap, {
          display: 'block',
          opacity: 1,
          duration: 0.3,
        })
        .to(
          cursor,
          {
            y: '0rem',
            x: '0rem',
            ease: 'power2.out',
            delay: 0.1,
            duration: 0.4,
          },
          '<-0.2'
        )
        .to(
          row1,
          {
            yPercent: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 0.6,
          },
          '<0.05'
        )
        .to(
          row2,
          {
            yPercent: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 0.6,
          },
          '<+0.1'
        );

      slide.addEventListener('click', () => {
        const ariaId = slide.getAttribute('aria-controls');
        const popup = document.getElementById(ariaId);
        const modal = popup.querySelector('.popup_complete-modal');

        const exitEls = popup.querySelectorAll('[fs-modal-element^="close"]');
        // const counterElements = popup.querySelectorAll(
        //   '.case-study_modal-metrics-item .heading-style-h2'
        // );

        gsap.fromTo(
          modal,
          {
            y: '3rem',
            scale: 0.98,
          },
          {
            y: '0rem',
            duration: 0.5,
            scale: 1,
            ease: 'power3.out',
          }
        );

        // if (!hasAnimatedNumbers) {
        //   counterElements.forEach((element) => {
        //     const text = element.textContent;
        //     const match = text.match(/\d+/);

        //     if (match) {
        //       element.parentNode.style.height = `${element.parentNode.clientHeight}px`;
        //       element.parentNode.style.width = `${element.parentNode.clientWidth + 12}px`;

        //       const targetNumber = parseInt(match[0], 10);
        //       const prefix = text.slice(0, match.index);
        //       const suffix = text.slice(match.index + match[0].length);

        //       // Create a proxy object to animate
        //       const obj = { value: 0 };
        //       element.textContent = prefix + obj.value + suffix;

        //       setTimeout(() => {
        //         gsap.to(obj, {
        //           scrollTrigger: {
        //             trigger: element,
        //             start: 'center bottom',
        //             // markers: true,
        //           },
        //           value: targetNumber,
        //           duration: 1, // Animation duration in seconds
        //           ease: 'power2.out', // You can change this easing function
        //           onUpdate: function () {
        //             const currentValue = Math.round(obj.value);
        //             element.textContent = prefix + currentValue + suffix;
        //           },
        //           onComplete: function () {
        //             element.textContent = prefix + targetNumber + suffix;
        //           },
        //         });
        //       }, 200);
        //     }
        //   });
        //   hasAnimatedNumbers = true;
        // }

        exitEls.forEach((el) => {
          el.addEventListener('click', () => {
            gsap.fromTo(
              modal,
              { y: '0rem', scale: 1 },
              {
                y: '3rem',
                scale: 0.98,
                duration: 0.5,
                delay: 0.15,
                ease: 'power2.out',
              }
            );
          });
        });
      });
    });

    slide.addEventListener('mouseleave', () => {
      gsap
        .timeline()
        .to(row2, {
          yPercent: 5,
          opacity: 0,
          ease: 'power2.in',
          duration: 0.2,
          delay: 0.1,
        })
        .to(
          row1,
          {
            yPercent: 15,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.2,
          },
          '<'
        )
        .to(
          hoverWrap,
          {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              gsap.set(hoverWrap, { display: 'none' });
              gsap.set(cursor, { y: '0.25rem', x: '-0.25rem' });
            },
          },
          '<'
        );
    });

    cursor.addEventListener('mouseenter', () => {
      gsap.to(cursor, {
        x: '0.25rem',
        y: '-0.25rem',
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    cursor.addEventListener('mouseleave', () => {
      gsap.to(cursor, {
        x: '0rem',
        y: '0rem',
        duration: 0.2,
        ease: 'power2.out',
      });
    });
  });

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

  const caseStudySwiper = new Swiper('.case-study_container', {
    modules: [Mousewheel, Keyboard, Pagination, Navigation, A11y],
    wrapperClass: 'case-study_wrapper',
    slideClass: 'case-study_slide',
    slidesPerView: 'auto',
    direction: 'horizontal',
    spaceBetween: 16,
    grabCursor: true,
    loop: false,
    speed: 300,
    breakpoints: {
      768: {
        spaceBetween: 24,
        speed: 350,
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
      nextEl: document.querySelectorAll('.section_case-studies .navigation-button')[1],
      prevEl: document.querySelectorAll('.section_case-studies .navigation-button')[0],
    },
    pagination: {
      el: '.section_case-studies .swiper-controls_pagination',
      bulletClass: 'pagination-bullet',
      bulletActiveClass: 'is-active',
      clickable: true,
      renderBullet: function (index, className) {
        return (
          '<button type="button" class="' +
          className +
          ' is-dark" aria-label="Go to slide ' +
          (index + 1) +
          '"></button>'
        );
      },
    },
    on: {
      beforeInit: function (swiper) {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
        // swiper.wrapperEl.style.transitionTimingFunction = 'cubic-bezier(0.62, 0.01, 0.41, 0.99)';
      },
      init: function (swiper) {
        swiper.slides.forEach((slide) => {
          const logos = slide.querySelectorAll('.logo_icon');
          logos.forEach((logo) => {
            logo.width = logo.dataset.width;
            logo.height = logo.dataset.height;
          });
        });
      },
    },
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

  function initializeResourceAnimations(items = document) {
    let portfolioItems;

    if (items === document) {
      portfolioItems = document.querySelectorAll('.portfolio_item');
    } else {
      // Handle array of items
      portfolioItems = items.flatMap((item) => {
        if (item.element && item.element.classList.contains('portfolio_item')) {
          return [item.element];
        }
        return Array.from(item.element.querySelectorAll('.portfolio_item'));
      });
    }
    portfolioItems.forEach((item) => {
      if (!item.dataset.animationInitialized) {
        const cursor = item.querySelector('.portfolio_cursor');
        const thumbnail = item.querySelector('.portfolio_thumbnail img');
        const link = item.querySelector('a');

        gsap.set(cursor, {
          y: '0.5rem',
          x: '-0.5rem',
          opacity: 0,
        });

        link.addEventListener('mouseenter', () => {
          gsap
            .timeline()
            .to(cursor, {
              y: '0rem',
              x: '0rem',
              opacity: 1,
              duration: 0.35,
              ease: 'power2.out',
            })
            .to(
              thumbnail,
              {
                scale: 1.025,
                duration: 0.25,
              },
              '<'
            );
        });

        link.addEventListener('mouseleave', () => {
          gsap
            .timeline()
            .to(cursor, {
              y: '0.5rem',
              x: '-0.5rem',
              opacity: 0,
              duration: 0.25,
              ease: 'power2.out',
              overwrite: true,
            })
            .to(
              thumbnail,
              {
                scale: 1,
                duration: 0.25,
                overwrite: true,
              },
              '<'
            );
        });

        item.dataset.animationInitialized = 'true';
      }
    });
  }

  // Initialize for initial document load
  window.Webflow ||= [];
  window.Webflow.push(() => {
    initializeResourceAnimations();
  });

  // For the FSAttributes integration
  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    'list',
    (listInstances) => {
      const [listInstance] = listInstances;

      initializeResourceAnimations();

      listInstance.effect(() => {
        initializeResourceAnimations(listInstance.items.value);
      });
    },
  ]);

  const navHeight = document.querySelector('.nav_component').clientHeight;

  gsap.to('.section_case-studies', {
    scrollTrigger: {
      trigger: '.section_portfolio',
      start: `${navHeight}px bottom`,
      end: 'top top',
      scrub: true,
    },
    y: '5rem',
    // opacity: 0.5,
  });
});
