import { Pipe, PipeTransform } from "@angular/core";
import { toUnicode } from "punycode";

export function decodePunycodeEmail(email: string): string {
  if (!email) {
    return "";
  }
  const [local, domain] = email.split("@");
  return `${local}@${toUnicode(domain)}`;
}

@Pipe({ name: "decodePunycodeEmail" })
export class DecodePunycodeEmailPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform(email: string): string {
    return decodePunycodeEmail(email);
  }
}
