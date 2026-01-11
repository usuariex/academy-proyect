from decimal import Decimal, InvalidOperation
import re

# -----------------------------
# Parsing helpers (string -> Decimal)
# -----------------------------


def parse_time_to_seconds_decimal(value: str) -> Decimal:
    """
    Convierte un string de tiempo en segundos decimales.
    Acepta formatos como: "3'28\"", "3'28", "3’28", "14\"2", "14.2".
    Devuelve un Decimal con el total de segundos.
    """
    if not value:
        raise ValueError("El valor de tiempo está vacío")

    s = value.strip()

    # Formato minutos'segundos (ej. 3'28)
    m = re.match(r"^(\d+)\s*['’]\s*(\d{1,2})(?:\"?)$", s)
    if m:
        minutes, seconds = int(m.group(1)), int(m.group(2))
        total = minutes * 60 + seconds
        return Decimal(str(total))

    # Formato segundos con decimales (ej. 14.2)
    try:
        return Decimal(s)
    except InvalidOperation:
        raise ValueError(f"Formato de tiempo inválido: '{value}'")


def parse_quantity_to_decimal(value: str) -> Decimal:
    """
    Convierte un string de cantidad en Decimal.
    Ejemplos: "6", "12", "12.5".
    """
    if not value:
        raise ValueError("El valor de cantidad está vacío")

    s = value.strip()
    try:
        d = Decimal(s)
    except InvalidOperation:
        raise ValueError(f"Formato de cantidad inválido: '{value}'")

    if d < 0:
        raise ValueError("La cantidad no puede ser negativa")

    return d

# -----------------------------
# Formatting helpers (Decimal -> string)
# -----------------------------


def seconds_decimal_to_time_string(seconds: Decimal) -> str:
    """
    Convierte un Decimal de segundos en string deportivo.
    Ejemplos:
      Decimal("208") -> "3'28\""
      Decimal("214") -> "3'34\""
      Decimal("14.2") -> "14\"2"
      Decimal("14.0") -> "14\""
    """
    if seconds is None:
        return ""

    q = seconds.quantize(Decimal("0.01"))

    # Si es 60 segundos o más, mostrar como minutos'segundos"
    if q >= Decimal(60):
        total = int(q)
        minutes = total // 60
        secs = total % 60
        return f"{minutes}'{secs:02d}\""

    # Si es menos de 60, mostrar como segundos con opcional decimal
    int_part = int(q)
    frac = (q - Decimal(int_part)).quantize(Decimal("0.01"))
    if frac == 0:
        return f'{int_part}\"'   # 👈 solo segundos enteros, ej: 14"
    frac_str = str(frac).split(".")[1].rstrip("0")
    return f'{int_part}\"{frac_str}'


def quantity_decimal_to_string(value: Decimal) -> str:
    """
    Convierte un Decimal de cantidad en string limpio.
    Ejemplos:
      Decimal("6.00") -> "6"
      Decimal("12.50") -> "12.5"
    """
    if value is None:
        return ""

    q = value.normalize()
    s = format(q, 'f')
    s = s.rstrip('0').rstrip('.') if '.' in s else s
    return s
