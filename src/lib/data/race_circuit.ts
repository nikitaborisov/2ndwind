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
            { name: "Tavi Borisova", results: parseResults("MG5(1)") },
            { name: "Tora Borisova", results: parseResults("MG5(2)") },
            { name: "Oona Joyce", results: [] },
            { name: "Madeline Lin", results: [] },
            { name: "Beatrix Paulson", results: [] },
            { name: "Charlotte Thornton", results: [] }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 20, max: 29 },
        participants: [
            { name: "Brittany Ashmore", results: parseResults("MG10(2)") },
            { name: "Tyranny Davis", results: [] },
            { name: "Megan Donnan", results: [] },
            { name: "Annalisa Fama", results: [] },
            { name: "Natalie Gustafson", results: [] },
            { name: "Holly Hahn", results: [] },
            { name: "Brianna Hajek", results: [] },
            { name: "Rachel Han", results: [] },
            { name: "Rhiannon Hinckley", results: [] },
            { name: "Kelly Levick", results: [] },
            { name: "Abby Livingston", results: [] },
            { name: "Sam Mabry", results: parseResults("MG15(2)") },
            { name: "Abby Nordstrom", results: [] },
            { name: "Macy Richardson", results: [] },
            { name: "Darby Roth", results: [] },
            { name: "Kathleen Sherlock", results: [] },
            { name: "Gabriela Silva Pumarada", results: [] },
            { name: "Josie Suter", results: [] },
            { name: "Julia Welle", results: parseResults("MG5(2)") },
            { name: "Brighid Zelko", results: [] },
            { name: "Bei Zhao", results: [] },
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 30, max: 39 },
        participants: [
            { name: "Katie Couture", results: parseResults("SE(2)") },
            { name: "Ellen Vore", results: parseResults("SE(1) MG15(2)") },
            { name: "Elizabeth Ackerson", results: [] },
            { name: "Diana Al Husseini", results: [] },
            { name: "Victoria Austen", results: [] },
            { name: "Amy Bailey", results: [] },
            { name: "Abbey Brinkoetter", results: [] },
            { name: "Ellen Buckley", results: [] },
            { name: "Bethany Carmien Onwodi", results: [] },
            { name: "Kat Chesnut", results: [] },
            { name: "Marli de Moraes Gomes Favoretto", results: [] },
            { name: "Hannah Dignan", results: [] },
            { name: "Jennifer Eastin", results: [] },
            { name: "Kiri Fagen-Ulmschneider", results: [] },
            { name: "Taylor Fears", results: [] },
            { name: "Caitlin Fredericks", results: [] },
            { name: "Madeline Furlong", results: [] },
            { name: "Pierina Garcia", results: [] },
            { name: "Ashlyn Henke", results: [] },
            { name: "Molly Knoblett", results: [] },
            { name: "Sydney Lazarus", results: [] },
            { name: "Mitzy Maldonado", results: [] },
            { name: "Nandana Nallapu", results: [] },
            { name: "Liz Paunicka", results: parseResults("MG10(2)") },
            { name: "Brenda Straka", results: parseResults("MG15(1)") },
            { name: "Paula Tankersley", results: parseResults("MG5(2)") },
            { name: "Emily Tarconish", results: [] },
            { name: "Mara Thacker", results: [] },
            { name: "Michelle Tushevski", results: [] },
            { name: "Kim Westfall", results: [] }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 40, max: 49 },
        participants: [
            { name: "Krista Overstreet", results: parseResults("SE(2) CC10(2) MG15(1)") },
            { name: "Tracy Kleparski", results: parseResults("CC10(1)") },
            { name: "Elizabeth Chominski", results: [] },
            { name: "Stephanie Cummings", results: [] },
            { name: "Shannon Doyle", results: [] },
            { name: "Randi Dunn", results: [] },
            { name: "Suzanne Engle", results: [] },
            { name: "Jen Gravley", results: [] },
            { name: "Sarah Hall", results: [] },
            { name: "Theresa Heater", results: parseResults("MG10(1)") },
            { name: "Nicole Lake Olmo", results: parseResults("MG15(2)") },
            { name: "Erin Lippitz", results: [] },
            { name: "Jennifer Mandel", results: [] },
            { name: "Angie Mcqueen", results: [] },
            { name: "Martha McSims", results: [] },
            { name: "Laura Owen", results: parseResults("MG10(2)") },
            { name: "Megan Parsons", results: [] },
            { name: "Whitney Patel", results: [] },
            { name: "Rebecca Taylor", results: [] }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 50, max: 59 },
        participants: [
            { name: "Leslie Hammersmith", results: parseResults("CC5(2) MG10(2)") },
            { name: "Annie Adams", results: [] },
            { name: "Jen Anderson", results: [] },
            { name: "Agatha Barnes", results: [] },
            { name: "Melony Barrett", results: [] },
            { name: "Lenore Borisova", results: [] },
            { name: "Ellen Byron", results: [] },
            { name: "Cara Finnegan", results: [] },
            { name: "Dawn Goeddel", results: [] },
            { name: "Michele Heller", results: [] },
            { name: "Vickie Hemann", results: [] },
            { name: "Angela Holcomb", results: [] },
            { name: "Fatima Husain", results: [] },
            { name: "Kate Kobak", results: [] },
            { name: "Susie Kundrat", results: [] },
            { name: "Jody Littleton", results: [] },
            { name: "Sandra Loeb", results: [] },
            { name: "Letitia Moffitt", results: [] },
            { name: "My Nguyen", results: [] },
            { name: "Susan Osterbur", results: [] },
            { name: "Lorrie Pearson", results: [] },
            { name: "Susan Pierce", results: [] },
            { name: "Tricia Smith", results: [] },
            { name: "Peg Stierwalt", results: [] }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 60, max: 69 },
        participants: [
            { name: "Nancy Roth", results: parseResults("SE(2) CC10(2)") },
            { name: "Babette Hiles", results: parseResults("CC10(1)") },
            { name: "Tina Ammermann", results: parseResults("MG10(1)") },
            { name: "Rebecca Dey", results: [] },
            { name: "Cathy Giffel", results: parseResults("MG10(2)") },
            { name: "Karen Iehl-Morse", results: [] },
            { name: "Jean Ingram", results: [] },
            { name: "Susan Kautzer", results: [] },
            { name: "Jessica Li", results: [] },
            { name: "Heather Mangian", results: [] },
            { name: "Kathi Ritten", results: [] },
            { name: "Elizabeth Scheid", results: [] },
            { name: "Jan Seeley", results: [] },
            { name: "Nancy Sivertsen", results: [] }
        ]
    },
    {
        gender: 'Female',
        ageRange: { min: 70, max: null },
        participants: [
            { name: "Linda Bradley", results: [] },
            { name: "Donna Brown", results: [] },
            { name: "Roma Chenoweth", results: [] },
            { name: "Carol Miles", results: [] },
            { name: "Phyllis Roth", results: [] },
            { name: "Kathy Vance", results: [] }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 0, max: 19 },
        participants: [
            { name: "Adam Byron", results: [] },
            { name: "Lucas Dixon", results: [] },
            { name: "Harlan Heller", results: [] },
            { name: "Aldous Joyce", results: [] },
            { name: "Dexter Lokshin", results: [] },
            { name: "Joshua Pierce", results: [] }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 20, max: 29 },
        participants: [
            { name: "Brody Wilt", results: parseResults("CC10(2) MG10(2)") },
            { name: "Joshua Agterberg", results: [] },
            { name: "Matthew Babik", results: [] },
            { name: "Sourav Das", results: [] },
            { name: "Derek Dayton", results: [] },
            { name: "Vitor Favoretto", results: [] },
            { name: "Rajesh Mishra", results: [] },
            { name: "Luke Morrison", results: parseResults("MG15(2)") },
            { name: "Andrew Pierce", results: [] },
            { name: "Vishal Kaushik Pillalamarri", results: [] },
            { name: "Martin Repetto", results: [] },
            { name: "John Richardson", results: [] },
            { name: "Jordan Rock", results: [] },
            { name: "Naser Salas", results: [] },
            { name: "Eddy Sirois", results: [] },
            { name: "Wilmer Smilde", results: [] },
            { name: "Edward Tang", results: parseResults("MG15(1)") },
            { name: "Matt Tyner", results: [] }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 30, max: 39 },
        participants: [
            { name: "Malcolm Bare", results: [] },
            { name: "Lucas Berger Munaro", results: [] },
            { name: "Fabian Dettenrieder", results: [] },
            { name: "Robert Duffy", results: [] },
            { name: "Nick Farmer", results: parseResults("MG10(1)") },
            { name: "Jacob Fredericks", results: [] },
            { name: "Javier Garcia", results: [] },
            { name: "Willy Guenthner", results: [] },
            { name: "Jordan Harpst", results: [] },
            { name: "Nicholas Heller", results: [] },
            { name: "Kory Henke", results: [] },
            { name: "Josh Loomis", results: [] },
            { name: "Duncan Nall", results: [] },
            { name: "Lars Oberg", results: [] },
            { name: "Paul O'Neil", results: [] },
            { name: "Andrew Rehn", results: parseResults("MG15(1)") },
            { name: "Devin Rittenhouse", results: parseResults("MG15(2)") },
            { name: "Makrand Sinha", results: [] },
            { name: "Stojan Tushevski", results: [] },
            { name: "Titus Young", results: [] },
            { name: "Ben Zigterman", results: [] }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 40, max: 49 },
        participants: [
            { name: "Jesse Couture", results: parseResults("SE(2)") },
            { name: "Matthias Diener", results: parseResults("CC5(2) MG5(1)") },
            { name: "Stephen Johnson", results: parseResults("CC15(2) MG15(1) ") },
            { name: "Patrick Garner", results: parseResults("CC15(1)") },
            { name: "Scott Tess", results: parseResults("SE(1) MG15(2)") },
            { name: "David Albouy", results: [] },
            { name: "Ramses Armendariz", results: [] },
            { name: "Eric Benson", results: [] },
            { name: "Nikita Borisov", results: parseResults("MG15(3)") },
            { name: "Joshua Brown", results: parseResults("MG5(2)") },
            { name: "Charles Fogelman", results: [] },
            { name: "Aaron Garrett", results: [] },
            { name: "Tom Gelsthorpe", results: [] },
            { name: "Bryan Hartman", results: [] },
            { name: "Ian Hojnicki", results: [] },
            { name: "Daniel Kirsanoff", results: [] },
            { name: "Brad Ludwig", results: [] },
            { name: "Nathan Mandel", results: [] },
            { name: "Cory Olmo", results: [] },
            { name: "Geoff Ower", results: [] },
            { name: "Nathan Parsons", results: [] },
            { name: "Nicholas Paulson", results: [] },
            { name: "Cory Pettijohn", results: [] },
            { name: "Tyler Reifsteck", results: [] },
            { name: "Brett Yockey", results: [] },
            { name: "Jason Zhang", results: [] }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 50, max: 59 },
        participants: [
            { name: "Michael Tankersley", results: parseResults("SE(4) MG15(3)") },
            { name: "Minh Do", results: parseResults("SE(3)") },
            { name: "David Ammermann", results: parseResults("SE(2) MG15(1)") },
            { name: "Scott Silverman", results: parseResults("CC10(2)") },
            { name: "Brad Giffel", results: parseResults("SE(1) MG15(2)") },
            { name: "Myron Bennett", results: [] },
            { name: "Chris Byron", results: [] },
            { name: "Michael Healea", results: [] },
            { name: "Alan Joyce", results: [] },
            { name: "Jeff Kohmstedt", results: [] },
            { name: "Christopher Korose", results: parseResults("MG5(2)") },
            { name: "Sanjay Kumar", results: [] },
            { name: "Paul Littleton", results: [] },
            { name: "Michael Lokshin", results: [] },
            { name: "Matthew Mabry", results: parseResults("MG10(2)") },
            { name: "Marc Mills", results: [] },
            { name: "John Reed", results: [] },
            { name: "Juan Salas", results: parseResults("MG10(1)") },
            { name: "Paul Weiss", results: [] }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 60, max: 69 },
        participants: [
            { name: "Don Dodson", results: parseResults("CC15(2) MG15(1)") },
            { name: "Richard Mann", results: parseResults("SE(2) MG15(2)") },
            { name: "Bruce Hajek", results: parseResults("SE(1)") },
            { name: "Larry Adelston", results: [] },
            { name: "Bill Dey", results: [] },
            { name: "Mark Dixon", results: [] },
            { name: "James Doyle", results: [] },
            { name: "Martin Gruebele", results: [] },
            { name: "Mike Lindemann", results: [] },
            { name: "Edward Mehnert", results: [] },
            { name: "Louis Mesker", results: [] },
            { name: "John Murphy", results: [] },
            { name: "Bryan Pierce", results: [] },
            { name: "Bryan Rojek", results: [] },
            { name: "Randall Stearns", results: [] },
            { name: "Ken Welle", results: [] },
            { name: "Taylor White", results: [] },
            { name: "James Whitfield", results: [] }
        ]
    },
    {
        gender: 'Male',
        ageRange: { min: 70, max: null },
        participants: [
            { name: "Charles V. Evans", results: [] },
            { name: "Martin Feilen", results: [] },
            { name: "Stephen Long", results: [] },
            { name: "Richard Roth", results: [] }
        ]
    }
];

// Helper function to calculate total points if needed
const getTotalPoints = (participant: Participant): number => {
    return participant.results.reduce((sum, result) => sum + result.points, 0);
};

export type { RaceResult, Participant, AgeGroup };
export { raceData, getTotalPoints, races };