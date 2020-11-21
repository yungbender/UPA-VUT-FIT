package models

// AbsGrowth represents absolute infected growth in one day
type AbsGrowth struct {
	Value float64 `gorm:"column:agrowth" json:"value"`
	Date  isodate `gorm:"column:date_" json:"date"`
}

// PercGrowth represents percentual infected growth in one day
type PercGrowth struct {
	Value float64 `gorm:"column:pgrowth" json:"value"`
	Date  isodate `gorm:"column:date_" json:"date"`
}

// SMA represents infected Simple Moving Average in one day
type SMA struct {
	Value float64 `gorm:"column:sma" json:"value"`
	Date  isodate `gorm:"column:date_" json:"date"`
}
