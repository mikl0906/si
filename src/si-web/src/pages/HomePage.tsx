import { useNavigate } from "react-router";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Своя игра</h1>
            <button onClick={() => navigate("/host")}>
                Начать игру
            </button>
        </div>
    );
}