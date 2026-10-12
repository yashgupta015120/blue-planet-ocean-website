(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Marine photo candidates. If a hosted image fails, try the next URL instead of
  // leaving a broken image icon on the page.
  const marineImages = {
    'open-ocean': [
      'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=2200&q=88',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=88',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2200&q=88'
    ],
    turtle: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=1000&q=85'
    ],
    whale: [
      'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=85'
    ],
    coral: [
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1400&q=88'
    ],
    reef: [
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1400&q=88'
    ],
    mangrove: [
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=88'
    ],
    polar: [
      'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=1400&q=88',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=88'
    ],
    shore: [
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=85',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=85',
      'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=2000&q=85'
    ],
    'deep-sea': [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=85',
      'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=2000&q=85',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=85'
    ]
  };

  function setMarineImage(img, groupName) {
    const candidates = marineImages[groupName] || marineImages['open-ocean'];
    let index = 0;
    img.classList.add('is-changing');
    img.onerror = () => {
      index += 1;
      if (index < candidates.length) {
        img.src = candidates[index];
      } else {
        img.classList.remove('is-changing');
        img.classList.add('image-unavailable');
        img.alt = `${img.alt || 'Marine habitat image'} — image unavailable; check your internet connection.`;
      }
    };
    img.onload = () => {
      img.classList.remove('is-changing', 'image-unavailable');
    };
    img.src = candidates[0];
  }

  document.querySelectorAll('img.marine-image[data-image-group]').forEach((img) => {
    setMarineImage(img, img.dataset.imageGroup);
  });

  // Mobile navigation.
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        mainNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  // Scroll progress and subtle hero depth.
  const scrollProgress = document.getElementById('scrollProgress');
  const heroImage = document.querySelector('.hero-image');
  let ticking = false;
  function updateScrollEffects() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    if (heroImage && !reducedMotion && window.scrollY < window.innerHeight) {
      heroImage.style.transform = `scale(1.04) translateY(${window.scrollY * 0.12}px)`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
  updateScrollEffects();

  // Progressive reveal animations, with a no-observer fallback.
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Ocean action checklist.
  const checkboxes = Array.from(document.querySelectorAll('.action-check input[type="checkbox"]'));
  const checklistProgress = document.getElementById('checklistProgress');
  function updateChecklist() {
    const checked = checkboxes.filter((checkbox) => checkbox.checked).length;
    if (!checklistProgress) return;
    checklistProgress.textContent = checked === checkboxes.length
      ? `All ${checkboxes.length} actions checked off. Keep the momentum moving. 🌊`
      : `${checked} of ${checkboxes.length} actions checked off. Every ripple counts.`;
  }
  checkboxes.forEach((checkbox) => checkbox.addEventListener('change', updateChecklist));

  // Habitat selector: text, accessible tab state, photo source, and labels update together.
  const habitatContent = {
    reef: {
      index: '01 / 04', mood: 'SHELTER · NURSERY · DIVERSITY', title: 'Coral reefs', emphasis: 'pulse.',
      description: 'Built by tiny coral animals over generations, reefs provide food and shelter for a remarkable variety of sea life. They can also reduce wave energy along some coastlines.',
      value: 'Reefs create complex homes for fish and invertebrates and support coastal livelihoods and local food webs.',
      action: 'Never stand on or touch coral, reduce pollution and emissions, and support science-led reef protection.',
      quote: '“A living city beneath the waves.”', imageGroup: 'reef', imageLabel: 'A CITY BUILT BY LIFE', imageAlt: 'Coral reef full of underwater life'
    },
    mangrove: {
      index: '02 / 04', mood: 'NURSERIES · CARBON · COASTAL SHIELDS', title: 'Mangrove forests', emphasis: 'hold fast.',
      description: 'Salt-tolerant mangrove trees grow where land meets tropical and subtropical seas. Their tangled roots shelter young fish and crustaceans while helping stabilise shorelines.',
      value: 'Mangroves provide nurseries for marine species, store carbon in their soils, and can reduce erosion and wave impacts.',
      action: 'Support locally led restoration, protect natural tidal flows, avoid littering, and back policies that conserve coastal wetlands.',
      quote: '“Roots that protect a whole coastline.”', imageGroup: 'mangrove', imageLabel: 'WHERE SEA MEETS SHORE', imageAlt: 'Coastal forest and mangrove habitat'
    },
    'open-ocean': {
      index: '03 / 04', mood: 'CURRENTS · CLIMATE · MIGRATION', title: 'Open ocean', emphasis: 'connects.',
      description: 'Far from shore, currents move heat and nutrients across the planet. Plankton form the base of many food webs, while tuna, sharks, turtles, and whales travel huge distances through open water.',
      value: 'Open-ocean food webs support marine biodiversity, help regulate climate, and connect distant ecosystems through currents and migration.',
      action: 'Choose responsible seafood, reduce your carbon footprint, dispose of fishing line safely, and support measures against illegal fishing.',
      quote: '“A blue highway with no borders.”', imageGroup: 'open-ocean', imageLabel: 'THE GREAT BLUE HIGHWAY', imageAlt: 'Sunlit blue ocean and underwater habitat'
    },
    polar: {
      index: '04 / 04', mood: 'ICE · FOOD WEBS · CLIMATE', title: 'Polar seas', emphasis: 'endure.',
      description: 'Cold Arctic and Antarctic waters support specialised wildlife, from krill and fish to seals, penguins, and whales. Seasonal sea ice creates habitat and shapes feeding and breeding patterns.',
      value: 'Polar ocean processes influence global climate, and seasonal ice is central to the lives of many species adapted to extreme conditions.',
      action: 'Cut climate pollution, support strong polar protections, choose responsible wildlife travel, and share evidence-based ocean science.',
      quote: '“A fragile edge that shapes the whole planet.”', imageGroup: 'polar', imageLabel: 'LIFE AT THE EDGE OF ICE', imageAlt: 'Polar sea and icy marine habitat'
    }
  };
  const habitatTabs = Array.from(document.querySelectorAll('.habitat-tab'));
  const habitatPanel = document.getElementById('habitatPanel');
  const habitatPhoto = document.getElementById('habitatPhoto');
  const habitatImageLabel = document.getElementById('habitatImageLabel');
  function selectHabitat(key, focusPanel = false) {
    const data = habitatContent[key];
    if (!data || !habitatPanel || !habitatPhoto) return;
    habitatTabs.forEach((tab) => {
      const active = tab.dataset.habitat === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    document.getElementById('habitatIndex').textContent = data.index;
    document.getElementById('habitatMood').textContent = data.mood;
    document.getElementById('habitatTitle').innerHTML = `${data.title} <em>${data.emphasis}</em>`;
    document.getElementById('habitatDescription').textContent = data.description;
    document.getElementById('habitatValue').textContent = data.value;
    document.getElementById('habitatAction').textContent = data.action;
    document.getElementById('habitatQuote').textContent = data.quote;
    habitatImageLabel.textContent = data.imageLabel;
    habitatPanel.setAttribute('aria-labelledby', `tab-${key}`);
    setMarineImage(habitatPhoto, data.imageGroup);
    habitatPhoto.alt = data.imageAlt;
    habitatPhoto.classList.add('is-changing');
    if (focusPanel) habitatPanel.focus({ preventScroll: true });
  }
  habitatTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectHabitat(tab.dataset.habitat));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % habitatTabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + habitatTabs.length) % habitatTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = habitatTabs.length - 1;
      else return;
      event.preventDefault();
      habitatTabs[nextIndex].focus();
      selectHabitat(habitatTabs[nextIndex].dataset.habitat);
    });
  });
  habitatTabs.forEach((tab) => { tab.tabIndex = tab.dataset.habitat === 'reef' ? 0 : -1; });
  selectHabitat('reef');

  // Feedback form: validate email, then show a clear demo confirmation.
  const feedbackForm = document.getElementById('feedbackForm');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const formResponse = document.getElementById('formResponse');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (feedbackForm && emailInput && emailError && formResponse) {
    emailInput.addEventListener('input', () => {
      emailError.textContent = '';
      formResponse.textContent = '';
      formResponse.classList.remove('is-error');
      emailInput.removeAttribute('aria-invalid');
    });
    feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      if (!emailPattern.test(email)) {
        emailError.textContent = 'Please enter a valid email address, such as you@example.com.';
        emailInput.setAttribute('aria-invalid', 'true');
        formResponse.textContent = '';
        emailInput.focus();
        return;
      }
      emailError.textContent = '';
      emailInput.removeAttribute('aria-invalid');
      formResponse.classList.remove('is-error');
      formResponse.textContent = '✓ Feedback submitted! Thank you for caring about ocean life. (Demo only — nothing was sent to a server.)';
      feedbackForm.reset();
    });
  }

  // Current year in footer.
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
