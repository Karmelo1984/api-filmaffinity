export interface SearchRequest {
   id_request: number;
   lang: 'es' | 'en';
   query: string;
   year: number | null;
}
