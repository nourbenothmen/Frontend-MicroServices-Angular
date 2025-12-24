import { CustomerArticle } from '../models/customer-article.model';

export interface Article {
  id?: number;

  nom: string;
  reference: string;
  description?: string;

  categorie: string;
  type: string;
  marque: string;
  modele?: string;

  prix: number;
  dureeGarantie: number;

  estDisponible: boolean;
  stock: number;

  imageUrl?: string;

  dateCreation?: Date;
  dateMiseAJour?: Date;

  articlesClients?: CustomerArticle[];
}
