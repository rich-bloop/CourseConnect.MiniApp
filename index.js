const carouselInner = document.querySelector('.carousel-inner');
            const carouselItems = document.querySelectorAll('.carousel-item');
            const controls = document.querySelectorAll('.carousel-controls div');
            const leftArrow = document.querySelector('.carousel-arrow.left');
            const rightArrow = document.querySelector('.carousel-arrow.right');
            let currentIndex = 0;

            function updateCarousel() {
                const offset = -currentIndex * (carouselItems[0].clientWidth + 20);
                carouselInner.style.transform = `translateX(${offset}px)`;
                controls.forEach((control, index) => {
                    control.classList.toggle('active', index === currentIndex);
                });
            }

            // Event listeners for carousel arrows
            leftArrow.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
                updateCarousel();
            });

            rightArrow.addEventListener('click', () => {
                currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });

            // Event listeners for carousel controls
            controls.forEach((control, index) => {
                control.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
            });

            // Search functionality
            document.getElementById('searchButton').addEventListener('click', () => {
                const searchInput = document.getElementById('searchInput').value.toLowerCase();

                carouselItems.forEach(item => {
                    const imgAltText = item.querySelector('img').alt.toLowerCase();
                    if (imgAltText.includes(searchInput)) {
                        item.style.display = 'block'; // Show item if it matches
                    } else {
                        item.style.display = 'none'; // Hide item if it doesn't match
                    }
                });

                // Reset the carousel to the first item after searching
                currentIndex = 0;
                updateCarousel();
            });

            // Initialize the carousel on page load
            updateCarousel();

            // Modal functionality
            const modal = document.getElementById("imageModal");
            const modalImage = document.getElementById("modalImage");
            const captionText = document.getElementById("caption");
            const closeModal = document.getElementsByClassName("close")[0];
            let modalIndex = 0;

            // Add click event to each carousel item to open modal
            carouselItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    modal.style.display = "block";
                    const img = item.querySelector('img');
                    modalImage.src = img.src;
                    captionText.innerHTML = img.alt;
                    modalIndex = index; // Set the current index for swiping
                    updateModalImage(); // Update the modal image
                });
            });

            // Function to update the modal image based on the current index
            function updateModalImage() {
                const img = carouselItems[modalIndex].querySelector('img');
                modalImage.src = img.src;
                captionText.innerHTML = img.alt;

                // Update active class for scaling effect
                carouselItems.forEach((item, index) => {
                    item.querySelector('img').classList.toggle('active', index === modalIndex);
                });
            }

            // Close the modal when the user clicks on <span> (x)
            closeModal.onclick = function() {
                modal.style.display = "none";
            }

            // Close the modal when the user clicks anywhere outside of the modal
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

            // Swipe functionality
            let startX;

            modal.addEventListener('touchstart', (event) => {
                startX = event.touches[0].clientX; // Get the starting touch position
            });

            modal.addEventListener('touchmove', (event) => {
                const moveX = event.touches[0].clientX; // Get the current touch position
                const diffX = startX - moveX; // Calculate the difference

                // If the swipe was significant enough, change the image
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swiped left
                        modalIndex = (modalIndex < carouselItems.length - 1) ? modalIndex + 1 : 0; // Loop back to the first image
                    } else {
                        // Swiped right
                        modalIndex = (modalIndex > 0) ? modalIndex - 1 : carouselItems.length - 1; // Loop back to the last image
                    }
                    updateModalImage(); // Update the modal image
                    startX = moveX; // Reset start position
                }
            });