import { slugString, slugLocation, removeAccents } from "../stringUtils";

describe("removeAccents", () => {
  [
    { in: "ÀÁÂÃÄÅàáâãäå", out: "AAAAAAaaaaaa" },
    { in: "ÒÓÔÕÕÖØòóôõöø", out: "OOOOOOOoooooo" },
    { in: "ÈÉÊËèéêë", out: "EEEEeeee" },
    { in: "Çç", out: "Cc" },
    { in: "ÌÍÎÏìíîï", out: "IIIIiiii" },
    { in: "ÙÚÛÜùúûü", out: "UUUUuuuu" },
    { in: "Ññ", out: "Nn" },
    { in: "œ", out: "oe" },
  ].forEach((value) => {
    it(`remove accent: ${value.in}`, () => {
      expect(removeAccents(value.in)).toEqual(value.out);
    });
  });
});

describe("slugLocation", () => {
  [
    { in: "Ain", out: "ain" },
    { in: "Aisne", out: "aisne" },
    { in: "Allier", out: "allier" },
    { in: "Alpes-de-Haute-Provence", out: "alpes-de-haute-provence" },
    { in: "Hautes-Alpes", out: "hautes-alpes" },
    { in: "Alpes-Maritimes", out: "alpes-maritimes" },
    { in: "Ardèche", out: "ardeche" },
    { in: "Ardennes", out: "ardennes" },
    { in: "Aube", out: "aube" },
    { in: "Aude", out: "aude" },
    { in: "Aveyron", out: "aveyron" },
    { in: "Bouches-du-Rhône", out: "bouches-du-rhone" },
    { in: "Calvados", out: "calvados" },
    { in: "Cantal", out: "cantal" },
    { in: "Charente", out: "charente" },
    { in: "Charente-Maritime", out: "charente-maritime" },
    { in: "Cher", out: "cher" },
    { in: "Corrèze", out: "correze" },
    { in: "Côte-d'Or", out: "cote-d-or" },
    { in: "Côtes-d'Armor", out: "cotes-d-armor" },
    { in: "Creuse", out: "creuse" },
    { in: "Dordogne", out: "dordogne" },
    { in: "Doubs", out: "doubs" },
    { in: "Auvergne-Rhône-Alpes", out: "auvergne-rhone-alpes" },
    { in: "Eure", out: "eure" },
    { in: "Eure-et-Loir", out: "eure-et-loir" },
    { in: "Finistère", out: "finistere" },
    { in: "Corse-du-Sud", out: "corse-du-sud" },
    { in: "Haute-Corse", out: "haute-corse" },
    { in: "Gard", out: "gard" },
    { in: "Haute-Garonne", out: "haute-garonne" },
    { in: "Gers", out: "gers" },
    { in: "Gironde", out: "gironde" },
    { in: "Hérault", out: "herault" },
    { in: "Ille-et-Vilaine", out: "ille-et-vilaine" },
    { in: "Indre", out: "indre" },
    { in: "Indre-et-Loire", out: "indre-et-loire" },
    { in: "Isère", out: "isere" },
    { in: "Jura", out: "jura" },
    { in: "Landes", out: "landes" },
    { in: "Loir-et-Cher", out: "loir-et-cher" },
    { in: "Loire", out: "loire" },
    { in: "Haute-Loire", out: "haute-loire" },
    { in: "Loire-Atlantique", out: "loire-atlantique" },
    { in: "Lot-et-Garonne", out: "lot-et-garonne" },
    { in: "Lozère", out: "lozere" },
    { in: "Maine-et-Loire", out: "maine-et-loire" },
    { in: "Manche", out: "manche" },
    { in: "Marne", out: "marne" },
    { in: "Haute-Marne", out: "haute-marne" },
    { in: "Mayenne", out: "mayenne" },
    { in: "Meurthe-et-Moselle", out: "meurthe-et-moselle" },
    { in: "Meuse", out: "meuse" },
    { in: "Morbihan", out: "morbihan" },
    { in: "Moselle", out: "moselle" },
    { in: "Nièvre", out: "nievre" },
    { in: "Nord", out: "nord" },
    { in: "Oise", out: "oise" },
    { in: "Orne", out: "orne" },
    { in: "Puy-de-Dôme", out: "puy-de-dome" },
    { in: "Pyrénées-Atlantiques", out: "pyrenees-atlantiques" },
    { in: "Hautes-Pyrénées", out: "hautes-pyrenees" },
    { in: "Pyrénées-Orientales", out: "pyrenees-orientales" },
    { in: "Bas-Rhin", out: "bas-rhin" },
    { in: "Haut-Rhin", out: "haut-rhin" },
    { in: "Rhône", out: "rhone" },
    { in: "Haute-Saône", out: "haute-saone" },
    { in: "Saône-et-Loire", out: "saone-et-loire" },
    { in: "Sarthe", out: "sarthe" },
    { in: "Haute-Savoie", out: "haute-savoie" },
    { in: "Paris", out: "paris" },
    { in: "Seine-Maritime", out: "seine-maritime" },
    { in: "Seine-et-Marne", out: "seine-et-marne" },
    { in: "Yvelines", out: "yvelines" },
    { in: "Deux-Sèvres", out: "deux-sevres" },
    { in: "Somme", out: "somme" },
    { in: "Tarn", out: "tarn" },
    { in: "Tarn-et-Garonne", out: "tarn-et-garonne" },
    { in: "Var", out: "var" },
    { in: "Vaucluse", out: "vaucluse" },
    { in: "Vendée", out: "vendee" },
    { in: "Vienne", out: "vienne" },
    { in: "Haute-Vienne", out: "haute-vienne" },
    { in: "Vosges", out: "vosges" },
    { in: "Yonne", out: "yonne" },
    { in: "Territoire de Belfort", out: "territoire-de-belfort" },
    { in: "Essonne", out: "essonne" },
    { in: "Hauts-de-Seine", out: "hauts-de-seine" },
    { in: "Seine-Saint-Denis", out: "seine-saint-denis" },
    { in: "Val-de-Marne", out: "val-de-marne" },
    { in: "Val-d'Oise", out: "val-d-oise" },
    { in: "Guadeloupe", out: "guadeloupe" },
    { in: "Martinique", out: "martinique" },
    { in: "Guyane", out: "guyane" },
    { in: "La Réunion", out: "la-reunion" },
    { in: "Mayotte", out: "mayotte" },
    { in: "Normandie", out: "normandie" },
    { in: "Bretagne", out: "bretagne" },
    { in: "Centre-Val de Loire", out: "centre-val-de-loire" },
    { in: "Occitanie", out: "occitanie" },
    { in: "Pays de la Loire", out: "pays-de-la-loire" },
    { in: "Grand Est", out: "grand-est" },
    { in: "Auvergne-Rhône-Alpes", out: "auvergne-rhone-alpes" },
    { in: "Provence-Alpes-Côte d'Azur", out: "provence-alpes-cote-d-azur" },
    { in: "Nouvelle-Aquitaine", out: "nouvelle-aquitaine" },
    { in: "Bourgogne-Franche-Comté", out: "bourgogne-franche-comte" },
    { in: "Île-de-France", out: "ile-de-france" },
    { in: "Pétaouchnok, France", out: "petaouchnok" },
  ].forEach((value) => {
    it(`generate slug for location: ${value.in}`, () => {
      expect(slugLocation(value.in)).toEqual(value.out);
    });
  });
});

describe("slugString", () => {
  [
    { in: "Les Restos-du-coeur", out: "les restos du coeur" },
    {
      in: "Mission Locale MIRE - antenne de Drancy",
      out: "mission locale mire antenne de drancy",
    },
    {
      in: "Camion des Restos du Cœur - Drancy",
      out: "camion des restos du coeur drancy",
    },
    {
      in: "Antenne de Paris Centre / Café-rencontre (Eglise Saint Eustache)",
      out: "antenne de paris centre cafe rencontre eglise saint eustache",
    },
    {
      in: "Antenne Etudiant.e.s Bayet - Secours Populaire Français",
      out: "antenne etudiant e s bayet secours populaire francais",
    },
    {
      in: "Relais social de la famille, de la citoyenneté et de l’accès au droit",
      out: "relais social de la famille de la citoyennete et de l acces au droit",
    },
    {
      in: "Unité Locale de la Croix-Rouge de Villeneuve le Roi - Villeneuve Saint Georges - Ablon sur Seine - Orly - Valenton (local n°1)",
      out: "unite locale de la croix rouge de villeneuve le roi villeneuve saint georges ablon sur seine orly valenton local n 1",
    },
    {
      in: "Maison de la Justice et du Droit de Clichy-sous-Bois/Montfermeil",
      out: "maison de la justice et du droit de clichy sous bois montfermeil",
    },
    {
      in: "Emmaüs Montreuil",
      out: "emmaus montreuil",
    },
    {
      in: "Permanence CIDFF - Hôtel de Ville de Bondy",
      out: "permanence cidff hotel de ville de bondy",
    },
    {
      in: "<p>Inscription au libre-service alimentaire solidaire via l'entretien social.</p>",
      out: "inscription au libre service alimentaire solidaire via l entretien social",
    },
    {
      in: "Le numéro 3230 (service gratuit - prix d'un appel local). ",
      out: "le numero 3230 service gratuit prix d un appel local",
    },
    {
      in: "32 rue Bouret, 75019 Paris, France",
      out: "32 rue bouret 75019 paris france",
    },
  ].forEach((value) => {
    it(`Slug string: ${value.in}`, () => {
      expect(slugString(value.in)).toEqual(value.out);
    });
  });
});
