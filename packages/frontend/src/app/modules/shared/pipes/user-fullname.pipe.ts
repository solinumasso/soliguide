import { Pipe, PipeTransform } from "@angular/core";
import { generateCompleteName } from "../../../shared/functions";
import { User } from "../../users/classes";

@Pipe({ name: "userFullName" })
export class UserFullNamePipe implements PipeTransform {
  public transform(user: Pick<User, "name" | "lastname">): string {
    return generateCompleteName(user.name, user.lastname);
  }
}
