package models

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB postgres db connection handler
var DB *gorm.DB

type dbConfig struct {
	dbName   string
	host     string
	username string
	password string
}

func getDbConfig() dbConfig {
	dbName := os.Getenv("SQL_DBNAME")
	host := os.Getenv("SQL_HOST")
	username := os.Getenv("SQL_USERNAME")
	pwd := os.Getenv("SQL_PASSWORD")

	config := dbConfig{dbName: dbName, host: host, username: username, password: pwd}
	return config
}

var config dbConfig = getDbConfig()

// SetConn sets postgres db connection
func SetConn(newConf ...string) {
	var dsn string
	if newConf != nil {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s", newConf[0], newConf[1], newConf[2], newConf[3], newConf[4])
	} else {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432", config.host, config.username, config.password, config.dbName)
	}

	fmt.Println(dsn)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	DB = db
}
