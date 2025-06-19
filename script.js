document.addEventListener('DOMContentLoaded', () => {
  // --- Splash Screen & Entry Animations ---
  const splashScreen = document.getElementById('splash-screen');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');

  // This sequence now runs on all devices
  window.onload = () => {
    setTimeout(() => {
      if (splashScreen) splashScreen.classList.add('hidden');
      if (sidebar) sidebar.classList.add('animate-slide-in');
      if (mainContent) mainContent.classList.add('animate-fade-in');
    }, 1500); // Show splash for at least half a second
  };


  // --- Custom Animated Cursor ---
  // Only run this on devices that are likely to have a mouse
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (!isCoarsePointer) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactiveElements = document.querySelectorAll('.interactive');

    window.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      if (cursorDot) {
          cursorDot.style.left = `${clientX}px`;
          cursorDot.style.top = `${clientY}px`;
      }
      if(cursorOutline){
          cursorOutline.animate({
              left: `${clientX}px`,
              top: `${clientY}px`
          }, { duration: 500, fill: 'forwards' });
      }
    });

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  }

  // --- Set Current Year ---
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  // --- Navigation Logic ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.main-section');
  const mainContentArea = document.querySelector('main.main-content-area');
  let currentSectionId = 'about'; 

  function updateActiveNav(targetId) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === targetId);
    });
  }

  function showSection(targetId) {
    sections.forEach(section => {
      const isTarget = section.id === targetId;
      section.style.display = isTarget ? 'block' : 'none';
      if (isTarget) {
        section.classList.remove('animate-fadeIn');
        void section.offsetWidth; 
        section.classList.add('animate-fadeIn');
      }
    });
    currentSectionId = targetId;
    updateActiveNav(targetId);
  }
  
  // Show 'about' by default without animation on initial load
  sections.forEach(s => {
      if (s.id === 'about') {
          s.style.display = 'block';
          s.classList.add('animate-fadeIn');
      } else {
          s.style.display = 'none';
      }
  });
  updateActiveNav('about');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); 
      const targetId = link.dataset.section;
      if (targetId && targetId !== currentSectionId) {
        if (mainContentArea) mainContentArea.scrollTop = 0;
        showSection(targetId);
      }
    });
  });

  // --- Project Modal Logic ---
  const projectModal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeModalBtnFooter = document.getElementById('closeModalBtnFooter');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalTechContainer = document.getElementById('modalTechContainer');
  const modalProjectLink = document.getElementById('modalProjectLink');
  const projectCards = document.querySelectorAll('.project-card');
  
  const modalImageContainer = document.getElementById('modalImageContainer');
  const modalImage = document.getElementById('modalImage');
  const modalVideoContainer = document.getElementById('modalVideoContainer');
  const modalVideo = document.getElementById('modalVideo');

  function openModal(card) {
    modalTitle.textContent = card.dataset.title;
    modalSubtitle.textContent = card.dataset.subtitle;
    modalDescription.textContent = card.dataset.description;
    
    modalTechContainer.innerHTML = ''; 
    if (card.dataset.tech) {
      card.dataset.tech.split(',').forEach(techName => {
        const techTag = document.createElement('span');
        techTag.className = 'tech-tag'; 
        techTag.textContent = techName.trim();
        modalTechContainer.appendChild(techTag);
      });
    }
    
    modalProjectLink.href = card.dataset.link || '#';
    modalProjectLink.classList.toggle('hidden', !card.dataset.link);

    modalImageContainer.style.display = 'none';
    modalVideoContainer.style.display = 'none';

    const videoUrl = card.dataset.video;
    const projectLink = card.dataset.link;
    const staticImageUrl = card.dataset.image;

    if (videoUrl && videoUrl.includes('your-video-id-here') === false) {
        modalVideo.src = videoUrl;
        modalVideoContainer.style.display = 'block';
    } else {
        let imageUrlToShow = '';
        if (projectLink && projectLink.includes('github.com')) {
            try {
                const url = new URL(projectLink);
                const [user, repo] = url.pathname.split('/').filter(Boolean);
                if (user && repo) {
                    imageUrlToShow = `https://socialify.git.ci/${user}/${repo}/image?theme=Dark&font=Inter&pattern=Plus`;
                }
            } catch (e) { console.error("Could not parse GitHub URL:", projectLink); }
        }

        if (imageUrlToShow) {
            modalImage.src = imageUrlToShow;
            modalImageContainer.style.display = 'block';
            modalImage.onerror = () => {
                if (staticImageUrl && staticImageUrl !== 'images/placeholder.png') {
                    modalImage.src = staticImageUrl;
                } else {
                    modalImageContainer.style.display = 'none';
                }
            };
        } else if (staticImageUrl && staticImageUrl !== 'images/placeholder.png') {
            modalImage.src = staticImageUrl;
            modalImageContainer.style.display = 'block';
        }
    }
    
    projectModal.classList.remove('hidden');
    projectModal.classList.add('flex'); 
    document.body.classList.add('modal-open');
    closeModalBtn.focus();
  }

  function closeModal() {
    projectModal.classList.add('hidden');
    projectModal.classList.remove('flex');
    document.body.classList.remove('modal-open');
    modalVideo.src = '';
  }

  projectCards.forEach(card => card.addEventListener('click', () => openModal(card)));

  closeModalBtn.addEventListener('click', closeModal);
  closeModalBtnFooter.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !projectModal.classList.contains('hidden')) closeModal();
  });
});