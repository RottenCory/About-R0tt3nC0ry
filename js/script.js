/* ============================================
   MAIN SCRIPT - All Features JavaScript
   ============================================ */

// ============================================
// 1. MOBILE MENU FUNCTIONALITY
// ============================================
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu when hamburger is clicked
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// 2. BACK TO TOP BUTTON
// ============================================
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// 3. SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// ============================================
// 4. TABLE OF CONTENTS GENERATION
// ============================================
function generateTableOfContents() {
    const toc = document.querySelector('.table-of-contents');
    if (!toc) return;

    const headings = document.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        toc.style.display = 'none';
        return;
    }

    let tocHTML = '<h3>📑 Table of Contents</h3><ul>';
    
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const level = heading.tagName === 'H2' ? 0 : 1;
        const indent = level > 0 ? 'margin-left: 1.5rem;' : '';
        
        tocHTML += `<li style="${indent}"><a href="#${heading.id}">${heading.textContent}</a></li>`;
    });
    
    tocHTML += '</ul>';
    toc.innerHTML = tocHTML;

    // Add smooth scroll to TOC links
    document.querySelectorAll('.table-of-contents a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Generate TOC on page load
document.addEventListener('DOMContentLoaded', generateTableOfContents);

// ============================================
// 5. SEARCH FUNCTIONALITY
// ============================================
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const searchResults = document.querySelector('.search-results');

function performSearch(query) {
    if (!query.trim()) {
        searchResults.classList.remove('show');
        return;
    }

    const query_lower = query.toLowerCase();
    const results = [];

    // Search in all sections
    document.querySelectorAll('section, .card').forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(query_lower)) {
            // Get heading or card title
            const heading = section.querySelector('h2, h3');
            const title = heading ? heading.textContent : section.textContent.substring(0, 50) + '...';
            
            if (!results.find(r => r.title === title)) {
                results.push({
                    title: title,
                    element: section
                });
            }
        }
    });

    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found for "' + query + '"</div>';
    } else {
        searchResults.innerHTML = results.map(result => 
            `<div class="search-result-item">${result.title}</div>`
        ).join('');

        // Add click handlers to results
        document.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const element = results[index].element;
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                searchResults.classList.remove('show');
                searchInput.value = '';
            });
        });
    }

    searchResults.classList.add('show');
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        searchResults.classList.remove('show');
    }
});

// ============================================
// 6. PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 2000);
    }
});

// ============================================
// 7. ACTIVE NAV LINK TRACKING
// ============================================
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || 
            (current === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ============================================
// 8. GOOGLE ANALYTICS INTEGRATION
// ============================================
function initializeAnalytics() {
    const measurementId = 'G-XXXXXXXXXX'; // Replace with your Google Analytics ID
    
    if (measurementId === 'G-XXXXXXXXXX') {
        console.log('⚠️ Analytics: Please replace G-XXXXXXXXXX with your Google Analytics ID in js/script.js');
        return;
    }

    // Create global gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', measurementId);

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    console.log('✓ Analytics initialized with ID:', measurementId);
}

// Initialize analytics when page loads
document.addEventListener('DOMContentLoaded', initializeAnalytics);

// ============================================
// 9. SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// 10. ENHANCED BUTTON ANIMATIONS
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(1deg)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

console.log('✓ All features loaded successfully!');
console.log('📑 Features: Mobile Menu, Animations, Search, TOC, Back to Top, Analytics');
