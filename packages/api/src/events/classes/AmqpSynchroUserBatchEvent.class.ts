import type { Themes } from "@soliguide/common";

import { AmqpEvent } from "../interfaces";
import { AmqpSynchroAirtableUserEvent } from "./AmqpSynchroAirtableUserEvent.class";

/**
 * Message "lot" pour le backfill Brevo des users.
 *
 * Comme pour les places, le backfill regroupe plusieurs users par message
 * (queue dédiée `users.synchro_brevo_all`) afin que n8n puisse traiter le lot
 * en un minimum d'appels (upsert des contacts en batch, et surtout
 * regroupement des liaisons contact -> places sur l'endpoint objects, qui est
 * le vrai goulot au regard de la limite horaire de Brevo).
 *
 * `frontendUrl` / `theme` au niveau du lot ne sont pas exploités par le
 * workflow (chaque user porte déjà les siens) ; ils sont repris du premier
 * élément pour satisfaire le contrat `AmqpEvent` et faciliter le debug.
 */
export class AmqpSynchroUserBatchEvent implements AmqpEvent {
  public frontendUrl: string;

  public theme: Themes | null;

  public users: AmqpSynchroAirtableUserEvent[];

  constructor(users: AmqpSynchroAirtableUserEvent[]) {
    this.users = users;
    this.frontendUrl = users[0]?.frontendUrl ?? "";
    this.theme = users[0]?.theme ?? null;
  }
}
