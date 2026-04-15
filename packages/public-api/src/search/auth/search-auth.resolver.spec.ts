import { UnauthorizedException } from "@nestjs/common";
import { UserModel } from "@soliguide/api";
import { UserStatus, UserStatusNotLogged } from "@soliguide/common";
import { verify } from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { SearchAuthResolver } from "./search-auth.resolver";

vi.mock("jsonwebtoken", () => ({
  verify: vi.fn(),
}));

vi.mock("@soliguide/api", () => ({
  UserModel: {
    findById: vi.fn(),
  },
}));

describe("SearchAuthResolver", () => {
  const resolver = new SearchAuthResolver();
  const verifyJwt = verify as unknown as Mock;
  const findById = UserModel.findById as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("resolves NOT_LOGGED when authorization header is missing", async () => {
    await expect(resolver.resolve(undefined)).resolves.toEqual({
      user: {
        userId: "anonymous",
        status: UserStatusNotLogged.NOT_LOGGED,
      },
      blocked: false,
    });

    expect(verifyJwt).not.toHaveBeenCalled();
    expect(findById).not.toHaveBeenCalled();
  });

  it("returns INVALID_TOKEN when authorization scheme is not JWT", async () => {
    await expect(resolver.resolve("Bearer abc")).rejects.toMatchObject({
      response: { message: "INVALID_TOKEN" },
    });

    expect(findById).not.toHaveBeenCalled();
  });

  it("returns INVALID_TOKEN when jwt is invalid", async () => {
    verifyJwt.mockImplementation(() => {
      throw new Error("invalid token");
    });

    await expect(resolver.resolve("JWT invalid")).rejects.toMatchObject({
      response: { message: "INVALID_TOKEN" },
    });

    expect(findById).not.toHaveBeenCalled();
  });

  it("returns USER_NOT_VERIFIED when user does not exist", async () => {
    verifyJwt.mockReturnValue({ _id: "66a0f6ec4ad86cb5706f4f24" });

    const exec = vi.fn().mockResolvedValue(null);
    const lean = vi.fn().mockReturnValue({ exec });
    const select = vi.fn().mockReturnValue({ lean });
    findById.mockReturnValue({ select });

    await expect(resolver.resolve("JWT token")).rejects.toMatchObject({
      response: { message: "USER_NOT_VERIFIED" },
    });
  });

  it("returns USER_NOT_VERIFIED for unverified users", async () => {
    verifyJwt.mockReturnValue({ _id: "66a0f6ec4ad86cb5706f4f24" });

    const exec = vi.fn().mockResolvedValue({
      _id: "66a0f6ec4ad86cb5706f4f24",
      status: UserStatus.SIMPLE_USER,
      verified: false,
    });
    const lean = vi.fn().mockReturnValue({ exec });
    const select = vi.fn().mockReturnValue({ lean });
    findById.mockReturnValue({ select });

    await expect(resolver.resolve("JWT token")).rejects.toMatchObject({
      response: { message: "USER_NOT_VERIFIED" },
    });
  });

  it("resolves verified non-admin user context", async () => {
    verifyJwt.mockReturnValue({ _id: "66a0f6ec4ad86cb5706f4f24" });

    const exec = vi.fn().mockResolvedValue({
      _id: "66a0f6ec4ad86cb5706f4f24",
      status: UserStatus.API_USER,
      verified: true,
      blocked: true,
      areas: { fr: { departments: ["75"] } },
      categoriesLimitations: ["health"],
    });
    const lean = vi.fn().mockReturnValue({ exec });
    const select = vi.fn().mockReturnValue({ lean });
    findById.mockReturnValue({ select });

    await expect(resolver.resolve("JWT token")).resolves.toEqual({
      user: {
        userId: "66a0f6ec4ad86cb5706f4f24",
        status: UserStatus.API_USER,
        areas: { fr: { departments: ["75"] } },
        categoriesLimitations: ["health"],
      },
      blocked: true,
    });
  });

  it("downgrades admin users to SIMPLE_USER", async () => {
    verifyJwt.mockReturnValue({ _id: "66a0f6ec4ad86cb5706f4f24" });

    const exec = vi.fn().mockResolvedValue({
      _id: "66a0f6ec4ad86cb5706f4f24",
      status: UserStatus.ADMIN_TERRITORY,
      verified: true,
      blocked: false,
    });
    const lean = vi.fn().mockReturnValue({ exec });
    const select = vi.fn().mockReturnValue({ lean });
    findById.mockReturnValue({ select });

    const resolvedAuth = await resolver.resolve("JWT token");

    expect(resolvedAuth.user.status).toBe(UserStatus.SIMPLE_USER);
    expect(resolvedAuth.blocked).toBe(false);
  });

  it("throws when JWT_SECRET is not set", async () => {
    delete process.env.JWT_SECRET;

    await expect(resolver.resolve("JWT token")).rejects.toThrow(Error);
  });

  it("returns UnauthorizedException for invalid token payload", async () => {
    verifyJwt.mockReturnValue({});

    await expect(resolver.resolve("JWT token")).rejects.toThrow(
      UnauthorizedException
    );
  });
});
