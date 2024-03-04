import { ChangeEvent } from 'react';
import { User } from '../data_model/dataModel.ts'

export const getEmptyUserData = () => {
    return {
        username: "",
        cashGameSessions: [],
        gameStats: {
            income: 0,
            hourlyIncome: 0,
            sessionlyIncome: 0,
            durationMinutes: 0,
            cashedRate: 0
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


export const handleFileUploadHelper = (e: ChangeEvent<HTMLInputElement>, setGameData: (gameData: User) => void) => {
    if (!e.target.files) {
        return;
    }
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (evt) => {
        if (!evt?.target?.result) {
            return;
        }
        const { result } = evt.target;
        // Read result
        try {
            const user: User = JSON.parse(result as string);
            setGameData(user)
        }
        catch (error) {
            alert("Error: " + error)
            setGameData(getEmptyUserData())
        }
    };
    reader.readAsBinaryString(file);
};