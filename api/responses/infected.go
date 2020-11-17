package responses

import (
	"upa/api/models"
)

// InfectedResponse represents inner response of API for infected endpoint
type InfectedResponse struct {
	AbsGrowth []models.AbsGrowth `json:"abs_growth"`
	Y         []float64          `json:"y"`
}

// MakeInfectedResponse returns json response for infected api endpoint
func MakeInfectedResponse(code uint8, x []models.AbsGrowth, y []float64) BaseResponseOK {
	inner := InfectedResponse{AbsGrowth: x, Y: y}
	base := makeResponseOK(true, code, inner)
	return base
}
