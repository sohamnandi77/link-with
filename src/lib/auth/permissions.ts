import { type UserRole } from "@prisma/client";
import { ApiError } from "../../services/errors";
import { type PermissionAction, ROLE_PERMISSIONS } from "../rbac/permissions";

// Check if the required scope is in the list of user scopes
export const throwIfNoAccess = ({
  permissions,
  requiredPermissions,
  workspaceId,
}: {
  permissions: PermissionAction[]; // user or token permissions
  requiredPermissions: PermissionAction[];
  workspaceId: string;
}) => {
  if (requiredPermissions.length === 0) {
    return;
  }

  const missingPermissions = requiredPermissions.filter(
    (p) => !permissions.includes(p),
  );

  if (missingPermissions.length === 0) {
    return;
  }

  throw new ApiError({
    code: "FORBIDDEN",
    message: `The provided key does not have the required permissions for this endpoint on the workspace 'ws_${workspaceId}'. Having the '${missingPermissions.join(" ")}' permission would allow this request to continue.`,
  });
};

export const clientAccessCheck = ({
  action,
  role,
  customPermissionDescription,
}: {
  action: PermissionAction;
  role: UserRole;
  customPermissionDescription?: string;
}) => {
  const allowedActions = ROLE_PERMISSIONS[role];

  if ([...allowedActions].includes(action)) {
    return {
      error: false,
    };
  }

  return {
    error: `You don't have the required permissions to ${action}. ${
      customPermissionDescription ? customPermissionDescription : action
    }`,
  };
};
