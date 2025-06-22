type SentenceInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const SentenceInput: React.FC<SentenceInputProps> = ({ value, onChange }) => (
  <textarea
    className="w-full p-2 border border-gray-300 rounded"
    placeholder="Type your sentence here..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={4}
  />
)

export default SentenceInput;