FROM python:3.8-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

RUN python3 -m nltk.downloader punkt

RUN python3 -m nltk.downloader stopwords

EXPOSE 5000

CMD [ "python", "app.py"]
