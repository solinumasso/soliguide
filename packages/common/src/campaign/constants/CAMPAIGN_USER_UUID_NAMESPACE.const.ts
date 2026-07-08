/**
 * Namespace UUID (v4, figé à vie) utilisé pour dériver `campaignUserUuid`
 * depuis `user._id` via UUID v5 dans la migration one-shot.
 *
 * Les nouveaux users créés après la migration reçoivent un `campaignUserUuid`
 * v4 aléatoire (`crypto.randomUUID()`) — la dérivation v5 ne sert qu'à
 * garantir l'idempotence de la migration one-shot.
 *
 * **Ne JAMAIS changer** cette valeur : casserait la reproductibilité des
 * UUID sur un dump ré-importé.
 */
export const CAMPAIGN_USER_UUID_NAMESPACE =
  "b5a3f8e2-1c4d-4a7f-9e6b-8d2c7f4a5e91";
