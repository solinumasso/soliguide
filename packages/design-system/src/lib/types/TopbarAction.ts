import type { SvelteComponent, ComponentType } from 'svelte';

export type TopbarActionType = 'button' | 'toggle';

export type TopbarActionEventKey = 'favorite' | 'share' | 'settings' | 'edit' | 'more';

export interface TopbarAction {
  label: string;
  type?: TopbarActionType;
  icon: ComponentType<SvelteComponent>;
  iconColor?: string;
  eventKey: TopbarActionEventKey;
  active?: boolean;
}
