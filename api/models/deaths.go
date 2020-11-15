package models

import "time"

// Death represents deaths table in sql
type Death struct {
	ID       int
	DateFrom time.Time `gorm:"constraint:unique"`
	DateTo   time.Time `gorm:"constraint:unique"`
	Week     int
	Deaths   int
	AgeFrom  float64 `gorm:"contraint:unique"`
	AgeTo    float64 `gorm:"constraint:unique"`
}
