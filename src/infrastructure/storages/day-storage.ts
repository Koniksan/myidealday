export interface StoredTask {
    label: string;
    checked: boolean;
}

type DayKey = string; // "YYYY-MM-DD"

const STORAGE_KEY = "myidealday:tasks";

const toDayKey = (year: number, month: number, day: number): DayKey =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const readAll = (): Record<DayKey, StoredTask[]> => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const writeAll = (data: Record<DayKey, StoredTask[]>): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadTasks = (year: number, month: number, day: number): StoredTask[] => {
    const key = toDayKey(year, month, day);
    return readAll()[key] ?? [];
};

export const saveTasks = (year: number, month: number, day: number, tasks: StoredTask[]): void => {
    const key = toDayKey(year, month, day);
    const data = readAll();
    data[key] = tasks;
    writeAll(data);
};
