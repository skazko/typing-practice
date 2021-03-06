export type MaybeCredentials = {
  email: string;
  password: string;
};

const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export class Credentials {
  static hasEmail(credentials: MaybeCredentials): boolean {
    return credentials.email?.length > 0;
  }

  static hasPassword(credentials: MaybeCredentials): boolean {
    return credentials.password?.length > 0;
  }

  static isEmailValid(credentials: MaybeCredentials): boolean {
    return emailPattern.test(credentials.email);
  }

  static from(credentials: MaybeCredentials): Credentials {
    if (!Credentials.hasEmail(credentials)) {
      throw new TypeError(`Email is required`);
    }

    if (!Credentials.isEmailValid(credentials)) {
      throw new TypeError(`${credentials.email} is not valid email`);
    }

    if (!Credentials.hasPassword(credentials)) {
      throw new TypeError(`Password is required`);
    }

    return new Credentials(credentials.email, credentials.password);
  }

  protected readonly _credentials = Symbol("credentials");

  protected constructor(public readonly email: string, public readonly password: string) {}
}
