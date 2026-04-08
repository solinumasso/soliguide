export type FieldKey<TContainer> = Extract<keyof TContainer, string>;

export type ResolvedContainer<TPayload> =
  TPayload extends Record<string, unknown> ? TPayload : Record<string, unknown>;
