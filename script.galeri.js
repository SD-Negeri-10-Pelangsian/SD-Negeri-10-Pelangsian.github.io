// Data galeri default - 3 GAMBAR BERBEDA
const defaultGallery = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&h=600&fit=crop',
        title: 'Upacara Bendera',
        date: '15 Agustus 2024'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1490613541933-9fd87c5a6c4e?w=1000&h=600&fit=crop',
        title: 'Kegiatan Olahraga',
        date: '20 September 2024'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1000&h=600&fit=crop',
        title: 'Pembelajaran Interaktif',
        date: '25 Oktober 2024'
    }
];

let galleryImages = [...defaultGallery];
let currentIndex = 0;
let autoPlayInterval = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing gallery...');
    renderThumbnails();
    renderSwiper();
    initSwiperControls();
    startAutoPlay();
});

function renderThumbnails() {
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    if (!thumbnailGrid) {
        console.error('Thumbnail grid not found');
        return;
    }

    thumbnailGrid.innerHTML = '';

    galleryImages.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-item';
        thumbnail.onclick = () => openModal(image.src);
        thumbnail.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="thumbnail-overlay">
                <div class="thumbnail-title">${image.title}</div>
                <div class="thumbnail-date">${image.date}</div>
            </div>
        `;
        thumbnailGrid.appendChild(thumbnail);
    });

    console.log('Thumbnails rendered:', galleryImages.length);
}

function renderSwiper() {
    const swiperWrapper = document.getElementById('gallerySwiper');
    if (!swiperWrapper) {
        console.error('Swiper wrapper not found');
        return;
    }

    swiperWrapper.innerHTML = '';
    swiperWrapper.style.transition = 'none'; // Reset transition

    galleryImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.dataset.index = index;
        slide.innerHTML = `<img src="${image.src}" alt="${image.title}" loading="lazy">`;
        swiperWrapper.appendChild(slide);
    });

    // Force reset to first slide
    setTimeout(() => {
        currentIndex = 0;
        swiperWrapper.style.transform = `translateX(0%)`;
        swiperWrapper.style.transition = 'transform 0.5s ease';
        console.log('Swiper rendered and reset to first slide');
    }, 100);
}

function initSwiperControls() {
    const prevBtn = document.querySelector('.swiper-button-prev');
    const nextBtn = document.querySelector('.swiper-button-next');
    const swiperWrapper = document.getElementById('gallerySwiper');

    if (!prevBtn || !nextBtn || !swiperWrapper) {
        console.error('Swiper controls not found');
        return;
    }

    // REMOVE old event listeners dengan clone method
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    newPrevBtn.addEventListener('click', goToPrev);
    newNextBtn.addEventListener('click', goToNext);

    console.log('Swiper controls initialized');
}

function goToNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateSwiper();
    resetAutoPlay();
}

function goToPrev() {
    currentIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    updateSwiper();
    resetAutoPlay();
}

function updateSwiper() {
    const swiperWrapper = document.getElementById('gallerySwiper');
    if (!swiperWrapper) return;

    swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    console.log('Switched to slide:', currentIndex);
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
        goToNext();
    }, 4000);
    console.log('Auto-play started');
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

function setupEventListeners() {
    // Modal functionality - SINGLE EVENT LISTENER
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
            closeModal();
        }
        if (e.target.matches('.upload-gallery-btn')) {
            uploadGalleryImage();
        }
    }, { once: false });
}

function openModal(imageSrc) {
    stopAutoPlay();
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-close">&times;</div>
        <img src="${imageSrc}" alt="Fullscreen image">
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.remove();
        startAutoPlay();
    }
}

function uploadGalleryImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const newImage = {
                    id: Date.now(),
                    src: e.target.result,
                    title: `Foto Baru ${new Date().toLocaleDateString('id-ID')}`,
                    date: new Date().toLocaleDateString('id-ID')
                };
                galleryImages.unshift(newImage);
                renderThumbnails();
                renderSwiper();
                initSwiperControls(); // Re-init controls
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Initialize everything
setupEventListeners();