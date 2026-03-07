export interface AccordionContext {
  toggleExpand: (childKey: string) => void;
  register: (childKey: string, isExpanded: boolean) => void;
  state: Writable<Map<string, boolean>>;
}
