import Header from "../header"
import { Outlet } from "react-router-dom";

function RutasSinSesion() {
    return (
        <>
            <div className="absolute w-full insert-0 z-30">
                <Header url="/" />
            </div>
            <Outlet />
        </>
    )
}

export default RutasSinSesion;