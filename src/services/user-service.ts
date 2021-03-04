import { Role } from "../entities/role";
import { Admin } from "../entities/admin";
import { Client } from "../entities/client";
import { Moderator } from "../entities/moderator";
import { Operation } from "../entities/operation";
import type { User } from "../entities/user";
import type { RoleToUser } from "../entities/role-to-user";

export default class UserService {
  private users: readonly User[] = [];

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

  async updateUserRole<R extends Role>(
    user: Readonly<RoleToUser[R]>,
    newRole: R
  ) {
    const User = this.getConstructorByRole(newRole);
    this.users = this.users.map((u) => (u.id === user.id ? User.from(u) : u));
    return this.users;
  }

  getAvailableOperations(user: User, currenUser: User): Operation[] {
    if (currenUser instanceof Admin) {
      if (user instanceof Admin || user instanceof Client) {
        return [Operation.UPDATE_TO_MODERATOR];
      }
      return [Operation.UPDATE_TO_CLIENT, Operation.UPDATE_TO_ADMIN];
    }

    if (currenUser instanceof Moderator) {
      if (user instanceof Client) {
        return [Operation.UPDATE_TO_MODERATOR];
      }
      if (user instanceof Moderator) {
        return [Operation.UPDATE_TO_CLIENT];
      }
    }

    return []
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (this.users.length === 0) {
      await this.fetchUsers();
    }
    return this.users.find(u => (u.email === email));
  }
}
