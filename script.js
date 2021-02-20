const tvApp = {};

tvApp.apiUrl = "http://api.tvmaze.com/singlesearch/shows";
tvApp.apiQuery = "friends";

tvApp.getData = () => {

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
    const title = document.querySelector('.show-details h3');
    title.textContent = data.name;
    const imageDiv = document.querySelector('.image');
    const image = document.createElement('img');
    image.src = data.image.medium;
    image.alt = `${data.name} poster`;
    imageDiv.appendChild(image);
    const detailsDiv = document.querySelector('.details');
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
    const descriptionDiv = document.querySelector('.description');
    descriptionDiv.innerHTML = data.summary;

};

tvApp.init = () => {
    tvApp.getData();
};

tvApp.init();