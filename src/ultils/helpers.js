import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineFeedback, MdOutlineSettings } from "react-icons/md";

const googleProider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithRedirect(auth, googleProider).then((useCred) => {
    window.location.reload();
  });
};

export const signOutAction = async () => {
  await auth.signOut().then(() => {
    localStorage.removeItem("user");
    window.location.reload();
  });
};

export const Menus = [
  {
    id: uuidv4(),
    icon: <MdOutlineFeedback />,
    name: "Feedbacks",
    uri: "/feedback",
  },
  {
    id: uuidv4(),
    icon: <MdOutlineSettings />,
    name: "Settings",
    uri: "/setting/profile",
  },
];
