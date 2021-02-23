const tvApp = {};

tvApp.apiUrl = "http://api.tvmaze.com/singlesearch/shows";
tvApp.apiUrlSuggestions = "http://api.tvmaze.com/shows";

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
            // console.log(jsonResponse);
            tvApp.displayTvData(jsonResponse);
        })
}

tvApp.randomNumber = () => {

    const numOfSuggestions = 10;
    const randomNumbers = [];
    for ( let i = 0; i < numOfSuggestions; i++) {
        randomNumbers.push( Math.floor( Math.random() * 53000 ) );
    }

    // console.log(randomNumbers);
    tvApp.getSuggestions(randomNumbers);
};

tvApp.getSuggestions = (randomNumbers) => {
    // console.log(randomNumbers);

    for ( let i = 0; i < randomNumbers.length ; i++ ) {

        const showId = randomNumbers[i];
        const url = `${tvApp.apiUrlSuggestions}/${showId}`;

        fetch(url)
            .then(function(response){
                // console.log(response);
                return response.json();
            })
            .then(function(jsonResponse){
                // console.log(jsonResponse);
                tvApp.displaySuggestions(jsonResponse);
                // suggestionsArray.push(2);
            })

    }

    const suggestionsH2 = document.createElement('h2');
    suggestionsH2.innerText = 'Suggestions';
    const suggestionsDiv = document.createElement('ul');
    suggestionsDiv.classList.add('suggestions');
    const header = document.querySelector('header');
    header.append(suggestionsH2, suggestionsDiv);

    // this function doesn't work
    tvApp.listenToSuggestions();

}

tvApp.displaySuggestions = (data) => {
    
    // console.log(data);

    const suggestionsDiv = document.querySelector('.suggestions');
    const suggestion = document.createElement('li');
    suggestion.innerText = data.name;
    suggestionsDiv.appendChild(suggestion);

};

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
    release.innerHTML = `<h4>premiered on:</h4><p>${data.premiered}</p>`;
    const rating = document.createElement('div');
    rating.innerHTML = `<h4>Rating:</h4><p>${data.rating.average}</p>`;
    const status = document.createElement('div');
    status.innerHTML = `<h4>Status:</h4> <p>${data.status}</p>`;
    const website = document.createElement('a');
    website.textContent = 'learn more';
    website.classList.add('button');
    website.href = data.url;

    detailsDiv.append(genresDiv, release, rating, status, website);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    showDetailsDiv.appendChild(descriptionDiv);
    descriptionDiv.innerHTML =`<h4>Description:</h4><div class='content'>${data.summary}</div>`;
    
};

//  not working
tvApp.listenToSuggestions = () => {
    const suggestions = document.querySelectorAll('header li');
    // console.log(suggestions);
    // for ( suggestion of suggestions ) {
    //     console.log(suggestion);
    // };
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
    tvApp.randomNumber();
    document.querySelector('input[type=text]').value = '';
    tvApp.listenToForm();
};

tvApp.init();