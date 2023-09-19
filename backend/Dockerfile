FROM golang:latest

WORKDIR /app

COPY . .

RUN go install github.com/pressly/goose/v3/cmd/goose@latest

WORKDIR /app/internal/sql/schema 

WORKDIR /app

RUN go build -o server

EXPOSE 8080

RUN ["chmod","+x","/app/run.sh"]