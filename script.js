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
        .then(response => {
            return response.json();
        })
        .then(jsonResponse => {
            // console.log(jsonResponse);
            tvApp.displayTvData(jsonResponse);
        })
        .catch(error => {
            // console.log(error);
        });
}


tvApp.randomNumbers = (numOfSuggestions = 10) => {
    // console.log('randomNumbers');
    const randomNumbers = [];

    // const numOfSuggestions = 10;
    for (let i = 0; i < numOfSuggestions; i++) {
        randomNumbers.push(Math.floor(Math.random() * 53000));
    }
    const showResults = [];
    randomNumbers.forEach(number => {
        showResults.push(getShowByNum(number));
    });
    Promise.all(showResults)
        .then(responses => {
            responses.forEach(show => {
                if (show.name != 'Not Found') {
                    tvApp.displaySuggestions(show.name);
                } else {
                    tvApp.randomNumbers(1);
                }
            });
        })
        .catch(error => {
            console.log(error);
        });
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
    suggestion.addEventListener('click', function () {
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
        if (data.rating.average){
            rating.innerHTML = `<h4>Rating:</h4><p>${data.rating.average}</p>`;
        } else {
            rating.innerHTML = `<h4>Rating:</h4><p>Not Available</p>`;
        }
    console.log(data);

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
    showDetailsDiv.appendChild(descriptionDiv);
    descriptionDiv.innerHTML = `<h4>Description:</h4><div class='content'>${data.summary}</div>`;
    tvApp.displayCast(data);
};


tvApp.displayCast = (data) => {
    const castArray = data._embedded.cast;
    // console.log(castArray);
    // // console.log(data);
    console.log(data._embedded.cast)
    const castWrapper = document.querySelector('.cast-members-container .wrapper');
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
        image.src = member.character.image.medium;
        image.alt = `Picture of ${member.character.name}`;
        castImgDiv.appendChild(image);
        const castInfoDiv = document.createElement('div');
        castInfoDiv.classList.add('cast-info');
        castMemberLi.appendChild(castInfoDiv);
        const characterName = document.createElement('div');
        characterName.innerHTML = `<h4>Name of Character:</h4><p>${member.character.name}</p>`;
        const personName = document.createElement('div');
        personName.innerHTML = `<h4>Played by:</h4><p>${member.person.name}</p>`;
        const birthday = document.createElement('div');
        birthday.innerHTML = `<h4>Born: </h4> <p>${member.person.birthday}</p>`;
        const country = document.createElement('div');
        country.innerHTML = `<h4>Country: </h4> <p>${member.person.country.name}</p>`;
        castInfoDiv.append(characterName, personName, birthday, country);

        console.log(member.character.name);
        console.log(member.character.image.medium);
        console.log(member.person.country.name);
        console.log(member.person.birthday);
    })

}



tvApp.listenToForm = () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = document.querySelector('input[type=text]').value;
        tvApp.getData(query);
        document.querySelector('input[type=text]').value = '';
    });
}

tvApp.init = () => {
    const suggestionsH2 = document.createElement('h2');
    suggestionsH2.innerText = 'Suggestions';
    const suggestionsDiv = document.createElement('ul');
    suggestionsDiv.classList.add('suggestions');
    const header = document.querySelector('header');
    header.append(suggestionsH2, suggestionsDiv);
    tvApp.randomNumbers();
    document.querySelector('input[type=text]').value = '';
    tvApp.listenToForm();
};

tvApp.init();