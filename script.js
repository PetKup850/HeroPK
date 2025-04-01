document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar a");
  const parallaxLayer1 = document.querySelector(".layer1");
  const parallaxLayer2 = document.querySelector(".layer2");
  let currentSectionIndex = 0;

  function scrollToSection(index, duration) {
    const targetPosition = sections[index].offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        checkSectionVisibility(); // Kontrola viditelnosti po scrollování
      }
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  function checkSectionVisibility() {
    sections.forEach((section, index) => {
      const bentoItems = section.querySelectorAll(".bento-item");
      const sectionRect = section.getBoundingClientRect();
      const sectionHeight = sectionRect.height;
      const visibleHeight =
        Math.min(window.innerHeight, sectionRect.bottom) -
        Math.max(0, sectionRect.top);
      const visiblePercentage = (visibleHeight / sectionHeight) * 100;

      if (visiblePercentage >= 80 && index === currentSectionIndex) {
        setTimeout(() => {
          bentoItems.forEach((item) => {
            if (!item.classList.contains("cont")) {
              item.classList.remove("hidden");
              item.classList.add("visible");
            }
          });
        }, 300); // Zpoždění animace
      } else {
        bentoItems.forEach((item) => {
          item.classList.remove("visible");
          item.classList.add("hidden");
        });
      }
    });

    // Aktualizace aktivního odkazu
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (
        link.getAttribute("href").includes(sections[currentSectionIndex].id)
      ) {
        link.classList.add("active");
      }
    });
  }

  function removeVisibilityImmediately() {
    sections.forEach((section) => {
      const bentoItems = section.querySelectorAll(".bento-item");
      bentoItems.forEach((item) => {
        item.classList.remove("visible");
        item.classList.add("hidden");
      });
    });
  }

  function findActiveSectionIndex() {
    let activeSectionIndex = 0;
    navLinks.forEach((link, index) => {
      if (link.classList.contains("active")) {
        activeSectionIndex = index;
      }
    });
    return activeSectionIndex;
  }

  window.addEventListener("wheel", function (event) {
    if (event.deltaY > 0) {
      currentSectionIndex = Math.min(
        currentSectionIndex + 1,
        sections.length - 1
      );
    } else {
      currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
    }
    scrollToSection(currentSectionIndex, 1000); // Délka animace: 1000ms
  });

  // Event listener pro navigační odkazy
  navLinks.forEach((link, index) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      currentSectionIndex = index;
      scrollToSection(currentSectionIndex, 1000); // Délka animace: 1000ms
    });
  });

  // Událost pro scrollování, přidání parallax efektu
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY; // Aktuální pozice scrollu

    // Konstantní posun vrstev
    const parallaxOffset1 = scrollPosition * 0.02; // Úprava rychlosti (0.3 = pomalejší posun)
    const parallaxOffset2 = scrollPosition * 0.6; // Úprava rychlosti (0.6 = rychlejší posun)
    parallaxLayer1.style.transform = `translateY(${80 - parallaxOffset1}vh)`;
    parallaxLayer2.style.transform = `translateY(${80 - parallaxOffset2}vh)`;

    checkSectionVisibility(); // Aktualizace viditelnosti sekcí
  });

  // Událost při změně velikosti okna
  window.addEventListener("resize", function () {
    currentSectionIndex = findActiveSectionIndex();
    scrollToSection(currentSectionIndex, 1000); // Délka animace: 1000ms
  });

  // Kontrola viditelnosti a inicializace animace při načtení stránky
  checkSectionVisibility();

  // Apply animation on page load
  sections.forEach((section, index) => {
    const bentoItems = section.querySelectorAll(".bento-item");
    const sectionRect = section.getBoundingClientRect();
    const sectionHeight = sectionRect.height;
    const visibleHeight =
      Math.min(window.innerHeight, sectionRect.bottom) -
      Math.max(0, sectionRect.top);
    const visiblePercentage = (visibleHeight / sectionHeight) * 100;

    if (visiblePercentage >= 80) {
      setTimeout(() => {
        bentoItems.forEach((item) => {
          if (!item.classList.contains("cont")) {
            item.classList.remove("hidden");
            item.classList.add("visible");
          }
        });
      }, 300); // Delay the reveal animation by 300ms
    }
  });

  // Apply animation on refresh
  window.addEventListener("load", function () {
    checkSectionVisibility();
  });

  // Logo animation based on mouse position
  document.addEventListener("mousemove", (event) => {
    const logo = document.querySelector(".logo-placeholder img");

    if (!logo) return; // Kontrola, zda logo existuje

    const clientX = event.clientX;
    const clientY = event.clientY;
    const innerWidth = window.innerWidth; // Šířka viewportu
    const innerHeight = window.innerHeight; // Výška viewportu

    // Zajištění, že hodnoty jsou platné
    const mouseXPercent = innerWidth ? (clientX / innerWidth) * 100 : 50;
    const mouseYPercent = innerHeight ? (clientY / innerHeight) * 100 : 50;

    // Výpočet úhlu naklonění
    const tiltX = (mouseYPercent - 50) / 10 || 0; // Vertikální naklonění
    const tiltY = (50 - mouseXPercent) / 10 || 0; // Horizontální naklonění

    // Výpočet stínu
    const shadowX = -(mouseXPercent - 50) / 2 || 0; // Posun stínu horizontálně
    const shadowY = -(mouseYPercent - 50) / 2 || 0; // Posun stínu vertikálně

    // Nastavení transformace a stínu
    logo.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    logo.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.5)`;
  });
});
