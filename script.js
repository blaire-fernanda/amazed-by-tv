const tvApp = {};





tvApp.apiUrl = "http://api.tvmaze.com/singlesearch/shows";
tvApp.apiUrlSuggestions = "http://api.tvmaze.com/shows";

tvApp.getData = (query) => {
    tvApp.apiQuery = query;
    const url = new URL(tvApp.apiUrl);
    url.search = new URLSearchParams({
            q: tvApp.apiQuery,
            embed: 'cast'
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


tvApp.randomNumbers = () => {
    // console.log('randomNumbers');
    const randomNumbers = [];

    const numOfSuggestions = 10;
    for ( let i = 0; i < numOfSuggestions; i++) {
        randomNumbers.push( Math.floor( Math.random() * 53000 ) );
    }
    const showResults = [];
    randomNumbers.forEach(number => {
        showResults.push(getShowByNum(number));
    });
    const suggestionsH2 = document.createElement('h2');
    suggestionsH2.innerText = 'Suggestions';
    const suggestionsDiv = document.createElement('ul');
    suggestionsDiv.classList.add('suggestions');
    const header = document.querySelector('header');
    header.append(suggestionsH2, suggestionsDiv);
    Promise.all(showResults)
        .then(responses => {
            responses.forEach(show => {
                tvApp.displaySuggestions(show.name);
            })
        })
        .catch(error => {
            console.log(error);
        })
};

async function getShowByNum(number) {
    const response = await fetch(`http://api.tvmaze.com/shows/${number}`);
    const data = await response.json();
    return data;
}

tvApp.displaySuggestions = (show) => {
    const suggestionsDiv = document.querySelector('.suggestions');
    const suggestion = document.createElement('li');
    suggestion.innerText = show;
    suggestionsDiv.appendChild(suggestion);
    suggestion.addEventListener('click', function(){
        tvApp.getData(show);
    });
}


tvApp.displayTvData = (data) => {
    const showDetailsDiv = document.querySelector('.show-details');
    showDetailsDiv.innerHTML = '';
    // console.log(showDetailsDiv);
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
    tvApp.displayCast(data);
};

tvApp.displayCast = (data) => {
    const castArray = data._embedded.cast;
    // console.log(castArray);
    // // console.log(data);
    console.log(data._embedded.cast)
    castArray.forEach((member) => {
        console.log(member.character.name);
        console.log(member.character.image.medium);
    })

}



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
    tvApp.randomNumbers();
    document.querySelector('input[type=text]').value = '';
    tvApp.listenToForm();
};

tvApp.init();