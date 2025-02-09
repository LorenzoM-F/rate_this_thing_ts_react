import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface ErrorProps {
    message: string;
}

const Error: FC<ErrorProps> = ({ message }) => {
    const navigate = useNavigate();

    const handleOkClick = () => {
        navigate("/");
    };

    return (
        <div className="error-container">
            <div className="error-icon">✘</div>
            <p className="error-message">{message}</p>
            <button className="ok-button" onClick={handleOkClick}>OK</button>
        </div>
    );
};

export default Error;
