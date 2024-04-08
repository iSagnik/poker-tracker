import { useState, useEffect } from 'react';
import { CashGame } from "../../data_model/dataModel.ts"
import { useGameData } from '../gameDataContext.tsx';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    Colors,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Colors,);

const IncomeByStakeChart = () => {
    const { gameData } = useGameData();
    const [cashGames, setCashGames] = useState<CashGame[]>([]);

    useEffect(() => {
        setCashGames(gameData.cashGameSessions)
    }, [gameData]);

    interface DataItem {
        stake: string,
        income: number;
        date: string;
    }

    const prepareDataset = () => {
        const dataPointsMap: { [key: string]: DataItem[] } = {};
        const datesSet = new Set()
        cashGames.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateA.getTime() - dateB.getTime(); // Ascending order
        })

        cashGames.forEach((game) => {
            const stake = `${game.stake.smallBlind}/${game.stake.bigBlind}${game.stake.ante > 0 ? `/${game.stake.ante}` : ""}`;
            if (!dataPointsMap[stake]) {
                dataPointsMap[stake] = []
            }
            // Handle potential null/NaN for profit
            const profit = isNaN(game.profit) ? 0 : game.profit;
            const lastIncome = dataPointsMap[stake][dataPointsMap[stake].length - 1]?.income ?? 0;

            // Format date (you might want a custom date formatting function)
            const date = game.date ? new Date(game.date).toDateString() : "";

            dataPointsMap[stake].push({
                stake,
                income: profit + lastIncome,
                date,
            });
            if (!datesSet.has(date)) {
                datesSet.add(date)
            }
        });
        const dates = Array.from(datesSet)
        return { dataPointsMap, dates }
    }

    const prepareData = () => {
        const { dataPointsMap, dates } = prepareDataset();

        const datasets = []

        for (const stake in dataPointsMap) {
            const datasetItem = {
                label: stake,
                data: dataPointsMap[stake].map((item) => item.income)
            }
            datasets.push(datasetItem)
        }

        // console.log(datasets)

        const data = {
            labels: dates,
            datasets: datasets
        }

        console.log(data)

        return data;
    }

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest'
        },
        plugins: {
            colors: {
                forceOverride: true
            },
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Income over time by stake',
            },
            datalabels: {
                display: true,
                align: "top",
                formatter: (val: number) => val.toFixed(2)
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Income"
                }
            }
        }
    };

    return (
        <>
            <div className="chart-container" style={{ position: 'relative', height: '40vh', width: '80vw' }}>
                <Line
                    options={options}
                    data={prepareData()}
                />
            </div>
        </>
    )

}

export default IncomeByStakeChart