// GSAP is loaded via CDN in index.html
document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar scroll effect
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  }

  // 2. Interactive Tabs
  const tabBtns = document.querySelectorAll('.tab-btn-pill');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active classes
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Add active class to clicked button
      btn.classList.add('active');

      // Show corresponding tab pane
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      targetPane.classList.add('active');
    });
  });

  // 2b. Interactive Amenities Images
  const amenityLists = document.querySelectorAll('.interactive-amenities');
  amenityLists.forEach(list => {
    const items = list.querySelectorAll('.amenity-item');
    const imgElement = list.closest('.split-layout').querySelector('img');
    
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const newSrc = item.getAttribute('data-img');
        if (newSrc && imgElement) {
          gsap.to(imgElement, { opacity: 0, duration: 0.2, onComplete: () => {
            imgElement.src = newSrc;
            gsap.to(imgElement, { opacity: 1, duration: 0.2 });
          }});
        }
      });
    });
  });

  // 3. GSAP Animations

  // Hero Parallax Effect
  gsap.to('.hero-bg', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Section 5 Parallax Effect
  gsap.to('.cta-bg', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Simple Fade Up for texts and images on scroll
  const allFadeElements = document.querySelectorAll('.text-content, .image-content, .dark-card, .footer-col');
  const fadeElements = Array.from(allFadeElements).filter(el => !el.closest('.tabs-content'));
  
  fadeElements.forEach(el => {
    gsap.fromTo(el, 
      { 
        y: 40, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // 5. Image Modal (Lightbox with Zoom & Pan)
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector(".close-modal");
  const zoomableImages = document.querySelectorAll(".zoomable");

  if (modal && modalImg && closeBtn) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const updateTransform = () => {
      modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    zoomableImages.forEach(img => {
      img.addEventListener("click", () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        modalImg.style.transform = ''; 
        modalImg.classList.remove("no-transition");
        
        modal.classList.add("show");
        modalImg.src = img.src; 
      });
    });

    const closeModal = () => {
      modal.classList.remove("show");
      setTimeout(() => { 
        modalImg.src = ""; 
        modalImg.style.transform = '';
      }, 300);
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target !== modalImg) {
        closeModal();
      }
    });

    modalImg.addEventListener("wheel", (e) => {
      e.preventDefault();
      modalImg.classList.add("no-transition");

      const zoomFactor = 0.15;
      if (e.deltaY < 0) {
        scale += zoomFactor;
      } else {
        scale -= zoomFactor;
      }
      scale = Math.min(Math.max(0.5, scale), 5); 
      updateTransform();
    });

    modalImg.addEventListener("mousedown", (e) => {
      e.preventDefault();
      modalImg.classList.add("no-transition");
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  // 5b. Carousel Logic
  const carouselTrack = document.querySelector('.carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (carouselTrack && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -carouselTrack.clientWidth * 0.6, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: carouselTrack.clientWidth * 0.6, behavior: 'smooth' });
    });
  }

  // 6. Hamburger Menu Logic
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
    
    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
});
