import { Directive, HostListener, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[appCleanStr]",
})
export class CleanStrDirective {
  public inputElement: HTMLInputElement;

  private readonly rules: { [key in "share" | "alphanumeric"]: RegExp } = {
    share:
      /[^a-zÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž\d \\'\\-\\/\\:\\+!]/gi,

    alphanumeric:
      /[^a-zÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž\d \\'\\-]/gi,
  };

  @Input() appCleanStr: "share" | "alphanumeric";

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener("keypress", ["$event"])
  public onKeyPress(event: KeyboardEvent) {
    const currentValue: string = event.key;

    const sanitizedValue: string = this.sanitizeInput(currentValue);
    if (currentValue !== sanitizedValue) {
      event.preventDefault();
    }
  }

  @HostListener("paste", ["$event"])
  public onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const sanitizedValue: string = event.clipboardData
      ? this.sanitizeInput(event.clipboardData.getData("text/plain"))
      : "";

    this.inputElement.value = sanitizedValue;
  }

  private sanitizeInput(str: string): string {
    return str.replace(this.rules[this.appCleanStr], "");
  }
}
