// =========================================================
// PORTFOLIO SCRIPT.JS
// =========================================================

document.addEventListener('DOMContentLoaded', function () {
    // =====================================================
    // SITE PRELOADER
    // =====================================================
    const preloader = document.getElementById('site-preloader');

    function hidePreloader() {
        if (!preloader) return;

        window.setTimeout(function () {
            preloader.classList.add('is-hidden');
            window.setTimeout(function () {
                preloader.remove();
            }, 500);
        }, 700);
    }

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader, { once: true });
    }
    // =====================================================
    // MOBILE NAV CLOSE
    // =====================================================
    const mainNavbar = document.getElementById('mainNavbar');

    if (mainNavbar && window.bootstrap) {
        document.querySelectorAll('.nav-menu .nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                const navCollapse = bootstrap.Collapse.getOrCreateInstance(mainNavbar, { toggle: false });
                navCollapse.hide();
            });
        });
    }

    // =====================================================
    // HERO TYPING ANIMATION
    // =====================================================
    const typingWords = [
        'Logo Design',
        'Poster Design',
        'Brochure Design',
        'Menu Card Design',
        'Visiting Card Design',
        'Social Media Design',
        'Brand Identity Design'
    ];

    const typingText = document.getElementById('typing-text');

    if (typingText) {
        const typeSpeed = 78;
        const deleteSpeed = 42;
        const pauseTime = 2000;

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeLoop() {
            const currentWord = typingWords[wordIndex];

            if (!deleting) {
                charIndex += 1;
                typingText.textContent = currentWord.slice(0, charIndex);

                if (charIndex === currentWord.length) {
                    deleting = true;
                    window.setTimeout(typeLoop, pauseTime);
                    return;
                }

                window.setTimeout(typeLoop, typeSpeed);
                return;
            }

            charIndex -= 1;
            typingText.textContent = currentWord.slice(0, charIndex);

            if (charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % typingWords.length;
                window.setTimeout(typeLoop, 280);
                return;
            }

            window.setTimeout(typeLoop, deleteSpeed);
        }

        typeLoop();
    }

    // =====================================================
    // PROJECT FILTER
    // =====================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const projectViewAllBtn = document.getElementById('project-view-all');
    const projectButtonLabels = {
        logo: 'View All Logos',
        poster: 'View All Posters',
        brochure: 'View All Brochures',
        visiting: 'View All Visiting Cards',
        video: 'View All Videos'
    };
    // Paste your Google Drive folder links inside the quotes below.
    const projectButtonLinks = {
        logo: 'https://drive.google.com/drive/folders/PASTE_LOGO_DRIVE_LINK_HERE',
        poster: 'https://drive.google.com/drive/folders/PASTE_POSTER_DRIVE_LINK_HERE',
        brochure: 'https://drive.google.com/drive/folders/1-w0tijKzwPJ-O4S8MenLW-hEELRkSClB?usp=sharing',
        visiting: 'https://drive.google.com/drive/folders/PASTE_VISITING_CARDS_DRIVE_LINK_HERE',
        video: 'https://drive.google.com/drive/folders/PASTE_VIDEO_DRIVE_LINK_HERE'
    };

    function filterProjects(filterValue) {
        projectItems.forEach(function (item) {
            const category = item.getAttribute('data-category');

            if (filterValue === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        if (projectViewAllBtn && projectButtonLabels[filterValue]) {
            projectViewAllBtn.innerHTML = projectButtonLabels[filterValue] + ' <i class="bi bi-arrow-right"></i>';
            projectViewAllBtn.href = projectButtonLinks[filterValue];
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const filterValue = button.getAttribute('data-filter');

            filterButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            filterProjects(filterValue);
        });
    });

    const requestedCategory = new URLSearchParams(window.location.search).get('category');
    const initialCategory = projectButtonLabels[requestedCategory] ? requestedCategory : 'logo';

    filterButtons.forEach(function (button) {
        button.classList.toggle('active', button.getAttribute('data-filter') === initialCategory);
    });
    filterProjects(initialCategory);
    // =====================================================
    // PROJECT IMAGE & VIDEO PREVIEW
    // =====================================================
    const preview = document.getElementById('project-preview');
    const previewMedia = document.getElementById('project-preview-media');
    const previewCloseButton = preview ? preview.querySelector('.project-preview__close') : null;
    let previewTrigger = null;

    function closeProjectPreview() {
        if (!preview || !preview.classList.contains('is-open')) return;

        const openVideo = previewMedia.querySelector('video');
        if (openVideo) {
            openVideo.pause();
            openVideo.removeAttribute('src');
            openVideo.load();
        }

        previewMedia.replaceChildren();
        preview.classList.remove('is-open');
        preview.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-preview-open');

        if (previewTrigger) {
            previewTrigger.focus();
            previewTrigger = null;
        }
    }

    function openProjectPreview(card) {
        if (!preview || !previewMedia) return;

        const image = card.querySelector('img');
        const video = card.querySelector('video');
        if (!image && !video) return;

        previewTrigger = card;
        previewMedia.replaceChildren();

        if (image) {
            const fullImage = document.createElement('img');
            fullImage.src = image.currentSrc || image.src;
            fullImage.alt = image.alt || 'Project preview';
            previewMedia.appendChild(fullImage);
        } else {
            const fullVideo = document.createElement('video');
            fullVideo.src = video.currentSrc || video.src;
            fullVideo.controls = true;
            fullVideo.autoplay = true;
            fullVideo.playsInline = true;
            fullVideo.preload = 'metadata';
            fullVideo.setAttribute('aria-label', 'Project video preview');
            previewMedia.appendChild(fullVideo);
            fullVideo.play().catch(function () {
                // Playback remains available through the video controls.
            });
        }

        preview.classList.add('is-open');
        preview.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-preview-open');
        previewCloseButton.focus();
    }

    projectItems.forEach(function (item) {
        const card = item.querySelector('.project-card');
        if (!card || !card.querySelector('img, video')) return;

        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Open project preview');
        card.addEventListener('click', function () {
            openProjectPreview(card);
        });
        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProjectPreview(card);
            }
        });
    });

    if (preview) {
        preview.querySelectorAll('[data-preview-close]').forEach(function (element) {
            element.addEventListener('click', closeProjectPreview);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeProjectPreview();
        });
    }

    // =====================================================
    // SKILL PROGRESS BAR ANIMATION (on scroll into view)
    // =====================================================
    const skillBars = document.querySelectorAll('.skill-progress .progress-bar');
    let skillsAnimated = false;

    skillBars.forEach(function (bar) {
        bar.style.width = '0%';
    });

    function animateSkillBars() {
        if (skillsAnimated) return;

        if (toolsSection) {
            toolsSection.classList.add('tools-animate');
        }

        skillBars.forEach(function (bar) {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = '0%';
            setTimeout(function () {
                bar.style.width = targetWidth + '%';
            }, 100);
        });

        skillsAnimated = true;
    }

    // =====================================================
    // COUNTER ANIMATION (Stats in About section)
    // =====================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(function (statEl) {
            const originalText = statEl.textContent.trim();
            const hasPlus = originalText.includes('+');
            const targetValue = parseInt(originalText.replace(/\D/g, ''), 10);

            if (isNaN(targetValue)) return;

            let currentValue = 0;
            const duration = 1500;
            const stepTime = Math.max(Math.floor(duration / targetValue), 15);

            const counterInterval = setInterval(function () {
                currentValue += Math.ceil(targetValue / (duration / stepTime));

                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(counterInterval);
                }

                statEl.textContent = currentValue + (hasPlus ? '+' : '');
            }, stepTime);
        });

        countersAnimated = true;
    }

    // =====================================================
    // SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
    // =====================================================
    const aboutSection = document.getElementById('about');
    const toolsSection = document.getElementById('tools');
    const experienceSection = document.getElementById('experience');
    const workflowSection = document.getElementById('workflow');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                if (entry.target === aboutSection) {
                    animateCounters();
                }
                if (entry.target === toolsSection) {
                    animateSkillBars();
                }
                if (entry.target === experienceSection) {
                    experienceSection.classList.add('experience-animate');
                }
                if (entry.target === workflowSection) {
                    workflowSection.classList.add('workflow-animate');
                }
            }
        });
    }, observerOptions);

    if (aboutSection) observer.observe(aboutSection);
    if (toolsSection) observer.observe(toolsSection);
    if (experienceSection) observer.observe(experienceSection);
    if (workflowSection) observer.observe(workflowSection);

    // =====================================================
    // CONTACT FORM VALIDATION & SUBMIT HANDLING
    // =====================================================
    const contactForm = document.getElementById('contact-form');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        function showFormStatus(message, type) {
            if (!formStatusMsg) return;

            formStatusMsg.textContent = message;
            formStatusMsg.classList.remove('d-none', 'success', 'error');
            formStatusMsg.classList.add(type);
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const nameField = document.getElementById('name');
            const phoneField = document.getElementById('phone');
            const emailField = document.getElementById('email');
            const workField = document.getElementById('work');
            const submitButton = contactForm.querySelector('button[type="submit"]');

            let isValid = true;

            [nameField, phoneField, workField].forEach(function (field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value.trim() && !emailPattern.test(emailField.value.trim())) {
                isValid = false;
                emailField.classList.add('is-invalid');
            }

            if (!isValid) {
                showFormStatus('Please fill required fields correctly.', 'error');
                return;
            }

            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = 'Sending... <i class="bi bi-send"></i>';
                }

                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Message sending failed');
                }

                showFormStatus('Success! Message sent to mail.', 'success');
                contactForm.reset();

                setTimeout(function () {
                    if (formStatusMsg) {
                        formStatusMsg.classList.add('d-none');
                    }
                }, 5000);
            } catch (error) {
                showFormStatus('Error! Message not sent. Try again.', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message <i class="bi bi-send"></i>';
                }
            }
        });

        // Remove invalid state as user types
        contactForm.querySelectorAll('.form-control, .form-select').forEach(function (input) {
            input.addEventListener('input', function () {
                input.classList.remove('is-invalid');
            });
        });
    }

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId.length < 2) return;

            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
