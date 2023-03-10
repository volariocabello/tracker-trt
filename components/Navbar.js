import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase";

export default function Navbar() {
	const auth = getAuth(app);
	const [user, loading] = useAuthState(auth);

	const handleSignOut = async () => {
		await signOut(auth);
	};
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" className="bg-gray-600">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						yeahbuddy
					</Typography>
					{!user && (
						<Link href="/login">
							<Button color="inherit">Login</Button>
						</Link>
					)}
					{user && (
						<Button color="inherit" onClick={handleSignOut}>
							Logout
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
