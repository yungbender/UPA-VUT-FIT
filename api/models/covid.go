package models

import (
	"time"
)

// Covid19 represents ORM model table covid19
type Covid19 struct {
	ID       uint
	Date     isodate `gorm:"column:date_"`
	Infected float64
	Cured    float64
	Deaths   float64
	Tested   float64
	Ts       time.Time
}

// TableName returns real table name in db
func (Covid19) TableName() string {
	return "covid19"
}
