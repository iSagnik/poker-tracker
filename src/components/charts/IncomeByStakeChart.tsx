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
    Legend,);

const IncomeByStakeChart = () => {
    const { gameData } = useGameData();
    const [cashGames, setCashGames] = useState<CashGame[]>([]);

    useEffect(() => {
        setCashGames(gameData.cashGameSessions)
    }, [gameData]);

    interface DataItem {
        income: number;
        date: string;
    }

    const prepareDataset = () => {
        const data: DataItem[] = [];
        let runningIncome = 0;
        cashGames.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateA.getTime() - dateB.getTime(); // Ascending order
        })

        cashGames.forEach((game) => {
            // Handle potential null/NaN for profit
            const profit = isNaN(game.profit) ? 0 : game.profit;
            runningIncome += profit;

            // Format date (you might want a custom date formatting function)
            const date = game.date ? new Date(game.date).toDateString() : "";

            data.push({
                income: runningIncome,
                date,
            });
        });
        return data
    }

    const prepareData = () => {
        const dataPoints = prepareDataset();
        const data = {
            labels: dataPoints.map((item) => item.date),
            datasets: [{
                label: 'Income',
                data: dataPoints.map((item) => item.income),
                borderColor: gameData.gameStats.income > 0 ? 'rgb(53, 162, 235)' : 'red',
                backgroundColor: gameData.gameStats.income > 0 ? 'rgb(53, 162, 235)' : 'red',
            }]
        };
        return data;
    }

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest'
        },
        plugins: {
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