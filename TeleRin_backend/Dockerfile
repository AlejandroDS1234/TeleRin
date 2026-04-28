FROM python:3.13.12

WORKDIR /TELERIN


COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

COPY . .

EXPOSE 1240

CMD ["python", "app.py"]

