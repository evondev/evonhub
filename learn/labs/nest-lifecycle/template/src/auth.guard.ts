import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { record } from "./trace.js";

const LAB_TOKEN = "lab-token";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    record("guard");

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    return authorization === `Bearer ${LAB_TOKEN}`;
  }
}
