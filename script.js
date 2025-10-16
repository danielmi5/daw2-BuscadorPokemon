const input = document.querySelector(".input-pokemon")
const seccion = document.querySelector(".seccion-pokemon")
const card = seccion.querySelector(".pokemon")
let nombrePokemon;
let nombre;
let altura;
let peso;
let tipos;
let ruta;
if (input) {
    input.addEventListener('change', function(event) {
        nombrePokemon = event.target.value.trim()
        
        if (nombrePokemon === "") throw new Error("No has pasado ningun valor por el input")
        fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
        .then(response => {
        if (!response.ok) {
            aniadirMensaje("No existe ningún pokemon con ese nombre -> " + nombrePokemon)
            throw new Error("Pokémon no encontrado");
        }
        document.querySelector('.mensaje').style.display = "none";
        return response.json();
        })
        .then(data => {
        nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1)
        altura = data.height / 10 // dm a m
        peso = data.weight / 10 // Hg A Kg
        ruta = data.sprites["other"]["official-artwork"]["front_default"]
        console.log('Nombre:', data.name);
        console.log('Altura:', data.height);
        console.log('Peso:', data.weight);
        console.log('Ruta', data.sprites["front_default"])

            tipos = data.types.map(tipoInfo => tipoInfo.type.name);
            console.log("Tipos:", tipos.join(", "));

            aniadirNombres()
        })
        .catch(error => {
        console.error("Error al buscar el Pokémon:", error.message);
        });
    })


    
}

function aniadirNombres(){
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
    
    card.querySelector(".pk-nombre").textContent = nombre
    card.querySelector(".pk-altura").textContent = "Altura: " + altura + " m"
    card.querySelector(".pk-peso").textContent = "Peso: " + peso + " Kg"
    if (tipos.length === 1) card.querySelector(".pk-tipos").textContent = "Tipo: " + tipos.map(tipo => t[tipo]) 
    else card.querySelector(".pk-tipos").textContent = "Tipos: " + tipos.map(tipo => t[tipo]).join(" y ") 
    card.querySelector(".pk-img img").src = ruta
    card.style.display = 'flex';
}

function aniadirMensaje(mensaje){
    const msj = document.querySelector(".mensaje")
    //card.style.display = 'none';
    msj.textContent = mensaje
    
}