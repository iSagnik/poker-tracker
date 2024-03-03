import { useState, ChangeEvent } from 'react';
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

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [gameData, setGameData] = useState<User>(getEmptyUserData());

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
    console.log(JSON.stringify(gameData))

  }

  const handleSave = () => {
    console.log(gameData)
    exportToJson(gameData)
  }

  const showLandingPage = () => {
    return !(showForm === true || showAllGames === true || showReport === true);
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
            {showForm && <AddCashGameForm setShowForm={setShowForm} />}
            {showAllGames && <AllGames setShowAllGames={setShowAllGames} />}
            {showReport && <Report setShowReport={setShowReport} />}
          </Container>
        </>
      </LocalizationProvider>
    </GameDataContext.Provider>
  )
}

export default App
