import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword, type User } from "firebase/auth";

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

async function useSignIn(email: string, password: string): Promise<IResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (userCredential) {
      response.data = userCredential.user;
      response.code = "auth/sign-in-successful";
      response.message = "The user was successfully signed in.";
    }
  } catch (error: any) {
    response.code = error.code;
    response.message = error.message;
  }

  return response;
}

export default useSignIn;
