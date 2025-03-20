import { parse } from "svelte/compiler";

interface Race {
    name: string;
    date: string;  // ISO date format
    url: string;
    distances: string[]; // 5K
    abbreviation: string;  // e.g., "SE", "CC",
    org: string | null
}

const races: Race[] = [
    {
        name: "Siberian Express",
        date: "2025-01-04",
        url: "https://runsignup.com/Race/IL/Oakwood/KennekukRoadRunnersSiberianExpress",
        distances: [],
        abbreviation: "SE", 
        org: "KRR"
    },
    {
        name: "Charleston Challenge Mid-Winter Classic",
        date: "2025-02-04",
        url: "https://www.charlestonillinois.org/community/charleston_tourism/racecharleston.php",
        distances: [ "5K", "10K", "15K" ],
        abbreviation: "CC",
        org: null
    },
    {
        name: "Mountain Goat",
        date: "2025-03-15",
        url: "https://runsignup.com/Race/IL/Oakwood/34thAnnualKRRMountianGoat",
        distances: [ "5K", "10K", "15K" ],
        abbreviation: "MG",
        org: "KRR"
    },  
    {
        name: "Clinton Lake Trail Race",
        date: "2025-03-29",
        url: "https://ultrasignup.com/register.aspx?did=115494",
        distances: [ "10", "30" ],
        abbreviation: "CL",
        org: "2nd Wind"
    },
    {
        name: "Allerton Trail Run With A Really Really Really Long Name",
        date: "2025-04-05",
        url: "https://runsignup.com/Race/IL/Allerton/AllertonTrailRun",
        distances: [ "5K", "10K", "15K" ],
        abbreviation: "ATR",
        org: "KRR"
    }
];


interface RaceResult {
    race: string;  // e.g., "SE", "CC10"
    distance: string | null;
    points: number;
}

interface Participant {
    name: string;
    results: RaceResult[];
    needsToRenew: boolean;
}

interface AgeGroup {
    gender: 'Female' | 'Male';
    ageRange: {
        min: number;
        max: number | null;  // null represents no upper bound (70+)
    };
    participants: Participant[];
}



const parseResults = (summary: string): RaceResult[] => {
    if (!summary.trim()) return [];
    return summary.split(' ')
        .filter(result => result.length > 0)
        .map(result => {
            const match = result.match(/([A-Z]+)(\d*)\((\d+)\)/);
            if (!match) throw new Error(`Invalid race result format: "${result}"`);
            const race = races.find(r => r.abbreviation === match[1]);
            if (!race) throw new Error(`Race with abbreviation ${match[1]} not found`);
            const distance = match[2] ? race.distances.find(d => d.startsWith(match[2])) : null;
            if (match[2] && !distance) throw new Error(`Distance ${match[2]} not found for race ${race.name}`);
            return {
                race: race.name,
                distance: distance,
                points: parseInt(match[3])
            };
        })
        .filter((result): result is RaceResult => result !== null);
};

const raceData: AgeGroup[] = [
    {
        gender: 'Female',
        ageRange: { min: 0, max: 19 },
        participants: [
            { name: "Tavi Borisova", results: parseResults("MG5(1)"), needsToRenew: false },
            { name: "Tora Borisova", results: parseResults("MG5(2)"), needsToRenew: false },
            { name: "Oona Joyce", results: [], needsToRenew: false },
            { name: "Madeline Lin", results: [], needsToRenew: false },
            { name: "Beatrix Paulson", results: [], needsToRenew: false },
            { name: "Charlotte Thornton", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 20, max: 29 },
        participants: [
            { name: "Brittany Ashmore", results: parseResults("MG10(2)"), needsToRenew: false },
            { name: "Tyranny Davis", results: [], needsToRenew: false },
            { name: "Megan Donnan", results: [], needsToRenew: false },
            { name: "Annalisa Fama", results: [], needsToRenew: true },
            { name: "Natalie Gustafson", results: [], needsToRenew: false },
            { name: "Holly Hahn", results: [], needsToRenew: false },
            { name: "Brianna Hajek", results: [], needsToRenew: false },
            { name: "Rachel Han", results: [], needsToRenew: false },
            { name: "Rhiannon Hinckley", results: [], needsToRenew: false },
            { name: "Kelly Levick", results: [], needsToRenew: false },
            { name: "Abby Livingston", results: [], needsToRenew: false },
            { name: "Sam Mabry", results: parseResults("MG15(2)"), needsToRenew: false },
            { name: "Abby Nordstrom", results: [], needsToRenew: false },
            { name: "Macy Richardson", results: [], needsToRenew: true },
            { name: "Darby Roth", results: [], needsToRenew: false },
            { name: "Kathleen Sherlock", results: [], needsToRenew: false },
            { name: "Gabriela Silva Pumarada", results: [], needsToRenew: false },
            { name: "Josie Suter", results: [], needsToRenew: false },
            { name: "Julia Welle", results: parseResults("MG5(2)"), needsToRenew: false },
            { name: "Brighid Zelko", results: [], needsToRenew: false },
            { name: "Bei Zhao", results: [], needsToRenew: true },
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 30, max: 39 },
        participants: [
            { name: "Katie Couture", results: parseResults("SE(2)"), needsToRenew: false },
            { name: "Ellen Vore", results: parseResults("SE(1) MG15(2)"), needsToRenew: false },
            { name: "Elizabeth Ackerson", results: [], needsToRenew: false },
            { name: "Diana Al Husseini", results: [], needsToRenew: false },
            { name: "Victoria Austen", results: [], needsToRenew: false },
            { name: "Amy Bailey", results: [], needsToRenew: false },
            { name: "Abbey Brinkoetter", results: [], needsToRenew: true },
            { name: "Ellen Buckley", results: [], needsToRenew: false },
            { name: "Bethany Carmien Onwodi", results: [], needsToRenew: false },
            { name: "Kat Chesnut", results: [], needsToRenew: false },
            { name: "Marli de Moraes Gomes Favoretto", results: [], needsToRenew: false },
            { name: "Hannah Dignan", results: [], needsToRenew: false },
            { name: "Jennifer Eastin", results: [], needsToRenew: false },
            { name: "Kiri Fagen-Ulmschneider", results: [], needsToRenew: false },
            { name: "Taylor Fears", results: [], needsToRenew: false },
            { name: "Caitlin Fredericks", results: [], needsToRenew: true },
            { name: "Madeline Furlong", results: [], needsToRenew: false },
            { name: "Pierina Garcia", results: [], needsToRenew: false },
            { name: "Ashlyn Henke", results: [], needsToRenew: false }, 
            { name: "Molly Knoblett", results: [], needsToRenew: false },
            { name: "Sydney Lazarus", results: [], needsToRenew: true },
            { name: "Mitzy Maldonado", results: [], needsToRenew: true },
            { name: "Nandana Nallapu", results: [], needsToRenew: false },
            { name: "Liz Paunicka", results: parseResults("MG10(2)"), needsToRenew: false },
            { name: "Brenda Straka", results: parseResults("MG15(1)"), needsToRenew: false },
            { name: "Paula Tankersley", results: parseResults("MG5(2)"), needsToRenew: false },
            { name: "Emily Tarconish", results: [], needsToRenew: false },
            { name: "Mara Thacker", results: [], needsToRenew: false },
            { name: "Michelle Tushevski", results: [], needsToRenew: false },
            { name: "Kim Westfall", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 40, max: 49 },
        participants: [
            { name: "Krista Overstreet", results: parseResults("SE(2) CC10(2) MG15(1)"), needsToRenew: false },
            { name: "Tracy Kleparski", results: parseResults("CC10(1)"), needsToRenew: true },
            { name: "Elizabeth Chominski", results: [], needsToRenew: false },
            { name: "Stephanie Cummings", results: [], needsToRenew: false },
            { name: "Shannon Doyle", results: [], needsToRenew: true },
            { name: "Randi Dunn", results: [], needsToRenew: false },
            { name: "Suzanne Engle", results: [], needsToRenew: false },
            { name: "Jen Gravley", results: [], needsToRenew: false },
            { name: "Sarah Hall", results: [], needsToRenew: false },
            { name: "Theresa Heater", results: parseResults("MG10(1)"), needsToRenew: false },
            { name: "Nicole Lake Olmo", results: parseResults("MG15(2)"), needsToRenew: false },
            { name: "Erin Lippitz", results: [], needsToRenew: false },
            { name: "Jennifer Mandel", results: [], needsToRenew: false },
            { name: "Angie Mcqueen", results: [], needsToRenew: false },
            { name: "Martha McSims", results: [], needsToRenew: false },
            { name: "Laura Owen", results: parseResults("MG10(2)"), needsToRenew: false },
            { name: "Megan Parsons", results: [], needsToRenew: false },
            { name: "Whitney Patel", results: [], needsToRenew: false },
            { name: "Rebecca Taylor", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 50, max: 59 },
        participants: [
            { name: "Leslie Hammersmith", results: parseResults("CC5(2) MG10(2)"), needsToRenew: false },
            { name: "Annie Adams", results: [], needsToRenew: false },
            { name: "Jen Anderson", results: [], needsToRenew: false },
            { name: "Agatha Barnes", results: [], needsToRenew: false },
            { name: "Melony Barrett", results: [], needsToRenew: true },
            { name: "Lenore Borisova", results: [], needsToRenew: false },
            { name: "Ellen Byron", results: [], needsToRenew: false },
            { name: "Cara Finnegan", results: [], needsToRenew: true },
            { name: "Dawn Goeddel", results: [], needsToRenew: true },
            { name: "Michele Heller", results: [], needsToRenew: false },
            { name: "Vickie Hemann", results: [], needsToRenew: false },
            { name: "Angela Holcomb", results: [], needsToRenew: false },
            { name: "Fatima Husain", results: [], needsToRenew: false },
            { name: "Kate Kobak", results: [], needsToRenew: false },
            { name: "Susie Kundrat", results: [], needsToRenew: false },
            { name: "Jody Littleton", results: [], needsToRenew: false },
            { name: "Sandra Loeb", results: [], needsToRenew: false },
            { name: "Letitia Moffitt", results: [], needsToRenew: false },
            { name: "My Nguyen", results: [], needsToRenew: false },
            { name: "Susan Osterbur", results: [], needsToRenew: false },
            { name: "Lorrie Pearson", results: [], needsToRenew: false },
            { name: "Susan Pierce", results: [], needsToRenew: false },
            { name: "Tricia Smith", results: [], needsToRenew: false },
            { name: "Peg Stierwalt", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 60, max: 69 },
        participants: [
            { name: "Nancy Roth", results: parseResults("SE(2) CC10(2)"), needsToRenew: true },
            { name: "Babette Hiles", results: parseResults("CC10(1)"), needsToRenew: false },
            { name: "Tina Ammermann", results: parseResults("MG10(1)"), needsToRenew: false },
            { name: "Rebecca Dey", results: [], needsToRenew: false },
            { name: "Cathy Giffel", results: parseResults("MG10(2)"), needsToRenew: false },
            { name: "Karen Iehl-Morse", results: [], needsToRenew: false },
            { name: "Jean Ingram", results: [], needsToRenew: false },
            { name: "Susan Kautzer", results: [], needsToRenew: false },
            { name: "Jessica Li", results: [], needsToRenew: false },
            { name: "Heather Mangian", results: [], needsToRenew: false },
            { name: "Kathi Ritten", results: [], needsToRenew: false },
            { name: "Elizabeth Scheid", results: [], needsToRenew: false },
            { name: "Jan Seeley", results: [], needsToRenew: false },
            { name: "Nancy Sivertsen", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 70, max: null },
        participants: [
            { name: "Linda Bradley", results: [], needsToRenew: false },
            { name: "Donna Brown", results: [], needsToRenew: true },
            { name: "Roma Chenoweth", results: [], needsToRenew: false },
            { name: "Carol Miles", results: [], needsToRenew: false },
            { name: "Phyllis Roth", results: [], needsToRenew: false },
            { name: "Kathy Vance", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 0, max: 19 },
        participants: [
            { name: "Adam Byron", results: [], needsToRenew: false },
            { name: "Lucas Dixon", results: [], needsToRenew: false },
            { name: "Harlan Heller", results: [], needsToRenew: false },
            { name: "Aldous Joyce", results: [], needsToRenew: false },
            { name: "Dexter Lokshin", results: [], needsToRenew: false },
            { name: "Joshua Pierce", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 20, max: 29 },
        participants: [
            { name: "Brody Wilt", results: parseResults("CC10(2) MG10(2)"), needsToRenew: false },
            { name: "Joshua Agterberg", results: [], needsToRenew: false },
            { name: "Matthew Babik", results: [], needsToRenew: false },
            { name: "Sourav Das", results: [], needsToRenew: false },
            { name: "Derek Dayton", results: [], needsToRenew: false },
            { name: "Vitor Favoretto", results: [], needsToRenew: false },
            { name: "Rajesh Mishra", results: [], needsToRenew: false },
            { name: "Luke Morrison", results: parseResults("MG15(2)"), needsToRenew: false },
            { name: "Andrew Pierce", results: [], needsToRenew: false },
            { name: "Vishal Kaushik Pillalamarri", results: [], needsToRenew: false },
            { name: "Martin Repetto", results: [], needsToRenew: false },
            { name: "John Richardson", results: [], needsToRenew: true },
            { name: "Jordan Rock", results: [], needsToRenew: false },
            { name: "Naser Salas", results: [], needsToRenew: false },
            { name: "Eddy Sirois", results: [], needsToRenew: false },
            { name: "Wilmer Smilde", results: [], needsToRenew: false },
            { name: "Edward Tang", results: parseResults("MG15(1)"), needsToRenew: false },
            { name: "Matt Tyner", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 30, max: 39 },
        participants: [
            { name: "Malcolm Bare", results: [], needsToRenew: false },
            { name: "Lucas Berger Munaro", results: [], needsToRenew: false },
            { name: "Fabian Dettenrieder", results: [], needsToRenew: true },
            { name: "Robert Duffy", results: [], needsToRenew: false },
            { name: "Nick Farmer", results: parseResults("MG10(1)"), needsToRenew: false },
            { name: "Jacob Fredericks", results: [], needsToRenew: true },
            { name: "Javier Garcia", results: [], needsToRenew: false }, 
            { name: "Willy Guenthner", results: [], needsToRenew: false },
            { name: "Jordan Harpst", results: [], needsToRenew: false },
            { name: "Nicholas Heller", results: [], needsToRenew: false },
            { name: "Kory Henke", results: [], needsToRenew: false },
            { name: "Josh Loomis", results: [], needsToRenew: false },
            { name: "Duncan Nall", results: [], needsToRenew: false },
            { name: "Lars Oberg", results: [], needsToRenew: false },
            { name: "Paul O'Neil", results: [], needsToRenew: true },
            { name: "Andrew Rehn", results: parseResults("MG15(1)"), needsToRenew: false },
            { name: "Devin Rittenhouse", results: parseResults("MG15(2)"), needsToRenew: false },
            { name: "Makrand Sinha", results: [], needsToRenew: false },
            { name: "Stojan Tushevski", results: [], needsToRenew: false },
            { name: "Titus Young", results: [], needsToRenew: true },
            { name: "Ben Zigterman", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 40, max: 49 },
        participants: [
            { name: "Jesse Couture", results: parseResults("SE(2)"), needsToRenew: false },
            { name: "Matthias Diener", results: parseResults("CC5(2) MG5(1)"), needsToRenew: true },
            { name: "Stephen Johnson", results: parseResults("CC15(2) MG15(1) "), needsToRenew: false },
            { name: "Patrick Garner", results: parseResults("CC15(1)"), needsToRenew: false },
            { name: "Scott Tess", results: parseResults("SE(1) MG15(2)"), needsToRenew: false },
            { name: "David Albouy", results: [], needsToRenew: true },
            { name: "Ramses Armendariz", results: [], needsToRenew: true },
            { name: "Eric Benson", results: [], needsToRenew: false },
            { name: "Nikita Borisov", results: parseResults("MG15(3)"), needsToRenew: false },
            { name: "Joshua Brown", results: parseResults("MG5(2)"), needsToRenew: false },
            { name: "Charles Fogelman", results: [], needsToRenew: false },
            { name: "Aaron Garrett", results: [], needsToRenew: true },
            { name: "Tom Gelsthorpe", results: [], needsToRenew: false },
            { name: "Bryan Hartman", results: [], needsToRenew: false },
            { name: "Ian Hojnicki", results: [], needsToRenew: false },
            { name: "Daniel Kirsanoff", results: [], needsToRenew: false },
            { name: "Brad Ludwig", results: [], needsToRenew: false },
            { name: "Nathan Mandel", results: [], needsToRenew: false },
            { name: "Cory Olmo", results: [], needsToRenew: false },
            { name: "Geoff Ower", results: [], needsToRenew: false },
            { name: "Nathan Parsons", results: [], needsToRenew: false },
            { name: "Nicholas Paulson", results: [], needsToRenew: false },
            { name: "Cory Pettijohn", results: [], needsToRenew: false },
            { name: "Tyler Reifsteck", results: [], needsToRenew: true },
            { name: "Brett Yockey", results: [], needsToRenew: false },
            { name: "Jason Zhang", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 50, max: 59 },
        participants: [
            { name: "Michael Tankersley", results: parseResults("SE(4) MG15(3)"), needsToRenew: false },
            { name: "Minh Do", results: parseResults("SE(3)"), needsToRenew: false },
            { name: "David Ammermann", results: parseResults("SE(2) MG15(1)"), needsToRenew: false },
            { name: "Scott Silverman", results: parseResults("CC10(2)"), needsToRenew: false },
            { name: "Brad Giffel", results: parseResults("SE(1) MG15(2)"), needsToRenew: false },
            { name: "Myron Bennett", results: [], needsToRenew: false },
            { name: "Chris Byron", results: [], needsToRenew: false },
            { name: "Michael Healea", results: [], needsToRenew: false },
            { name: "Alan Joyce", results: [], needsToRenew: false },
            { name: "Jeff Kohmstedt", results: [], needsToRenew: false },
            { name: "Christopher Korose", results: parseResults("MG5(2)"), needsToRenew: false },
            { name: "Sanjay Kumar", results: [], needsToRenew: false },
            { name: "Paul Littleton", results: [], needsToRenew: false },
            { name: "Michael Lokshin", results: [], needsToRenew: false },
            { name: "Matthew Mabry", results: parseResults("MG10(2)"), needsToRenew: false },
            { name: "Marc Mills", results: [], needsToRenew: false },
            { name: "John Reed", results: [], needsToRenew: false },
            { name: "Juan Salas", results: parseResults("MG10(1)"), needsToRenew: false },
            { name: "Paul Weiss", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 60, max: 69 },
        participants: [
            { name: "Don Dodson", results: parseResults("CC15(2) MG15(1)"), needsToRenew: false },
            { name: "Richard Mann", results: parseResults("SE(2) MG15(2)"), needsToRenew: false },
            { name: "Bruce Hajek", results: parseResults("SE(1)"), needsToRenew: false },
            { name: "Larry Adelston", results: [], needsToRenew: false },
            { name: "Bill Dey", results: [], needsToRenew: false },
            { name: "Mark Dixon", results: [], needsToRenew: false },
            { name: "James Doyle", results: [], needsToRenew: false },
            { name: "Martin Gruebele", results: [], needsToRenew: false },
            { name: "Mike Lindemann", results: [], needsToRenew: false },
            { name: "Edward Mehnert", results: [], needsToRenew: false },
            { name: "Louis Mesker", results: [], needsToRenew: false },
            { name: "John Murphy", results: [], needsToRenew: true },
            { name: "Bryan Pierce", results: [], needsToRenew: false },
            { name: "Bryan Rojek", results: [], needsToRenew: false },
            { name: "Randall Stearns", results: [], needsToRenew: false },
            { name: "Ken Welle", results: [], needsToRenew: false },
            { name: "Taylor White", results: [], needsToRenew: true },
            { name: "James Whitfield", results: [], needsToRenew: false }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 70, max: null },
        participants: [
            { name: "Charles V. Evans", results: [], needsToRenew: false },
            { name: "Martin Feilen", results: [], needsToRenew: false },
            { name: "Stephen Long", results: [], needsToRenew: false },
            { name: "Richard Roth", results: [], needsToRenew: false }
        ]
    }
];

// Helper function to calculate total points if needed
const getTotalPoints = (participant: Participant): number => {
    return participant.results.reduce((sum, result) => sum + result.points, 0);
};

export type { RaceResult, Participant, AgeGroup };
export { raceData, getTotalPoints, races };