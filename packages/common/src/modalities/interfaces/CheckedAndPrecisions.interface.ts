export interface Checked {
  checked?: boolean;
}

export interface CheckAndPrecisions extends Checked {
  precisions: string | null;
}
