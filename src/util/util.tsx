import { ChangeEvent } from 'react';
import { User, GameStats } from '../data_model/dataModel.ts'

export const getEmptyUserData = () => {
    return {
        username: "",
        cashGameSessions: [],
        gameStats: {
            income: 0,
            hourlyIncome: 0,
            sessionlyIncome: 0,
            durationMinutes: 0,
            cashedCount: 0,
            sessionCount: 0
        },
        joinDate: new Date()
    }
}

export const exportToJson = (objectData: User) => {
    let filename = "export.json";
    let contentType = "application/json;charset=utf-8;";
    const nav = (window.navigator as any);
    if (window.navigator && nav.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(objectData)))], { type: contentType });
        nav.msSaveOrOpenBlob(blob, filename);
    } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}


export const handleFileUploadHelper = (e: ChangeEvent<HTMLInputElement>, setGameData: (gameData: User) => void, setFilename: any) => {
    if (!e.target.files) {
        return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setFilename(name);

    const reader = new FileReader();
    reader.onload = (evt) => {
        if (!evt?.target?.result) {
            return;
        }
        const { result } = evt.target;
        // Read result
        try {
            const user: User = JSON.parse(result as string);
            user.gameStats = updateGameStats(user)
            setGameData(user)
        }
        catch (error) {
            alert("Error: " + error)
            setGameData(getEmptyUserData())
        }
    };
    reader.readAsBinaryString(file);
};

export const updateGameStats = (user: User) => {
    const { cashGameSessions } = user;

    // Initialize stats with starting values
    const gameStats: GameStats = {
        income: 0,
        hourlyIncome: 0,
        sessionlyIncome: 0,
        durationMinutes: 0,
        cashedCount: 0,
        sessionCount: 0
    };

    let cashedCount = 0;

    // Iterate through cash game sessions
    for (const session of cashGameSessions) {
        const profit = session.profit; // May be negative
        if (session.cashedOut > 0) {
            cashedCount++;
        }
        gameStats.income += profit;
        gameStats.durationMinutes += session.durationMinutes;

    }

    // Hourly income
    if (gameStats.durationMinutes > 0) {
        gameStats.hourlyIncome = gameStats.income / (gameStats.durationMinutes / 60)
    }
    gameStats.sessionCount = cashGameSessions.length;
    // Sessionly income
    gameStats.sessionlyIncome = gameStats.income / cashGameSessions.length;

    // Calculate cashed rate
    gameStats.cashedCount = cashedCount;

    return gameStats
}