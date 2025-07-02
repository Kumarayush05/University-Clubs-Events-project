document.addEventListener('DOMContentLoaded', () => {
    // Initialize Calendar
    const calendarEl = document.getElementById('calendar-container');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            {
                title: 'Basketball Tournament',
                start: '2025-03-25',
                backgroundColor: '#6366f1'
            },
            {
                title: 'Spring Concert',
                start: '2025-04-10',
                backgroundColor: '#10b981'
            }
        ]
    });
    calendar.render();

    // Countdown Timer Function
    function updateCountdown() {
        document.querySelectorAll('.countdown').forEach(countdown => {
            const targetDate = new Date(countdown.dataset.date).getTime();
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                countdown.textContent = 'Event has passed';
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            countdown.textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        });
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // Navigation State Management
    const navButtons = document.querySelectorAll('.nav-btn');
    let currentSection = 'home';

    function updateNavigation(sectionId) {
        navButtons.forEach(btn => {
            if (btn.getAttribute('onclick').includes(sectionId)) {
                btn.classList.add('bg-indigo-600');
            } else {
                btn.classList.remove('bg-indigo-600');
            }
        });
    }

    // Enhanced Section Navigation
    window.showSection = function(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
        
        // Update navigation state
        currentSection = sectionId;
        updateNavigation(sectionId);
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }

        // Update calendar if showing home section
        if (sectionId === 'home') {
            calendar.updateSize();
        }
    };

    // Mobile Menu Toggle with Animation
    window.toggleMobileMenu = function() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuIcon = document.querySelector('.menu-icon');
        const closeIcon = document.querySelector('.close-icon');
        
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    };

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        
        if (!mobileMenu.classList.contains('hidden') && 
            !mobileMenuButton.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Initialize navigation state
    updateNavigation(currentSection);

    // Club Details Navigation
    window.showClubDetails = function(clubId) {
        showSection('clubs');
        // Add logic to show specific club details
    };

    // Club Registration Modal
    window.showClubRegistrationModal = function() {
        document.getElementById('clubRegistrationModal').classList.remove('hidden');
    };

    window.hideClubRegistrationModal = function() {
        document.getElementById('clubRegistrationModal').classList.add('hidden');
    };

    // Handle Club Registration Form
    document.getElementById('clubRegistrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form handling logic here
        // This should include verification with university database
        hideClubRegistrationModal();
    });

    // Club Login Functions
    window.showClubLogin = function() {
        document.getElementById('clubLoginModal').classList.remove('hidden');
    };

    window.hideClubLogin = function() {
        document.getElementById('clubLoginModal').classList.add('hidden');
    };

    // Simple club authentication (replace with proper backend authentication)
    const mockClubData = {
        'demo@club.com': {
            password: 'demo123',
            clubName: 'Demo Club',
            events: []
        }
    };

    // Add this to your DOMContentLoaded event listener
    document.getElementById('clubLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.email.value;
        const password = this.password.value;

        // Mock authentication (replace with real authentication)
        if (mockClubData[email] && mockClubData[email].password === password) {
            // Store club session
            sessionStorage.setItem('currentClub', email);
            hideClubLogin();
            showClubDashboard();
        } else {
            alert('Invalid credentials');
        }
    });

    // Club Dashboard Functions
    function showClubDashboard() {
        const currentClub = sessionStorage.getItem('currentClub');
        if (!currentClub) return;

        showSection('clubDashboard');
        updateClubEventsList();
    }

    function updateClubEventsList() {
        const currentClub = sessionStorage.getItem('currentClub');
        const clubEvents = mockClubData[currentClub]?.events || [];
        const eventsList = document.getElementById('clubEventsList');
        
        eventsList.innerHTML = clubEvents.map(event => `
            <div class="bg-white shadow rounded-lg p-4">
                <div class="flex justify-between">
                    <h4 class="font-semibold">${event.title}</h4>
                    <button onclick="deleteEvent('${event.id}')" class="text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                <p class="text-gray-600 text-sm">${new Date(event.date).toLocaleString()}</p>
                <p class="mt-2">${event.description}</p>
                ${event.image ? `<img src="${event.image}" alt="${event.title}" class="mt-2 rounded-md w-full">` : ''}
            </div>
        `).join('') || '<p class="text-gray-500">No events yet</p>';
    }

    // Handle new event submission
    document.getElementById('addEventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const currentClub = sessionStorage.getItem('currentClub');
        if (!currentClub) return;

        const formData = new FormData(this);
        const imageFile = formData.get('image');

        // Handle image file (in a real app, you'd upload this to a server)
        const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

        const newEvent = {
            id: Date.now().toString(),
            title: formData.get('title'),
            date: formData.get('date'),
            description: formData.get('description'),
            image: imageUrl
        };

        // Add event to mock data (replace with API call)
        mockClubData[currentClub].events.push(newEvent);
        
        // Update calendar and events list
        calendar.addEvent({
            title: newEvent.title,
            start: newEvent.date,
            backgroundColor: '#6366f1'
        });
        
        updateClubEventsList();
        this.reset();
    });

    // Logout function
    window.logout = function() {
        sessionStorage.removeItem('currentClub');
        showSection('home');
    };

    // Check for existing session on page load
    if (sessionStorage.getItem('currentClub')) {
        showClubDashboard();
    }
}); 