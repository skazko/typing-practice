import { User } from "../entities/user";
import UserService from "./user-service";
import { Credentials } from "./../entities/credentials";

export default class LoginService {
  constructor(private readonly userService: UserService) {}

  public async login({ email, password }: Credentials): Promise<User> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    if (user.password !== password) {
      throw new Error("Wrong password");
    }

    return user;
  }
}
