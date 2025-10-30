const input = document.querySelector(".input-pokemon");
const mensaje = document.querySelector(".mensaje");
const seccionPokemons = document.querySelector(".seccion-pokemons");

let identificadorPokemon;
let nombre;
let altura;
let peso;
let tipos;
let ruta;

let listaNombres = [];

//Guarda todos los nombres de todos los pokémons en listaNombres
obtenerPokemons()

if (input) {
    input.addEventListener('input', async () => {
        buscarPokemon();
    });
}


// Función asíncrona para buscar pokémons por nombre
async function buscarPokemon() {
    const valor = input.value.toLowerCase().trim();
    seccionPokemons.innerHTML = '';
    mensaje.textContent = '';


    if (!valor) return;

    const listaFiltrada = listaNombres.filter(nombre => nombre.startsWith(valor));

    if (listaFiltrada.length === 0) {
        mensaje.textContent = "No se encontraron pokémons que empiecen por " + valor;
        return;
    }

    for (const nombrePokemon of listaFiltrada) {
        try {
            if (input.value.toLowerCase().trim() !== valor) break;
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
            if (!res.ok) continue;
            const { sprites } = await res.json();

            const card = document.createElement("article");
            card.className = 'pokemon';
            card.innerHTML = `
                <h3>${nombrePokemon}</h3>
                <div class="pk-img">
                <img src="${sprites.front_default}" alt="sprite de ${nombrePokemon}" />
                </div>
            `;

            card.addEventListener("click", () =>  {
                identificadorPokemon = nombrePokemon;
    
                if (!identificadorPokemon) {
                    return;
                }

                // Guardar el nombre para usarlo en pokemon.html
                sessionStorage.setItem("pokemonSeleccionado", identificadorPokemon);

                // Redirige al otro HTML
                window.location.href = "pokemon.html";
            })

            seccionPokemons.appendChild(card);
        } catch {
            console.error("Error al cargar los pokémons");
        }
    }
};

// Función asíncrónica para obtener todos los nombres de los pokémons
async function obtenerPokemons() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1118");
        const data = await response.json();
        listaNombres = data.results.map(p => p.name);
        
    } catch {
        console.error("Error al cargar pokémon");
    } 
}