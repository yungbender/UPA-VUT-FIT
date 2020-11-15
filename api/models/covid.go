package models

import "time"

// Covid19 represents ORM model table covid19
type Covid19 struct {
	ID       uint
	Date     time.Time `gorm:"column:date_"`
	Infected int
	Cured    int
	Deaths   int
	Tested   int
	Ts       time.Time
}

// TableName returns real table name in db
func (Covid19) TableName() string {
	return "covid19"
}
