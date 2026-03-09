import type { ComponentType, SvelteComponent } from 'svelte';

export interface MenuItem {
  icon: ComponentType<SvelteComponent>;
  iconActive: ComponentType<SvelteComponent>;
  label: string;
  ariaLabel: string;
  ariaLabelActive: string;
  route: string;
  hasBadge?: boolean;
  id?: string;
}
