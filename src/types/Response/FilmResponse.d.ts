export interface FilmResponse {
   id_film: number;
   title: string;
   originalTitle: string;
   year: number;
   duration_min: number;
   synopsis: string;
   rating: number;
   votes: number;
   image: string;
   nationality: Pais[];
   directedBy: Persona[];
   cast: Persona[];
   screenplay: Persona[];
   genre: string[];
   music: Persona[];
   photography: Persona[];
   studio: string[];
}

export interface Persona {
   id: number;
   name: string;
   photo: string | undefined;
}

export interface Pais {
   id: string | undefined;
   name: string | undefined;
   photo: string | undefined;
}
