import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import Swiper from 'swiper';
import { Navigation, Pagination, Mousewheel, Keyboard, A11y } from 'swiper/modules';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(Observer, ScrollTrigger);

  gsap.matchMedia().add('(min-width: 992px)', () => {
    const serviceCardTl = gsap
      .timeline({
        paused: true,
      })
      .from('.services_card', {
        rotateZ: 0,
        opacity: 0,
        y: '2rem',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.25,
      });

    ScrollTrigger.create({
      trigger: '.services_cards-grid',
      start: 'top 90%',
      markers: false,
      onEnter: () => {
        serviceCardTl.play();
      },
    });
  });

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

  /* TESTIMONIALS SWIPER */
  let testimonialSwiper = new Swiper('.testimonial_container', {
    modules: [Mousewheel, Keyboard, Pagination, Navigation, A11y],
    wrapperClass: 'testimonial_wrapper',
    slideClass: 'testimonial_slide',
    slidesPerView: 'auto',
    direction: 'horizontal',
    spaceBetween: 16,
    grabCursor: true,
    loop: false,
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
    navigation: {
      nextEl: document.querySelectorAll('.section_success-stories .navigation-button.is-dark')[1],
      prevEl: document.querySelectorAll('.section_success-stories .navigation-button.is-dark')[0],
    },
    pagination: {
      el: '.section_success-stories .swiper-controls_pagination',
      bulletClass: 'pagination-bullet is-dark',
      bulletActiveClass: 'is-active',
      clickable: true,
    },
    on: {
      beforeInit: function (swiper) {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
        // swiper.wrapperEl.style.transitionTimingFunction = 'cubic-bezier(0.62, 0.01, 0.41, 0.99)';
      },
    },
  });
  /* TESTIMONIALS SWIPER */

  /* CASE STUDIES SWIPER */
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
    },
    on: {
      beforeInit: function (swiper) {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
        // swiper.wrapperEl.style.transitionTimingFunction = 'cubic-bezier(0.62, 0.01, 0.41, 0.99)';
      },
    },
  });
  /* CASE STUDIES SWIPER */
});
