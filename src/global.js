window.Webflow ||= [];
window.Webflow.push(() => {
  // HIDE EXIT INTENT AND SET OPACITY TO 0
  const exitIntent = document.getElementById('exit-intent');
  const hasTriggered =
    window.sessionStorage.getItem(`hasFiredPopup_${window.location}`) == 'true' ? true : false;

  if (!hasTriggered && exitIntent) {
    exitIntent.style.display = 'none';
    exitIntent.style.opacity = 0;

    // Trigger Popup on exit intent
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 0 && timer > 5000) showExitIntent('exit_page');
    });

    // Trigger Popup after XXX milliseconds
    const minutes = 0.75;
    const timerInterval = 1000; // in milliseconds
    let timer = 0;
    let hasFiredPopup = false;

    const timerIntervalId = setInterval(() => {
      timer += timerInterval;
      if (timer >= minutes * 60000 && !hasFiredPopup) {
        showExitIntent('time_on_page');
        hasFiredPopup = true;
        clearInterval(timerIntervalId);
      }
    }, timerInterval);

    // TRIGGER EXIT INTENT
    function showExitIntent(triggerType) {
      if (!hasFiredPopup) {
        exitIntent.style.display = 'flex';
        fadeIn(exitIntent, 250);

        dataLayer.push({
          event: 'show_exit_intent',
          dlv_01: triggerType,
        });

        hasFiredPopup = true;
        window.sessionStorage.setItem(`hasFiredPopup_${window.location}`, 'true');
      }
    }
  }

  // ... existing code ...
  const exitIntentAuditStep1 = document.querySelector('#wf-form-audit-popup-step-1');

  if (exitIntentAuditStep1) {
    const completionDate = calculateCompletionDate();
    document.querySelectorAll('#audit_completion_date, #audit_completion_date2').forEach((el) => {
      el.textContent = formatFriendlyDate(completionDate);
    });
    document.querySelector('input[name="audit_completion_date"]').value = completionDate;
    document.querySelector('input[name="audit_completion_date_text"]').value =
      formatFriendlyDate(completionDate);

    exitIntentAuditStep1.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form submission if needed

      const siteVal = exitIntentAuditStep1.querySelector('#audit_website_url').value;

      document.querySelectorAll('input[name="audit_website_identifier"]').forEach((input) => {
        input.value = siteVal;
      });

      document.querySelector('.modal_step1').style.display = 'none';
      document.querySelector('.modal_step2').style.display = 'block';
    });

    document.getElementById('wf-form-audit-popup-step-2').addEventListener('submit', () => {
      document.querySelector('.modal_step2').style.display = 'none';
      document.querySelector('.modal_step3').style.display = 'block';
    });

    document.getElementById('wf-form-audit-popup-step-3').addEventListener('submit', () => {
      document.querySelector('.modal_step3').style.display = 'none';
      document.querySelector('.modal_step4').style.display = 'block';
    });
  }

  function calculateCompletionDate() {
    const now = new Date();
    let completionDate = new Date(now.getTime() + 48 * 60 * 60 * 1000); // Add 48 hours

    // Adjust for weekends
    while (completionDate.getDay() === 0 || completionDate.getDay() === 6) {
      completionDate.setDate(completionDate.getDate() + 1);
    }

    return completionDate;
  }

  function formatFriendlyDate(date) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];

    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${month} ${day}${suffix}`;
  }

  /*-------------------------------------------------------*/
  /* UTM PARAMS                                            */
  /*-------------------------------------------------------*/

  const utmParams = new Map([
    ['utm_source', ''],
    ['utm_medium', ''],
    ['utm_campaign', ''],
    ['utm_term', ''],
    ['utm_content', ''],
  ]);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionData = {};
  const localData = {};

  // Function to format date in human-readable format
  const formatDate = (date) => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Store UTM params and GCLID
  for (const [param, _] of utmParams) {
    if (urlParams.has(param)) {
      const value = urlParams.get(param);
      sessionData[param] = value;
      if (!localStorage.getItem(`first_${param}`)) {
        localData[`first_${param}`] = value;
      }
    }
  }

  if (urlParams.has('gclid')) {
    const gclid = urlParams.get('gclid');
    sessionData.gclid = gclid;
    if (!localStorage.getItem('first_gclid')) {
      localData.first_gclid = gclid;
    }
  }

  // Store first page URL
  if (!localStorage.getItem('first_page_url')) {
    localData.first_page_url = window.location.href;
  }

  // Improved referrer handling
  const getReferrerDomain = (referrer) => {
    if (!referrer) return '';
    return new URL(referrer).hostname;
  };

  const referrerDomain = getReferrerDomain(document.referrer);

  // Better source and medium attribution
  const getUtmSource = () => {
    if (urlParams.has('utm_source')) return urlParams.get('utm_source');
    if (!referrerDomain) return 'direct';
    if (['google', 'bing', 'yahoo'].some((se) => referrerDomain.includes(se)))
      return referrerDomain.split('.')[1];
    return referrerDomain;
  };

  const getUtmMedium = () => {
    if (urlParams.has('utm_medium')) return urlParams.get('utm_medium');
    if (urlParams.has('gclid')) return 'cpc';
    if (!referrerDomain) return '';
    if (['google', 'bing', 'yahoo'].some((se) => referrerDomain.includes(se))) return 'organic';
    return 'referral';
  };

  const utmSource = getUtmSource();
  const utmMedium = getUtmMedium();

  sessionData.utm_source = utmSource;
  sessionData.utm_medium = utmMedium;

  if (!localStorage.getItem('first_utm_source')) {
    localData.first_utm_source = utmSource;
  }
  if (!localStorage.getItem('first_utm_medium')) {
    localData.first_utm_medium = utmMedium;
  }

  // Add timestamp for first touch
  if (!localStorage.getItem('first_touch_timestamp')) {
    const now = new Date();
    localData.first_touch_timestamp = formatDate(now);
  }

  // Batch set sessionStorage
  Object.entries(sessionData).forEach(([key, value]) => {
    sessionStorage.setItem(key, value);
  });

  // Batch set localStorage
  Object.entries(localData).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });

  // Function to populate a single form
  const populateForm = (form) => {
    utmParams.forEach((_, param) => {
      const input = form.querySelector(`input[name=${param}]`);
      if (input) input.value = sessionStorage.getItem(param) ?? '';

      const firstInput = form.querySelector(`input[name=first_${param}]`);
      if (firstInput) firstInput.value = localStorage.getItem(`first_${param}`) ?? '';
    });

    // Add GCLID to form if present
    const gclidInput = form.querySelector('input[name=gclid]');
    if (gclidInput) gclidInput.value = sessionStorage.getItem('gclid') ?? '';

    const firstGclidInput = form.querySelector('input[name=first_gclid]');
    if (firstGclidInput) firstGclidInput.value = localStorage.getItem('first_gclid') ?? '';

    // Add first touch timestamp to form
    const firstTouchInput = form.querySelector('input[name=first_touch_timestamp]');
    if (firstTouchInput)
      firstTouchInput.value = localStorage.getItem('first_touch_timestamp') ?? '';
  };

  // Populate all forms on the page
  const populateAllForms = () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(populateForm);
  };

  // Call the function to populate all forms
  populateAllForms();

  ///////////––––––––––––––––––– BREAK –––––––––––––––––––///////////

  // ELEMENT SCROLLED INTO VIEW
  function isScrolledIntoView(elem) {
    const { top, bottom } = elem.getBoundingClientRect();
    return bottom <= window.innerHeight && top >= 0;
  }

  // Helper functions
  function fadeIn(element, duration) {
    fade(element, 0, 1, duration);
  }

  function fade(element, start, end, duration, callback) {
    let opacity = start;
    const step = ((end - start) * 50) / duration;
    const timer = setInterval(() => {
      opacity += step;
      if ((step > 0 && opacity >= end) || (step < 0 && opacity <= end)) {
        clearInterval(timer);
        opacity = end;
        if (callback) callback();
      }
      element.style.opacity = opacity;
    }, 50);
  }
});
