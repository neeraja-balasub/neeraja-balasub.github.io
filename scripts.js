// Global variables
let allPublications = [];
let showingSelected = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load publications data
  loadPublications();
  
  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Add event listener for toggle button
  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.addEventListener('click', togglePublications);
  }
});

// Load publications from JSON file
function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Publications loaded successfully:", data);
      allPublications = data.publications;
      renderPublications(true);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      // Create fallback publications display if JSON loading fails
      displayFallbackPublications();
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  container.innerHTML = `Error loading publications.`;
}

// Toggle between showing all or selected publications
function togglePublications() {
  showingSelected = !showingSelected;
  renderPublications(showingSelected);
  
  // Update button text
  const toggleButton = document.getElementById('toggle-publications');
  toggleButton.textContent = showingSelected ? 'Show All' : 'Show Selected';
  const toggleHeader = document.getElementById('toggle-header');
  toggleHeader.textContent = showingSelected ? 'Selected Publications' : 'All Publications';
}

// Render publications based on selection state
function renderPublications(selectedOnly) {
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';
  
  const pubsToShow = selectedOnly ? 
    allPublications.filter(pub => pub.selected === 1) : 
    allPublications;
  
  pubsToShow.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    publicationsContainer.appendChild(pubElement);
  });
}

// Create HTML element for a publication
// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';

  // Decide what the main click target should be
  let mainLink = '#';
  if (publication.links) {
    mainLink =
      publication.links.doi   ||
      publication.links.url   ||
      publication.links.pdf   ||
      publication.links.repo  ||
      publication.links.poster ||
      '#';
  }

  // --- Thumbnail (image) wrapped in a link ---
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';

  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = publication.thumbnail;
  thumbnailImg.alt = `${publication.title} thumbnail`;
  thumbnail.appendChild(thumbnailImg);

  const thumbLink = document.createElement('a');
  thumbLink.href = mainLink;
  thumbLink.target = '_blank';
  thumbLink.rel = 'noopener noreferrer';
  thumbLink.className = 'pub-thumb-link';
  thumbLink.appendChild(thumbnail);

  // --- Content container ---
  const content = document.createElement('div');
  content.className = 'pub-content';

  // Title wrapped in a link
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;

  const titleLink = document.createElement('a');
  titleLink.href = mainLink;
  titleLink.target = '_blank';
  titleLink.rel = 'noopener noreferrer';
  titleLink.className = 'pub-title-link';
  titleLink.appendChild(title);
  content.appendChild(titleLink);

  // Authors with highlight
  const authors = document.createElement('div');
  authors.className = 'pub-authors';

  let authorsHTML = '';
  publication.authors.forEach((author, index) => {
    // TODO: adjust this condition to match your own name if you want highlighting
    if (author.includes('Neeraja Balasubrahmaniam')) {
      authorsHTML += `<span class="blue-a">${author}</span>`;
    } else {
      authorsHTML += author;
    }

    if (index < publication.authors.length - 1) {
      authorsHTML += ', ';
    }
  });
  authors.innerHTML = authorsHTML;
  content.appendChild(authors);

  // Venue + award
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';

  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);

  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }
  content.appendChild(venueContainer);

  // Links (PDF / Code / Poster)
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    if (publication.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = publication.links.pdf;
      pdfLink.target = '_blank';
      pdfLink.textContent = '[PDF]';
      links.appendChild(pdfLink);
    }

    if (publication.links.repo) {
      const codeLink = document.createElement('a');
      codeLink.href = publication.links.repo;
      codeLink.target = '_blank';
      codeLink.textContent = '[Code]';
      links.appendChild(codeLink);
    }

    if (publication.links.poster) {
      const projectLink = document.createElement('a');
      projectLink.href = publication.links.poster;
      projectLink.target = '_blank';
      projectLink.textContent = '[Poster]';
      links.appendChild(projectLink);
    }

    content.appendChild(links);
  }

  // Assemble the publication item
  pubItem.appendChild(thumbLink);  // link-wrapped thumbnail
  pubItem.appendChild(content);

  return pubItem;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
}
