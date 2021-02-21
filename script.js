const tvApp = {};

tvApp.apiUrl = "http://api.tvmaze.com/singlesearch/shows";

tvApp.getData = (query) => {
    tvApp.apiQuery = query;
    const url = new URL(tvApp.apiUrl);
    url.search = new URLSearchParams({
            q: tvApp.apiQuery
    });

    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(jsonResponse){
            console.log(jsonResponse);
            tvApp.displayTvData(jsonResponse);
        })
}

tvApp.displayTvData = (data) => {
    const showDetailsDiv = document.querySelector('.show-details');
    showDetailsDiv.innerHTML = '';
    console.log(showDetailsDiv);
    const titleH3 = document.createElement('h3');
    titleH3.textContent = data.name;
    showDetailsDiv.appendChild(titleH3);
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    showDetailsDiv.appendChild(imageDiv);
    const image = document.createElement('img');
    image.src = data.image.original;
    image.alt = `${data.name} poster`;
    imageDiv.appendChild(image);
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');
    showDetailsDiv.appendChild(detailsDiv);
    const genresDiv = document.createElement('div');
    genresDiv.classList.add('genres');
    detailsDiv.appendChild(genresDiv);
    const genresP = document.createElement('h4');
    genresP.textContent = "Genres:";
    genresDiv.appendChild(genresP);
    const genresUl = document.createElement('ul');
    genresDiv.appendChild(genresUl);
    data.genres.forEach( (genre) => {
        const genreLi = document.createElement('li');
        genreLi.textContent = genre;
        genresUl.appendChild(genreLi);
    });
    const release = document.createElement('div');
    // release.classList.add('release');
    release.innerHTML = `<h4>premiered on:</h4><p>${data.premiered}</p>`;
    detailsDiv.appendChild(release);
    const rating = document.createElement('div');
    // rating.classList.add('rating');
    rating.innerHTML = `<h4>Rating:</h4><p>${data.rating.average}</p>`;
    detailsDiv.appendChild(rating);
    const status = document.createElement('div');
    status.innerHTML = `<h4>Status:</h4> <p>${data.status}</p>`;
    detailsDiv.appendChild(status);
    const website = document.createElement('a');
    website.textContent = 'visit website';
    website.classList.add('button');
    website.href = data.url;
    detailsDiv.appendChild(website);
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    showDetailsDiv.appendChild(descriptionDiv);
    descriptionDiv.innerHTML =`<h4>Description:</h4><div class='content'>${data.summary}</div>`;
    
};

tvApp.listenToForm = () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.querySelector('input[type=text]').value;
        tvApp.getData(query);
        document.querySelector('input[type=text]').value = '';
    });
}

tvApp.init = () => {
    document.querySelector('input[type=text]').value = '';
    tvApp.listenToForm();
};

tvApp.init();