export const generateNextDays = (days) => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const day = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
        const dateNum = d.getDate().toString().padStart(2, "0");
        const fullDate = d.toLocaleDateString("en-US", { weekday: "long" }) + " Schedule";
        const isoDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        list.push({ day, date: dateNum, fullDate, isoDate });
    }
    return list;
};
