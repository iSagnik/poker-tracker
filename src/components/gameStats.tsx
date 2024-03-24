import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { GameStats } from '../data_model/dataModel.ts'
import { useGameData } from './gameDataContext.tsx';

const style = {
    py: 0,
    width: '100%',
    backgroundColor: 'background.paper',
};

const GameStatsCard = () => {
    const { gameData } = useGameData();
    const [gameStats, setGameStats] = useState<GameStats | null>(null);

    useEffect(() => {
        setGameStats(gameData.gameStats)
    }, [gameData]);

    const profitColour = (value: number | null) => {
        let profitColour = "gray"
        if (value && value > 0) {
            profitColour = "green"
        }
        else if (value && value < 0) {
            profitColour = "red"
        }
        return profitColour
    }

    const convertMinutesToHoursAndMinutes = (totalMinutes: number | null): string => {
        let hours = 0
        let minutes = 0
        if (totalMinutes) {
            hours = Math.floor(totalMinutes / 60);
            minutes = totalMinutes % 60;
        }

        return `${hours} hour(s) and ${minutes} minute(s)`;
    }

    return (
        <>
            <List sx={style}>
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography variant="h5"
                                style={{ color: profitColour(gameStats && gameStats.income) }}>{"$" + gameStats?.income.toFixed(2)}
                            </Typography>}
                        secondary="Income" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography variant="h5"
                                style={{ color: profitColour(gameStats && gameStats.hourlyIncome) }}>{"$" + gameStats?.hourlyIncome.toFixed(2)}
                            </Typography>}
                        secondary="Hourly Income" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography variant="h5"
                                style={{ color: profitColour(gameStats && gameStats.sessionlyIncome) }}>{"$" + gameStats?.sessionlyIncome.toFixed(2)
                                }</Typography>}
                        secondary="Income per session" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText
                        primary={convertMinutesToHoursAndMinutes(gameStats && gameStats.durationMinutes)}
                        secondary="Duration" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemText
                        primary={(gameStats && (gameStats.cashedCount / gameStats.sessionCount * 100) || 0) + "% (" + gameStats?.cashedCount + "/" + gameStats?.sessionCount + ")"}
                        secondary="Cashed rate" />
                </ListItem>
            </List >
        </>
    )

}

export default GameStatsCard