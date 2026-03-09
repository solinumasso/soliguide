import type { SvelteComponent, ComponentType } from 'svelte';

export interface DropdownOption {
  label: string;
  icon: ComponentType<SvelteComponent>;
  eventKey: string;
}

export type ActionButtonType = 'button' | 'toggle';

export type SuperbarActionEventKey =
  | 'share'
  | 'settings'
  | 'favorite'
  | 'add'
  | 'edit'
  | 'settings'
  | 'more';
export interface SuperbarAction {
  label: string;
  type?: ActionButtonType;
  eventKey: SuperbarActionEventKey;
  icon: ComponentType<SvelteComponent>;
}
