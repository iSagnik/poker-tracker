import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { CashGame } from "../data_model/dataModel.ts"
import { useGameData } from './gameDataContext.tsx';

const Charts = () => {
    const { gameData } = useGameData();
    const [cashGames, setCashGames] = useState<CashGame[]>([]);

    useEffect(() => {
        setCashGames(gameData.cashGameSessions)
    }, [gameData]); // Dependency array: useEffect runs when myStateVariable changes

    return (
        <>
            <LineChart
                xAxis={[
                    {
                        dataKey: 'date',
                        valueFormatter: (value: Date) => value.toLocaleDateString(),
                    },
                ]}
                series={[
                    {
                        dataKey: 'profit',
                        label: 'Cash',
                    }
                ]}
                width={500}
                height={300}
                dataset={cashGames}
            />
        </>
    )

}

export default Charts