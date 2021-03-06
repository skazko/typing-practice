import Services from "../services";
import { navigate } from "@reach/router";
import { useContext, useEffect } from "react";
import { LogedInActionType, LogedInUser } from "../providers/loged-in-user";
import type { User } from "../entities/user";
import { MaybeCredentials, Credentials } from "../entities/credentials";

export default function useLogin(credentials: MaybeCredentials | null): User | null {
  const { loginService } = useContext(Services);
  const { dispatch, state = { user: null } } = useContext(LogedInUser);

  useEffect(() => {
    if (!credentials || !dispatch) {
      return;
    }

    try {
      loginService
        .login(Credentials.from(credentials))
        .then((user: User) => dispatch!({ type: LogedInActionType.LOG_IN, payload: user }))
        .then(() => navigate("/"))
        .catch((e) => alert(e.message));
    } catch (e) {
      alert(e.message);
    }
  }, [credentials, dispatch]);

  return state.user;
}
