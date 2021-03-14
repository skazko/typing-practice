import { AsyncContract } from "runtypes";
import UserService from "./user-service";
import { User } from "../entities/user";
import { Credentials } from "./../entities/credentials";

export default class LoginService {
  constructor(private readonly userService: UserService) {}

  public login = AsyncContract(Credentials, User).enforce(async ({ email, password }) => {
    const users = await this.userService.getAllUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    if (user.password !== password) {
      throw new Error("Wrong password");
    }

    return user;
  });
}
