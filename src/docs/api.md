# API-REST

| Método | API         | Parámetros                                                                   | Descripción                                               |
| ------ | ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| GET    | /api/search | `lang=${'es' or 'en'}&year=${año}&query=${patrón a buscar}` (Opcional: year) | Busca películas por título adaptándose al patrón indicado |
| GET    | /api/film   | `lang=${'es' or 'en'}&id=${id}`                                              | Obtiene datos de una película o serie mediante un ID      |
| POST   | /api/film   | `{"url": "https://www.filmaffinity.com/es/film819745.html"}`                 | Obtiene datos de una película o serie mediante una URL    |

# Ejemplos de uso

## Búsqueda de películas cuyo título coincida con el string de búsqueda introducido

### Ejemplo 1

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

### Ejemplo 2

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

### Ejemplo 3

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

## Búsqueda de una película a través de su ID

### Ejemplo 1

GET [http://localhost:3000/api/film?lang=es&id=470268](http://localhost:3000/api/film?lang=es&id=470268)

```json
{
   "title": "Gone with the Wind",
   "originalTitle": "Gone with the Wind",
   "year": 1939,
   "duration": "238 min.",
   "sinopsys": "When wealthy Southern belle Scarlett O'Hara (Vivien Leigh) learns that Ashley Wilkes (Leslie Howard), whom she's secretly in love with, is engaged to Melanie Hamilton (Olivia de Havilland), she decides to tell him at a party about her feelings for him. However, Ashley is not swayed, and responds that he's much more suited to Melanie. Rhett Butler (Clark Gable), who has overheard their conversation, promises to Scarlett that he'll keep her secret. The party is interrupted when it's announced that the Civil War has begun. As the men leave to enlist, Melanie's younger brother Charles asks for Scarlett's hand in marriage. She agrees, even though she doesn't love him.",
   "genre": "Drama | Romance | Adventure",
   "rating": 7.9,
   "votes": 59065,
   "image": "https://pics.filmaffinity.com/gone_with_the_wind-432251527-mmed.jpg",
   "nationality": "United States",
   "directedBy": "Victor Fleming | George Cukor | Sam Wood",
   "screenplay": "Sidney Howard | Oliver H.P. Garrett | Ben Hecht | Jo Swerling | John Van Druten.  Novel: Margaret Mitchell",
   "cast": "Vivien Leigh | Clark Gable | Olivia de Havilland | Leslie Howard | Hattie McDaniel | Thomas Mitchell | Barbara O'Neil | Butterfly McQueen | Ona Munson | Ann Rutherford | Evelyn Keyes | Mickey Kuhn | Ward Bond | George Reeves",
   "cast_images": "https://pics.filmaffinity.com/vivien_leigh-082357339530468-nm_200.jpg | https://pics.filmaffinity.com/clark_gable-243857803934738-nm_200.jpg | https://pics.filmaffinity.com/olivia_de_havilland-048485474956236-nm_200.jpg | https://pics.filmaffinity.com/leslie_howard-220357392243531-nm_200.jpg | https://pics.filmaffinity.com/hattie_mcdaniel-057352777545643-nm_200.jpg | https://pics.filmaffinity.com/thomas_mitchell-215357602602082-nm_200.jpg | https://pics.filmaffinity.com/barbara_o_neil-140266160360359-nm_200.jpg | NOT image | NOT image | https://pics.filmaffinity.com/ann_rutherford-105769580833580-nm_200.jpg | https://pics.filmaffinity.com/evelyn_keyes-032656387003915-nm_200.jpg | NOT image | https://pics.filmaffinity.com/ward_bond-154013674037580-nm_200.jpg | https://pics.filmaffinity.com/george_reeves-164650280876629-nm_200.jpg",
   "music": "Max Steiner",
   "photography": "Ernest Haller",
   "studio": "Selznick International Pictures | Metro-Goldwyn-Mayer (MGM)"
}
```

### Ejemplo 2

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
   "votes": 103939,
   "image": "https://pics.filmaffinity.com/star_wars_episode_i_the_phantom_menace-434398792-mmed.jpg",
   "nationality": "United States",
   "directedBy": "George Lucas",
   "screenplay": "George Lucas",
   "cast": "Liam Neeson | Ewan McGregor | Natalie Portman | Jake Lloyd | Samuel L. Jackson | Ian McDiarmid | Ray Park | Anthony Daniels | Kenny Baker | Pernilla August | Hugh Quarshie | Ahmed Best | Andy Secombe",
   "cast_images": "https://pics.filmaffinity.com/liam_neeson-141977938966156-nm_200.jpg | https://pics.filmaffinity.com/ewan_mcgregor-032764755725908-nm_200.jpg | https://pics.filmaffinity.com/natalie_portman-006310795219870-nm_200.jpg | https://pics.filmaffinity.com/jake_lloyd-132931545980414-nm_200.jpg | https://pics.filmaffinity.com/samuel_l_jackson-281405475762864-nm_200.jpg | https://pics.filmaffinity.com/ian_mcdiarmid-200169201771562-nm_200.jpg | https://pics.filmaffinity.com/ray_park-276501816589467-nm_200.jpg | https://pics.filmaffinity.com/anthony_daniels-108595224087471-nm_200.jpg | https://pics.filmaffinity.com/kenny_baker-229525724195046-nm_200.jpg | https://pics.filmaffinity.com/pernilla_august-266690163996533-nm_200.jpg | https://pics.filmaffinity.com/hugh_quarshie-026473575198207-nm_200.jpg | https://pics.filmaffinity.com/ahmed_best-036445186419580-nm_200.jpg | https://pics.filmaffinity.com/andy_secombe-250315122555266-nm_200.jpg",
   "music": "John Williams",
   "photography": "David Tattersall",
   "studio": "Lucasfilm | 20th Century Fox"
}
```

### Ejemplo 3

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
   "votes": 7555,
   "image": "https://pics.filmaffinity.com/el_ano_de_la_garrapata-136495103-mmed.jpg",
   "nationality": "Spain",
   "directedBy": "Jorge Coira",
   "screenplay": "Carlos Portela",
   "cast": "Félix Gómez | Javier Veiga | Verónica Sánchez | María Vázquez | Víctor Clavijo | Camila Bossa | Mela Casal | Celso Parada | Luis Zahera | Josefina Gómez | Rosa Álvarez | Elina Luaces | Manuel Millán",
   "cast_images": "https://pics.filmaffinity.com/felix_gomez-011744550943444-nm_200.jpg | https://pics.filmaffinity.com/javier_veiga-280546478693330-nm_200.jpg | https://pics.filmaffinity.com/veronica_sanchez-083233902177622-nm_200.jpg | https://pics.filmaffinity.com/maria_vazquez-041030266802405-nm_200.jpg | https://pics.filmaffinity.com/victor_clavijo-279826410725594-nm_200.jpg | https://pics.filmaffinity.com/camila_bossa-261430550132636-nm_200.jpg | https://pics.filmaffinity.com/mela_casal-067723996021615-nm_200.jpg | NOT image | https://pics.filmaffinity.com/luis_zahera-196291090835112-nm_200.jpg | NOT image | https://pics.filmaffinity.com/rosa_alvarez-170004061425274-nm_200.jpg | https://pics.filmaffinity.com/elina_luaces-149455033990173-nm_200.jpg | NOT image",
   "music": "",
   "photography": "Chechu Graf",
   "studio": "Filmanova | LugoPress | Filmanova Invest | Televisión de Galicia (TVG)"
}
```
