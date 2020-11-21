package responses

import (
	"upa/api/models"
)

// InfectedResponse represents inner response of API for infected endpoint
type InfectedResponse struct {
	AbsGrowth  []models.AbsGrowth  `json:"abs_growth"`
	PercGrowth []models.PercGrowth `json:"perc_growth"`
	SMA        []models.SMA        `json:"sma"`
}

// MakeInfectedResponse returns json response for infected api endpoint
func MakeInfectedResponse(code uint8, inner InfectedResponse) BaseResponseOK {
	base := makeResponseOK(true, code, inner)
	return base
}
