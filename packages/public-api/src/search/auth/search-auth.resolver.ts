import { Injectable, UnauthorizedException } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { UserModel } from "@soliguide/api";
import {
  Categories,
  OperationalAreas,
  UserStatus,
  UserStatusNotLogged,
} from "@soliguide/common";

import { NonAdminUserStatus } from "../search-query/search-query";

export type SearchUserContext = {
  userId: string;
  status: NonAdminUserStatus;
  categoriesLimitations?: Categories[];
  areas?: OperationalAreas;
};

export type ResolvedSearchAuth = {
  user: SearchUserContext;
  blocked: boolean;
};

type JwtPayload = {
  _id: string;
};

type UserProjection = {
  _id: string;
  status: string;
  verified?: boolean;
  blocked?: boolean;
  areas?: OperationalAreas;
  categoriesLimitations?: Categories[];
};

const JWT_PREFIX = "JWT ";

const NON_ADMIN_USER_STATUSES = new Set<NonAdminUserStatus>([
  UserStatus.API_USER,
  UserStatus.PRO,
  UserStatus.SIMPLE_USER,
  UserStatus.SOLI_BOT,
  UserStatus.VOLUNTEER,
  UserStatus.WIDGET_USER,
  UserStatusNotLogged.NOT_LOGGED,
]);

const ADMIN_USER_STATUSES = new Set<string>([
  UserStatus.ADMIN_SOLIGUIDE,
  UserStatus.ADMIN_TERRITORY,
]);

@Injectable()
export class SearchAuthResolver {
  async resolve(authorizationHeader?: string): Promise<ResolvedSearchAuth> {
    if (!authorizationHeader?.trim()) {
      return this.buildAnonymousUser();
    }

    const token = this.extractJwtToken(authorizationHeader);
    if (!token) {
      throw new UnauthorizedException({ message: "INVALID_TOKEN" });
    }

    const decoded = this.verifyToken(token);
    if (!decoded?._id) {
      throw new UnauthorizedException({ message: "INVALID_TOKEN" });
    }

    const user = await UserModel.findById<UserProjection>(decoded._id)
      .select("_id status verified blocked areas categoriesLimitations")
      .lean()
      .exec();

    if (!user?.verified) {
      throw new UnauthorizedException({ message: "USER_NOT_VERIFIED" });
    }

    return {
      user: {
        userId: user._id,
        status: this.normalizeStatus(user.status),
        categoriesLimitations: user.categoriesLimitations,
        areas: user.areas,
      },
      blocked: user.blocked === true,
    };
  }

  private buildAnonymousUser(): ResolvedSearchAuth {
    return {
      user: {
        userId: "anonymous",
        status: UserStatusNotLogged.NOT_LOGGED,
      },
      blocked: false,
    };
  }

  private extractJwtToken(authorizationHeader: string): string | null {
    if (!authorizationHeader.startsWith(JWT_PREFIX)) {
      return null;
    }

    const token = authorizationHeader.slice(JWT_PREFIX.length).trim();
    return token || null;
  }

  private verifyToken(token: string): JwtPayload | null {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is required");
    }

    try {
      const decoded = verify(token, jwtSecret, {
        ignoreExpiration: true,
      });

      if (
        !decoded ||
        typeof decoded !== "object" ||
        typeof (decoded as { _id?: unknown })._id !== "string"
      ) {
        return null;
      }

      return decoded as JwtPayload;
    } catch {
      return null;
    }
  }

  private normalizeStatus(status: string): NonAdminUserStatus {
    if (NON_ADMIN_USER_STATUSES.has(status as NonAdminUserStatus)) {
      return status as NonAdminUserStatus;
    }

    if (ADMIN_USER_STATUSES.has(status)) {
      return UserStatus.SIMPLE_USER;
    }

    return UserStatus.SIMPLE_USER;
  }
}
