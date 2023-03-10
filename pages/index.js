import { useState, useEffect } from "react";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { runTransaction } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { StyledEngineProvider } from "@mui/material/styles";
import {
	Typography,
	Container,
	TextField,
	Button,
	Box,
	IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
	addDoc,
	onSnapshot,
	query,
	doc,
	deleteDoc,
	collection,
} from "firebase/firestore";
import { db } from "@/firebase";

const columns = [
	{ field: "id", headerName: "ID", width: 70 },
	{ field: "compound", headerName: "Compound", width: 130 },
	{ field: "ester", headerName: "Ester", width: 130 },
	{ field: "dosageMg", headerName: "Dosage (mg)", width: 130 },
	{ field: "dosageMl", headerName: "Dosage (ml)", width: 130 },
	{ field: "brand", headerName: "Brand", width: 130 },
	{ field: "area", headerName: "Area", width: 130 },
	{ field: "date", headerName: "Date", width: 130 },
];

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
	const [selectedRow, setSelectedRow] = useState([]);

	const handleShowLogArea = () => {
		setShowAddLogArea(true);
	};

	const handleLogDelete = async () => {
		await deleteDoc(doc(db, "logs", selectedRow));
		setSelectedRow([]);
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
		<StyledEngineProvider injectFirst>
			<Box className="w-full">
				<Container maxWidth="xl" className="flex flex-row pt-10">
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
						className="bg-white pb-5 flex justify-center flex-col items-center shadow-md rounded-xl ml-10"
					>
						<Typography className="text-xl pt-5 pb-5">Logger</Typography>
						<Box className="pb-5" style={{ height: 400, width: "100%" }}>
							<DataGrid
								className="w-full"
								rows={logs}
								columns={columns}
								pageSize={5}
								rowsPerPageOptions={[5]}
								onRowClick={(rows) => {
									setSelectedRow(rows.id);
								}}
								initialState={{
									pagination: { paginationModel: { pageSize: 5 } },
								}}
							/>
						</Box>
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
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										className="w-[170px]"
										label="Select date"
										value={value}
										onChange={(newValue) => setValue(newValue)}
									/>
								</LocalizationProvider>
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
						<Container className="flex justify-center">
							{!showAddLogArea && (
								<>
									<Button
										className="mr-5"
										variant="outlined"
										onClick={handleShowLogArea}
									>
										NEW LOG
									</Button>
									{selectedRow.length > 0 && (
										<Button variant="outlined" onClick={handleLogDelete}>
											DELETE LOG{" "}
										</Button>
									)}
								</>
							)}
						</Container>
					</Container>
				</Container>
			</Box>
		</StyledEngineProvider>
	);
}
