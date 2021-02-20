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
    image.src = data.image.medium;
    image.alt = `${data.name} poster`;
    imageDiv.appendChild(image);
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');
    showDetailsDiv.appendChild(detailsDiv);
    const genresDiv = document.createElement('div');
    genresDiv.classList.add('genres');
    detailsDiv.appendChild(genresDiv);
    const genresP = document.createElement('p');
    genresP.textContent = "Genres";
    genresDiv.appendChild(genresP);
    const genresUl = document.createElement('ul');
    genresDiv.appendChild(genresUl);
    data.genres.forEach( (genre) => {
        const genreLi = document.createElement('li');
        genreLi.textContent = genre;
        genresUl.appendChild(genreLi);
    });
    const release = document.createElement('p');
    // release.classList.add('release');
    release.textContent = data.premiered;
    detailsDiv.appendChild(release);
    const rating = document.createElement('p');
    // rating.classList.add('rating');
    rating.textContent = data.rating.average;
    detailsDiv.appendChild(rating);
    const status = document.createElement('p');
    status.textContent = data.status;
    detailsDiv.appendChild(status);
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    showDetailsDiv.appendChild(descriptionDiv);
    descriptionDiv.innerHTML = data.summary;
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