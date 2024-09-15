import { type createLinkBodySchema } from "@/schema/links";
import { type Link, type Workspace } from "@prisma/client";
import { type z } from "zod";

export interface UserProps {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  lockedAt?: Date;
  defaultWorkspace?: string;
  hasPassword: boolean;
  provider: string | null;
}

export const PLANS = ["FREE", "PRO"] as const;

export type PlanProps = (typeof PLANS)[number];

export const USER_ROLES = ["ADMIN", "MEMBER", "GUEST"] as const;

export type RoleProps = (typeof USER_ROLES)[number];

export const UTM_TAGS = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
] as const;

export interface WorkspaceProps extends Workspace {
  logo: string | null;
  plan: PlanProps;
  domains: {
    id: string;
    slug: string;
    primary: boolean;
    verified: boolean;
  }[];
  users: {
    role: RoleProps;
  }[];
}

export type WorkspaceWithUsers = Omit<WorkspaceProps, "domains">;

export type NewLinkProps = z.infer<typeof createLinkBodySchema>;

type ProcessedLinkOverrides =
  | "domain"
  | "keyword"
  | "originalLink"
  | "workspaceId";
export type ProcessedLinkProps = Omit<NewLinkProps, ProcessedLinkOverrides> &
  Pick<Link, ProcessedLinkOverrides> & { userId?: Link["userId"] } & {
    createdAt?: Date;
    id?: string;
  };
