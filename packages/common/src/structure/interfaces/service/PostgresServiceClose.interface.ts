export interface PostgresServiceClose {
  id: string;
  alive: boolean;
  start: Date | null;
  end: Date | null;
}
