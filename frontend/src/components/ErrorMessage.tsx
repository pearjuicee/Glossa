type ErrorMessageProps = {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
        {message}
    </div>
);

export default ErrorMessage;