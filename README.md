# api-filmaffinity
API REST no oficial de Filmaffinity en castellano

- [Basada en la desarrollada por Carlos Ramos [09 Dec 2017]](https://github.com/carlosramosa/api-filmaffinity)
- Modificada por Carmelo Molero [09 Sep 2023]

## Introducción

Esta es una API REST que utiliza WEB SCRAPING para extraer información de Filmaffinity (Sept 2023).

Es importante mencionar que se trata de una API no oficial, por lo que blablabla...

## API-REST

### Búsqueda de películas por título

Realiza una búsqueda de películas cuyo título coincida con el texto introducido.

- Método: GET
- URL: `http://localhost:3000/api/search?str=${Título+de+la+película}`

### Datos de la película por ID en Filmaffinity

Obtiene los datos de una película según el ID asignado por Filmaffinity.

- Método: GET
- URL: `http://localhost:3000/api/film?id=${id}`

## Ejemplos de uso

### Búsqueda de películas cuyo título coincida con el string de búsqueda introducido

#### Ejemplo 1

GET http://localhost:3000/api/search?str=lo+que+el+viento+se+llevo

```json
    [
        {
            "id": 470268,
            "titulo": "Lo que el viento se llevó",
            "anyo": 1939,
            "enlace": "https://www.filmaffinity.com/es/film470268.html"
        },
        {
            "id": 796616,
            "titulo": "El viento se llevó lo que",
            "anyo": 1998,
            "enlace": "https://www.filmaffinity.com/es/film796616.html"
        },
        {
            "id": 333451,
            "titulo": "La realización de una leyenda: 'Lo que el viento se llevó' (TV)",
            "anyo": 1988,
            "enlace": "https://www.filmaffinity.com/es/film333451.html"
        },
        {
            "id": 484826,
            "titulo": "Ni se lo llevó el viento, ni puñetera falta que hacía",
            "anyo": 1982,
            "enlace": "https://www.filmaffinity.com/es/film484826.html"
        }
    ]
```
#### Ejemplo 2

GET http://localhost:3000/api/search?str=la+amenaza+fantasma

```json
    [
        {
            "id": 267008,
            "titulo": "Star Wars. Episodio I: La amenaza fantasma",
            "anyo": 1999,
            "enlace": "https://www.filmaffinity.com/es/film267008.html"
        }
    ]
```

### Búsqueda de una película a través de su ID

#### Ejemplo 1

GET http://localhost:3000/api/film?id=470268

```json
    {
        "titulo": "Lo que el viento se llevó",
        "titulo_original": "Gone with the Wind",
        "anyo": 1939,
        "duracion": "238 min.",
        "pais": "Estados Unidos",
        "direccion": "Victor Fleming | George Cukor | Sam Wood",
        "guion": "Sidney Howard | Oliver H.P. Garrett | Ben Hecht | Jo Swerling | John Van Druten | Novela: Margaret Mitchell",
        "reparto": "Vivien Leigh | Clark Gable | Olivia de Havilland | Leslie Howard | Hattie McDaniel | Thomas Mitchell | Barbara O'Neil | Butterfly McQueen | Ona Munson | Ann Rutherford | Evelyn Keyes | Mickey Kuhn | Ward Bond | George Reeves",
        "musica": "Max Steiner",
        "fotografia": "Ernest Haller",
        "companias": "Selznick International Pictures | Metro-Goldwyn-Mayer (MGM)",
        "genero": "Drama | Romance | Aventuras",
        "sinopsis": "Georgia, 1861. En la elegante mansión sureña de Tara, vive Scarlett O'Hara (Vivien Leigh), la joven más bella, caprichosa y egoísta de la región. Ella suspira por el amor de Ashley (Leslie Howard), pero él está prometido con su prima, la dulce y bondadosa Melanie (Olivia de Havilland). En la última fiesta antes del estallido de la Guerra de Secesión (1861-1865), Scarlett conoce al cínico y apuesto Rhett Butler (Clark Gable), un vividor arrogante y aventurero, que sólo piensa en sí mismo y que no tiene ninguna intención de participar en la contienda. Lo único que él desea es hacerse rico y conquistar el corazón de la hermosa Scarlett.",
        "nota": 7.9,
        "votos": 58960
    }
```

#### Ejemplo 2

GET http://localhost:3000/api/film?id=267008
```json
    {
        "titulo": "Star Wars. Episodio I: La amenaza fantasma",
        "titulo_original": "Star Wars. Episode I: The Phantom Menaceaka",
        "anyo": 1999,
        "duracion": "130 min.",
        "pais": "Estados Unidos",
        "direccion": "George Lucas",
        "guion": "George Lucas",
        "reparto": "Liam Neeson | Ewan McGregor | Natalie Portman | Jake Lloyd | Samuel L. Jackson | Ian McDiarmid | Ray Park | Anthony Daniels | Kenny Baker | Pernilla August | Hugh Quarshie | Ahmed Best | Andy Secombe",
        "musica": "John Williams",
        "fotografia": "David Tattersall",
        "companias": "Lucasfilm | 20th Century Fox",
        "genero": "Ciencia ficción | Aventuras",
        "sinopsis": "Ambientada treinta años antes que \"La guerra de las galaxias\" (1977), muestra la infancia de Darth Vader, el pasado de Obi-Wan Kenobi y el resurgimiento de los Sith, los caballeros Jedi dominados por el Lado Oscuro. La Federación de Comercio ha bloqueado el pequeño planeta de Naboo, gobernado por la joven Reina Amidala; se trata de un plan ideado por Sith Darth Sidious, que, manteniéndose en el anonimato, dirige a los neimoidianos, que están al mando de la Federación. El Jedi Qui-Gon Jinn y su aprendiz Obi-Wan Kenobi convencen a Amidala para que vaya a Coruscant, la capital de la República y sede del Consejo Jedi, y trate de  neutralizar esta amenaza. Pero, al intentar esquivar el bloqueo, la nave real resulta averiada, viéndose así obligada la tripulación a aterrizar en el desértico y remoto planeta de Tatooine...\n\nReestrenada en cines de todo el mundo en febrero de 2012, tanto en 3D como en 2D estándar. (FILMAFFINITY)",
        "nota": 6.3,
        "votos": 103789
    }
```