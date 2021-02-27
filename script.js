const tvApp = {};

// single search endpoint
tvApp.apiUrl = "http://api.tvmaze.com/singlesearch/shows";

// get show by id endpoint
tvApp.apiUrlSuggestions = "http://api.tvmaze.com/shows";

tvApp.getShowDetails = (query) => {

    const url = new URL(tvApp.apiUrl);

    url.search = new URLSearchParams({
        q: query,
        embed: 'cast'
    });

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(jsonResponse => {
            tvApp.displayShowDetails(jsonResponse);
        })
        .catch(error => {
            console.log(error);
        });

};

tvApp.getRandomShows = (numOfSuggestions = 10) => {

    if ( !document.querySelector('.suggestions') ) {
        const suggestionsH2 = document.createElement('h2');
        suggestionsH2.innerText = 'Suggestions';
        const suggestionsDiv = document.createElement('ul');
        suggestionsDiv.classList.add('suggestions');
        const header = document.querySelector('header');
        header.append(suggestionsH2, suggestionsDiv);
    }

    const randomNumbers = [];

    for (let i = 0; i < numOfSuggestions; i++) {
        randomNumbers.push(Math.floor(Math.random() * 53000));
    }
 
    const randomShows = randomNumbers.map((number) => {
        return getShowByNum(number);
    });
    
    async function getShowByNum(number) {
        const response = await fetch(`http://api.tvmaze.com/shows/${number}`);
        const data = await response.json();
        return data;
    }

    Promise.all(randomShows)
        .then(responses => {
            responses.forEach((show) => {
                if ( show.name != 'Not Found' ) {
                    tvApp.displaySuggestion(show.name);
                } else {
                    tvApp.getRandomShows(1);
                }
            });
        });  

};

tvApp.displaySuggestion = (show) => {

    const suggestionsDiv = document.querySelector('.suggestions');
    const suggestionLi = document.createElement('li');
    const suggestion = document.createElement('button');
    suggestion.innerText = show;
    suggestionsDiv.appendChild(suggestionLi);
    suggestionLi.appendChild(suggestion);
    
    suggestion.addEventListener('click', function () {
        tvApp.getShowDetails(show);
    });

};

tvApp.displayShowDetails = (data) => {

    const showDetailsDiv = document.querySelector('.show-details');
    showDetailsDiv.innerHTML = '';

    const titleH3 = document.createElement('h3');
    titleH3.textContent = data.name;
    showDetailsDiv.appendChild(titleH3);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    showDetailsDiv.appendChild(imageDiv);
    const image = document.createElement('img');
    if (data.image !== null){
        image.src = data.image.original;
    } else {
        image.src = './assets/notavailable.jpg';
    }
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
    if (data.genres.length !== 0) {
        data.genres.forEach((genre) => {
            const genreLi = document.createElement('li');
            genreLi.textContent = genre;
            genresUl.appendChild(genreLi);
        });
    } else {
        const genreLi = document.createElement('li');
        genreLi.textContent = 'not available';
        genresUl.appendChild(genreLi);
    }

    const premiered = document.createElement('div');
    if (data.premiered) {
        premiered.innerHTML = `<h4>Premiered on:</h4><p>${data.premiered}</p>`;;
    } else {
        premiered.innerHTML = `<h4>Premiered on:</h4><p>Not Available</p>`;
    }

    const rating = document.createElement('div');
    if (data.rating.average) {
        rating.innerHTML = `<h4>Rating:</h4><p>${data.rating.average}</p>`;
    } else {
        rating.innerHTML = `<h4>Rating:</h4><p>Not Available</p>`;
    }

    const status = document.createElement('div');
    if (data.status) {
        status.innerHTML = `<h4>Status:</h4> <p>${data.status}</p>`;
    } else {
        status.innerHTML = `<h4>Status:</h4><p>Not Available</p>`;
    }

    const website = document.createElement('a');
    website.textContent = 'learn more';
    website.classList.add('button');
    website.href = data.url;

    detailsDiv.append(genresDiv, premiered, rating, status, website);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    if(data.summary !== null && data.summary !== "") {
        descriptionDiv.innerHTML = `<h4>Description:</h4><div class='content'>${data.summary}</div>`;
    } else {
        descriptionDiv.innerHTML = `<h4>Description:</h4><div class='content'><p>Not Available</p></div>`;
    }
    showDetailsDiv.appendChild(descriptionDiv);

    if (data._embedded.cast.length !== 0) {
        tvApp.displayCast(data);
    }

};

tvApp.displayCast = (data) => {
    
    const castArray = data._embedded.cast;

    const castWrapper = document.querySelector('.cast-members-container .wrapper');
    castWrapper.innerHTML = '';

    const castTitle = document.createElement('h3');
    castTitle.classList.add('cast-title');
    castWrapper.appendChild(castTitle);
    castTitle.innerHTML = `Cast`;

    const castMembersUl = document.createElement('ul');
    castMembersUl.classList.add('cast-members');
    castWrapper.appendChild(castMembersUl);

    castArray.forEach((member) => {

        const castMemberLi = document.createElement('li');
        castMembersUl.appendChild(castMemberLi);

        const castImgDiv = document.createElement('div');
        castImgDiv.classList.add('image');
        castMemberLi.appendChild(castImgDiv);
        const image = document.createElement('img');
        if (member.character.image !== null){
            image.src = member.character.image.medium;
        } else {
            image.src = './assets/notavail.jpg';
        };
        image.alt = `Picture of ${member.character.name}`;
        castImgDiv.appendChild(image);

        const castInfoDiv = document.createElement('div');
        castInfoDiv.classList.add('cast-info');
        castMemberLi.appendChild(castInfoDiv);

        const characterName = document.createElement('div');
        if (member.character.name !== null) {
            characterName.innerHTML = `<h4>Name of Character:</h4><p>${member.character.name}</p>`;
        } else {
            characterName.innerHTML = `<h4>Name of Character</h4><p>Not Available</p>`;
        }

        const personName = document.createElement('div');
        if (member.person.name !== null){
            personName.innerHTML = `<h4>Played by:</h4><p>${member.person.name}</p>`;
        } else {
            personName.innerHTML = `<h4>Played by:</h4><p>Not Available</p>`;
        }

        const birthday = document.createElement('div');
        if (member.person.birthday !== null) {
            birthday.innerHTML = `<h4>Born:</h4> <p>${member.person.birthday}</p>`;
        } else {
            birthday.innerHTML = `<h4>Born:</h4><p>Not Available</p>`;
        }

        const country = document.createElement('div');
        if (member.person.country !== null)  {
            country.innerHTML = `<h4>Country:</h4><p>${member.person.country.name}</p>`;
        } else {
            country.innerHTML = `<h4>Country:</h4><p>Not Available</p>`;
        }

        castInfoDiv.append(characterName, personName, birthday, country);
    })

};

tvApp.listenToForm = () => {

    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = document.querySelector('input[type=text]').value;
        tvApp.getShowDetails(query);
        document.querySelector('input[type=text]').value = '';
    });

};

tvApp.init = () => {
    document.querySelector('input[type=text]').value = '';
    tvApp.getRandomShows();
    tvApp.listenToForm();
};

tvApp.init();