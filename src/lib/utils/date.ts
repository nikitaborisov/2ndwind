interface FormattedDate {
    display: string;
    isLikely: boolean;
}

export function formatRaceDate(dateStr: string): FormattedDate {
    // Check if it's a likely date (has *)
    const isLikely = dateStr.includes('*');
    const cleanDate = dateStr.replace('*', '');

    // Helper to create a date in local time
    const createLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-based in JS Date
    };

    // Check if it's a date range (has /)
    if (cleanDate.includes('/')) {
        const [start, end] = cleanDate.split('/');
        const startDate = createLocalDate(start);
        const endDate = createLocalDate(start.slice(0, -end.length) + end);
        
        // If dates are in the same month, only show month once
        if (startDate.getMonth() === endDate.getMonth()) {
            return {
                display: `${startDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}—${endDate.toLocaleDateString('en-US', {day: 'numeric'})}`,
                isLikely
            };
        }
        
        // Different months, show full date for both
        return {
            display: `${startDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${endDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`,
            isLikely
        };
    }

    // Single date
    const date = createLocalDate(cleanDate);
    return {
        display: date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        isLikely
    };
} 