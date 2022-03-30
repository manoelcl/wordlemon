"use strict";

let pokemon;
let tries = 4;

const pokeballTray = document.querySelector(".pokeball-tray");
const img = document.querySelector(".imagePokemon img");
const textInput = document.forms.textForm;

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

const pokeballTemplate = `<div></div>
<div>
  <div></div>
  <div></div>
  <div><p>B</p></div>
</div>`;

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

  createPokeballs(nextPattern, guess);

  if (pokemonName.toUpperCase() === guess) {
    const h2 = document.createElement("h2");
    h2.textContent = `The pokémon was ${pokemonName}`;
    img.classList.remove("no-brightness");
    pokeballTray.append(h2);
  } else if (--tries <= 0) {
    const h2 = document.createElement("h2");
    h2.textContent = `The pokémon was ${pokemonName}`;
    img.classList.remove("no-brightness", "no-visible");
    pokeballTray.append(h2);
  }

  if ((tries = 3)) {
    img.classList.remove("no-visible");
  }
}

const setupGame = async () => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 700)}/`
    );

    if (response.ok) {
      pokemon = await response.json();
    } else {
      throw new Error("Failed to import");
    }
  } catch (error) {
    console.log(error);
  }
  img.src = pokemon.sprites.front_default;
  img.classList.add("no-brightness", "no-visible");
  createPokeballs(pokemon.species.name.toUpperCase(), "");
  console.log(pokemon.species.name);
};

setupGame();
