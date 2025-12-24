import { Reclamation } from './reclamation.model';

export interface Customer {
  id?: number;

  userId: string;

  firstName: string;
  lastName: string;
  phone: string;
  address: string;

  createdAt?: Date;

  reclamations?: Reclamation[];
}
