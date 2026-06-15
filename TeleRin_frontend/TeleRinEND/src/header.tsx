import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface HeaderProps {
  url?: string;
  iniciar?: boolean;
}

function Header({ url = "/", iniciar = true }: HeaderProps) {
  return (
    <motion.header className="h-25 flex flex-col  items-center">
      <div className="h-100 flex justify-center sm:justify-between items-end w-full px-[5%]">
        <Link to={url} className="font-[titulo] text-(--color_texto_oscuro) font-bold text-7xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.6 }}
          >
            TeleRin
          </motion.p>
        </Link>
      </div>
      <div className="w-full flex flex-col items-center gap-1">
        <motion.div
          className="h-0.5 bg-(--color_bordes) "
          initial={{ width: 0 }}
          animate={{ width: "95%" }}
          transition={{ duration: 0.9 }}
        />
        <motion.div
          className="h-1 bg-(--color_bordes) "
          initial={{ width: 0 }}
          animate={{ width: "92%" }}
          transition={{ duration: 1.3 }}
        />
      </div>
    </motion.header>
  );
}

export default Header;
