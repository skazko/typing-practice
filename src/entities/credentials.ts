import { Record, Static, String } from "runtypes";

const emailPattern = /^[\w\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export const Email = String.withConstraint((email) => emailPattern.test(email) || "Email is not correct!").withBrand(
  "email"
);
export type Email = Static<typeof Email>;

export const Password = String.withConstraint((password) => password.length > 0 || "Password is required").withBrand(
  "password"
);
export type Password = Static<typeof Password>;

export const Credentials = Record({
  email: Email,
  password: Password
})

export type Credentials = Static<typeof Credentials>