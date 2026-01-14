import { useNavigate } from 'react-router-dom';

const CTAButton = ({ text = "Book Online Consultation", onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate('/booking');
        }
    };

    return (
        <button className="btn btn-primary" onClick={handleClick}>
            👉 {text}
        </button>
    );
};

export default CTAButton;
