import { Role } from "../entities/role";
import { Admin } from "../entities/admin";
import { Client } from "../entities/client";
import { Moderator } from "../entities/moderator";
import type { User } from "../entities/user";
import type { RoleToUser } from "../entities/role-to-user";
import { AVAILABLE_OPERATIONS } from "../entities/available-operations";

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

  async updateUserRole<R extends Role>(user: Readonly<RoleToUser[R]>, newRole: R) {
    const User = this.getConstructorByRole(newRole);
    this.users = this.users.map((u) => (u.id === user.id ? User.from(u) : u));
    return this.users;
  }

  getAvailableOperations<
    R1 extends Role,
    U1 extends User & { role: R1 },
    R2 extends Role,
    U2 extends User & { role: R2 }
  >(user: U1, currenUser: U2): typeof AVAILABLE_OPERATIONS[R1][R2] {
    return AVAILABLE_OPERATIONS[user.role][currenUser.role];
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
    return this.users.find((u) => u.email === email);
  }
}
