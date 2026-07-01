import { PlaceType } from "@soliguide/common";
import { z } from "zod";
import { schema } from "../../../versioning-engine/dsl";

const v20260426SearchPlaceResponseSchema = z.object({
  waypoints: z.unknown(),
  openingHours: z.unknown(),
  position: z.unknown(),
});

export const tempInfoSchema = schema(
  z
    .looseObject({
      closure: z
        .looseObject({
          active: z
            .boolean()
            .nullable()
            .optional()
            .describe(
              "Indicates whether the temporary information is currently active."
            ),
          startDate: z
            .string()
            .nullable()
            .optional()
            .describe(
              "Start date of the temporary information. Format ISO 8601."
            ),
          endDate: z
            .string()
            .nullable()
            .optional()
            .describe(
              "End date of the temporary information. Format ISO 8601."
            ),
          description: z
            .string()
            .nullable()
            .optional()
            .describe("Message describing the temporary information."),
        })
        .nullable()
        .optional()
        .describe("Temporary closure of the place."),
      hours: z
        .looseObject({
          active: z
            .boolean()
            .nullable()
            .optional()
            .describe(
              "Indicates whether the temporary information is currently active."
            ),
          startDate: z
            .string()
            .nullable()
            .optional()
            .describe(
              "Start date of the temporary information. Format ISO 8601."
            ),
          endDate: z
            .string()
            .nullable()
            .optional()
            .describe(
              "End date of the temporary information. Format ISO 8601."
            ),
          description: z
            .string()
            .nullable()
            .optional()
            .describe("Message describing the temporary information."),
          hours: z
            .looseObject({})
            .nullable()
            .optional()
            .describe("Temporary opening hours of the place."),
        })
        .nullable()
        .optional()
        .describe("Temporary opening hours of the place."),
      message: z
        .looseObject({
          active: z
            .boolean()
            .nullable()
            .optional()
            .describe(
              "Indicates whether the temporary information is currently active."
            ),
          startDate: z
            .string()
            .nullable()
            .optional()
            .describe(
              "Start date of the temporary information. Format ISO 8601."
            ),
          endDate: z
            .string()
            .nullable()
            .optional()
            .describe(
              "End date of the temporary information. Format ISO 8601."
            ),
          description: z
            .string()
            .nullable()
            .optional()
            .describe("Message describing the temporary information."),
          name: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional()
    .describe("Temporary closure, opening hours and message information.")
);

export const accessibilitySchema = schema(
  z
    .object({
      wheelchair: z
        .boolean()
        .nullable()
        .optional()
        .describe(
          "Indicates whether the place is accessible to wheelchair users."
        ),
    })
    .nullable()
    .optional()
    .describe("Accessibility details for the place.")
);

export const specialSupportContextSchema = schema(
  z
    .object({
      type: z.string().describe("Broad category of support context.").meta({
        example: "humanitarianCrisis",
      }),
      key: z
        .string()
        .describe("Stable machine-readable identifier for the support context.")
        .meta({
          example: "ukraine-displacement",
        }),
      label: z
        .string()
        .describe("Human-readable label for the support context.")
        .meta({
          example: "Support for displaced people from Ukraine",
        }),
      details: z
        .string()
        .describe(
          "Additional details about the support available in this context."
        )
        .meta({
          example: "Ukrainian-speaking volunteers available.",
        }),
    })
    .nullable()
    .optional()
    .describe(
      "Special support context related to a crisis or exceptional situation."
    )
);

export const searchPlacesByTypeSchema = schema(
  z.array(
    z
      .discriminatedUnion("placeType", [
        v20260426SearchPlaceResponseSchema
          .omit({ waypoints: true })
          .extend({
            placeType: z.literal(PlaceType.PLACE),
          })
          .meta({ title: "FixedPosition" }),
        v20260426SearchPlaceResponseSchema
          .omit({ openingHours: true, position: true })
          .extend({
            placeType: z.literal(PlaceType.ITINERARY),
          })
          .meta({ title: "Itinerary" }),
      ])
      .meta({
        discriminator: {
          propertyName: "type",
        },
      })
      .nullable()
      .describe("List of place matching the request.")
  )
);
