import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    return result.user;

  } catch (error) {
    console.log(error);
    throw error;
  }
};