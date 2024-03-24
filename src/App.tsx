import { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import './App.css'
import AddCashGameForm from './components/addCashGame.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Upload } from '@mui/icons-material';
import { User } from './data_model/dataModel.ts'
import GameDataContext from './components/gameDataContext.tsx';
import { getEmptyUserData, exportToJson, handleFileUploadHelper } from './util/util.tsx'
import AllGames from './components/allGames.tsx'
import Report from './components/report.tsx'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [gameData, setGameData] = useState<User>(getEmptyUserData());
  const [showSuccess, setShowSuccess] = useState(false);
  const [filename, setFilename] = useState("");
  const [cachedGameData, setCachedGameData] = useState<User | null>(null);

  useEffect(() => {
    // Check if cached data is available
    if (localStorage.getItem("gameData")) {
      try {
        const cacheData = localStorage.getItem("gameData");
        if (!cacheData) {
          return;
        }
        const data: User = JSON.parse(cacheData)
        setCachedGameData(data);
      } catch (error) {
        console.error("Error parsing cached game data", error);
      }
    }
  }, []);

  useEffect(() => {
    if (cachedGameData) {
      setGameData(cachedGameData);
      setFilename("Cache")
      setCachedGameData(null);
    }
  }, [cachedGameData]);

  const handleAddCashGame = () => {
    setShowForm(true);
  };

  const handleAllGames = () => {
    setShowAllGames(true)
  }

  const handleReport = () => {
    setShowReport(true)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileUploadHelper(e, setGameData, setFilename)
    setShowSuccess(true)
  }

  const handleSave = () => {
    console.log(gameData)
    localStorage.setItem("gameData", JSON.stringify(gameData));
    try {
      exportToJson(gameData)
      setShowSuccess(true)
    }
    catch (error) {
      alert("Error: " + error)
    }
  }

  const showLandingPage = () => {
    return !(showForm === true || showAllGames === true || showReport === true);
  }

  const closeSuccess = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccess(false);
  }

  const largerScreen = useMediaQuery('(min-width: 600px)');

  return (
    <GameDataContext.Provider value={{ gameData, setGameData }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <>
          <MainContainer>
            <Box display="flex" justifyContent="center">
              <img src="/src/assets/logo.png" alt="PokerTrackerLogo" width="70" height="50" style={{ marginTop: "8px" }} />
              <h1>PokerTracker</h1>
            </Box>
            {
              showLandingPage() && (
                <>
                  <Stack direction={largerScreen ? "row" : "column"} justifyContent="center"
                    alignItems="center">
                    <Button onClick={handleAddCashGame}>Add Cash Game</Button>
                    <Button onClick={handleAllGames}>All Games</Button>
                    <Button onClick={handleReport}>Report</Button>
                    <Button onClick={handleSave}>Save Data</Button>
                  </Stack>
                  <Button
                    component="label"
                    variant="contained"
                    color="primary"
                    startIcon={<Upload />}
                  >
                    Upload Data
                    <input type="file" accept="text/plain,application/json" hidden onChange={handleFileUpload} />
                  </Button>
                  {filename !== "" && <span style={{ opacity: "0.6" }}>Data loaded from {filename}</span>}
                </>
              )
            }
            {showForm && <AddCashGameForm setShowForm={setShowForm} setShowSuccess={setShowSuccess} />}
            {showAllGames && <AllGames setShowAllGames={setShowAllGames} />}
            {showReport && <Report setShowReport={setShowReport} />}
          </MainContainer>
          <Snackbar open={showSuccess} autoHideDuration={1500} onClose={closeSuccess}>
            <Alert
              onClose={closeSuccess}
              severity="success"
              variant="filled"
              sx={{ width: '100%' }}
            >
              Success!
            </Alert>
          </Snackbar>
        </>
      </LocalizationProvider>
    </GameDataContext.Provider>
  )
}

const MainContainer = styled(Container)`
margin: 0 auto;
max-width: 100%;
`;

export default App
