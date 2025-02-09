import { useNavigate } from 'react-router-dom';
import '../css/Back.css'; // Make sure to create and style this CSS file

function Back() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <button className="back-button" onClick={handleBackClick}>
            &#8592; {/* Left arrow character */}
        </button>
    );
}

export default Back;