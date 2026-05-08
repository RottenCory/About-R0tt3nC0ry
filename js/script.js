/* ============================================
   JAVASCRIPT - All Features Implementation
   ============================================ */

// ============================================
// 1. LOADING ANIMATION
// ============================================
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 2000);
    }
});

// ============================================
// 2. MOBILE MENU TOGGLE
// ============================================
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (menuBtn) {
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// 3. BACK TO TOP BUTTON
// ============================================
const backToTopBtn = document.querySelector('.back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// 4. ANIMATED SCROLL EFFECTS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.card, .content, .hero').forEach(el => {
    observer.observe(el);
});

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

    const allText = document.body.innerText.toLowerCase();
    const results = [];

    // Search in headings
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        if (heading.textContent.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                text: heading.textContent.trim(),
                element: heading,
                type: 'heading'
            });
        }
    });

    // Search in paragraphs
    document.querySelectorAll('p').forEach(p => {
        if (p.textContent.toLowerCase().includes(query.toLowerCase())) {
            const preview = p.textContent.substring(0, 50) + '...';
            results.push({
                text: preview,
                element: p,
                type: 'paragraph'
            });
        }
    });

    // Display results
    displaySearchResults(results.slice(0, 10), query);
}

function displaySearchResults(results, query) {
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            // Highlight the search term
            const highlightedText = result.text.replace(
                new RegExp(query, 'gi'),
                match => `<strong>${match}</strong>`
            );
            resultItem.innerHTML = highlightedText;

            resultItem.addEventListener('click', function() {
                result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                searchResults.classList.remove('show');
                searchInput.value = '';
            });

            searchResults.appendChild(resultItem);
        });
    }

    searchResults.classList.add('show');
}

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        performSearch(e.target.value);
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container') && searchResults) {
        searchResults.classList.remove('show');
    }
});

// ============================================
// 6. TABLE OF CONTENTS GENERATION
// ============================================
function generateTableOfContents() {
    const toc = document.querySelector('.table-of-contents');
    if (!toc) return;

    const headings = document.querySelectorAll('h2, h3');
    const tocList = document.createElement('div');
    tocList.innerHTML = '<h3>Table of Contents</h3><ul></ul>';
    const list = tocList.querySelector('ul');

    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `section-${index}`;
        }

        // Create TOC item
        const level = heading.tagName === 'H2' ? 1 : 2;
        const li = document.createElement('li');
        li.style.marginLeft = (level - 1) * 20 + 'px';

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        li.appendChild(link);
        list.appendChild(li);
    });

    toc.innerHTML = '';
    toc.appendChild(tocList);
}

// Generate TOC on page load
document.addEventListener('DOMContentLoaded', generateTableOfContents);

// ============================================
// 7. ANALYTICS INTEGRATION
// ============================================
function initializeAnalytics() {
    // Replace 'G-XXXXXXXXXX' with your Google Analytics Measurement ID
    const measurementId = 'G-XXXXXXXXXX';

    if (measurementId === 'G-XXXXXXXXXX') {
        console.log('Analytics: Please replace G-XXXXXXXXXX with your actual Measurement ID');
        return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', measurementId);

    // Track page views
    gtag('event', 'page_view', {
        'page_title': document.title,
        'page_path': window.location.pathname
    });

    console.log('Analytics initialized with ID:', measurementId);
}

// Initialize analytics
initializeAnalytics();

// ============================================
// 8. SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// 9. UTILITY: Print current analytics status
// ============================================
function checkAnalyticsStatus() {
    if (window.gtag) {
        console.log('✓ Analytics is active');
    } else {
        console.log('✗ Analytics not yet loaded');
    }
}

// ============================================
// INITIALIZATION
// ============================================
console.log('✓ All features loaded successfully!');
console.log('Features: Loading Animation, Mobile Menu, Back-to-Top, Scroll Effects, Search, TOC, Analytics');
