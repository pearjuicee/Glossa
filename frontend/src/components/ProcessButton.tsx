type ProcessButtonProps = {
    onClick: () => void;
    disabled?: boolean;
};


const ProcessButton: React.FC<ProcessButtonProps> = ({ onClick, disabled }) => (
    <button
        className="cursor-pointer mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={onClick}
        disabled={disabled}
    >
        Process Sentence
    </button>
)

export default ProcessButton;