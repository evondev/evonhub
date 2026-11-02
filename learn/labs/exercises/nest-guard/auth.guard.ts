import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { record } from "./trace.js";

const LAB_TOKEN = "lab-token";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    record("guard");

    // TODO: chỉ cho qua khi header Authorization đúng bằng "Bearer lab-token".
    return true;
  }
}
