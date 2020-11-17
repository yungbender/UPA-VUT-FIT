package models

import "time"

// AbsGrowth represents absolute infected growth in one day
type AbsGrowth struct {
	Value float64   `gorm:"column:agrowth" json:"value"`
	Date  time.Time `gorm:"column:date_" json:"date"`
}
