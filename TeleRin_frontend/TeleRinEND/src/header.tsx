import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface HeaderProps {
    url?: string;
}

function Header({ url = "/" }: HeaderProps) {
    return (
        <motion.header className="h-25 flex flex-col  items-center">
            <div className="h-100 flex justify-center sm:justify-between items-end w-full px-[5%]">
                <Link to={url} className="font-[titulo] font-bold text-7xl">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.6 }}
                    >TeleRin</motion.p>
                </Link>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
                <motion.div className="h-[2px] bg-black "
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1 }}
                />
                <motion.div className="h-[4px] bg-black "
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1.5 }}
                />
            </div>
        </motion.header>
    )
}

export default Header;
