package models

// ValueRes represents single info about people that died and got cured in single day
type ValueRes struct {
	Date   isodate `json:"date"`
	Deaths int     `json:"deaths"`
	Cured  int     `json:"cured"`
}
