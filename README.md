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
      "titulo": "Lo que el viento se llevó",
      "anyo": 1939,
      "link": "https://www.filmaffinity.com/es/film470268.html",
      "api": "http://localhost:3000/api/film?lang=es&id=470268"
   },
   {
      "id": 796616,
      "titulo": "El viento se llevó lo que",
      "anyo": 1998,
      "link": "https://www.filmaffinity.com/es/film796616.html",
      "api": "http://localhost:3000/api/film?lang=es&id=796616"
   },
   {
      "id": 333451,
      "titulo": "La realización de una leyenda: 'Lo que el viento se llevó' (TV)",
      "anyo": 1988,
      "link": "https://www.filmaffinity.com/es/film333451.html",
      "api": "http://localhost:3000/api/film?lang=es&id=333451"
   },
   {
      "id": 484826,
      "titulo": "Ni se lo llevó el viento, ni puñetera falta que hacía",
      "anyo": 1982,
      "link": "https://www.filmaffinity.com/es/film484826.html",
      "api": "http://localhost:3000/api/film?lang=es&id=484826"
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
      "link": "https://www.filmaffinity.com/es/film470268.html",
      "api": "http://localhost:3000/api/film?lang=es&id=470268"
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
      "link": "https://www.filmaffinity.com/en/film267008.html",
      "api": "http://localhost:3000/api/film?lang=en&id=267008"
   }
]
```

### Búsqueda de una película a través de su ID

#### Ejemplo 1

GET [http://localhost:3000/api/film?lang=es&id=470268](http://localhost:3000/api/film?lang=es&id=470268)

```json
{
   "title": "Lo que el viento se llevó",
   "originalTitle": "Gone with the Wind",
   "year": 1939,
   "duration": "238 min.",
   "sinopsys": "Georgia, 1861. En la elegante mansión sureña de Tara, vive Scarlett O'Hara (Vivien Leigh), la joven más bella, caprichosa y egoísta de la región. Ella suspira por el amor de Ashley (Leslie Howard), pero él está prometido con su prima, la dulce y bondadosa Melanie (Olivia de Havilland). En la última fiesta antes del estallido de la Guerra de Secesión (1861-1865), Scarlett conoce al cínico y apuesto Rhett Butler (Clark Gable), un vividor arrogante y aventurero, que sólo piensa en sí mismo y que no tiene ninguna intención de participar en la contienda. Lo único que él desea es hacerse rico y conquistar el corazón de la hermosa Scarlett.",
   "genre": "Drama | Romance | Aventuras",
   "rating": 7.9,
   "votes": 59014,
   "image": "https://pics.filmaffinity.com/gone_with_the_wind-432251527-mmed.jpg",
   "nationality": "Estados Unidos",
   "directedBy": "Victor Fleming | George Cukor | Sam Wood",
   "screenplay": "Sidney Howard | Oliver H.P. Garrett | Ben Hecht | Jo Swerling | John Van Druten",
   "cast": "Vivien Leigh | Clark Gable | Olivia de Havilland | Leslie Howard | Hattie McDaniel | Thomas Mitchell | Barbara O'Neil | Butterfly McQueen | Ona Munson | Ann Rutherford | Evelyn Keyes | Mickey Kuhn | Ward Bond | George Reeves",
   "music": "Max Steiner",
   "photography": "Ernest Haller",
   "studio": "Selznick International Pictures | Metro-Goldwyn-Mayer (MGM)"
}
```

#### Ejemplo 2

GET [http://localhost:3000/api/film?lang=en&id=267008](http://localhost:3000/api/film?lang=en&id=267008)

```json
{
   "title": "Star Wars. Episode I: The Phantom Menace",
   "originalTitle": "Star Wars. Episode I: The Phantom Menace",
   "year": 1999,
   "duration": "130 min.",
   "sinopsys": "The first of three prequels to George Lucas’s celebrated STAR WARS films, EPISODE I - THE PHANTOM MENACE is set some 30 years before STAR WARS: EPISODE IV - A NEW HOPE in the era of the Republic. Naboo, a peaceful planet governed by the young, but wise Queen Amidala (Natalie Portman), is being threatened by the corrupt Trade Federation, puppets of an evil Sith lord and his terrifying apprentice, Darth Maul (Ray Park). The seemingly benevolent Senator Palpatine (Ian McDiarmid) is chief adviser to the queen, though there are suspicions surrounding him. Jedi knights Qui-Gon Jinn (Liam Neeson) and Obi-Wan Kenobi (Ewan McGregor, performing an amazing vocal interpretation of Alec Guinness, the older Obi-Wan) are called on to intervene in the trade disputes. Along the way, they acquire an apprentice of their own in the form of young prodigal Anakin Skywalker (Jake Lloyd), or as STAR WARS fans know him, the future Darth Vader. They also encounter Jar Jar Binks (Ahmed Best), a goofy, lizardlike creature who has been banished from his underwater world for his clumsiness. When the Trade Federation launches an attack on Naboo, the queen and her allies must battle hordes of robot troopers while Qui-Gon and Obi-Wan face off against the sinister Darth Maul.",
   "genre": "Sci-Fi | Adventure",
   "rating": 6.3,
   "votes": 103867,
   "image": "https://pics.filmaffinity.com/star_wars_episode_i_the_phantom_menace-434398792-mmed.jpg",
   "nationality": "United States",
   "directedBy": "George Lucas",
   "screenplay": "George Lucas",
   "cast": "Liam Neeson | Ewan McGregor | Natalie Portman | Jake Lloyd | Samuel L. Jackson | Ian McDiarmid | Ray Park | Anthony Daniels | Kenny Baker | Pernilla August | Hugh Quarshie | Ahmed Best | Andy Secombe",
   "music": "John Williams",
   "photography": "David Tattersall",
   "studio": "Lucasfilm | 20th Century Fox"
}
```

#### Ejemplo 3

POST [http://localhost:3000/api/film](http://localhost:3000/api/film)

```json
{
   "url": "https://www.filmaffinity.com/es/film819745.html"
}
```

```json
{
   "title": "The Year of the Tick",
   "originalTitle": "El año de la garrapata",
   "year": 2004,
   "duration": "105 min.",
   "sinopsys": "",
   "genre": "Comedy",
   "rating": 5.8,
   "votes": 7549,
   "image": "https://pics.filmaffinity.com/el_ano_de_la_garrapata-136495103-mmed.jpg",
   "nationality": "Spain",
   "directedBy": "Jorge Coira",
   "screenplay": "Carlos Portela",
   "cast": "Félix Gómez | Javier Veiga | Verónica Sánchez | María Vázquez | Víctor Clavijo | Camila Bossa | Mela Casal | Celso Parada | Luis Zahera | Josefina Gómez | Rosa Álvarez | Elina Luaces | Manuel Millán",
   "music": "",
   "photography": "Chechu Graf",
   "studio": "Filmanova | LugoPress | Filmanova Invest | Televisión de Galicia (TVG)"
}
```
