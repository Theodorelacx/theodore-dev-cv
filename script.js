document.addEventListener('DOMContentLoaded', () => {
    // --- Logique du menu mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // --- Logique du Carrousel interne au portfolio-item ---
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach(container => {
        const slidesContainer = container.querySelector('.carousel-slides');
        const slides = container.querySelectorAll('.carousel-slide');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');

        if (!slidesContainer || slides.length <= 1) {
            const navElement = container.querySelector('.carousel-nav');
            if (navElement) {
                navElement.style.display = 'none';
            }
            return;
        }

        let currentIndex = 0;

        function updateCarousel() {
            const offset = -currentIndex * 100;
            slidesContainer.style.transform = `translateX(${offset}%)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });

        updateCarousel();
    });

    // --- Logique des filtres du portfolio ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            document.querySelectorAll('.portfolio-grid .portfolio-item[style*="display: block"] .carousel-container').forEach(container => {
                const slidesContainer = container.querySelector('.carousel-slides');
                if (slidesContainer) {
                    slidesContainer.style.transform = 'translateX(0%)';
                }
            });
        });
    });

    // --- Logique Lightgallery (NOUVEAU) ---
    // Initialisation de Lightgallery pour chaque groupe d'éléments du portfolio
    const galleryItems = document.querySelectorAll('.gallery-trigger');

    // On regroupe les éléments par data-gallery-id
    const galleries = {};
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const trigger = item.querySelector('.gallery-trigger');
        if (trigger) {
            const galleryId = trigger.getAttribute('data-gallery-id');
            if (!galleries[galleryId]) {
                galleries[galleryId] = [];
            }
            // Ajoute le trigger principal
            galleries[galleryId].push(trigger);
            // Ajoute les éléments cachés du même groupe
            item.querySelectorAll('.hidden-gallery-item').forEach(hiddenItem => {
                galleries[galleryId].push(hiddenItem);
            });
        } else {
            // Pour les items sans carrousel (un seul visuel, mais toujours cliquable pour lightgallery)
            const singleItem = item.querySelector('.btn-primary');
            if (singleItem && singleItem.getAttribute('data-src')) { // Assure que c'est un élément Lightgallery
                 const galleryId = singleItem.getAttribute('data-gallery-id');
                 if (!galleries[galleryId]) {
                    galleries[galleryId] = [];
                 }
                 galleries[galleryId].push(singleItem);
            }
        }
    });

    for (const galleryId in galleries) {
        lightGallery(document.createElement('div'), { // Créer un conteneur temporaire pour Lightgallery
            dynamic: true,
            dynamicEl: galleries[galleryId].map(el => ({
                src: el.getAttribute('data-src'),
                thumb: el.getAttribute('data-src'), // Utilisez la même image pour la miniature
                subHtml: el.getAttribute('data-sub-html') || ''
            })),
            plugins: [lgZoom, lgThumbnail],
            licenseKey: '0000-0000-0000-0000', // Remplacez par votre clé de licence si vous en avez une, sinon laissez tel quel pour l'utilisation non commerciale
            download: false // Empêche le bouton de téléchargement dans la lightbox
        });

        // Maintenant, attachez l'événement de clic au bouton réel "Voir le projet complet"
        galleries[galleryId][0].addEventListener('click', (e) => {
            e.preventDefault(); // Empêche l'action par défaut du lien
            // lightGallery s'ouvrira automatiquement car il est initialisé sur le groupe
            // On doit trouver l'instance de Lightgallery pour l'ouvrir
            const lgInstance = document.querySelector('.lg-container'); // Lightgallery crée ce conteneur
            if (lgInstance && lgInstance.lgData) { // Vérifie que l'instance est prête
                lgInstance.lgData.openGallery();
            } else {
                // Si la lightbox n'est pas encore prête, on la reinitialise et on l'ouvre
                const newLg = lightGallery(document.createElement('div'), {
                    dynamic: true,
                    dynamicEl: galleries[galleryId].map(el => ({
                        src: el.getAttribute('data-src'),
                        thumb: el.getAttribute('data-src'),
                        subHtml: el.getAttribute('data-sub-html') || ''
                    })),
                    plugins: [lgZoom, lgThumbnail],
                    licenseKey: '0000-0000-0000-0000',
                    download: false
                });
                newLg.openGallery();
            }
        });
    }

});