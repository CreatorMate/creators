export function sortByKey<T>(list: T[], key: keyof T, desc: boolean = false, limit?: number) {
    const sortedList = list.slice().sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (valueA < valueB) return desc ? 1 : -1;
        if (valueA > valueB) return desc? -1 : 1;
        return 0;
    });

    return limit ? sortedList.slice(0, limit) : sortedList
}
export function sortKeyValueObject<T>(obj: Record<string, T>, limit?: number, descending: boolean = false): Record<string, T> {
    const sortedEntries = Object.entries(obj).sort(([, valueA], [, valueB]) => {
        if (valueA < valueB) return descending ? 1 : -1;
        if (valueA > valueB) return descending ? -1 : 1;
        return 0;
    });

    const limitedEntries = limit !== undefined ? sortedEntries.slice(0, limit) : sortedEntries;

    return Object.fromEntries(limitedEntries);
}

export function shorten(text: string, amount: number, devider: string = ' ') {
    if(!text) return text;
    const words = text.split(devider);
    let newText = '';
    for(const word of words.splice(0, amount)) {
        newText += `${word} `;
    }

    return `${newText}...`
}

export function sendTo(url: string) {
    window.open(url, '_blank')
}

export function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); //approximation
    const years = Math.floor(days / 365); //approximation

    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'less than a minute ago';
    }
}

type Success<T> = {
    data: T,
    error: null;
}

type Failure<E> = {
    data: null;
    error: E;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return {data, error: null}
    } catch (error) {
        return {data: null, error: error as E}
    }
}