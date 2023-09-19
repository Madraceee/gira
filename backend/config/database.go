package config

import (
	"database/sql"
	"log"
    _ "github.com/lib/pq"
)


func GetDatabaseConn(env *EnvVars) (*sql.DB,error){
    conn, err := sql.Open("postgres",env.DB_URL)
    if err != nil{
        return nil, err
    }

    log.Print("Connected to Database")
    return conn,nil
}
