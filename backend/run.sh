#!/bin/sh
goose -dir "/app/internal/sql/schema" postgres postgres://postgres:postgres@database:5432/balkanID up
./server