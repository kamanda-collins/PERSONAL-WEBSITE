// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true
});

// Portfolio modal functionality
function showPortfolioModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('portfolioModal'));
    
    let content = '';
    switch(type) {
        case 'geology':
            content = '<h4>Geological Research</h4>' +
                      '<p class="text-muted">Coming soon...</p>' +
                      '<div class="mt-3">' +
                      '   <button class="btn btn-outline-primary">View Project</button>' +
                      '</div>';
            break;
        case 'tech':
            content = '<h4>Technical Projects</h4>' +
                      '<p class="text-muted">Coming soon...</p>' +
                      '<div class="mt-3">' +
                      '   <button class="btn btn-outline-primary">View Project</button>' +
                      '</div>';
            break;
        case 'film':
            content = '<h4>Film Projects</h4>' +
                      '<p class="text-muted">Coming soon...</p>' +
                      '<div class="mt-3">' +
                      '   <button class="btn btn-outline-primary">View Project</button>' +
                      '</div>';
            break;
    }
    
    document.getElementById('portfolioContent').innerHTML = content;
    modal.show();
}

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    // For now, we'll just show an alert
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Add scroll-to-top button
const scrollButton = document.createElement('button');
scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollButton.className = 'btn btn-primary scroll-to-top';
scrollButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    cursor: pointer;
    z-index: 1000;
`;

document.body.appendChild(scrollButton);

// Show/hide scroll button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
});

// Scroll to top functionality
scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
