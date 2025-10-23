const input = document.querySelector(".input-pokemon")
const seccion = document.querySelector(".seccion-pokemon")
const card = seccion.querySelector(".pokemon")
let identificadorPokemon;
let nombre;
let altura;
let peso;
let tipos;
let ruta;
if (input) {
    input.addEventListener('change', function(event) {
        identificadorPokemon = event.target.value.trim()
        
        if (identificadorPokemon === "") throw new Error("No has pasado ningun valor por el input")
        fetch(`https://pokeapi.co/api/v2/pokemon/${identificadorPokemon}`)
        .then(response => {
        if (!response.ok) {
            if (isNaN(identificadorPokemon)){
                aniadirMensaje("No existe ningún pokemon con ese nombre -> \"" + identificadorPokemon + "\"")
            } else {
                aniadirMensaje("No existe ningún pokemon con ese número de pokédex -> \"" + identificadorPokemon + "\"")
            }
            
            throw new Error("Pokémon no encontrado");
        }
        document.querySelector('.mensaje').style.display = "none";
        return response.json();
        })
        .then(data => {
            id = data.id
            nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            altura = data.height / 10; // dm a m
            peso = data.weight / 10; // Hg A Kg
            ruta = data.sprites["other"]["official-artwork"]["front_default"];
            obtenerPromesaDescripcion(data.species.url).then(desc => {
                descripcion = desc;
                console.log("Nombre:", nombre);
                console.log("Número de pokédex:", id);
                console.log("Altura:", altura);
                console.log("Peso:", peso);
                console.log("Ruta", ruta)
                console.log("Descripción: ", descripcion)

                tipos = data.types.map(tipoInfo => tipoInfo.type.name);
                console.log("Tipos:", tipos.join(", "));
                console.log("-");
                aniadirNombres()
            })
        })
        .catch(error => {
        console.error("Error al buscar el Pokémon:", error.message);
        });
    })


    
}

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
    
    card.querySelector(".pk-nombre").textContent = nombre;
    card.querySelector(".pk-id").innerHTML = "<b>Número de pokédex: </b>" + id;
    card.querySelector(".pk-altura").innerHTML = "<b>Altura:</b> " + altura + " m";
    card.querySelector(".pk-peso").innerHTML = "<b>Peso:</b> " + peso + " Kg";
    card.querySelector(".pk-desc").innerHTML = "<b>Descripción:</b> " + descripcion;
    if (tipos.length === 1) card.querySelector(".pk-tipos").innerHTML = "<b>Tipo:</b> " + tipos.map(tipo => t[tipo])
    else card.querySelector(".pk-tipos").innerHTML = "<b>Tipo:</b> " + tipos.map(tipo => t[tipo]).join(" y ") 
    card.querySelector(".pk-img img").src = ruta;
    card.style.display = 'flex';
}

function aniadirMensaje(mensaje){
    const msj = document.querySelector(".mensaje")
    card.style.display = 'none';
    msj.style.display = 'block';
    msj.textContent = mensaje
    
}