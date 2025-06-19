document.addEventListener('DOMContentLoaded', () => {
  // --- Environment Detection ---
  const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isDesktopExperience = isDesktop && !isCoarsePointer;

  // --- Core DOM Elements ---
  const splashScreen = document.getElementById('splash-screen');
  const splashFullGif = document.getElementById('splash-full-gif');
  const splashTextContainer = document.getElementById('splash-text-container');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileSidebarCloseButton = document.getElementById('mobile-sidebar-close-button');

  // --- Entry Animation Logic ---
  const runEntryAnimation = () => {
    if (!splashScreen) {
        console.error("Splash screen element not found. Skipping animation.");
        sidebar.classList.add('visible');
        mainContent.classList.add('visible');
        return;
    }

    if (isDesktopExperience) {
      // --- Desktop: Full GIF with Text on Top ---
      splashFullGif.style.display = 'block'; // Show the full GIF
        splashTextContainer.style.opacity = 0;
      const gifDisplayDuration = 3000; // Display for 2.5 seconds
      
      setTimeout(() => {
        splashScreen.classList.add('hidden'); // Fully fade out the splash container
        // Make site content visible instantly after splash
        sidebar.classList.add('visible');
        mainContent.classList.add('visible');
      }, gifDisplayDuration);
    } else {
      // --- Mobile/Tablet: Glow and Fade Text ---
      splashFullGif.style.display = 'block'; // Hide the GIF
      splashTextContainer.style.opacity = 0; // Make sure text is visible

      const mobileSplashDuration = 3000; // Display for 2 seconds

      setTimeout(() => {
        splashScreen.classList.add('hidden'); // Fade out splash
        // Fade in main content after splash fades
        sidebar.classList.add('visible');
        mainContent.classList.add('visible');
      }, mobileSplashDuration);
    }
  };

  window.onload = () => setTimeout(runEntryAnimation, 500);

  // --- Custom Animated Cursor (Desktop Only) ---
  if (isDesktopExperience) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactiveElements = document.querySelectorAll('.interactive');
    
    window.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      if (cursorDot) cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
      if (cursorOutline) cursorOutline.style.transform = `translate(${clientX}px, ${clientY}px)`;
    });

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  }

  // --- Mobile Sidebar Toggle Logic ---
  if (!isDesktop) {
    const openSidebar = () => {
      sidebar.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeSidebar = () => {
      sidebar.classList.remove('open');
      document.body.style.overflow = '';
    };

    mobileMenuButton.addEventListener('click', openSidebar);
    mobileSidebarCloseButton.addEventListener('click', closeSidebar);
    
    // Close sidebar when clicking a nav link
    sidebar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !mobileMenuButton.contains(event.target)) {
        closeSidebar();
      }
    });
  }

  // --- Set Current Year ---
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // --- Navigation & Content Switching Logic ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.main-section');
  
  let currentSectionId = 'about';

  const showSection = (targetId) => {
    sections.forEach(section => {
      section.style.display = (section.id === targetId) ? 'block' : 'none';
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === targetId);
    });
    currentSectionId = targetId;
  };
  
  showSection('about'); // Show 'About' section by default

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showSection(link.dataset.section);
      if(!isDesktop) closeSidebar(); // Also close sidebar on mobile nav click
    });
  });

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
    modalVideo.src = ''; // Stop video playback
  }

  projectCards.forEach(card => card.addEventListener('click', () => openModal(card)));
  closeModalBtn.addEventListener('click', closeModal);
  closeModalBtnFooter.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (event) => { if (event.target === projectModal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !projectModal.classList.contains('hidden')) closeModal(); });
});