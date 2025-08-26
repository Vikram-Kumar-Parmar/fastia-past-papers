document.addEventListener('DOMContentLoaded', () => {
    let coursesData = [];
    let filteredCourses = [];
    let currentCourseIndex = 0;
    let isAscending = true;

    // Fetch course data from JSON file
    async function loadCourses() {
        try {
            const response = await fetch('/data/data.json');
            coursesData = await response.json();
            filteredCourses = [...coursesData];
            init();
        } catch (error) {
            console.error('Could not load course data:', error);
            document.getElementById('coursesGrid').innerHTML = '<div style="text-align: center; color: #ec4899; font-size: 1.2rem; grid-column: 1 / -1;">Error: Could not load course materials.</div>';
        }
    }

    // Initialize the application
    function init() {
        displayCourses(filteredCourses);
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', handleSearch);

        const popupOverlay = document.getElementById('popupOverlay');
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePopup();
            }
        });
    }

    // Handle search functionality
    function handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        filteredCourses = coursesData.filter(course =>
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm)
        );
        displayCourses(filteredCourses);
    }

    // Display courses in the grid
    function displayCourses(courses) {
        const coursesGrid = document.getElementById('coursesGrid');
        if (courses.length === 0) {
            coursesGrid.innerHTML = '<div style="text-align: center; color: #a1a1aa; font-size: 1.2rem; grid-column: 1 / -1;">Nahi Mil raha course? Just wait we may update soon ! 😊</div>';
            return;
        }
        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <button class="get-stuff-btn" onclick="showCourseMaterials(${course.id})">Get Stuff</button>
            </div>
        `).join('');
    }

    // Make functions globally accessible
    window.showDashboard = function() {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('courseMaterials').classList.remove('active');
    }

    window.showCourseMaterials = function(courseId) {
        const course = coursesData.find(c => c.id === courseId);
        if (!course) return;

        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('courseMaterials').classList.add('active');
        document.getElementById('courseTitle').textContent = course.title;

        const materialsChain = document.getElementById('materialsChain');
        const materials = [
            { key: 'lab', title: 'Lab Sessions', desc: 'Practical exercises' },
            { key: 'assignments', title: 'Assignments', desc: 'Course assignments' },
            { key: 'quizzes', title: 'Quizzes', desc: 'Quiz papers' },
            { key: 'sessional-1', title: 'Sessional 1', desc: 'Mid-term exams' },
            { key: 'sessional-2', title: 'Sessional 2', desc: 'Second sessional' },
            { key: 'finals', title: 'Finals', desc: 'Final examinations' },
            { key: 'books', title: 'Books', desc: 'Reference materials' },
            { key: 'outlines', title: 'Outlines', desc: 'Course outlines' },
            { key: 'slides', title: 'Slides', desc: 'Course slides' }

        ];

        materialsChain.innerHTML = materials.map(material => `
            <div class="material-node" onclick="window.open('${course.materials[material.key]}', '_blank')">
                <div class="material-title">${material.title}</div>
                <div class="material-desc">${material.desc}</div>
            </div>
        `).join('');
    }

    window.sortCourses = function(order, evt) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (evt && evt.target) {
            evt.target.classList.add('active');
        }
        
        if (order === 'alphabetical') {
            filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filteredCourses = [...coursesData.filter(course =>
                course.title.toLowerCase().includes(document.getElementById('searchInput').value.toLowerCase()) ||
                course.description.toLowerCase().includes(document.getElementById('searchInput').value.toLowerCase())
            )];
        }
        displayCourses(filteredCourses);
    }

    window.toggleSort = function() {
        isAscending = !isAscending;
        const sortIcon = document.getElementById('sortIcon');
        const sortText = document.getElementById('sortText');
        
        if (isAscending) {
            sortIcon.className = 'fas fa-sort-alpha-down';
            sortText.textContent = 'A-Z';
            filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            sortIcon.className = 'fas fa-sort-alpha-up';
            sortText.textContent = 'Z-A';
            filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
        }
        displayCourses(filteredCourses);
    }

    window.randomCourse = function() {
        if (filteredCourses.length === 0) return;
        const randomIndex = Math.floor(Math.random() * filteredCourses.length);
        const courseCards = document.querySelectorAll('.course-card');
        if (courseCards[randomIndex]) {
            courseCards[randomIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    window.openPopup = function() {
        const popup = document.getElementById('popupOverlay');
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.closePopup = function() {
        const popup = document.getElementById('popupOverlay');
        popup.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Start loading the course data
    loadCourses();
});