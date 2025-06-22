import type { Token } from "../models/DictionaryResponse";

type TokenDisplayProps = {
    tokens: Token[];
    selected: Token | null;
    onSelect: (token: Token) => void;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens, selected, onSelect }) => (
    <div className="mt-3 flex flex-wrap gap-2">
        {tokens.map((token) => (
            <button
            key={token.index}
            onClick={() => onSelect(token)}
            className={`cursor-pointer px-2 py-1 border rounded ${
                selected?.index === token.index ? 'bg-yellow-300' : 'bg-gray-100'
            }`}
            >
                {token.segment}
            </button>
        ))}
    </div>
);

export default TokenDisplay;