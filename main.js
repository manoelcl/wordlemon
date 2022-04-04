"use strict";
import { encode64, decode64 } from "./helpers/encoding.js";

//General variables

const totalPokemon = 811;
let pokemon;
let tries = 4;

//DOM elements

const pokeballTray = document.querySelector(".pokeball-tray");
const pokedexButton = document.querySelector("header section");
const img = document.querySelector(".imagePokemon img");
const textInput = document.forms.textForm;

//POKEBALL HTML TEMPLATE

const pokeballTemplate = `<div></div>
<div>
  <div></div>
  <div></div>
  <div><p>B</p></div>
</div>`;

//STORAGE FUNCTIONS

const getStoredPokemon = () =>
  localStorage.getItem("pokemons")
    ? JSON.parse(decode64(localStorage.getItem("pokemons")))
    : [];

const storePokemon = (pokemonArray, pokemonName) => {
  pokemonArray.push(pokemonName);
  const newPokemonAdded = [...new Set(pokemonArray)];
  localStorage.setItem("pokemons", encode64(JSON.stringify(newPokemonAdded)));
};

const updatePokedexNumber = () =>
  (pokedexButton.children[1].textContent = `${getStoredPokemon()
    .length.toString()
    .padStart(3, 0)}/${totalPokemon}`);

textInput.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target.elements.textInput.value;
  if (pokemon.species.name.length === input.length) {
    guessPokemon(pokemon.species.name.toUpperCase(), input.toUpperCase());
    event.target.elements.textInput.value = "";
    event.target.elements.textInput.classList.remove("green");
  }
});

textInput.elements.textInput.addEventListener("input", (event) => {
  console.log(event.target.value);
  if (event.target.value.length === pokemon.species.name.length) {
    event.target.classList.add("green");
  } else {
    event.target.classList.remove("green");
  }
});

const createPokeballs = (pokeballs, guess) => {
  const pokeballSet = document.createElement("div");
  pokeballSet.className = "pokeball-set";
  [...pokeballs].forEach((element, index) => {
    const newPokeball = document.createElement("div");
    newPokeball.classList.add("pokeball");
    newPokeball.innerHTML = pokeballTemplate;
    newPokeball.querySelector("p").textContent = guess[index];
    if (element === "◓") {
      newPokeball.classList.add("captured");
    } else if (element === "○") {
      newPokeball.classList.add("half-captured");
    } else {
      newPokeball.classList.add("not-captured");
    }
    pokeballSet.append(newPokeball);
  });
  pokeballTray.append(pokeballSet);
};

function guessPokemon(pokemonName, guess) {
  let nextPattern = "";

  for (let i = 0; i < pokemonName.length; i++) {
    let nextSymbol = "";
    for (let j = 0; j < pokemonName.length; j++) {
      if (pokemonName[j] === guess[i]) {
        if (i === j) {
          nextSymbol = "◓";
          break;
        }
        nextSymbol = "○";
      }
    }
    nextPattern += nextSymbol || "◌";
  }

  const createRestarButton = () => {
    const restartButton = document.createElement("button");
    restartButton.textContent = "Next Pokémon";
    restartButton.addEventListener("click", (event) => {
      event.preventDefault();
      pokeballTray.innerHTML = "";
      setupGame();
    });
    return restartButton;
  };

  createPokeballs(nextPattern, guess);
  console.log(tries);
  if (pokemonName.toUpperCase() === guess) {
    textInput.children[0].disabled = true;
    img.classList.remove("no-brightness", "no-visible");
    img.classList.add("move");
    const h21 = document.createElement("h2");
    h21.textContent = `All right!`;
    const h22 = document.createElement("h2");
    h22.textContent = `${pokemonName} was caught!`;
    const h23 = document.createElement("h2");
    h23.textContent = `New POKÉDEX data will be added for ${pokemonName}!`;
    const restartButton = createRestarButton();
    pokeballTray.append(h21, h22, h23, restartButton);

    const getPokemon = getStoredPokemon();

    storePokemon(getPokemon, pokemonName);
  } else if (--tries <= 0) {
    const h2 = document.createElement("h2");
    h2.textContent = `The pokémon was ${pokemonName}`;
    img.classList.remove("no-brightness", "no-visible");
    const restartButton = createRestarButton();
    pokeballTray.append(h2, restartButton);
  } else if (tries === 3) {
    img.classList.remove("no-visible");
  }
}

const setupGame = async () => {
  textInput.children[0].disabled = false;
  tries = 4;
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${Math.floor(
        Math.random() * totalPokemon
      )}/`
    );

    if (response.ok) {
      pokemon = await response.json();
    } else {
      throw new Error("Failed to import Pokeapi data.");
    }
  } catch (error) {
    console.log(error);
  }
  img.src = pokemon.sprites.front_default;
  img.classList.add("no-brightness", "no-visible");
  createPokeballs(pokemon.species.name.toUpperCase(), "");
  console.log(pokemon.species.name);
  updatePokedexNumber();
};

setupGame();
