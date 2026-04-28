export type ResourceKind = "request" | "response";

export type ChangeRuntime<TDirection extends ResourceKind = ResourceKind> = [
  TDirection
] extends ["request"]
  ? {
      upgrade?: RequestUpgrade;
      downgrade?: never;
    }
  : [TDirection] extends ["response"]
  ? {
      downgrade?: ResponseDowngrade;
      upgrade?: never;
    }
  : {
      upgrade?: RequestUpgrade;
      downgrade?: ResponseDowngrade;
    };

type RequestUpgrade<TPayload = unknown, TContext = unknown> = (
  payload: TPayload,
  context: TContext
) => TPayload | Promise<TPayload>;

type ResponseDowngrade<TPayload = unknown, TContext = unknown> = (
  payload: TPayload,
  context: TContext
) => TPayload | Promise<TPayload>;
