import type { z } from "zod";

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type IsAny<T> = 0 extends 1 & T ? true : false;

type SchemaAuthoringShape<T> = SchemaKnownShape<T>;

type SchemaKnownShape<T> = T extends z.ZodObject<infer Shape, any>
  ? {
      [K in keyof Shape]: SchemaKnownShape<Shape[K]>;
    }
  : T extends z.ZodArray<infer ArrayItem>
  ? SchemaKnownShape<ArrayItem>[]
  : T extends z.ZodOptional<infer InnerSchema>
  ? SchemaKnownShape<InnerSchema> | undefined
  : T extends z.ZodNullable<infer InnerSchema>
  ? SchemaKnownShape<InnerSchema> | null
  : T extends z.ZodDefault<infer InnerSchema>
  ? SchemaKnownShape<InnerSchema>
  : T extends z.ZodCatch<infer InnerSchema>
  ? SchemaKnownShape<InnerSchema>
  : T extends z.ZodReadonly<infer InnerSchema>
  ? Readonly<SchemaKnownShape<InnerSchema>>
  : T extends z.ZodNonOptional<infer InnerSchema>
  ? SchemaKnownShape<InnerSchema>
  : T extends z.ZodLazy<infer InnerSchema>
  ? SchemaKnownShape<InnerSchema>
  : T extends z.ZodUnion<infer Options>
  ? SchemaKnownShape<Options[number]>
  : T extends z.ZodDiscriminatedUnion<infer Options, any>
  ? SchemaKnownShape<Options[number]>
  : T extends z.ZodIntersection<infer LeftSchema, infer RightSchema>
  ? SchemaKnownShape<LeftSchema> & SchemaKnownShape<RightSchema>
  : T extends z.ZodTypeAny
  ? z.output<T>
  : T;

type Normalize<T> = NonNullable<SchemaAuthoringShape<T>>;
type NormalizeNode<T> = Normalize<T> extends readonly (infer ArrayItem)[]
  ? Normalize<ArrayItem>
  : Normalize<T>;

type KnownStringKeys<T> = Extract<
  {
    [K in keyof T]-?: string extends K ? never : number extends K ? never : K;
  }[keyof T],
  string
>;

type PathSuffix<T> = T extends Primitive
  ? never
  : NormalizeNode<T> extends object
  ? {
      [K in KnownStringKeys<NormalizeNode<T>>]:
        | K
        | (PathSuffix<NormalizeNode<T>[K]> extends never
            ? never
            : `${K}.${PathSuffix<NormalizeNode<T>[K]>}`);
    }[KnownStringKeys<NormalizeNode<T>>]
  : never;

type ObjectPathSuffix<T> = NormalizeNode<T> extends Primitive
  ? never
  : NormalizeNode<T> extends object
  ? {
      [K in KnownStringKeys<NormalizeNode<T>>]: NormalizeNode<
        NormalizeNode<T>[K]
      > extends Primitive
        ? never
        : NormalizeNode<NormalizeNode<T>[K]> extends object
        ?
            | K
            | (ObjectPathSuffix<NormalizeNode<T>[K]> extends never
                ? never
                : `${K}.${ObjectPathSuffix<NormalizeNode<T>[K]>}`)
        : never;
    }[KnownStringKeys<NormalizeNode<T>>]
  : never;

type PathValue<
  T,
  TPath extends string
> = TPath extends `${infer Head}.${infer Tail}`
  ? Head extends KnownStringKeys<NormalizeNode<T>>
    ? PathValue<NormalizeNode<T>[Head], Tail>
    : never
  : TPath extends ""
  ? NormalizeNode<T>
  : TPath extends KnownStringKeys<NormalizeNode<T>>
  ? NormalizeNode<T>[TPath]
  : never;

type RootPath<T> = NormalizeNode<T> extends Primitive
  ? never
  : NormalizeNode<T> extends object
  ? ""
  : never;

/**
 * Dot-path suggestions over a schema-inferred object type or a generated
 * Zod schema type (`typeof someSchema`).
 *
 * Paths are relative to the main exported schema and implicitly traverse arrays,
 * so "places._id" means "field _id on each places item".
 */
export type SchemaPathStrict<T> = RootPath<T> | PathSuffix<T>;

// looseObject/catchall inferred types may collapse keys to an index signature.
// Fallback to string in that case to keep authoring usable.
export type SchemaPath<T> = IsAny<T> extends true
  ? never
  : [PathSuffix<T>] extends [never]
  ? string
  : SchemaPathStrict<T>;

export type SchemaObjectPathStrict<T> = RootPath<T> | ObjectPathSuffix<T>;

export type SchemaObjectPath<T> = IsAny<T> extends true
  ? never
  : [ObjectPathSuffix<T>] extends [never]
  ? string
  : SchemaObjectPathStrict<T>;

export type SchemaPathValue<
  T,
  TPath extends SchemaPath<T> | SchemaObjectPath<T>
> = PathValue<T, TPath & string>;

export type SchemaFieldAtPath<T, TPath extends SchemaObjectPath<T>> = [
  KnownStringKeys<NormalizeNode<SchemaPathValue<T, TPath>>>
] extends [never]
  ? string
  : KnownStringKeys<NormalizeNode<SchemaPathValue<T, TPath>>>;
