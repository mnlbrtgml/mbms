import { auth } from "@/firebase/config";
import { signOut, type User } from "firebase/auth";

interface IResponse {
  data: User | null;
  code: string;
  message: string;
}

const response: IResponse = {
  data: null,
  code: "",
  message: "",
};

async function useSignOut(): Promise<IResponse> {
  try {
    await signOut(auth).then(() => {
      response.code = "auth/sign-out-successful";
      response.message = "The user was successfully signed out.";
    });
  } catch (error: any) {
    response.code = error.code;
    response.message = error.message;
  }

  return response;
}

export default useSignOut;
