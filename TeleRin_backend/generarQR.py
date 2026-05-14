import argparse
import qrcode

def imprimir_qr(url: str) -> None:
    qr_terminal = qrcode.QRCode(border=1)
    qr_terminal.add_data(url)
    qr_terminal.make(fit=True)
    qr_terminal.print_ascii(invert=True)

def main() -> None:
    parser = argparse.ArgumentParser(description="Imprime un QR con la URL del frontend de TeleRin.")
    parser.add_argument("--url", required=True, help="URL completa a codificar en el QR.")
    args = parser.parse_args()

    print(f"URL para compartir: {args.url}")
    imprimir_qr(args.url)

if __name__ == "__main__":
    main() 
