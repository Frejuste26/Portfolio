document.addEventListener('DOMContentLoaded', () => {
    // Select HTML elements
    const navItems = document.querySelectorAll('.nav-items');
    const subNavItems = document.querySelectorAll('.sub-nav-items');
    const downloadBtn = document.getElementById('downloadBtn');
    const formationSubSection = document.getElementById('formations');
    const experiencesSubSection = document.getElementById('experiences');
    const interestsSubSection = document.getElementById('interests');
    const sliderContent = document.querySelector('.slider-content');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const formationsContainer = document.querySelector('.formations-container');
    const formations = document.querySelectorAll('.formation');
    let currentIndex = 0;
    const intervalTime = 3000;

    downloadBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('./Assets/doc/cv.pdf');
            if (!response.ok) throw new Error('Fichier introuvable');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'cv.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        } catch (error) {
            alert('Erreur : Le fichier CV est introuvable.');
        }
    });

    // Function to change the active class of navigation links
    function changeActiveClass(currentSection) {
        const activeLinks = document.querySelectorAll('.nav-items.active');
        activeLinks.forEach((link) => link.classList.remove('active'));

        const activeLink = document.querySelector(`.nav-items[href="#${currentSection.id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Function for smooth vertical scrolling
    function smoothScroll(section) {
        const sectionOffsetTop = section.offsetTop;
        window.scrollTo({
            top: sectionOffsetTop,
            behavior: 'smooth',
        });
    }

    // Function to display the corresponding section and hide the others
    function displaySection(currentSection) {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section) => {
            if (section === currentSection) {
                section.classList.remove('d-none');
            } else {
                section.classList.add('d-none');
            }
        });
    }

    // Add event listeners to navigation links
    navItems.forEach((navItem) => {
        navItem.addEventListener('click', (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            const targetSectionId = event.target.closest('a').getAttribute('href');
            const targetSection = document.querySelector(targetSectionId);
            if (targetSection) {
                smoothScroll(targetSection);
                changeActiveClass(targetSection);
                displaySection(targetSection);
            }
        });
    });

    // Function to change the “visited” class of sub-navigation links
    function changeVisitedClass(currentSubSection) {
        const activeLinks = document.querySelectorAll('.sub-nav-items.visited');
        activeLinks.forEach((link) => link.classList.remove('visited'));

        const activeLink = document.querySelector(`.sub-nav-items[href="#${currentSubSection.id}"]`);
        if (activeLink) {
            activeLink.classList.add('visited');
        }
    }

    // Function to display the corresponding sub-section and hide the others
    function displaySubSection(currentSubSection) {
        const subSections = document.querySelectorAll('.sub-section');
        subSections.forEach((subSection) => {
            if (subSection === currentSubSection) {
                subSection.classList.remove('d-none');
            } else {
                subSection.classList.add('d-none');
            }
        });
    }

    // Add event listeners to sub-navigation links
    subNavItems.forEach((subNavItem) => {
        subNavItem.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSectionId = event.target.closest('a').getAttribute('href');
            const targetSection = document.querySelector(targetSectionId);
            if (targetSection) {
                displaySubSection(targetSection);
                smoothScroll(targetSection);
                changeVisitedClass(targetSection);
            }
        });
    });

    
    function updateSlider() {
        formations.forEach((formation, index) => {
            formation.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
        });
    }

    function nextFormation() {
        currentIndex = (currentIndex + 1) % formations.length;
        updateSlider();
    }

    let sliderInterval = setInterval(nextFormation, intervalTime);

    formationsContainer.addEventListener('mouseenter', () => {
        clearInterval(sliderInterval);
    });

    formationsContainer.addEventListener('mouseleave', () => {
        sliderInterval = setInterval(nextFormation, intervalTime);
    });

    updateSlider();
});
