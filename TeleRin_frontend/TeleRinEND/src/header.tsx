import { Link } from "react-router-dom";


function Header({ cosas }) {
    return (
        <header className="bg-[#f85001] h-16 flex justify-between items-center px-4">
            <Link to="/" className="font-[fuente] text-4xl">TeleRin</Link>
            <div className="flex space-x-4">
                {cosas}
            </div>
        </header>
    )
}

export default Header;
