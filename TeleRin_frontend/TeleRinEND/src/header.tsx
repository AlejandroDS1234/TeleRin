import { Link } from "react-router-dom";

interface HeaderProps {
    url?: string;
}

function Header({ url = "/" }: HeaderProps) {
    return (
        <header className="h-25 flex flex-col  items-center">
            <div className="h-100 flex justify-center sm:justify-between items-end w-full px-[5%]">
                <Link to={url} className="font-[titulo] font-bold text-7xl">TeleRin</Link>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
                <div className="w-[95%] h-[2px] bg-black "></div>
                <div className="w-[92%] h-[4px] bg-black "></div>
            </div>
        </header>
    )
}

export default Header;
