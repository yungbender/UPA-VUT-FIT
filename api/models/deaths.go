package models

// Death represents deaths table in sql
type Death struct {
	ID       int
	DateFrom isodate `gorm:"constraint:unique"`
	DateTo   isodate `gorm:"constraint:unique"`
	Week     int
	Deaths   int
	AgeFrom  float64 `gorm:"contraint:unique"`
	AgeTo    float64 `gorm:"constraint:unique"`
}
