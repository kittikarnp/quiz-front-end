import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScoreEntry = {
    name: string;
    score: number;
    date: string; // ISO timestamp
};

const HISTORY_KEY = 'quiz_history';
const NAME_KEY = 'player_name';

export const savePlayerName = async (name: string) => {
    await AsyncStorage.setItem(NAME_KEY, name);
};

export const getPlayerName = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(NAME_KEY);
};

export const saveScore = async (entry: ScoreEntry) => {
    const history = await getScoreHistory();
    history.unshift(entry); // เก็บล่าสุดไว้บนสุด
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // จำกัดไม่เกิน 50 รายการ
};

export const getScoreHistory = async (): Promise<ScoreEntry[]> => {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : [];
};

export const clearHistory = async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
};
