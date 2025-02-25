document.addEventListener('DOMContentLoaded', () => {
    // Select HTML elements
    const navItems = document.querySelectorAll('.nav-items');
    const subNavItems = document.querySelectorAll('.sub-nav-items');
    const downloadBtn = document.getElementById('downloadBtn');
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

    function displaySection(currentSection) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
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

    // Function to change the "visited" class of sub-navigation links
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

    fetch('./data.json').then(response => response.json())
        .then(
            data => {
                const subSections = ["formations", "experiences", "interests"];
                let currentSubSection = "formations";
                let idx = 0;

                const displaySlides =  (subSection) => {
                    const sliderContent = document.querySelector('.slider-content');
                    sliderContent.innerHTML = ``;
                    data[subSection].forEach(item => {
                        const slide = document.createElement('div');
                        slide.classList.add('formation');
                        slide.innerHTML = `
                            <img id="slide-logo" src="${item.logo}" alt="${item.structure}">
                            <h3 class="slide-title">${item.structure}</h3>
                            <p class="slide-text">${item.title}</p>
                        `;
                        sliderContent.appendChild(slide);
                    });
                }
                displaySlides(currentSubSection);
            }
        );
    
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

    // Ajout de la gestion des filtres portfolio
    function initPortfolioFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                filterProjects(filter);
            });
        });
    }

    // Ajout des indicateurs de slider
    function createSliderIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'slider-indicators';
        
        formations.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `indicator ${index === currentIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(dot);
        });
        
        formationsContainer.appendChild(indicators);
    }

    // Amélioration de la gestion du formulaire
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        const submitBtn = form.querySelector('.submit-btn');
        let messageTimeout;

        function showMessage(type, text) {
            const message = document.createElement('div');
            message.className = `form-message ${type}`;
            message.textContent = text;
            document.body.appendChild(message);

            clearTimeout(messageTimeout);
            messageTimeout = setTimeout(() => {
                message.style.animation = 'slideOut 0.5s forwards';
                setTimeout(() => message.remove(), 500);
            }, 3000);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.classList.add('loading');

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                // Simulation d'envoi (à remplacer par votre logique d'envoi)
                await new Promise(resolve => setTimeout(resolve, 1500));

                showMessage('success', 'Message envoyé avec succès !');
                form.reset();

                // Réinitialiser les états des labels
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('focused');
                });

            } catch (error) {
                showMessage('error', 'Erreur lors de l\'envoi du message.');
                console.error('Erreur:', error);
            } finally {
                submitBtn.classList.remove('loading');
            }
        });

        // Gestion des états de focus
        form.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Maintenir l'état si le champ a une valeur
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    // Fonction pour filtrer les projets
    function filterProjects(filter) {
        const projects = document.querySelectorAll('.portfolio-item');
        const buttons = document.querySelectorAll('.filter-btn');
        
        // Mise à jour des boutons actifs
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        projects.forEach(project => {
            if (filter === 'all' || project.dataset.type === filter) {
                project.style.display = 'block';
                project.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                project.style.display = 'none';
            }
        });
    }

    // Fonction pour charger les projets
    function loadProjects(data) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        data.projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'portfolio-item';
            projectElement.dataset.type = project.type;
            
            const imgSrc = project.logo || './Assets/img/default.png';
            
            projectElement.innerHTML = `
                <div class="project-header">
                    <img src="${imgSrc}" alt="${project.title}" onerror="this.src='./Assets/img/default.png'">
                    <div class="project-status ${project.status.toLowerCase()}">
                        ${project.status}
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.techno.split(',').map(tech => `
                            <span class="tech-tag">
                                <i class="fi fi-br-code"></i>
                                ${tech.trim()}
                            </span>
                        `).join('')}
                    </div>
                    <a href="${project.repository}" target="_blank" class="project-link">
                        <i class="fi fi-br-link"></i>
                        Voir le projet
                    </a>
                </div>
            `;
            portfolioGrid.appendChild(projectElement);
        });
    }

    // Fonction pour mettre à jour les indicateurs du slider
    function updateSliderIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Fonction pour aller à une slide spécifique
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
        updateSliderIndicators();
    }

    // Initialiser les nouvelles fonctionnalités
    createSliderIndicators();
    initContactForm();
    
    // Animation des barres de compétences
    function initSkillsAnimation() {
        const skillBars = document.querySelectorAll('.skill-progress');
    
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const level = entry.target.dataset.level;
                    entry.target.style.width = level + '%';
                    observer.unobserve(entry.target); // Ne pas réanimer à chaque scroll
                }
            });
        }, { threshold: 0.5 });
    
        skillBars.forEach(bar => observer.observe(bar));
    }
    

    // Fonction pour charger les compétences
    function loadSkills(data) {
        const skillsContainer = document.querySelector('#knowlege');
        if (!skillsContainer) return;

        // Fonction pour créer une carte de compétence
        function createSkillCard(skill) {
            return `
                <div class="skill-card">
                    <div class="skill-header">
                        <img src="${skill.icon}" alt="${skill.title || skill.name}" class="skill-icon" onerror="this.src='./Assets/img/default.png'">
                        <div class="skill-info">
                            <h3 class="skill-name">${skill.title || skill.name}</h3>
                            ${skill.type ? `<span class="skill-category" data-category="${skill.type}">${skill.type}</span>` : ''}
                        </div>
                    </div>
                    <div class="skill-level-wrapper">
                        <div class="skill-level">
                            <div class="skill-progress" style="width: 0%" data-level="${skill.level}"></div>
                        </div>
                        <span class="skill-percentage">${skill.level}%</span>
                    </div>
                    ${skill.description ? `<div class="skill-tooltip">${skill.description}</div>` : ''}
                </div>
            `;
        }

        // Fonction pour charger une catégorie spécifique
        function loadCategory(categoryId) {
            const section = document.getElementById(categoryId);
            if (!section || !data.skills[categoryId]) return;

            const skillsGrid = document.createElement('div');
            skillsGrid.className = 'skills-grid';
            
            data.skills[categoryId].forEach(skill => {
                skillsGrid.innerHTML += createSkillCard(skill);
            });

            // Garder le titre h2 et ajouter la grille après
            const title = section.querySelector('h2');
            section.innerHTML = '';
            section.appendChild(title);
            section.appendChild(skillsGrid);

            // Initialiser l'animation des barres de progression
            initSkillsAnimation();
        }

        // Animation des barres de progression
        function initSkillsAnimation() {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target;
                        const level = progressBar.getAttribute('data-level');
                        // Attendre un court instant pour que l'animation soit visible
                        setTimeout(() => {
                            progressBar.style.width = `${level}%`;
                        }, 200);
                        observer.unobserve(progressBar);
                    }
                });
            }, { threshold: 0.5 });

            document.querySelectorAll('.skill-progress').forEach(bar => {
                observer.observe(bar);
            });
        }

        // Gestion de la navigation entre les catégories
        const subNavItems = skillsContainer.querySelectorAll('.sub-nav-items');
        const skillsItems = skillsContainer.querySelectorAll('.skills-item');

        subNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);

                // Mise à jour des classes actives
                subNavItems.forEach(nav => nav.classList.remove('visited'));
                item.classList.add('visited');

                // Affichage de la section correspondante
                skillsItems.forEach(section => {
                    if (section.id === targetId) {
                        section.classList.remove('d-none');
                        loadCategory(targetId);
                    } else {
                        section.classList.add('d-none');
                    }
                });
            });
        });

        // Charger la première catégorie par défaut
        loadCategory('languages');
    }

    // Fonction pour charger les expériences
    function loadExperiences(data) {
        const experiencesContainer = document.querySelector('#experiences');
        if (!experiencesContainer) return;

        const timeline = document.createElement('div');
        timeline.className = 'timeline';

        data.experiences.forEach(experience => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <img src="${experience.logo}" alt="${experience.structure}" 
                         class="timeline-logo" onerror="this.src='./Assets/img/default.png'">
                    <h3 class="timeline-title">${experience.title}</h3>
                    <div class="timeline-structure">${experience.structure}</div>
                    <div class="timeline-date">${experience.date || 'En cours'}</div>
                    ${experience.description ? `<p class="timeline-description">${experience.description}</p>` : ''}
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });

        experiencesContainer.appendChild(timeline);

        // Animation au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }

    // Fonction pour charger les intérêts
    function loadInterests(data) {
        const interestsContainer = document.querySelector('#interest');
        if (!interestsContainer) return;

        const interestsGrid = document.createElement('div');
        interestsGrid.className = 'interests-grid';

        data.interests.forEach((interest, index) => {
            const card = document.createElement('div');
            card.className = 'interest-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <img src="${interest.logo}" 
                     alt="${interest.title}" 
                     class="interest-image"
                     onerror="this.src='./Assets/img/default.png'">
                <div class="interest-overlay">
                    <h3 class="interest-title">${interest.title}</h3>
                    <p class="interest-structure">${interest.structure}</p>
                </div>
            `;

            interestsGrid.appendChild(card);
        });

        interestsContainer.appendChild(interestsGrid);

        // Animation au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.interest-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Charger les projets une fois les données récupérées
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            loadProjects(data);
            loadSkills(data);
            initPortfolioFilters();
            initProjectSearch();
            initFormationsSlider(data);
            loadExperiences(data);
            loadInterests(data);
        })
        .catch(error => console.error('Erreur:', error));

    // Gestion de l'indicateur de scroll pour la sidebar
    function initScrollIndicator() {
        const sidebar = document.querySelector('.sidebar');
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            sidebar.style.setProperty('--scroll-height', `${scrollPercent}%`);
            
            if (scrollPercent > 0) {
                sidebar.classList.add('scrolled');
            } else {
                sidebar.classList.remove('scrolled');
            }
        });
    }

    initScrollIndicator();

    // Fonction pour afficher tous les projets
    function showAllProjects() {
        const projects = document.querySelectorAll('.portfolio-item');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        // Réinitialiser les boutons de filtre
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });

        // Afficher tous les projets avec animation
        projects.forEach(project => {
            project.style.display = 'block';
            project.style.animation = 'fadeIn 0.5s ease forwards';
        });
    }

    // Fonction de recherche améliorée
    function initProjectSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        // Création de la barre de recherche
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'project-search';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher un projet par nom, technologie ou type...';
        
        const searchStatus = document.createElement('div');
        searchStatus.className = 'search-status';
        searchStatus.innerHTML = 'Recherche...';
        
        const searchDecoration = document.createElement('div');
        searchDecoration.className = 'search-decoration';
        
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        
        // Assemblage des éléments
        searchWrapper.appendChild(searchInput);
        searchWrapper.appendChild(searchStatus);
        searchWrapper.appendChild(searchDecoration);
        searchContainer.appendChild(searchWrapper);
        searchContainer.appendChild(suggestions);
        
        // Insertion dans le DOM
        const portfolioSection = document.querySelector('#portfolio');
        portfolioSection.insertBefore(searchContainer, portfolioSection.querySelector('.portfolio-filters'));

        let searchTimeout;
        let activeIndex = -1;

        // Fonction de recherche
        function performSearch(searchTerm) {
            const projects = document.querySelectorAll('.portfolio-item');
            const matchingProjects = [];
            
            projects.forEach(project => {
                const title = project.querySelector('h3').textContent.toLowerCase();
                const description = project.querySelector('p').textContent.toLowerCase();
                const techStack = project.querySelector('.project-tech').textContent.toLowerCase();
                const type = project.dataset.type.toLowerCase();
                
                if (title.includes(searchTerm) || 
                    description.includes(searchTerm) || 
                    techStack.includes(searchTerm) ||
                    type.includes(searchTerm)) {
                    matchingProjects.push({
                        title: project.querySelector('h3').textContent,
                        type: project.dataset.type,
                        element: project,
                        techStack: project.querySelector('.project-tech').textContent
                    });
                    project.style.display = 'block';
                    project.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    project.style.display = 'none';
                }
            });

            return matchingProjects;
        }

        // Fonction pour afficher les suggestions
        function displaySuggestions(matchingProjects) {
            if (matchingProjects.length > 0) {
                suggestions.innerHTML = matchingProjects.map((project, index) => `
                    <div class="suggestion-item ${index === activeIndex ? 'active' : ''}" 
                         data-project-id="${project.element.id || ''}"
                         role="option"
                         aria-selected="${index === activeIndex}">
                        <div class="suggestion-icon">
                            <i class="fi fi-br-apps"></i>
                        </div>
                        <div class="suggestion-text">
                            <div class="suggestion-title">${project.title}</div>
                            <div class="suggestion-category">${project.type}</div>
                            <div class="suggestion-tech">${project.techStack}</div>
                        </div>
                    </div>
                `).join('');
            } else {
                suggestions.innerHTML = '<div class="suggestion-item no-results">Aucun projet trouvé</div>';
            }
        }

        // Gestionnaire d'événements pour l'input
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            clearTimeout(searchTimeout);
            
            if (searchTerm.length > 0) {
                searchStatus.classList.add('searching');
                searchContainer.classList.add('active');
                searchWrapper.classList.add('active');
                
                searchTimeout = setTimeout(() => {
                    const matchingProjects = performSearch(searchTerm);
                    displaySuggestions(matchingProjects);
                    searchStatus.classList.remove('searching');
                    activeIndex = -1;
                }, 300);
            } else {
                searchContainer.classList.remove('active');
                searchWrapper.classList.remove('active');
                showAllProjects();
            }
        });

        // Navigation au clavier
        searchInput.addEventListener('keydown', (e) => {
            const items = suggestions.querySelectorAll('.suggestion-item:not(.no-results)');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, items.length - 1);
                    updateActiveItem();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, -1);
                    updateActiveItem();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0) {
                        const activeItem = items[activeIndex];
                        selectProject(activeItem);
                    }
                    break;
                case 'Escape':
                    searchInput.value = '';
                    searchContainer.classList.remove('active');
                    showAllProjects();
                    break;
            }
        });

        // Mise à jour de l'élément actif
        function updateActiveItem() {
            const items = suggestions.querySelectorAll('.suggestion-item');
            items.forEach((item, index) => {
                item.classList.toggle('active', index === activeIndex);
                item.setAttribute('aria-selected', index === activeIndex);
            });
        }

        // Sélection d'un projet
        function selectProject(item) {
            const projectId = item.dataset.projectId;
            const project = document.getElementById(projectId);
            if (project) {
                project.scrollIntoView({ behavior: 'smooth', block: 'center' });
                project.classList.add('highlight');
                setTimeout(() => project.classList.remove('highlight'), 2000);
            }
            searchContainer.classList.remove('active');
            searchInput.value = '';
        }

        // Gestion des clics sur les suggestions
        suggestions.addEventListener('click', (e) => {
            const item = e.target.closest('.suggestion-item');
            if (item && !item.classList.contains('no-results')) {
                selectProject(item);
            }
        });

        // Fermeture des suggestions en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchContainer.classList.remove('active');
            }
        });

        // Focus/Blur events
        searchInput.addEventListener('focus', () => {
            searchWrapper.classList.add('focused');
        });

        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                searchWrapper.classList.remove('focused');
            }
        });
    }

    // Animation des sections au scroll
    function initSectionAnimations() {
        const sections = document.querySelectorAll('.section');
        const options = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    initSectionAnimations();

    // Amélioration du slider de formations
    function initFormationsSlider(data) {
        const sliderContent = document.querySelector('.slider-content');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;

        // Création des slides
        function createSlides() {
            sliderContent.innerHTML = '';
            data.formations.forEach((formation, index) => {
                const slide = document.createElement('div');
                slide.className = `formation ${index === currentIndex ? 'active' : ''}`;
                slide.innerHTML = `
                    <img id="slide-logo" 
                        src="${formation.logo}" 
                        alt="${formation.structure}"
                        onerror="this.src='./Assets/img/default.png'">
                    <h3 class="slide-title">${formation.structure}</h3>
                    <p class="slide-text">${formation.title}</p>
                    ${formation.diplome ? `
                        <a href="${formation.diplome}" 
                           class="diplome-link" 
                           target="_blank"
                           rel="noopener noreferrer">
                            <i class="fi fi-br-diploma"></i>
                            Voir le diplôme
                        </a>
                    ` : ''}
                `;
                sliderContent.appendChild(slide);
            });
            updateIndicators();
        }

        // Gestion des indicateurs
        function createIndicators() {
            const indicators = document.querySelector('.slider-indicators');
            indicators.innerHTML = '';
            data.formations.forEach((_, index) => {
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'slider-indicator';
                radio.value = index;
                radio.checked = index === currentIndex;
                radio.setAttribute('aria-label', `Slide ${index + 1}`);
                radio.addEventListener('change', () => goToSlide(index));
                indicators.appendChild(radio);
            });
        }

        function updateIndicators() {
            const radios = document.querySelectorAll('.slider-indicators input[type="radio"]');
            radios.forEach((radio, index) => {
                radio.checked = index === currentIndex;
            });
        }

        // Navigation du slider
        function goToSlide(index) {
            const slides = document.querySelectorAll('.formation');
            slides[currentIndex].classList.remove('active');
            currentIndex = index;
            slides[currentIndex].classList.add('active');
            updateIndicators();
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % data.formations.length;
            goToSlide(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentIndex - 1 + data.formations.length) % data.formations.length;
            goToSlide(prevIndex);
        }

        // Initialisation
        createSlides();
        createIndicators();

        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Auto-play avec pause au survol
        let autoPlayInterval = setInterval(nextSlide, 5000);

        const formationsContainer = document.querySelector('.formations-container');
        formationsContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        formationsContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        });

        // Gestion du swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;

        formationsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        formationsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }

    // Gestion de la navigation
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-items');
        const sections = document.querySelectorAll('.section');
        const subNavItems = document.querySelectorAll('.sub-nav-items');
        const subSections = document.querySelectorAll('.sub-section');

        // Navigation principale
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                // Mise à jour des classes actives
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Affichage de la section
                sections.forEach(section => section.classList.remove('active'));
                targetSection.classList.add('active');

                // Scroll vers la section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Navigation secondaire (sous-sections)
        subNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const targetSubSection = document.getElementById(targetId);

                // Mise à jour des classes actives
                subNavItems.forEach(nav => nav.classList.remove('visited'));
                item.classList.add('visited');

                // Affichage de la sous-section
                subSections.forEach(section => {
                    section.classList.add('d-none');
                    section.classList.remove('active');
                });
                targetSubSection.classList.remove('d-none');
                targetSubSection.classList.add('active');
            });
        });

        // Activer la première section et sous-section par défaut
        if (navItems.length > 0) {
            navItems[0].classList.add('active');
            sections[0].classList.add('active');
        }

        if (subNavItems.length > 0) {
            subNavItems[0].classList.add('visited');
            subSections[0].classList.remove('d-none');
            subSections[0].classList.add('active');
        }
    }

    // Appel de l'initialisation dans le DOMContentLoaded
    initNavigation();
});
