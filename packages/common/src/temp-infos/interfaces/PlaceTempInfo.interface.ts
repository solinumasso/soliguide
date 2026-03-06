export interface IPlaceTempInfo {
  closure: {
    dateDebut: Date;
    dateFin: Date | null;
    description: string;
  };

  // Temporary hours on the place
  hours: {
    dateDebut: Date;
    dateFin: Date | null;
    description: string;
    hours: any;
  };

  // Temporary message on the place
  message: {
    dateDebut: Date;
    dateFin: Date | null;
    description: string;
    name: string;
  };
}
