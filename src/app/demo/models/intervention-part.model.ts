import { Intervention } from './intervention.model';

export interface InterventionPart {
  id?: number;

  interventionId: number;

  nomPiece: string;
  reference: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal?: number;

  description?: string;

  intervention?: Intervention; // optional navigation property
}
