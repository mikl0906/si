import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Своя игра</h1>
            <Button onClick={() => navigate("/new")}>Новая игра</Button>
        </div>
    );
}