import type { Themes } from "@soliguide/common";

import { AmqpEvent } from "../interfaces";
import { AmqpSynchroAirtablePlaceEvent } from "./AmqpSynchroAirtablePlaceEvent.class";

/**
 * Message "lot" pour le backfill Brevo des places.
 *
 * Le backfill regroupe plusieurs places par message (queue dédiée
 * `places.synchro_brevo_all`) pour que n8n fasse un seul appel
 * `POST /objects/place/batch/upsert` par message, avec plusieurs `records`.
 * Cela réduit drastiquement le nombre d'appels et permet de rester sous la
 * limite horaire de l'endpoint objects de Brevo.
 *
 * `frontendUrl` / `theme` au niveau du lot ne sont pas exploités par le
 * workflow (chaque place porte déjà les siens) ; ils sont repris du premier
 * élément pour satisfaire le contrat `AmqpEvent` et faciliter le debug.
 */
export class AmqpSynchroPlaceBatchEvent implements AmqpEvent {
  public frontendUrl: string;

  public theme: Themes | null;

  public places: AmqpSynchroAirtablePlaceEvent[];

  constructor(places: AmqpSynchroAirtablePlaceEvent[]) {
    this.places = places;
    this.frontendUrl = places[0]?.frontendUrl ?? "";
    this.theme = places[0]?.theme ?? null;
  }
}
