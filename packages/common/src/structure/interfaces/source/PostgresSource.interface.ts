export interface PostgresSource {
  id: string;
  name: string;
  url?: string;
  license?: string;
  is_origin: boolean;
}
