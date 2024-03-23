import { useState } from 'react';
import { GameType, LimitType } from "../data_model/enums.ts"
import { CashGame, Player, User } from "../data_model/dataModel.ts"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useGameData } from './gameDataContext.tsx';
import { v4 as uuidv4 } from 'uuid';
import { updateGameStats } from '../util/util.tsx'
import { Cancel } from '@mui/icons-material';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';

const AddCashGameForm = ({ setShowForm, setShowSuccess }: any) => {
    const { gameData, setGameData } = useGameData();
    const [gameType, setGameType] = useState(GameType.TEXAS_HOLD_EM);
    const [stake, setStake] = useState({
        smallBlind: 0,
        bigBlind: 0,
        ante: 0,
    });
    const [limitType, setLimitType] = useState(LimitType.NO_LIMIT);
    const [fixedLimit, setFixedLimit] = useState(0);
    const [location, setLocation] = useState('');
    const [buyIn, setBuyIn] = useState(0);
    const [cashedOut, setCashedOut] = useState(0);
    const [playerCount, setPlayerCount] = useState(0);
    const [players, setPlayers] = useState<Player[]>([]);
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);
    const [durationMinutes, setDurationMinutes] = useState(0);
    const [notes, setNotes] = useState('');
    const [showFixedLimit, setShowFixedLimit] = useState(false);

    const handleLimitChange = (event: any) => {
        setLimitType(event.target.value)
        if (event.target.value === LimitType.FIXED_LIMIT) {
            setShowFixedLimit(true)
        }
        else {
            setShowFixedLimit(false)
            setFixedLimit(0)
        }
    }

    const handleGameTypeChange = (event: any) => {
        setGameType(event.target.value)
    }

    const handleStartTimeChange = (newStartTime: Dayjs | null) => {
        setStartTime(newStartTime)
        if (!endTime) {
            return;
        }
        const durationMinutes: number = ((endTime!.diff(newStartTime) / 1000) / 60) // milliseconds to minutes
        setDurationMinutes(durationMinutes)
    }

    const handleEndTimeChange = (newEndTime: Dayjs | null) => {
        setEndTime(newEndTime)
        if (!startTime) {
            return
        }
        const durationMinutes: number = ((newEndTime!.diff(startTime) / 1000) / 60) // milliseconds to minutes
        setDurationMinutes(durationMinutes)
    }

    const handleSmallBlindChange = (value: number | null) => {
        if (!value) {
            value = 0
        }
        setStake({ smallBlind: value, bigBlind: stake.bigBlind, ante: stake.ante })
    }

    const handleBigBlindChange = (value: number | null) => {
        if (!value) {
            value = 0
        }
        setStake({ smallBlind: stake.smallBlind, bigBlind: value, ante: stake.ante })
    }

    const handleAnteChange = (value: number | null) => {
        if (!value) {
            value = 0
        }
        setStake({ smallBlind: stake.smallBlind, bigBlind: stake.bigBlind, ante: value })
    }

    const [newPlayerName, setNewPlayerName] = useState('');

    const addPlayer = () => {
        if (!newPlayerName) {
            return;
        }
        setPlayers([...players, { name: newPlayerName }]);
        setNewPlayerName('');
    };

    const removePlayer = (index: number) => {
        const updatedPlayers = [...players];
        updatedPlayers.splice(index, 1);
        setPlayers(updatedPlayers);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const gameDate: Date | undefined = date?.toDate();
        const gameStartTime: Date | undefined = startTime?.toDate();
        const gameEndTime: Date | undefined = endTime?.toDate();
        const id: string = Date.now().toString() + '-' + uuidv4();
        // Validate times and durations.
        if (buyIn <= 0) {
            alert("Buy in must be greater than 0");
            return;
        }
        const profit = cashedOut - buyIn

        let cashGame: CashGame = {
            id,
            gameType,
            stake,
            limitType,
            fixedLimit,
            location,
            buyIn,
            cashedOut,
            profit,
            playerCount,
            players,
            date: gameDate,
            startTime: gameStartTime,
            endTime: gameEndTime,
            durationMinutes,
            notes
        }
        let currentGameData: User = gameData
        currentGameData.cashGameSessions.push(cashGame)
        currentGameData.gameStats = updateGameStats(currentGameData)
        setGameData(currentGameData)
        setShowSuccess(true)
        setShowForm(false)
    };

    return (
        <>
            <Button variant="outlined" onClick={() => setShowForm(false)}>
                Cancel
            </Button>
            <FormContainer onSubmit={handleSubmit}>
                <FormFieldContainer>
                    <InputLabel id="game-type-label">Game Type</InputLabel>
                    <Select name="gameType"
                        required
                        value={gameType}
                        onChange={(event) => handleGameTypeChange(event)}>
                        <MenuItem value={GameType.TEXAS_HOLD_EM}>Texas Hold'em Poker</MenuItem>
                        <MenuItem value={GameType.OMAHA}>Omaha</MenuItem>
                        <MenuItem value={GameType.HORSE}>Horse</MenuItem>
                        <MenuItem value={GameType.SEVEN_CARD_STUD}>7 Card Stud</MenuItem>
                        <MenuItem value={GameType.SEVEN_CARD_STUD_EIGHT}>7 Card Stud 8</MenuItem>
                    </Select>
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Stake</InputLabel>
                    <label htmlFor="smallBlind">Small Blind</label>
                    <Autocomplete
                        id='small-blind-input'
                        freeSolo
                        options={stakeValueOptions.map((option) => String(option.value))}
                        onChange={(event, value) => handleSmallBlindChange(Number(value))}
                        renderInput={(params) => <TextField {...params} label="Small Blind" />}
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <label htmlFor="bigBlind">Big Blind</label>
                    <Autocomplete
                        id='big-blind-input'
                        freeSolo
                        options={stakeValueOptions.map((option) => String(option.value))}
                        onChange={(event, value) => handleBigBlindChange(Number(value))}
                        renderInput={(params) => <TextField {...params} label="Big Blind" />}
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <label htmlFor="ante">Ante</label>
                    <Autocomplete
                        id='ante-input'
                        freeSolo
                        options={stakeValueOptions.map((option) => String(option.value))}
                        onChange={(event, value) => handleAnteChange(Number(value))}
                        renderInput={(params) => <TextField {...params} label="Ante" />}
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Limit Type</InputLabel>
                    <Select
                        required
                        name="limitType"
                        value={limitType}
                        onChange={(event) => handleLimitChange(event)}
                    >
                        <MenuItem value={LimitType.NO_LIMIT}>No Limit</MenuItem>
                        <MenuItem value={LimitType.FIXED_LIMIT}>Fixed Limit</MenuItem>
                        <MenuItem value={LimitType.POT_LIMIT}>Pot Limit</MenuItem>
                        <MenuItem value={LimitType.POT_LIMIT_PRE}>Pot Limit Preflop</MenuItem>
                        <MenuItem value={LimitType.MIXED_LIMIT}>Mixed Limit</MenuItem>
                        <MenuItem value={LimitType.SPREAD_LIMIT}>Spread Limit</MenuItem>
                    </Select>
                </FormFieldContainer>
                <FormFieldContainer>
                    {showFixedLimit && (
                        <>
                            <InputLabel>Fixed Limit</InputLabel>
                            <TextField
                                name="fixedLimit"
                                value={fixedLimit}
                                onChange={(event) => setFixedLimit(Number(event.target.value))}
                                type="number"
                            />
                        </>)}
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Location</InputLabel>
                    <TextField
                        required
                        name="location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Buy In</InputLabel>
                    <TextField
                        required
                        name="buyIn"
                        value={buyIn}
                        type="number"
                        onChange={(event) => setBuyIn(Number(event.target.value))}
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Cashed Out</InputLabel>
                    <TextField
                        required
                        name="cashedOut"
                        value={cashedOut}
                        onChange={(event) => setCashedOut(Number(event.target.value))}
                        type="number"
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Player Count</InputLabel>
                    <TextField
                        name="playerCount"
                        value={playerCount}
                        onChange={(event) => setPlayerCount(Number(event.target.value))}
                        type="number"
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Players</InputLabel>
                    <List>
                        {players.map((player, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={player.name} />
                                <Button startIcon={<Cancel onClick={() => {
                                    removePlayer(index)
                                }} />}></Button>
                            </ListItem>
                        ))}
                    </List>
                    <TextField
                        label="Add player"
                        value={newPlayerName}
                        onChange={(event) => setNewPlayerName(event.target.value)}
                    />
                    <Button onClick={addPlayer} disabled={players.length >= playerCount}>Add</Button>
                </FormFieldContainer>
                <FormFieldContainer>
                    <DatePicker label="Date" value={date} onChange={(newDate) => setDate(newDate)} />
                </FormFieldContainer>
                <FormFieldContainer>
                    <TimePicker
                        label="Start Time"
                        value={startTime}
                        onChange={(newStartTime) => handleStartTimeChange(newStartTime)}
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <TimePicker
                        label="End Time"
                        value={endTime}
                        onChange={(newEndTime) => handleEndTimeChange(newEndTime)}
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Duration (Minutes)</InputLabel>
                    <TextField
                        disabled={startTime !== null && endTime !== null}
                        name="durationMinutes"
                        value={durationMinutes}
                        onChange={(event) => setDurationMinutes(Number(event.target.value))}
                        type="number"
                    />
                </FormFieldContainer>
                <FormFieldContainer>
                    <InputLabel>Notes</InputLabel>
                    <TextareaAutosize name="notes" value={notes} minRows={5} onChange={(event) => setNotes(event.target.value)} />
                </FormFieldContainer>
                <Button variant="contained" type="submit">Submit</Button>
                <Button variant="outlined" onClick={() => setShowForm(false)}>
                    Cancel
                </Button>
            </FormContainer >
        </>
    )
}

const FormContainer = styled(Container)`
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 600px;
  padding: 25px;
`;

const FormFieldContainer = styled(Box)`
padding: 10px;
max-width: 20vw;
margin: 0 auto
`

const stakeValueOptions = [
    { value: 0.05 },
    { value: 0.1 },
    { value: 0.20 },
    { value: 0.25 },
    { value: 0.50 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 5 },
]

export default AddCashGameForm;
