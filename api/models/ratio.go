package models

// ValueRes represents single info about people that died and got cured in single day
type ValueRes struct {
	Date       isodate `json:"date"`
	Deaths     float64 `json:"deaths"`
	Cured      float64 `json:"cured"`
	DeathRatio float64 `json:"death_ratio"`
	CuredRatio float64 `json:"cured_ratio"`
}
