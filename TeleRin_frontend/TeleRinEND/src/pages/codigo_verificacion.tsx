import Header from "../header";
import UseMensajeRedirigir from "../function_generales";

function CodigoVerificacion() {
    return (
        <>
            <Header />
            <div>
                <UseMensajeRedirigir />
            </div>
            <div className="container">
                <h1>Codigo de verificacion</h1>
                <p>Ingresa el codigo de verificacion que se te ha enviado a tu correo</p>
                <form action="/validar_codigo" method="POST">
                    <input type="text" name="codigo" placeholder="Codigo de verificacion" required />
                    <button type="submit">Validar codigo</button>
                </form>
            </div>
        </>
    );
}

export default CodigoVerificacion;