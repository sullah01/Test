// Logo Manager for 247 Home Fix Experts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Logo Manager loaded');
    
    // Add CSS for horizontal layout
    const style = document.createElement('style');
    style.textContent = `
        .header-with-logo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 0;
            flex-wrap: wrap;
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        .nav-logo {
            flex-shrink: 0;
        }
        .nav-logo img {
            height: 50px;
            width: auto;
            max-height: 50px !important;
            object-fit: contain;
        }
        .main-nav {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin: 0;
            padding: 0;
        }
        .main-nav a {
            text-decoration: none;
            color: white !important;
            font-weight: 500;
            transition: color 0.3s ease;
            white-space: nowrap;
            padding: 8px 12px;
            min-height: 44px;
            display: flex;
            align-items: center;
            border-radius: 6px;
        }
        .main-nav a:hover {
            color: #2E8B57;
            background: rgba(255,255,255,0.15);
        }
        /* Ensure header containers use flex */
        header, .header, .navbar {
            display: flex;
            justify-content: center;
        }
        header > div, .header > div, .navbar > div {
            width: 100%;
        }
        @media (max-width: 768px) {
            .header-with-logo {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
                padding: 0.5rem 0;
            }
            .nav-logo img {
                height: 40px;
            }
            .main-nav {
                justify-content: center;
                flex-direction: column;
                width: 100%;
            }
            .main-nav a {
                width: 100%;
                justify-content: center;
                padding: 12px 20px;
                min-height: 50px;
                font-size: 1.1rem;
            }
        }
    `;
    document.head.appendChild(style);

    // Function to add logo to headers
    function addLogoToHeaders() {
        const headers = document.querySelectorAll('header, .header, .navbar');
        
        headers.forEach(header => {
            if (!header.querySelector('.nav-logo')) {
                // Check if header already has navigation
                const existingNav = header.querySelector('nav, .nav, .navbar-nav, .main-nav, [role="navigation"]');
                const existingLinks = header.querySelectorAll('a[href*=".html"], a[href^="/"], a[href^="#"]');
                
                let navHtml = '';
                
                // If we found existing navigation links, use them
                if (existingNav) {
                    navHtml = existingNav.outerHTML;
                    existingNav.remove();
                } else if (existingLinks.length > 0) {
                    // Create nav from existing links
                    navHtml = '<nav class="main-nav">';
                    existingLinks.forEach(link => {
                        if (link.parentElement.tagName !== 'LI') {
                            navHtml += link.outerHTML;
                            link.remove();
                        }
                    });
                    navHtml += '</nav>';
                } else {
                    // Create default navigation
                    navHtml = `
                        <nav class="main-nav">
                            <a href="index.html">Home</a>
                            <a href="services.html">Services</a>
                            <a href="about.html">About</a>
                            <a href="contact.html">Contact</a>
                        </nav>
                    `;
                }

                // Create the full header structure
                const headerHtml = `
                    <div class="header-with-logo">
                        <div class="nav-logo">
                            <a href="/" style="display: flex; align-items: center; min-height: 44px;">
                                <img src="assets/logos/logo-primary.png" alt="24 7 Home Fix Experts" loading="lazy">
                            </a>
                        </div>
                        ${navHtml}
                    </div>
                `;
                
                // Replace header content with new structure
                header.innerHTML = headerHtml;
            }
        });
    }

    // Function to add logo to footers
    function addLogoToFooters() {
        const footers = document.querySelectorAll('footer, .footer');
        
        footers.forEach(footer => {
            if (!footer.querySelector('.footer-logo')) {
                const logoHtml = `
                    <div class="footer-logo" style="text-align: center; margin-bottom: 1rem;">
                        <a href="/" style="display: inline-flex; align-items: center; min-height: 44px;">
                            <img src="assets/logos/logo-primary.png" alt="24 7 Home Fix Experts" 
                                 style="max-height: 40px; height: auto; opacity: 0.8; object-fit: contain;" loading="lazy">
                        </a>
                    </div>
                `;
                footer.insertAdjacentHTML('afterbegin', logoHtml);
            }
        });
    }

    // Function to handle logo selection based on background
    function setupLogoContrast() {
        const logoImages = document.querySelectorAll('.nav-logo img, .footer-logo img');
        
        function updateLogos() {
            logoImages.forEach(logo => {
                const parent = logo.closest('header, footer, .header, .footer');
                if (parent) {
                    const bgColor = window.getComputedStyle(parent).backgroundColor;
                    const rgb = bgColor.match(/\d+/g);
                    
                    if (rgb && rgb.length >= 3) {
                        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                        const logoType = brightness > 128 ? 'dark' : 'light';
                        logo.src = `assets/logos/logo-${logoType}.png`;
                    }
                }
            });
        }
        
        // Update logos on load and resize
        updateLogos();
        window.addEventListener('resize', updateLogos);
    }

    // Initialize all functions
    addLogoToHeaders();
    addLogoToFooters();
    setupLogoContrast();
    
    console.log('Logo Manager initialized successfully');

    // Add mobile navigation handling
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const nav = document.querySelector('.main-nav');
            if (nav) {
                nav.classList.toggle('active');
            }
        });
    }

    // Close menu when clicking on links (mobile)
    document.addEventListener('click', function(event) {
        if (event.target.matches('.main-nav a')) {
            const nav = document.querySelector('.main-nav');
            if (nav && window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        }
    });
});
