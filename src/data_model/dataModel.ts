import { GameType, LimitType } from "./enums.ts"

export interface User {
    username: string,
    cashGameSessions: CashGame[]
    gameStats: GameStats
    joinDate: Date
}

export interface GameStats {
    income: number,
    hourlyIncome: number,
    sessionlyIncome: number,
    durationMinutes: number,
    cashedCount: number,
    sessionCount: number
}

export interface Stake {
    smallBlind: number,
    bigBlind: number,
    ante: number
}

export interface CashGame {
    id: string,
    gameType: GameType,
    stake: Stake,
    limitType: LimitType,
    fixedLimit: number,
    location: string,
    buyIn: number,
    cashedOut: number,
    profit: number,
    playerCount: number,
    date: Date | null | undefined,
    startTime: Date | null | undefined,
    endTime: Date | null | undefined,
    durationMinutes: number,
    notes: string
}