# api-filmaffinity

API REST no oficial de Filmaffinity en castellano. Desarrollada desde cero con NodeJS y Typescript.

Puedes encontrar el codigo fuente en [Github](https://github.com/Karmelo1984/api-filmaffinity)

## Introducción

Esta es una API REST que utiliza WEB SCRAPING tanto para hacer búsquedas como para extraer información de películas y
series de [Filmaffinity](https://www.filmaffinity.com/es/main.html).

Está preparada tanto para la ejecución en local, como para crear una imagen en docker.
[Ver en docker hub](https://hub.docker.com/repository/docker/karmelo1984/filmaffinity/general)

### Ejecución en local

Es necesaria la versión v18.17.1 de nodejs.

```bash
    $ node --version
```

Ejecuta el siguiente comando para instalar las dependencias correspondientes.

```bash
    $ yarn
```

Inicia el proyecto en modo desarrollo.

```bash
    $ yarn run dev
```

### Ejecución en docker

Asegura que tienes instalado docker en tu sistema.

```bash
    $ docker --version
```

Crea la imagen a partir del proyecto, salvo los warning, debería de generar la imagen correctamente (pesa alrededor de
950MB).

```bash
    $ docker build -t filmaffinity:${etiqueta} .
```

O descarga la imagen:

```bash
    $ docker pull filmaffinity:${etiqueta}
```

Una vez terminada la generación de la imagen, o terminada la descarga, verifica que está disponible en tu sistema con:

```bash
    $ docker images
```

Tened en en cuenta la redirección de puertos:

-  ${port_host} : es donde estará escuchando nuestro pc (los ejemplos de esta guía están con el puerto 3000).
-  ${port_contenedor} : es donde escucha el contenedor (por defecto está configurado en el dockerfile en el puerto 3000)
-  Para no perder los logs en cada ejecución, se recomienda crear un volumen

```bash
    $ docker run --name ${nombre_contenedor} -p ${port_host}:${port_contenedor} -e PORT=${port_contenedor} -e LOG_NAME=${nombre_de_los_logs}
  -v ${dir_log_local}:/usr/src/app/logs ${nombre_o_id_de_la_imagen}

```

Llegado a este punto, tan solo tienes que poner en tu navegador la dirección siguiente para comprobar que está
correctamente inicializado.

```bash
    http://localhost:${port_host}/
```

Para detener la ejecución del contenedor:

```bash
    $ docker stop ${nombre_del_contenedor}
```

Para volver a ejecutarlo en primer plano (si lo quieres ejecutar en segundo plano, elimina el flag '-a'):

```bash
    $ docker start -a ${nombre_del_contenedor}
```

## API-REST

| Método | API         | Parámetros                                                                   | Descripción                                               |
| ------ | ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| GET    | /api/search | `lang=${'es' or 'en'}&year=${año}&query=${patrón a buscar}` (Opcional: year) | Busca películas por título adaptándose al patrón indicado |
| GET    | /api/film   | `lang=${'es' or 'en'}&id=${id}`                                              | Obtiene datos de una película o serie mediante un ID      |
| POST   | /api/film   | `{"url": "https://www.filmaffinity.com/es/film819745.html"}`                 | Obtiene datos de una película o serie mediante una URL    |

## Ejemplos de uso

### Búsqueda de películas cuyo título coincida con el string de búsqueda introducido

#### Ejemplo 1

GET
[http://localhost:3000/api/search?lang=es&query=lo+que+el+viento+se+llevo](http://localhost:3000/api/search?lang=es&query=lo+que+el+viento+se+llevo)

```json
[
   {
      "id": 470268,
      "title": "Lo que el viento se llevó",
      "year": 1939,
      "rating": 7.9,
      "votes": 59065,
      "link": "https://www.filmaffinity.com/es/film470268.html",
      "api": "http://localhost:3003/api/film?lang=es&id=470268"
   },
   {
      "id": 796616,
      "title": "El viento se llevó lo que",
      "year": 1998,
      "rating": 6,
      "votes": 748,
      "link": "https://www.filmaffinity.com/es/film796616.html",
      "api": "http://localhost:3003/api/film?lang=es&id=796616"
   },
   {
      "id": 333451,
      "title": "La realización de una leyenda: 'Lo que el viento se llevó' (TV)",
      "year": 1988,
      "rating": 7.4,
      "votes": 84,
      "link": "https://www.filmaffinity.com/es/film333451.html",
      "api": "http://localhost:3003/api/film?lang=es&id=333451"
   },
   {
      "id": 484826,
      "title": "Ni se lo llevó el viento, ni puñetera falta que hacía",
      "year": 1982,
      "rating": null,
      "votes": null,
      "link": "https://www.filmaffinity.com/es/film484826.html",
      "api": "http://localhost:3003/api/film?lang=es&id=484826"
   }
]
```

#### Ejemplo 2

GET
[http://localhost:3000/api/search?lang=es&year=1939&query=lo+que+el+viento+se+llevo](http://localhost:3000/api/search?lang=es&year=1939&query=lo+que+el+viento+se+llevo)

```json
[
   {
      "id": 470268,
      "title": "Lo que el viento se llevó",
      "year": 1939,
      "rating": 7.9,
      "votes": 59065,
      "link": "https://www.filmaffinity.com/es/film470268.html",
      "api": "http://localhost:3003/api/film?lang=es&id=470268"
   }
]
```

#### Ejemplo 3

GET
[http://localhost:3000/api/search?lang=en&query=menace+phantom](http://localhost:3000/api/search?lang=en&query=menace+phantom)

```json
[
   {
      "id": 267008,
      "title": "Star Wars. Episode I: The Phantom Menace",
      "year": 1999,
      "rating": 6.3,
      "votes": 103939,
      "link": "https://www.filmaffinity.com/en/film267008.html",
      "api": "http://localhost:3003/api/film?lang=en&id=267008"
   }
]
```

### Búsqueda de una película a través de su ID

#### Ejemplo 1

GET [http://localhost:3000/api/film?lang=es&id=932476](http://localhost:3000/api/film?lang=es&id=932476)

```json
{
   "id_film": 932476,
   "title": "Matrix",
   "originalTitle": "The Matrix",
   "year": 1999,
   "duration_min": 131,
   "synopsis": "Thomas Anderson es un brillante programador de una respetable compañía de software. Pero fuera del trabajo es Neo, un hacker que un día recibe una misteriosa visita...",
   "rating": 7.9,
   "votes": 196210,
   "image": "https://pics.filmaffinity.com/the_matrix-155050517-mmed.jpg",
   "nationality": [
      {
         "id": "US",
         "name": "Estados Unidos",
         "photo": "https://www.filmaffinity.com/imgs/countries2/US.png"
      }
   ],
   "directedBy": [
      {
         "id": 153009377,
         "name": "Lilly Wachowski"
      },
      {
         "id": 900896593,
         "name": "Lana Wachowski"
      },
      {
         "id": 933533162,
         "name": "Hermanas Wachowski"
      }
   ],
   "cast": [
      {
         "id": 463960823,
         "name": "Keanu Reeves",
         "photo": "https://pics.filmaffinity.com/keanu_reeves-249385740937163-nm_200.jpg"
      },
      {
         "id": 117451997,
         "name": "Laurence Fishburne",
         "photo": "https://pics.filmaffinity.com/laurence_fishburne-078467778754783-nm_200.jpg"
      },
      {
         "id": 683742825,
         "name": "Carrie-Anne Moss",
         "photo": "https://pics.filmaffinity.com/carrie_anne_moss-204191028328099-nm_200.jpg"
      },
      {
         "id": 105874327,
         "name": "Joe Pantoliano",
         "photo": "https://pics.filmaffinity.com/joe_pantoliano-165515591455445-nm_200.jpg"
      },
      {
         "id": 336642334,
         "name": "Hugo Weaving",
         "photo": "https://pics.filmaffinity.com/hugo_weaving-031348611626736-nm_200.jpg"
      },
      {
         "id": 927563115,
         "name": "Marcus Chong",
         "photo": "https://pics.filmaffinity.com/marcus_chong-050984070190899-nm_200.jpg"
      },
      {
         "id": 159482441,
         "name": "Gloria Foster",
         "photo": "https://pics.filmaffinity.com/gloria_foster-029526648398964-nm_200.jpg"
      },
      {
         "id": 476153081,
         "name": "Matt Doran",
         "photo": "https://pics.filmaffinity.com/matt_doran-017655586129192-nm_200.jpg"
      },
      {
         "id": 952223319,
         "name": "Belinda McClory",
         "photo": "https://pics.filmaffinity.com/belinda_mcclory-188757579700012-nm_200.jpg"
      },
      {
         "id": 350056708,
         "name": "Julian Arahanga",
         "photo": "https://pics.filmaffinity.com/julian_arahanga-114303540482099-nm_200.jpg"
      },
      {
         "id": 136628451,
         "name": "Anthony Ray Parker",
         "photo": "https://pics.filmaffinity.com/anthony_ray_parker-020562095453699-nm_200.jpg"
      },
      {
         "id": 121062628,
         "name": "Paul Goddard",
         "photo": "https://pics.filmaffinity.com/paul_goddard-080003031603806-nm_200.jpg"
      },
      {
         "id": 227117938,
         "name": "Robert Taylor",
         "photo": "https://pics.filmaffinity.com/robert_taylor-110196200929597-nm_200.jpg"
      },
      {
         "id": 179255462,
         "name": "Marc Aden Gray"
      }
   ],
   "screenplay": [
      {
         "id": 153009377,
         "name": "Lilly Wachowski"
      },
      {
         "id": 900896593,
         "name": "Lana Wachowski"
      }
   ],
   "music": [
      {
         "id": 541844573,
         "name": "Don Davis"
      }
   ],
   "photography": [
      {
         "id": 143461449,
         "name": "Bill Pope"
      }
   ],
   "studio": ["Warner Bros", "Village Roadshow", "Groucho Film Partnership"],
   "genre": [
      "Ciencia Ficción",
      "Fantástico",
      "Acción",
      "Thriller",
      "Thriller Futurista",
      "Mundo Virtual",
      "Cyberpunk",
      "Distopía",
      "Internet / Informática",
      "Artes Marciales",
      "Película De Culto"
   ]
}
```

#### Ejemplo 2

GET [http://localhost:3000/api/film?lang=en&id=257620](http://localhost:3000/api/film?lang=en&id=257620)

```json
{
   "id_film": 257620,
   "title": "The Matrix Revolutions",
   "originalTitle": "The Matrix Revolutions",
   "year": 2003,
   "duration_min": 130,
   "synopsis": "In the third installment, the epic war between man and machine reaches a thundering crescendo: the Zion military, aided by courageous civilian volunteers like Zee and the Kid, desperately battles to hold back the Sentinel invasion as the Machine army bores into their stronghold. Facing total annihilation, the citizens of the last bastion of humanity fight not only for their own lives, but for the future of mankind itself. But an unknown element poisons the ranks from within: the rogue program Smith has cunningly hijacked Bane, a member of the hovercraft fleet. Growing more powerful with each passing second, Smith is beyond even the control of the Machines and now threatens to destroy their empire along with the real world and the Matrix. The Oracle offers Neo her final words of guidance, which he accepts with the knowledge that she is a program and her words could be just another layer of falsehood in the grand scheme of the Matrix. With the aid of Niobe, Neo and Trinity choose to travel farther than any human has ever dared to go - a treacherous journey above ground, across the scorched surface of the earth and into the heart of the menacing Machine City. In this vast mechanized metropolis, Neo comes face to face with the ultimate power in the Machine world--the Deus Ex Machina--and strikes a bargain that is the only hope for a dying world. The war will end tonight, with Neo's destiny and the fate of two civilizations inexorably tied to the outcome of his cataclysmic confrontation with Agent Smith.",
   "rating": 6,
   "votes": 115569,
   "image": "https://pics.filmaffinity.com/the_matrix_revolutions-289564524-mmed.jpg",
   "nationality": [
      {
         "id": "US",
         "name": "United States",
         "photo": "https://www.filmaffinity.com/imgs/countries2/US.png"
      }
   ],
   "directedBy": [
      {
         "id": 153009377,
         "name": "Lilly Wachowski"
      },
      {
         "id": 900896593,
         "name": "Lana Wachowski"
      },
      {
         "id": 933533162,
         "name": "Hermanas Wachowski"
      }
   ],
   "cast": [
      {
         "id": 463960823,
         "name": "Keanu Reeves",
         "photo": "https://pics.filmaffinity.com/keanu_reeves-249385740937163-nm_200.jpg"
      },
      {
         "id": 117451997,
         "name": "Laurence Fishburne",
         "photo": "https://pics.filmaffinity.com/laurence_fishburne-078467778754783-nm_200.jpg"
      },
      {
         "id": 683742825,
         "name": "Carrie-Anne Moss",
         "photo": "https://pics.filmaffinity.com/carrie_anne_moss-204191028328099-nm_200.jpg"
      },
      {
         "id": 336642334,
         "name": "Hugo Weaving",
         "photo": "https://pics.filmaffinity.com/hugo_weaving-031348611626736-nm_200.jpg"
      },
      {
         "id": 998657220,
         "name": "Jada Pinkett Smith",
         "photo": "https://pics.filmaffinity.com/jada_pinkett_smith-104106227958622-nm_200.jpg"
      },
      {
         "id": 818438320,
         "name": "Harold Perrineau",
         "photo": "https://pics.filmaffinity.com/harold_perrineau-229825775363567-nm_200.jpg"
      },
      {
         "id": 361009041,
         "name": "Nona Gaye",
         "photo": "https://pics.filmaffinity.com/nona_gaye-008435300158933-nm_200.jpg"
      },
      {
         "id": 979527680,
         "name": "Clayton Watson",
         "photo": "https://pics.filmaffinity.com/clayton_watson-111978382681350-nm_200.jpg"
      },
      {
         "id": 590047547,
         "name": "Mary Alice",
         "photo": "https://pics.filmaffinity.com/mary_alice-116563634475781-nm_200.jpg"
      },
      {
         "id": 200321431,
         "name": "Ian Bliss",
         "photo": "https://pics.filmaffinity.com/ian_bliss-099632953379653-nm_200.jpg"
      },
      {
         "id": 414485404,
         "name": "Harry Lennix",
         "photo": "https://pics.filmaffinity.com/harry_lennix-153937008178143-nm_200.jpg"
      },
      {
         "id": 483587430,
         "name": "Collin Chou",
         "photo": "https://pics.filmaffinity.com/collin_chou-151504521321555-nm_200.jpg"
      },
      {
         "id": 331535570,
         "name": "Bruce Spence",
         "photo": "https://pics.filmaffinity.com/bruce_spence-274714897818328-nm_200.jpg"
      }
   ],
   "screenplay": [
      {
         "id": 153009377,
         "name": "Lilly Wachowski"
      },
      {
         "id": 900896593,
         "name": "Lana Wachowski"
      },
      {
         "id": 933533162,
         "name": "Hermanas Wachowski"
      }
   ],
   "music": [
      {
         "id": 541844573,
         "name": "Don Davis"
      }
   ],
   "photography": [
      {
         "id": 143461449,
         "name": "Bill Pope"
      }
   ],
   "studio": ["Warner Bros"],
   "genre": [
      "Sci-Fi",
      "Fantasy",
      "Action",
      "War",
      "Futuristic Thriller",
      "Cyberpunk",
      "Dystopia",
      "Virtual Worlds",
      "Sequel"
   ]
}
```

#### Ejemplo 3

POST [http://localhost:3000/api/film](http://localhost:3000/api/film)

```json
{
   "url": "https://www.filmaffinity.com/en/film349820.html"
}
```

```json
{
   "id_film": 349820,
   "title": "The Matrix Reloaded",
   "originalTitle": "The Matrix Reloaded",
   "year": 2003,
   "duration_min": 138,
   "synopsis": "Zion, mankind's last free city, has been located by the machines. With 250,000 sentinels only hours away, Zion's military leaders scramble all hovercrafts and personnel to defend the city and its people. Believing mankind's salvation lies not with a military action, but with the Oracle's prophecy, Morpheus pleads for time and resources to allow the Oracle to contact Neo. While Neo has gained greater control over his abilities in the Matrix, he is haunted by horrifying visions of death that threaten to paralyze him in the moment of truth. With new information from the Oracle, Neo, Trinity, and Morpheus take the fight into the Matrix in hopes of saving Zion, and ending the machine's enslavement of humanity once and for all.",
   "rating": 6.4,
   "votes": 86152,
   "image": "https://pics.filmaffinity.com/the_matrix_reloaded-133935821-mmed.jpg",
   "nationality": [
      {
         "id": "US",
         "name": "United States",
         "photo": "https://www.filmaffinity.com/imgs/countries2/US.png"
      }
   ],
   "directedBy": [
      {
         "id": 153009377,
         "name": "Lilly Wachowski"
      },
      {
         "id": 900896593,
         "name": "Lana Wachowski"
      },
      {
         "id": 933533162,
         "name": "Hermanas Wachowski"
      }
   ],
   "cast": [
      {
         "id": 463960823,
         "name": "Keanu Reeves",
         "photo": "https://pics.filmaffinity.com/keanu_reeves-249385740937163-nm_200.jpg"
      },
      {
         "id": 117451997,
         "name": "Laurence Fishburne",
         "photo": "https://pics.filmaffinity.com/laurence_fishburne-078467778754783-nm_200.jpg"
      },
      {
         "id": 683742825,
         "name": "Carrie-Anne Moss",
         "photo": "https://pics.filmaffinity.com/carrie_anne_moss-204191028328099-nm_200.jpg"
      },
      {
         "id": 336642334,
         "name": "Hugo Weaving",
         "photo": "https://pics.filmaffinity.com/hugo_weaving-031348611626736-nm_200.jpg"
      },
      {
         "id": 818438320,
         "name": "Harold Perrineau",
         "photo": "https://pics.filmaffinity.com/harold_perrineau-229825775363567-nm_200.jpg"
      },
      {
         "id": 998657220,
         "name": "Jada Pinkett Smith",
         "photo": "https://pics.filmaffinity.com/jada_pinkett_smith-104106227958622-nm_200.jpg"
      },
      {
         "id": 161497424,
         "name": "Anthony Zerbe",
         "photo": "https://pics.filmaffinity.com/anthony_zerbe-254139194167468-nm_200.jpg"
      },
      {
         "id": 354972731,
         "name": "Lambert Wilson",
         "photo": "https://pics.filmaffinity.com/lambert_wilson-214755668479206-nm_200.jpg"
      },
      {
         "id": 154705150,
         "name": "Monica Bellucci",
         "photo": "https://pics.filmaffinity.com/monica_bellucci-186875717537286-nm_200.jpg"
      },
      {
         "id": 414485404,
         "name": "Harry Lennix",
         "photo": "https://pics.filmaffinity.com/harry_lennix-153937008178143-nm_200.jpg"
      },
      {
         "id": 246406528,
         "name": "Helmut Bakaitis",
         "photo": "https://pics.filmaffinity.com/helmut_bakaitis-270085411801939-nm_200.jpg"
      },
      {
         "id": 159482441,
         "name": "Gloria Foster",
         "photo": "https://pics.filmaffinity.com/gloria_foster-029526648398964-nm_200.jpg"
      },
      {
         "id": 505423747,
         "name": "Daniel Bernhardt",
         "photo": "https://pics.filmaffinity.com/daniel_bernhardt-253752690375740-nm_200.jpg"
      }
   ],
   "screenplay": [
      {
         "id": 153009377,
         "name": "Lilly Wachowski"
      },
      {
         "id": 900896593,
         "name": "Lana Wachowski"
      },
      {
         "id": 933533162,
         "name": "Hermanas Wachowski"
      }
   ],
   "music": [
      {
         "id": 541844573,
         "name": "Don Davis"
      }
   ],
   "photography": [
      {
         "id": 143461449,
         "name": "Bill Pope"
      }
   ],
   "studio": [
      "Warner Bros",
      "Village Roadshow",
      "Silver Pictures",
      "NPV Entertainment",
      "Heineken Branded Entertainment"
   ],
   "genre": [
      "Sci-Fi",
      "Fantasy",
      "Action",
      "Thriller",
      "Futuristic Thriller",
      "Cyberpunk",
      "Dystopia",
      "Virtual Worlds",
      "Computers / Internet",
      "Sequel"
   ]
}
```
