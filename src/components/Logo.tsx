import { Rat } from "lucide-react";

export default function Logo() {
    return (
        <div className="logo flex flex-row items-center gap-2">
            <Rat className="size-6" />
            <span className="  font-mono font-bold text-2xl">Eternity</span>
        </div>
    )
}