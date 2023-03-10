import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { runTransaction } from "firebase/firestore";
import {
	Typography,
	Container,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Paper,
	Modal,
	Box,
	IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
	addDoc,
	onSnapshot,
	query,
	updateDoc,
	doc,
	deleteDoc,
	collection,
} from "firebase/firestore";
import { db } from "@/firebase";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [logs, setLogs] = useState([]);
	const [vials, setVials] = useState([]);
	const [compound, setCompound] = useState("");
	const [ester, setEster] = useState("");
	const [dosageMg, setDosageMg] = useState("");
	const [dosageMl, setDosageMl] = useState("");
	const [brand, setBrand] = useState("");
	const [area, setArea] = useState("");
	const [value, setValue] = useState(null);
	const [showAddLogArea, setShowAddLogArea] = useState(false);

	const handleShowLogArea = () => {
		setShowAddLogArea(true);
	};

	//add shot log
	const handleAddLog = async (e) => {
		const sfDocRef = doc(db, "vials", "MhWhwXbXVYw0MR3MkGGc");
		setShowAddLogArea(false);
		e.preventDefault();
		await addDoc(collection(db, "logs"), {
			compound: compound,
			ester: ester,
			dosageMg: dosageMg,
			dosageMl: dosageMl,
			brand: brand,
			area: area,
			date: new Date(value).toLocaleDateString("en-gb", {
				year: "numeric",
				month: "numeric",
				day: "numeric",
			}),
		});

		try {
			await runTransaction(db, async (transaction) => {
				const sfDoc = await transaction.get(sfDocRef);
				if (!sfDoc.exists()) {
					throw "Document does not exist!";
				}

				const newTotalMg = sfDoc.data().totalMg - parseInt(dosageMg);
				transaction.update(sfDocRef, { totalMg: newTotalMg });
			});
			console.log("Transaction successfully committed!");
		} catch (e) {
			console.log("Transaction failed: ", e);
		}

		return;
	};

	//read shot logs
	useEffect(() => {
		const q = query(collection(db, "logs"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let logsArray = [];
			querySnapshot.forEach((doc) => {
				logsArray.push({ ...doc.data(), id: doc.id });
			});
			setLogs(logsArray);
		});
		return () => unsubscribe();
	}, []);

	// read vial logs
	useEffect(() => {
		const q = query(collection(db, "vials"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let vialsArray = [];
			querySnapshot.forEach((doc) => {
				vialsArray.push({ ...doc.data(), id: doc.id });
			});
			setVials(vialsArray);
		});
		return () => unsubscribe();
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Container maxWidth="xl" className="flex flex-row pt-20">
				<Container
					maxWidth="xs"
					className="bg-white flex flex-col justify-center items-center shadow-md rounded-xl w-[250px] h-[200px]"
				>
					<Typography>Your active vial</Typography>
					<Container className="flex flex-col items-center">
						{vials.map((vial) => {
							return (
								<>
									<p>{vial.name}</p>
									<p>{vial.totalMg}</p>
								</>
							);
						})}
					</Container>
				</Container>
				<Container
					maxWidth="lg"
					className="bg-white pb-10 flex justify-center flex-col items-center shadow-md rounded-xl ml-10"
				>
					<Typography className="text-xl pt-10">TRT Tracker Raw</Typography>

					<Container className="logListHolder mb-10 mt-10">
						<Paper elevation={0} className="flex text-center border-b">
							<Container>
								<Typography className="font-bold">Compound</Typography>
							</Container>
							<Container>
								<Typography className="font-bold">Ester</Typography>
							</Container>
							<Container>
								<Typography className="font-bold">Dosage (mg)</Typography>
							</Container>
							<Container>
								<Typography className="font-bold">Dosage (ml)</Typography>
							</Container>
							<Container>
								<Typography className="font-bold">Brand</Typography>
							</Container>
							<Container>
								<Typography className="font-bold">Area</Typography>
							</Container>
							<Container>
								<Typography className="font-bold">Area</Typography>
							</Container>
						</Paper>
						{logs.map((log) => {
							return (
								<Paper elevation={0} className="flex text-center border-b p-1">
									<Container className="">{log.compound}</Container>
									<Container className="">{log.ester}</Container>
									<Container className="">{log.dosageMg}</Container>
									<Container className="">{log.dosageMl}</Container>
									<Container className="">{log.brand}</Container>
									<Container className="">{log.area}</Container>
									<Container className="">{log.date}</Container>
								</Paper>
							);
						})}
					</Container>

					{showAddLogArea && (
						<Container className="inputsWrapper flex justify-between flex-wrap">
							<TextField
								className="w-[150px]"
								label="Compound"
								variant="outlined"
								type="text"
								onChange={(e) => setCompound(e.target.value)}
							/>
							<TextField
								className="w-[150px]"
								label="Ester"
								variant="outlined"
								type="text"
								onChange={(e) => setEster(e.target.value)}
							/>

							<TextField
								className="w-[120px]"
								label="Dosage (mg)"
								variant="outlined"
								type="number"
								onChange={(e) => setDosageMg(e.target.value)}
							/>
							<TextField
								className="w-[120px]"
								label="Dosage (ml)"
								variant="outlined"
								type="number"
								onChange={(e) => setDosageMl(e.target.value)}
							/>
							<TextField
								className="w-[150px]"
								label="Brand"
								variant="outlined"
								type="text"
								onChange={(e) => setBrand(e.target.value)}
							/>
							<TextField
								className="w-[150px]"
								label="Area"
								variant="outlined"
								type="text"
								onChange={(e) => setArea(e.target.value)}
							/>

							<DatePicker
								className="w-[170px]"
								label="Select date"
								value={value}
								onChange={(newValue) => setValue(newValue)}
							/>
							<Container className="flex justify-center">
								<IconButton aria-label="add-log" onClick={handleAddLog}>
									<CheckOutlinedIcon fontSize="large" />
								</IconButton>
								<IconButton
									aria-label="add-log"
									onClick={() => setShowAddLogArea(false)}
								>
									<CloseOutlinedIcon fontSize="large" />
								</IconButton>
							</Container>
						</Container>
					)}
					{!showAddLogArea && (
						<Button variant="outlined" onClick={handleShowLogArea}>
							NEW LOG
						</Button>
					)}
				</Container>
			</Container>
		</LocalizationProvider>
	);
}