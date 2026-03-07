import { type Categories } from "../../../categories/enums";

export interface PostgresServiceCategory {
  id: string;
  category: Categories;
  description?: string;
  name?: string;
}
