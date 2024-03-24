import { Fragment, useState, useEffect } from 'react';
import { useGameData } from './gameDataContext.tsx';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Delete } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { CashGame, User } from "../data_model/dataModel.ts"
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CashGameCard from './cashGameCard.tsx'
import { updateGameStats } from '../util/util.tsx'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const AllGames = ({ setShowAllGames }: any) => {
    const { gameData, setGameData } = useGameData();
    const [editIcon, setEditIcon] = useState(false);
    const [cashGames, setCashGames] = useState<CashGame[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCard, setCurrentCard] = useState<CashGame | null>(null);
    const [showGameCard, setShowGameCard] = useState(false);
    const [sort, setSort] = useState<string>("Newest");
    const [showSortOptions, setShowSortOptions] = useState(false);

    useEffect(() => {
        setCashGames(gameData.cashGameSessions)
    }, [gameData]); // Dependency array: useEffect runs when myStateVariable changes


    const toggleEdit = () => {
        setEditIcon(!editIcon)
    }

    const toggleSortOptions = () => {
        setShowSortOptions(!showSortOptions)
    }

    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

    const handleDelete = () => {
        if (currentCard === null) {
            alert("Error: Could not delete cash game.");
            return;
        }
        const updatedcashGames: CashGame[] = gameData.cashGameSessions.filter((cashGame) => cashGame.id !== currentCard.id);
        let updatedGameData: User = gameData;
        updatedGameData.cashGameSessions = updatedcashGames
        updatedGameData.gameStats = updateGameStats(updatedGameData)
        setGameData(updatedGameData)
        setCashGames(updatedGameData.cashGameSessions)
        localStorage.setItem("gameData", JSON.stringify(gameData));
        setCurrentCard(null)
    }

    const CardData = ({ cardData }: any) => {
        const profit: number = cardData.profit;
        let profitColour = "gray"
        if (profit > 0) {
            profitColour = "green"
        }
        else if (profit < 0) {
            profitColour = "red"
        }

        return (
            <Fragment>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {new Date(cardData.date).toDateString()}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {cardData.location}{bull}<span style={{ color: profitColour }}>${profit.toFixed(2)}</span>
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {cardData.gameType}
                    </Typography>

                    <Typography variant="body2">
                        <>${cardData.stake?.smallBlind.toFixed(2)} / ${cardData.stake?.bigBlind.toFixed(2)} / ${cardData.stake?.ante.toFixed(2)}</>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => {
                        setCurrentCard(cardData)
                        setShowGameCard(true)
                    }}>Details</Button>
                    {editIcon && (<Button size="small" startIcon={<Delete onClick={() => {
                        setOpenDialog(true)
                        setCurrentCard(cardData)
                    }} sx={{ color: red[500] }} />}></Button>)}
                    <DeleteDialog setOpenDialog={setOpenDialog} openDialog={openDialog} onConfirm={handleDelete} />
                </CardActions>
            </Fragment>
        )
    }

    const DeleteDialog = ({ setOpenDialog, openDialog, onConfirm }: any) => {
        return (
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete cash game at " + currentCard?.location + "?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={() => { setOpenDialog(false); onConfirm(); }} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const sortCashGames = (cashGames: CashGame[], sortType: string): CashGame[] => {
        return cashGames.sort((a, b) => {
            if (sortType === "Highest") {
                return b.profit - a.profit;
            }
            else if (sortType === "Lowest") {
                return a.profit - b.profit;
            }
            else {
                if (!a.date || !b.date) {
                    return 0;
                }
                const dateA: Date = new Date(a.date)
                const dateB: Date = new Date(b.date)
                if (sortType === "Oldest") {
                    return dateA.getTime() - dateB.getTime(); // Oldest first
                } else {
                    return dateB.getTime() - dateA.getTime(); // Newest first - default
                }
            }
        });
    };

    return (
        <Box>
            <Button variant="outlined" onClick={() => setShowAllGames(false)}>
                Back
            </Button>
            {
                cashGames && cashGames.length === 0 && (
                    <Box>No Games</Box>
                )
            }
            {
                cashGames && cashGames.length > 0 && (
                    <Button variant="outlined" onClick={() => toggleEdit()}>
                        {
                            editIcon ? <>Done</> : <>Edit</>
                        }
                    </Button>
                )
            }
            {
                cashGames && cashGames.length > 0 && (
                    <Button variant="outlined" onClick={() => toggleSortOptions()}>
                        {
                            showSortOptions ? <>Close Sort</> : <>Sort</>
                        }
                    </Button>
                )
            }
            {cashGames && cashGames.length > 0 && showSortOptions && (
                <Box display={'flex'} justifyContent={'center'}>
                    <FormControl>
                        <FormLabel>Sort by Date</FormLabel>
                        <RadioGroup
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            name="radio-buttons-group"
                            row
                        >
                            <FormControlLabel value="Newest" control={<Radio />} label="Newest" />
                            <FormControlLabel value="Oldest" control={<Radio />} label="Oldest" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Sort by Profit</FormLabel>
                        <RadioGroup
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            name="radio-buttons-group"
                            row
                        >
                            <FormControlLabel value="Highest" control={<Radio />} label="Highest" />
                            <FormControlLabel value="Lowest" control={<Radio />} label="Lowest" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            )
            }
            <Stack spacing={2}>
                {cashGames && sortCashGames(cashGames, sort).map((cardData: CashGame, index) => (
                    <Card key={index} variant="outlined" >
                        {
                            cardData && (<CardData cardData={cardData} />)
                        }
                    </Card>
                ))}
            </Stack>
            {showGameCard && <CashGameCard cashGame={currentCard} showGameCard={showGameCard} setShowGameCard={setShowGameCard} />}
        </Box>
    )
}

export default AllGames

