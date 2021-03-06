import { Role } from "../entities/role";
import { Admin } from "../entities/admin";
import { Client } from "../entities/client";
import { Moderator } from "../entities/moderator";
import { Operation } from "../entities/operation";
import type { User } from "../entities/user";
import type { RoleToUser } from "../entities/role-to-user";
import type { DashboardUser } from "../entities/dashboard-user";
import or from "../utils/or";

export default class UserService {
  private users: readonly User[] = [];
  private readonly operationsForAdminBy = {
    [Role.ADMIN]: [Operation.UPDATE_TO_MODERATOR],
    [Role.MODERATOR]: [],
  };
  private readonly operationsForModeratorBy = {
    [Role.ADMIN]: [Operation.UPDATE_TO_ADMIN, Operation.UPDATE_TO_CLIENT],
    [Role.MODERATOR]: [Operation.UPDATE_TO_CLIENT],
  };
  private readonly operationForClientBy = {
    [Role.ADMIN]: [Operation.UPDATE_TO_MODERATOR],
    [Role.MODERATOR]: [Operation.UPDATE_TO_MODERATOR],
  };

  async getAllUsers(): Promise<readonly User[]> {
    if (this.users.length === 0) {
      await this.fetchUsers();
    }
    
    return this.users;
  }

  private async fetchUsers(): Promise<void> {
    const response = await this.fetch();
    this.users = response.default.map((u: any) => {
      const User = this.getConstructorByRole(u.role);
      return User.from(u);
    });
  }

  private fetch(): Promise<any> {
    return import("../mocks/users.json");
  }

  async updateUserRole<R extends Role>(user: Readonly<RoleToUser[R]>, newRole: R) {
    const User = this.getConstructorByRole(newRole);
    this.users = this.users.map((u) => (u.id === user.id ? User.from(u) : u));
    return this.users;
  }

  getAvailableOperations(user: User, currenUser: User) {
    const dashboardUser = or(Admin, Moderator);

    if (this.isOperationsForAdmin(user)) {
      return this.getOperationsForAdmin(dashboardUser(currenUser));
    }

    if (this.isOperationsForModerator(user)) {
      return this.getOperationsForModerator(dashboardUser(currenUser));
    }

    return this.getOperationsForClient(dashboardUser(currenUser));
  }

  getConstructorByRole(role: Role) {
    switch (role) {
      case Role.ADMIN:
        return Admin;
      case Role.CLIENT:
        return Client;
      case Role.MODERATOR:
        return Moderator;
    }
  }

  isOperationsForAdmin(user: User): user is Admin {
    return user instanceof Admin;
  }

  isOperationsForModerator(user: User): user is Moderator {
    return user instanceof Moderator;
  }

  isOperationsForClient(user: User): user is Client {
    return user instanceof Client;
  }

  getOperationsForAdmin(loggedInUser: DashboardUser) {
    return this.operationsForAdminBy[loggedInUser.role];
  }

  getOperationsForModerator(loggedInUser: DashboardUser) {
    return this.operationsForModeratorBy[loggedInUser.role];
  }

  getOperationsForClient(loggedInUser: DashboardUser) {
    return this.operationForClientBy[loggedInUser.role];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (this.users.length === 0) {
      await this.fetchUsers();
    }
    return this.users.find((u) => u.email === email);
  }
}
