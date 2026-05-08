/* ============================================
   STORIES.JS - Community Stories Functionality
   ============================================ */

// ============================================
// 1. LOCAL STORAGE MANAGEMENT
// ============================================
const STORAGE_KEY = 'communityStories';

function getStories() {
    const stories = localStorage.getItem(STORAGE_KEY);
    return stories ? JSON.parse(stories) : [];
}

function saveStories(stories) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

function addStory(story) {
    const stories = getStories();
    const newStory = {
        id: Date.now(),
        ...story,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
    stories.unshift(newStory);
    saveStories(stories);
    return newStory;
}

// ============================================
// 2. FORM HANDLING
// ============================================
const storyForm = document.getElementById('storyForm');
const formMessage = document.getElementById('formMessage');
const charCountSpan = document.getElementById('charCount');
const storyContent = document.getElementById('storyContent');

// Character count update
if (storyContent) {
    storyContent.addEventListener('input', function() {
        charCountSpan.textContent = this.value.length;
    });
}

// Form submission
if (storyForm) {
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('storyName').value.trim() || 'Anonymous';
        const category = document.getElementById('storyCategory').value;
        const title = document.getElementById('storyTitle').value.trim();
        const content = document.getElementById('storyContent').value.trim();

        // Validation
        if (!category || !title || !content) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }

        if (content.length < 20) {
            showFormMessage('Story must be at least 20 characters', 'error');
            return;
        }

        // Add story
        addStory({
            name,
            category,
            title,
            content
        });

        // Show success message
        showFormMessage('✅ Thank you for sharing! Your story has been posted.', 'success');

        // Reset form
        storyForm.reset();
        charCountSpan.textContent = '0';

        // Refresh display
        setTimeout(() => {
            displayStories('all');
            formMessage.style.display = 'none';
        }, 2000);
    });
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// ============================================
// 3. STORY DISPLAY
// ============================================
const storiesContainer = document.getElementById('storiesContainer');

function displayStories(filter = 'all') {
    const stories = getStories();
    let filteredStories = stories;

    if (filter !== 'all') {
        filteredStories = stories.filter(story => story.category === filter);
    }

    if (filteredStories.length === 0) {
        storiesContainer.innerHTML = '<div class="empty-state"><p>📖 No stories found. Be the first to share!</p></div>';
        return;
    }

    storiesContainer.innerHTML = filteredStories.map(story => `
        <div class="story-card" onclick="openStoryModal(${story.id})">
            <span class="story-category">${getCategoryLabel(story.category)}</span>
            <h3 class="story-title">${escapeHtml(story.title)}</h3>
            <p class="story-author">by ${escapeHtml(story.name)}</p>
            <p class="story-preview">${escapeHtml(story.content.substring(0, 150))}...</p>
            <p class="story-date">${story.date}</p>
            <a href="#" class="read-more">Read Full Story →</a>
        </div>
    `).join('');
}

function getCategoryLabel(category) {
    const labels = {
        'identity': 'Identity',
        'mental-health': 'Mental Health',
        'relationships': 'Relationships',
        'career': 'Career',
        'inspiration': 'Inspiration',
        'advice': 'Advice',
        'other': 'Other'
    };
    return labels[category] || category;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// 4. MODAL FOR FULL STORY
// ============================================
function openStoryModal(storyId) {
    const stories = getStories();
    const story = stories.find(s => s.id === storyId);

    if (!story) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            <span class="story-category">${getCategoryLabel(story.category)}</span>
            <h2 class="modal-title">${escapeHtml(story.title)}</h2>
            <div class="modal-meta">
                <p><strong>by ${escapeHtml(story.name)}</strong></p>
                <p>${story.date}</p>
            </div>
            <div class="modal-body">${escapeHtml(story.content)}</div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });

    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ============================================
// 5. FILTER FUNCTIONALITY
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Display filtered stories
        const filter = this.getAttribute('data-filter');
        displayStories(filter);
    });
});

// ============================================
// 6. INITIAL LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add some sample stories on first load if empty
    const stories = getStories();
    if (stories.length === 0) {
        addSampleStories();
    }
    displayStories('all');
});

// ============================================
// 7. SAMPLE STORIES (for demo purposes)
// ============================================
function addSampleStories() {
    const sampleStories = [
        {
            name: 'Alex',
            category: 'identity',
            title: 'Finding My True Self',
            content: 'Coming out was one of the scariest but most liberating experiences of my life. It took me years to accept myself, but once I did, everything changed. I\'m so grateful for everyone who supported me on this journey. If you\'re struggling with your identity, know that you\'re not alone and your feelings are valid.'
        },
        {
            name: 'Jordan',
            category: 'mental-health',
            title: 'My Journey with Anxiety',
            content: 'I used to think I had to be perfect all the time. The anxiety was consuming me. Through therapy and self-compassion, I learned that my worth isn\'t determined by my productivity. Taking care of my mental health has become my priority, and it\'s been transformative.'
        },
        {
            name: 'Sam',
            category: 'inspiration',
            title: 'Never Give Up on Your Dreams',
            content: 'I faced rejection after rejection, but I refused to give up. Everyone told me I was crazy for pursuing this path, but I believed in myself. Today, I\'m living my dream. If you\'re going through a tough time, remember that setbacks are just setups for comebacks.'
        }
    ];

    sampleStories.forEach(story => {
        addStory(story);
    });
}

// ============================================
// 8. DELETE STORY (for user's own stories - optional)
// ============================================
function deleteStory(storyId) {
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    const stories = getStories();
    const filtered = stories.filter(s => s.id !== storyId);
    saveStories(filtered);
    displayStories('all');
}

// ============================================
// 9. EXPORT STORIES (optional)
// ============================================
function exportStoriesToJSON() {
    const stories = getStories();
    const dataStr = JSON.stringify(stories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'community-stories.json';
    link.click();
}

console.log('✓ Stories functionality loaded!');
