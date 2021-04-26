fs = require('fs');
var log = fs.createWriteStream('pokemon.yaml', {
  flags: 'w'
})
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

var pokemon = "test";

for (i = 1; i < 461; i += 1) {
  P.resource(["/api/v2/evolution-chain/" + i]).then((response) => {
    base = response[0].chain.species.name;
    pokemon = response[0].chain.species.name;
    if (response[0].chain.evolves_to.length == 0) {
      printMon(pokemon, base);
    } else {
      for (o = 0; o < response[0].chain.evolves_to.length; o += 1) {
        if (response[0].chain.evolves_to[o].evolves_to.length == 0) {
          pokemon = response[0].chain.evolves_to[o].species.name;
          printMon(pokemon,base);
        } else {
          for (x = 0; x < response[0].chain.evolves_to[o].evolves_to.length; x += 1) {
            if (
              response[0].chain.evolves_to[o].evolves_to[x].evolves_to.length ==
              0
            ) {
              pokemon =
                response[0].chain.evolves_to[o].evolves_to[x].species.name;
              printMon(pokemon,base);
            } else {
              log.write("oops\n ");
            }
          }
        }
      }
    }
  }).catch(err => console.error(err));
}

function printMon(pokemon,base) {
 P.resource([
  "api/v2/pokemon-species/"+pokemon,
  "/api/v2/pokemon/"+pokemon,
]).then( response => {
  log.write("- species: "+response[0].name+" \n ");
  gen = response[0].generation.name.split("-");
  log.write(" \t gen: "+gen[1]+" \n ");
  if (pokemon != base) {
    log.write(" \t foundAs: "+base+" \n ");
  }
  log.write(" \t types: \n ");
  for (var a = 0; a < response[1].types.length; a++) {
    log.write(" \t - "+response[1].types[a].type.name+" \n ");
  }
}).catch(err => console.error(err))
};
/*
Remaining to do: (can't currently be completed as PokeApi is not fully completed)

    versions:
    - game: red
      location: starter
      level: 5
      chance: 100
      holding: nothing");


       */
