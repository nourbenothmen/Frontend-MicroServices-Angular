import { InterventionPart } from './intervention-part.model';

export type InterventionStatus = 'Planifiée' | 'EnCours' | 'Terminée' | 'Annulée';

export interface Intervention {
  id?: number;

  reclamationId: number;
  clientId: number;
  articleId: number;

  description: string;
  dateIntervention: Date;
  statut: InterventionStatus;

  estSousGarantie: boolean;

  montantMainOeuvre: number;
  montantTotal: number;

  commentaire?: string;
  technicienNom: string;

  dateCreation?: Date;
  dateMiseAJour?: Date;

  pieces?: InterventionPart[];
}
