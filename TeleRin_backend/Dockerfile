FROM python:3.13.12

WORKDIR /TELERIN

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 1240

CMD ["python", "app.py"]

