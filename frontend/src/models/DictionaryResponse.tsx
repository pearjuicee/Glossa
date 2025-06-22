export type DictionaryResponse = {
    response: {
        definition: string;
        romanized: string;
        language?: string;
    }
}

export type Token = {
    segment: string;
    index: number;
    isSelected: boolean;
}