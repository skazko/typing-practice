import { match, Union } from "runtypes";
import { Role } from "../entities/role";
import { User } from "../entities/user";
import { Admin } from "../entities/admin";
import { Moderator } from './../entities/moderator';
import { Client } from "../entities/client";
import { Operation } from "../entities/operation";
import { castTo } from "../entities/role-to-user";
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
    this.users = response.default.map((u: any) => User.check(u));
  }

  private fetch(): Promise<any> {
    return import("../mocks/users.json");
  }

  async updateUserRole<R extends Role>(
    user: RoleToUser[R],
    newRole: R
  ) {
    const newUser = castTo(newRole, user);
    this.users = this.users.map((u) => (u.id === user.id ? newUser : u));
    return this.users;
  }

  getAvailableOperationsForAdminBy = match(
    [Admin, (admin) => [Operation.UPDATE_TO_MODERATOR]],
    [User, (user) => []]
  )
  getAvailableOperationsForModeratorBy = match(
    [Admin, (admin) => [Operation.UPDATE_TO_ADMIN, Operation.UPDATE_TO_CLIENT]],
    [Moderator, (moderator) => [Operation.UPDATE_TO_CLIENT]],
    [User, (user) => []]
  )
  getAvailableOperationsForClientBy = match(
    [Union(Admin, Moderator), (user) => [Operation.UPDATE_TO_MODERATOR]],
    [User, (user) => []]
  )
  getAvailableOperations = match(
    [Admin, (admin) => (user: User) => this.getAvailableOperationsForAdminBy(user)],
    [Moderator, (moderator) => (user: User) => this.getAvailableOperationsForModeratorBy(user)],
    [Client, (client) => (user: User) => this.getAvailableOperationsForClientBy(user)]
  )
}
