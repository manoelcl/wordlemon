"use strict";
import { encode64, decode64 } from "./helpers/encoding.js";

//VARIABLES

const totalPokemon = 811;
let pokemon;
let tries = 4;
let rewards = [];

//DOM ELEMENTS VARIABLES

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

//------INPUT FUNCTIONS----//

//TEXT INPUT

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
  const inputLength = event.target.value.length;
  const nameLength = pokemon.species.name.length;
  if (inputLength === nameLength) {
    event.target.classList.add("green");
  } else if (inputLength > nameLength) {
    event.target.classList.add("green");
    event.target.value = event.target.value.slice(0, nameLength);
  } else {
    event.target.classList.remove("green");
  }
});

//CREATE BUTTON

const createButton = (text, callback) => {
  const button = document.createElement("button");
  button.textContent = "Next Pokémon";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    pokeballTray.innerHTML = "";
    setupGame();
  });
  return button;
};

//-----------GAMEPLAY FUNCTIONS-----------//

//CREATE POKEBALLS

const rewardEvent = (event) => {
  const DOMElement = event.currentTarget;
  DOMElement.removeEventListener("click", addReward);
  DOMElement.classList.remove("special");
  img.classList.remove("no-visible");
};

const addReward = (pokeball, position) => {
  pokeball.classList.add("special");
  pokeball.addEventListener("click", rewardEvent);
  rewards[position] = 0;
};

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
      if (rewards[index] === 2) {
        addReward(newPokeball, index);
      }
    } else if (element === "○") {
      newPokeball.classList.add("half-captured");
      if (rewards[index] === 1) {
        addReward(newPokeball, index);
      }
    } else {
      newPokeball.classList.add("not-captured");
    }
    pokeballSet.append(newPokeball);
  });
  pokeballTray.append(pokeballSet);
};

//CREATE REWARDS

const createRewards = (string) => {
  rewards = [];
  [...string].map(() => {
    const reward = Math.floor(Math.random() * 3);
    rewards.push(reward);
  });
  console.log(rewards);
};

//MAIN LOOP

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

  createPokeballs(nextPattern, guess);
  console.log(tries);

  if (pokemonName.toUpperCase() === guess) {
    textInput.children[0].disabled = true;
    img.classList.remove("no-brightness", "no-visible");
    img.classList.add("move");
    const p1 = document.createElement("p");
    p1.textContent = `All right!`;
    const p2 = document.createElement("p");
    p2.textContent = `${pokemonName} was caught!`;
    const p3 = document.createElement("p");
    p3.textContent = `New POKÉDEX data will be added for ${pokemonName}!`;
    const restartButton = createButton();
    pokeballTray.append(p1, p2, p3, restartButton);

    const getPokemon = getStoredPokemon();

    storePokemon(getPokemon, pokemonName);
  } else if (--tries <= 0) {
    const p = document.createElement("p");
    p.textContent = `The pokémon was ${pokemonName}`;
    img.classList.remove("no-brightness", "no-visible");
    const restartButton = createButton();
    pokeballTray.append(p, restartButton);
  }
}

//GAME SETUP

const setupGame = async () => {
  textInput.children[0].disabled = false;
  tries = 4;
  img.parentElement.children[0].style.visibility = "visible";
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${Math.floor(
        Math.random() * totalPokemon
      )}/`
    );

    if (response.ok) {
      pokemon = await response.json();
      img.parentElement.children[0].style.visibility = "hidden";
    } else {
      throw new Error("Failed to import Pokeapi data.");
    }
  } catch (error) {
    console.log(error);
  }
  img.src = pokemon.sprites.front_default;
  img.classList.add("no-brightness", "no-visible");
  img.classList.remove("move");
  createPokeballs(pokemon.species.name.toUpperCase(), "");
  console.log(pokemon.species.name);
  createRewards(pokemon.species.name);
  updatePokedexNumber();
};

setupGame();
