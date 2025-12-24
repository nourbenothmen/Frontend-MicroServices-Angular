import { Customer } from '../models/client.model'; // Update the path to the correct location

export enum ReclamationStatus {
  EnAttente = 'EnAttente',
  EnCours = 'EnCours',
  Resolue = 'Resolue',
  Rejetee = 'Rejetee'
}

export interface Reclamation {
  id?: number;

  customerId: number;

  subject: string;
  description: string;

  serialNumber?: string;

  articleId: number;
  interventionId?: number;

  status: ReclamationStatus;

  createdAt?: Date;
  processedAt?: Date;
  resolvedAt?: Date;

  customer?: Customer;
}
