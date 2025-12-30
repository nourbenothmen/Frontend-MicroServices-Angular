export interface InterventionPart {
  Id: number;
  InterventionId: number;
  NomPiece: string;
  Reference?: string;
  Quantite: number;
  PrixUnitaire: number;
  PrixTotal: number;
  Description?: string;
}

export interface Intervention {
  Id: number;
  ReclamationId: number;
  ClientId: number;
  ClientNom: string;
  ClientEmail?: string;
  ClientTelephone?: string;
  ArticleId: number;
  ArticleNom: string;
  EstSousGarantie: boolean;
  TechnicienNom: string;
  DateIntervention: string;
  Description?: string;

  // Champs facturation (ajoutés)
  DureeIntervention: number;
  TarifHoraire: number;
  MontantDeplacement: number;
  TauxTVA: number;
  ModePaiement?: string;
  StatutPaiement?: string;
  MontantMainOeuvre?: number;
  MontantTotal?: number;

  Pieces: InterventionPart[];
}