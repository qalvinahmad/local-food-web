// Get DOM elements
const slides = document.querySelectorAll('.slide');
const progressBars = document.querySelectorAll('.progress');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Current slide index
let currentSlide = 0;
let autoplayInterval;

// Function to show slide - update this function
const showSlide = (index) => {
    // Remove active class from all slides and progress bars
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Get the updated progress bars from the DOM
    const currentProgressBars = document.querySelectorAll('.progress');
    currentProgressBars.forEach(progress => progress.classList.remove('active'));
    
    // Reset horizontal progress bar animation
    const horizontalProgress = document.querySelector('.horizontal-progress');
    if (horizontalProgress) {
        horizontalProgress.style.animation = 'none';
        // Trigger reflow
        void horizontalProgress.offsetWidth;
        horizontalProgress.style.animation = 'horizontalProgress 5s linear forwards';
    }
    
    // Handle infinite loop
    if(index >= slides.length) {
        currentSlide = 0;
    } else if(index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Add active class to current slide and progress bar
    slides[currentSlide].classList.add('active');
    
    // Make sure we're using the current progress bars from the DOM
    if (currentProgressBars[currentSlide]) {
        currentProgressBars[currentSlide].classList.add('active');
    }
    
    // Log for debugging
    console.log(`Showing slide ${currentSlide + 1} of ${slides.length}`);
}

// Function to go to next slide
const nextSlide = () => {
    showSlide(currentSlide + 1);
}

// Function to go to previous slide
const prevSlide = () => {
    showSlide(currentSlide - 1);
}

// Function to start autoplay with reset timer
const startAutoplay = () => {
    stopAutoplay(); // Clear any existing interval first
    autoplayInterval = setInterval(() => {
        nextSlide();
    }, 5000); // 5 seconds interval
}

// Function to stop autoplay
const stopAutoplay = () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

// Function to handle keyboard events
const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
        startAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
        startAutoplay();
    }
}

// Event listeners
prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    startAutoplay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
});

// Progress bar click handling
progressBars.forEach((progress, index) => {
    progress.addEventListener('click', () => {
        showSlide(index);
        stopAutoplay();
        startAutoplay();
    });
});

// Watch video button click handling
document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Add your video playing logic here
        console.log(`Playing video: ${btn.dataset.video}`);
        stopAutoplay();
        startAutoplay();
    });
});

// Add keyboard event listener
document.addEventListener('keydown', handleKeyPress);

// Start autoplay when page loads
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0); // Ensure first slide is shown
    startAutoplay();
    checkTitleLength();
    handleImageErrors(); // Tambahkan ini
});

// Optional: Pause autoplay when user hovers over slider
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseenter', stopAutoplay);
sliderContainer.addEventListener('mouseleave', () => {
    stopAutoplay();
    startAutoplay();
});

// Replace all modal-related code with this:
const modal = document.getElementById('detailModal');
const modalClose = document.querySelector('.modal-close');

// Simple detail button click handler
document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const slide = this.closest('.slide');
        const title = slide.querySelector('.slide-title').textContent;
        const imageSrc = slide.querySelector('.animal-image').src;
        
        // Update modal content
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.food-image').src = imageSrc;
        
        // Update additional info
        const data = modalData[title] || {
            info: {
                price: 'Harga tidak tersedia',
                hours: 'Jam buka tidak tersedia',
                speciality: 'Spesialitas tidak tersedia'
            },
            location: {
                address: 'Alamat tidak tersedia',
                maps: '#'
            },
            whatsapp: '6281234567890'
        };
        
        modal.querySelector('.food-price').textContent = data.info.price;
        modal.querySelector('.opening-hours').textContent = data.info.hours;
        modal.querySelector('.speciality').textContent = data.info.speciality;
        modal.querySelector('.location-address').textContent = data.location.address;
        modal.querySelector('.map-link').href = data.location.maps;
        modal.querySelector('.whatsapp').href = `https://wa.me/${data.whatsapp}`;
        
        // Show modal with consistent positioning
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Force browser to recalculate layout to ensure consistent positioning
        void modal.offsetWidth;
        
        // Ensure modal content is properly centered
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translate(-50%, -50%)';
        }
        
        stopAutoplay();
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    startAutoplay();
});

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        startAutoplay();
    }
});

// Close with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        startAutoplay();
    }
});

// Tambahkan fungsi untuk mendeteksi judul panjang
function checkTitleLength() {
  const titles = document.querySelectorAll('.slide-title');
  titles.forEach(title => {
    if (title.textContent.length > 10 || title.textContent.includes(' ')) {
      title.setAttribute('data-length', 'long');
    }
  });
}

// Panggil fungsi saat dokumen dimuat
document.addEventListener('DOMContentLoaded', checkTitleLength);

// Tambahkan fungsi untuk menangani gambar yang rusak
function handleImageErrors() {
  const images = document.querySelectorAll('.animal-image');
  images.forEach(img => {
    img.onerror = function() {
      // Ganti dengan placeholder image jika gambar rusak
      this.src = 'assets/images/placeholder.png';
      // Atau gunakan URL placeholder online
      // this.src = 'https://via.placeholder.com/300';
      console.log(`Error loading image: ${this.src}`);
    };
  });
}


// Add this at the beginning of your main.js file

// Preloader with 3-second duration
window.addEventListener('load', function() {
  const preloader = document.querySelector('.preloader');
  const modal = document.getElementById('detailModal');
  
  // Pastikan modal tertutup
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  // Tampilkan preloader selama 3 detik
  setTimeout(function() {
    preloader.classList.add('fade-out');
    
    setTimeout(function() {
      preloader.style.display = 'none';
      // Memulai slider setelah preloader selesai
      startAutoplay();
    }, 500);
  }, 3000);
});

// Function to generate progress bars dynamically based on slide count
function generateProgressBars() {
  const progressBarsContainer = document.querySelector('.progress-bars');
  const slideCount = document.querySelectorAll('.slide').length;
  
  // Clear existing progress bars
  progressBarsContainer.innerHTML = '';
  
  // Create new progress bars based on actual slide count
  for (let i = 0; i < slideCount; i++) {
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress');
    progressBar.setAttribute('data-index', i); // Add index attribute for easier tracking
    if (i === currentSlide) progressBar.classList.add('active');
    progressBarsContainer.appendChild(progressBar);
  }
  
  // Add click event listeners to the new progress bars
  const newProgressBars = document.querySelectorAll('.progress');
  newProgressBars.forEach((progress, index) => {
    progress.addEventListener('click', () => {
      showSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });
  
  return newProgressBars;
}

// Update the DOMContentLoaded event listener to ensure proper initialization
document.addEventListener('DOMContentLoaded', () => {
    // First, set currentSlide to 0 to ensure we start from the first slide
    currentSlide = 0;
    
    // Generate progress bars dynamically
    const updatedProgressBars = generateProgressBars();
    
    // Show the first slide
    showSlide(0);
    
    // Start autoplay
    startAutoplay();
    
    // Run other initialization functions
    checkTitleLength();
    handleImageErrors();
    
    // Pastikan modal tertutup saat halaman dimuat
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});
