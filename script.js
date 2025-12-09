document.addEventListener("DOMContentLoaded", function () {
    // ==================== MOBILE MENU FIX ====================
    // Universal Mobile Menu Script - Single source of truth
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        // Make sure menu starts closed
        mainNav.classList.remove('active');
        navToggle.innerHTML = '☰';
        navToggle.setAttribute('aria-label', 'Open navigation');
        
        // Toggle menu on hamburger click
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mainNav.classList.toggle('active');
            
            // Update button icon
            if (mainNav.classList.contains('active')) {
                this.innerHTML = '✕';
                this.setAttribute('aria-label', 'Close navigation');
            } else {
                this.innerHTML = '☰';
                this.setAttribute('aria-label', 'Open navigation');
            }
        });
        
        // Close menu when clicking links
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                navToggle.innerHTML = '☰';
                navToggle.setAttribute('aria-label', 'Open navigation');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(event.target) && 
                !navToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                navToggle.innerHTML = '☰';
                navToggle.setAttribute('aria-label', 'Open navigation');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                navToggle.innerHTML = '☰';
                navToggle.setAttribute('aria-label', 'Open navigation');
            }
        });
    }
    
    // ==================== ORIGINAL SCRIPT CONTENT ====================
    const services = [
        {
            id: 'service-heating',
            title: 'Heating & Boiler Services',
            desc: 'Boiler repairs, servicing and system optimisation to keep you warm and efficient. Gas Safe Registered Experts: Every job is handled by our fully qualified, Gas Safe registered engineers. Your safety and satisfaction are our priority.',
            image: 'https://images.unsplash.com/photo-1711037868000-ea0c38991aef?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            url: 'service-heating.html'
        },
        {
            id: 'service-plumbing',
            title: 'Professional Plumbing Services',
            desc: 'Complete plumbing solutions including emergency repairs, installations, and maintenance for residential and commercial properties.',
            image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            url: 'service-plumbing.html'
        },
        {
            id: 'service-electrical',
            title: 'Electrical Services',
            desc: '24/7 Electrical Experts, Fully Certified. Certified electrical installations, repairs, and safety inspections for all your Domestic needs.',
            image: 'https://plus.unsplash.com/premium_photo-1664297981377-b45697cc416f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            url: 'service-electrical.html'
        },
        {
            id: 'service-gas',
            title: 'Gas Safety & Installations',
            desc: 'Certified gas engineers for safe installations, inspections and repairs.',
            image: 'https://images.unsplash.com/photo-1744302570337-a9840df6e723?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            url: 'service-gas.html'
        }
    ];

    // Slider injection with real images
    const slider = document.getElementById('slider');
    let currentSlide = 0;
    let slideInterval;

    if (slider) {
        services.forEach((s, idx) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.opacity = idx === 0 ? '1' : '0';
            slide.style.transform = idx === 0 ? 'translateY(0)' : 'translateY(20px)';
            slide.style.zIndex = idx === 0 ? '2' : '1';
            slide.innerHTML = `
                <div class="slide-copy">
                    <h2>${s.title}</h2>
                    <p>${s.desc}</p>
                    <button class="btn view-details-btn" data-url="${s.url}">View Details</button>
                </div>
                <div class="real-image-bg ${s.id.replace('service-', '')}-image">
                    <img src="${s.image}" alt="${s.title}" loading="lazy">
                </div>
            `;
            slider.appendChild(slide);
        });

        const slides = Array.from(document.querySelectorAll('.slide'));
        
        // Single click handler for all buttons
        slider.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-details-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const activeSlide = slides[currentSlide];
                const activeButton = activeSlide.querySelector('.view-details-btn');
                const url = activeButton.getAttribute('data-url');
                
                console.log('Active slide:', currentSlide, 'Navigating to:', url);
                window.location.href = url;
            }
        });
        
        // Navigation buttons
        const nextBtn = document.querySelector('.slide-next');
        const prevBtn = document.querySelector('.slide-prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        }

        function showSlide(n) {
            // Clear existing interval
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            
            currentSlide = (n + slides.length) % slides.length;
            slides.forEach((s, i) => {
                s.style.opacity = i === currentSlide ? '1' : '0';
                s.style.transform = i === currentSlide ? 'translateY(0)' : 'translateY(20px)';
                s.style.zIndex = i === currentSlide ? '2' : '1';
            });
            
            // Restart auto-slide
            startAutoSlide();
        }

        function startAutoSlide() {
            if (slides.length > 1) {
                slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
            }
        }

        // Start auto-slide
        startAutoSlide();

        // Pause auto-slide on hover/touch
        slider.addEventListener('mouseenter', () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        });

        slider.addEventListener('mouseleave', () => {
            startAutoSlide();
        });

        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next
                    showSlide(currentSlide + 1);
                } else {
                    // Swipe right - previous
                    showSlide(currentSlide - 1);
                }
            }
        }
    }

    // Services preview with real images
    const servicesPreview = document.getElementById('services-preview');
    if (servicesPreview) {
        services.forEach((s) => {
            const block = document.createElement('section');
            block.className = 'service-block';
            block.innerHTML = `
                <div class="real-image-preview">
                    <img src="${s.image}" alt="${s.title}" loading="lazy">
                </div>
                <div class="copy">
                    <h3>${s.title}</h3>
                    <p class="lead dropcap">${s.desc} Learn more about how we deliver reliable solutions for every home.</p>
                    <p><a class="btn" href="${s.url}">View Details</a></p>
                </div>
            `;
            servicesPreview.appendChild(block);
        });
    }

    // News section
    const sampleNews = [
        {
            title: 'How to Reduce Winter Heating Bills',
            src: 'Energy Tips',
            url: '#',
            excerpt: 'Discover practical ways to lower your heating costs while staying warm this winter season.'
        },
        {
            title: 'Top 5 Signs Your Electrical System Needs Service',
            src: 'Electrical Safety',
            url: '#',
            excerpt: 'Learn the warning signs that indicate your electrical system requires professional attention.'
        },
        {
            title: 'Prevent Small Leaks from Becoming Expensive',
            src: 'Plumbing',
            url: '#',
            excerpt: 'Early detection and repair can save you thousands in water damage repairs.'
        },
        {
            title: 'Smart Thermostats: Are They Worth It?',
            src: 'Technology',
            url: '#',
            excerpt: 'Explore the benefits of smart home technology for your heating system.'
        }
    ];

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const newsList = document.getElementById('news-list');
    if (newsList) {
        shuffle(sampleNews).forEach(n => {
            const item = document.createElement('article');
            item.className = 'news-item';
            item.innerHTML = `
                <h4>${n.title}</h4>
                <p class="muted">${n.src} • ${new Date().toLocaleDateString()}</p>
                <p>${n.excerpt} <a href="${n.url}">Read More</a></p>
            `;
            newsList.appendChild(item);
        });
    }

    // Set current year in footer
    const yearElements = document.querySelectorAll('[id^="year"]');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                message: formData.get('message')
            };

            // Send email using FormSubmit
            fetch('https://formsubmit.co/ajax/info@247homefixexperts.com', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                const msg = document.getElementById('form-msg');
                if (msg) {
                    msg.textContent = 'Thank you! Your message has been sent successfully.';
                    msg.style.color = '#2E8B57';
                }
                contactForm.reset();
            })
            .catch(error => {
                const msg = document.getElementById('form-msg');
                if (msg) {
                    msg.textContent = 'Sorry, there was an error sending your message. Please try again.';
                    msg.style.color = '#e74c3c';
                }
            });
        });
    }

    // Enhanced mobile experience
    function enhanceMobileExperience() {
        // Improve touch targets for mobile
        if ('ontouchstart' in window) {
            document.documentElement.classList.add('touch-device');
            
            const touchElements = document.querySelectorAll('a, button, .btn, .service-card');
            touchElements.forEach(el => {
                if (el.offsetWidth < 44 || el.offsetHeight < 44) {
                    el.style.minHeight = '44px';
                    el.style.minWidth = '44px';
                }
            });
        }

        // Prevent zoom on input focus for iOS
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '16px';
                }
            });
        });

        // Handle viewport height on mobile
        function setViewportHeight() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);
    }

    enhanceMobileExperience();

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
