// this is an IIFE that wraps up much of my code to minimize side-effects.

let pokemonRepository = (function () {
  let pokemonList = [];

  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
      pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon){

    //This section creates the buttons that lead to more details about the pokemon.

    let unorderedList = document.querySelector('.pokemon-ul');
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    let button = document.createElement('button');
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('btn-block');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.dataset.target = '#pokemonModal';
    button.innerText = pokemon.name;
    listItem.appendChild(button);
    unorderedList.appendChild(listItem);

    //this section makes clicking the buttons send pokemon details into a modal that pops up.

    button.addEventListener('click', function(){
      showDetails(pokemon);
    });
  }

  //This section is the code for fetching Pokemon data from the Pokemon API.

  async function loadList() {
    try {
      let response = await fetch(apiUrl);
      let json = await response.json();
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    } catch(e) {
      alert.error(e);
    }
  }

  //This section is the code for extracting Pokemon details from detailsUrl.

  async function loadDetails(item) {
    let url = item.detailsUrl;
    try {
      let response = await fetch(url);
      let json = await response.json();
      item.imageUrl = json.sprites.front_default;
      item.height = json.height;
      item.types = json.types;
    } catch(e) {
      alert.error(e);
    }
  }

  //This function sends pokemon details to the modal.

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {

      // This section puts info about the selected pokemon into the modal.

      let modalTitle = document.querySelector('#modalTitle');
      modalTitle.innerText = pokemon.name;
      let contentContainer = document.querySelector('.modal-body');
      contentContainer.innerText = 'height: ' + pokemon.height;

      let imageElement = document.createElement('img');
      imageElement.classList.add('modal-pokemon-image');
      imageElement.src = pokemon.imageUrl;
      setTimeout(function() {imageElement.classList.add('loaded')}, 500)

      contentContainer.appendChild(imageElement);
    });
  }

  //This section makes these functions callable outside the IIFE.

  return{add, getAll, addListItem, loadList, loadDetails};
})()


//This section creates a list of the Pokemons' names.

pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});

//This section makes the search box work

document.getElementById('search-term').addEventListener('input', e => {
  let searchTerm = e.target.value;
  let buttons = document.getElementsByClassName('btn-block');
  for (let i = 0; i < buttons.length; i ++){
    if (buttons[i].innerText.toLowerCase().includes(searchTerm.toLowerCase())){
      buttons[i].parentNode.style.display = 'block';
    } else {
      buttons[i].parentNode.style.display = 'none';
    }
  }
})
