import { MOCK_ITEMS } from "../mock/mockTransfers";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchNewsAsync() {
    await delay(400);

    // sort by date desc
    return [...MOCK_ITEMS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
