import { User } from "../entities/user";
import UserService from "./user-service";

export default class LoginService {
  constructor(private readonly userService: UserService) {}

  public async login(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    if (user.password !== password) {
      throw new Error('Wrong password');
    }
    
    return user;
  }
}
