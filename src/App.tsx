import { useState, ChangeEvent, SyntheticEvent } from 'react';
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

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [gameData, setGameData] = useState<User>(getEmptyUserData());
  const [showSuccess, setShowSuccess] = useState(false);

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
    handleFileUploadHelper(e, setGameData)
    setShowSuccess(true)
  }

  const handleSave = () => {
    console.log(gameData)
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

  return (
    <GameDataContext.Provider value={{ gameData, setGameData }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <>
          <Container>
            <h1>PokerTracker</h1>
            {
              showLandingPage() && (
                <>
                  <Button onClick={handleAddCashGame}>Add Cash Game</Button>
                  <Button onClick={handleAllGames}>All Games</Button>
                  <Button onClick={handleReport}>Report</Button>
                  <Button onClick={handleSave}>Save Data</Button>
                  <Button
                    component="label"
                    variant="contained"
                    color="primary"
                    startIcon={<Upload />}
                  >
                    Upload Data
                    <input type="file" accept="text/plain, application/json" hidden onChange={handleFileUpload} />
                  </Button>
                </>
              )
            }
            {showForm && <AddCashGameForm setShowForm={setShowForm} setShowSuccess={setShowSuccess} />}
            {showAllGames && <AllGames setShowAllGames={setShowAllGames} />}
            {showReport && <Report setShowReport={setShowReport} />}
          </Container>
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

export default App
