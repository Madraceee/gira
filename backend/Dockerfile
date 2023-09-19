FROM golang:latest

WORKDIR /app

COPY . .

RUN go install github.com/pressly/goose/v3/cmd/goose@latest

WORKDIR /app/internal/sql/schema 
RUN goose postgres postgres://postgres:postgres@localhost:5432/balkanID up

WORKDIR /app

RUN go build -o server

EXPOSE 8080

CMD ["./server"]