import argparse
import socket
import time

import qrcode 


PUERTO_FRONTEND = 4210
INTERFACES_PRIORIZADAS = ("Wi-Fi", "WLAN", "wlan0", "wlp2s0")


def obtener_ip_por_interfaz(nombre_interfaz: str) -> str | None:
    interfaces = psutil.net_if_addrs()
    direcciones = interfaces.get(nombre_interfaz, [])

    for direccion in direcciones:
        if direccion.family == socket.AF_INET and not direccion.address.startswith("127."):
            return direccion.address
    return None


def obtener_ip_local() -> str | None:
    for interfaz in INTERFACES_PRIORIZADAS:
        ip = obtener_ip_por_interfaz(interfaz)
        if ip:
            return ip

    interfaces = psutil.net_if_addrs()
    for nombre_interfaz, direcciones in interfaces.items():
        nombre_interfaz_minuscula = nombre_interfaz.lower()
        if any(palabra in nombre_interfaz_minuscula for palabra in ("docker", "loopback", "virtual", "vmware")):
            continue

        for direccion in direcciones:
            if direccion.family == socket.AF_INET and not direccion.address.startswith("127."):
                return direccion.address

    return None


def construir_url(ip: str) -> str:
    return f"http://{ip}:{PUERTO_FRONTEND}"


def imprimir_qr(url: str) -> None:
    qr_terminal = qrcode.QRCode(border=1)
    qr_terminal.add_data(url)
    qr_terminal.make(fit=True)
    qr_terminal.print_ascii(invert=True)


def mostrar_qr_actual(url: str, descripcion: str) -> None:
    print("\n" + "=" * 60)
    print(descripcion)
    print(f"URL para compartir: {url}")
    print("El QR se actualizara automaticamente si cambia la IP.")
    print("=" * 60 + "\n")
    imprimir_qr(url)
    print("")


def parsear_argumentos() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Imprime un QR con la URL del frontend de TeleRin."
    )
    parser.add_argument(
        "--ip",
        help="IP del host para construir la URL del frontend.",
    )
    parser.add_argument(
        "--url",
        help="URL completa a codificar en el QR. Tiene prioridad sobre --ip.",
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="Imprime el QR una sola vez y termina.",
    )
    return parser.parse_args()


def main() -> None:
    args = parsear_argumentos()

    if args.url or args.ip:
        url = args.url or construir_url(args.ip)
        descripcion = f"IP del host usada para el QR: {args.ip}" if args.ip else "URL recibida por parametro."
        mostrar_qr_actual(url, descripcion)
        return

    ultima_ip = None

    while True:
        ip_actual = obtener_ip_local()

        if ip_actual and ip_actual != ultima_ip:
            ultima_ip = ip_actual
            mostrar_qr_actual(construir_url(ip_actual), f"IP local detectada: {ip_actual}")
            if args.once:
                return
        elif ip_actual is None and ultima_ip is not None:
            ultima_ip = None
            print("\nNo se pudo detectar una IP local valida. Esperando reconexion...\n")

        time.sleep(3)


if __name__ == "__main__":
    main()
