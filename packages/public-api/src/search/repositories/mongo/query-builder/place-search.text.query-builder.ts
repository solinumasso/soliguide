import { Injectable } from "@nestjs/common";
import { type Document } from "mongodb";

import { SearchContext, SearchQueryBuilder } from "./search.query-builder";
import { appendAndConditions } from "./utils";

@Injectable()
export class TextQueryBuilder implements SearchQueryBuilder {
  build(context: SearchContext): SearchContext {
    if (!context.query.word || !context.query.word.trim()) {
      return context;
    }

    const escaped = this.escapeRegex(context.query.word.trim());
    const regex = new RegExp(escaped, "i");

    const condition: Document = {
      $or: [
        { name: regex },
        { description: regex },
        { "entity.name": regex },
        { "services_all.name": regex },
      ],
    };

    return appendAndConditions(context, condition);
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
