document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const overlayClose = document.querySelector('.overlay-close');
    const overlay = document.getElementById('overlay');
    const overlayContent = document.querySelector('.overlay-content');

    // Handle overlay visibility and content animation
    menuToggle.addEventListener('change', function() {
        if (menuToggle.checked) {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            overlayContent.style.transform = 'translateY(0)';
        } else {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlayContent.style.transform = 'translateY(100%)';
        }
    });

    // Close overlay when close button is clicked
    overlayClose.addEventListener('click', function() {
        menuToggle.checked = false;
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlayContent.style.transform = 'translateY(100%)';
    });

    // Prevent the toggle button from closing the menu
    document.querySelector('.menu-label').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Close overlay when clicking outside the menu
    document.addEventListener('click', function(event) {
        if (menuToggle.checked && !overlayContent.contains(event.target) && !menuToggle.contains(event.target)) {
            menuToggle.checked = false;
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlayContent.style.transform = 'translateY(100%)';
        }
    });
});

window.addEventListener('DOMContentLoaded', function() {
    var overlayContent = document.querySelector('.overlay-content');
    var overlay = document.querySelector('.overlay');
    
    if (overlayContent && overlay) {
        var contentWidth = overlayContent.offsetWidth;
        var overlayWidth = overlay.offsetWidth;
        overlay.style.paddingLeft = ((100 - (contentWidth / overlayWidth * 100)) / 2) + '%';
    }
});

