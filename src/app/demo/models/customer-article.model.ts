import { Article } from './article.model';

export interface CustomerArticle {
  id?: number;

  clientId: number;
  articleId: number;

  numeroSerie: string;
  dateAchat: Date;
  dateFinGarantie: Date;
  estSousGarantie: boolean;

  numeroFacture?: string;
  remarques?: string;

  dateCreation?: Date;
  dateMiseAJour?: Date;

  article?: Article;
}
