const boton = document.querySelector(".btn-volver");

let id;
let nombre;
let altura; 
let peso;
let tipos;
let ruta; 
let descripcion;


if (boton) {
    boton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}


const identificadorPokemon = sessionStorage.getItem("pokemonSeleccionado");

if (identificadorPokemon) {
    cargarDetalles(identificadorPokemon);
} else {
    console.error("No hay ningún Pokémon.");
}

// Función principal para cargar los detalles
async function cargarDetalles(identificador) {
    try {
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identificador}`);
        if (!response.ok) console.error("Pokémon no encontrado");

        const data = await response.json();

        id = data.id;
        nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        altura = data.height / 10; // dm a m
        peso = data.weight / 10;   // hg a kg
        ruta = data.sprites["other"]["official-artwork"]["front_default"];
        tipos = data.types.map(tipoInfo => tipoInfo.type.name);

        
        descripcion = await obtenerPromesaDescripcion(data.species.url);

        aniadirNombres();

    } catch (error) {
        console.error("Error al cargar el Pokémon:");
    }
}

// Función para obtener la descripción
async function obtenerPromesaDescripcion(url) {
    let desc = "No encontrada";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Pokémon no encontrado");

        const data = await response.json();
        let resultado = data.flavor_text_entries.find(
            descripcion => descripcion.language.name === "es"
        );

        if (!resultado) {
            resultado = data.flavor_text_entries.find(
                descripcion => descripcion.language.name === "en"
            );
        }

        desc = resultado ? resultado.flavor_text : "No encontrada";
    } catch (error) {
        console.log(error);
    }
    return desc;
}

// Función para añadir los nombres y detalles al HTML
function aniadirNombres() {
    const t = {
        normal: "normal",
        fire: "fuego",
        water: "agua",
        electric: "eléctrico",
        grass: "planta",
        ice: "hielo",
        fighting: "lucha",
        poison: "veneno",
        ground: "tierra",
        flying: "volador",
        psychic: "psíquico",
        bug: "bicho",
        rock: "roca",
        ghost: "fantasma",
        dragon: "dragón",
        dark: "siniestro",
        steel: "acero",
        fairy: "hada"
    };

    document.querySelector(".pk-nombre").textContent = nombre;
    document.querySelector(".pk-id").innerHTML = "<b>Número de pokédex: </b>" + id;
    document.querySelector(".pk-altura").innerHTML = "<b>Altura:</b> " + altura + " m";
    document.querySelector(".pk-peso").innerHTML = "<b>Peso:</b> " + peso + " Kg";
    document.querySelector(".pk-desc").innerHTML = "<b>Descripción:</b> " + descripcion;

    if (tipos.length === 1) {
        document.querySelector(".pk-tipos").innerHTML = "<b>Tipo:</b> " + t[tipos[0]];
    } else {
        document.querySelector(".pk-tipos").innerHTML = "<b>Tipo:</b> " + tipos.map(tipo => t[tipo]).join(" y ");
    }

    document.querySelector(".pk-imagen img").src = ruta;
    document.querySelector(".pk-imagen img").alt = nombre;
}

