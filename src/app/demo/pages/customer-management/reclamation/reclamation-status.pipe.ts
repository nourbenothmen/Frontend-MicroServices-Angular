import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reclamationStatus',
  standalone: true
})
export class ReclamationStatusPipe implements PipeTransform {

  private statusMap: Record<number, string> = {
    0: 'En attente',
    1: 'Planifiée',
    2: 'En cours',
    3: 'Terminée'
  };

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return 'Inconnu';
    }

    // Si c'est un nombre (ancien format ou nouveau avec enum)
    if (typeof value === 'number') {
      return this.statusMap[value] ?? 'Inconnu';
    }

    // Si c'est une string (si tu utilises JsonStringEnumConverter)
    const stringMap: Record<string, string> = {
      'EnAttente': 'En attente',
      'Planifiée': 'Planifiée',
      'EnCours': 'En cours',
      'Terminée': 'Terminée'
    };

    return stringMap[value] ?? 'Inconnu';
  }
}