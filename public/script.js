// JavaScript for index.html
document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Fetch berita data
      const beritaResponse = await fetch('/api/berita');
      const beritaData = await beritaResponse.json();
  
      // Update DOM with berita data
      const beritaSection = document.getElementById('berita');
      beritaData.forEach(berita => {
        const beritaElement = document.createElement('div');
        beritaElement.innerHTML = `
          <h3>${berita.title}</h3>
          <p>${berita.paragraf}</p>
          <img src="${berita.gambar}" alt="${berita.title}">
        `;
        beritaSection.appendChild(beritaElement);
      });
  
      // Fetch ekskul data
      const ekskulResponse = await fetch('/api/ekskul');
      const ekskulData = await ekskulResponse.json();
  
      // Update DOM with ekskul data
      const ekskulSection = document.getElementById('ekskul');
      ekskulData.forEach(ekskul => {
        const ekskulElement = document.createElement('div');
        ekskulElement.innerHTML = `
          <h3>${ekskul.title}</h3>
          <p>${ekskul.paragraf}</p>
          <img src="${ekskul.gambar}" alt="${ekskul.title}">
        `;
        ekskulSection.appendChild(ekskulElement);
      });
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  });
  