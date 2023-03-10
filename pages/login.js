import { initFirebase } from "@/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

export default function Login() {
	initFirebase();
	const provider = new GoogleAuthProvider();
	const auth = getAuth();
	const [user, loading] = useAuthState(auth);
	const router = useRouter();

	const signIn = async () => {
		await signInWithPopup(auth, provider);
	};

	if (user) {
		router.push("/dashboard");
	}

	return (
		<div className>
			<button className="border-solid border-4" onClick={signIn}>
				LOG IN WITH GOOGLE
			</button>
		</div>
	);
}
