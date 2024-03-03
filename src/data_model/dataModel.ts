import { GameType, LimitType } from "./enums.ts"

export interface User {
    username: string,
    cashGameSessions: CashGame[]
    gameStats: GameStats
    joinDate: Date
}

export interface GameStats {
    income: Number,
    hourlyIncome: Number,
    sessionlyIncome: Number,
    durationMinutes: Number,
    cashedRate: Number,
}

export interface Stake {
    smallBlind: Number,
    bigBlind: Number,
    ante: Number
}

export interface CashGame {
    id: string,
    gameType: GameType,
    stake: Stake,
    limitType: LimitType,
    fixedLimit: Number,
    location: string,
    buyIn: Number,
    cashedOut: Number,
    playerCount: Number,
    date: Date | null | undefined,
    startTime: Date | null | undefined,
    endTime: Date | null | undefined,
    durationMinutes: Number,
    notes: string
}