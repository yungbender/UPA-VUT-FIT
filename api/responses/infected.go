package responses

// InfectedResponse represents inner response of API for infected endpoint
type InfectedResponse struct {
	X []float64 `json:"x"`
	Y []float64 `json:"y"`
}

// MakeInfectedResponse returns json response for infected api endpoint
func MakeInfectedResponse(code uint8, x []float64, y []float64) BaseResponseOK {
	inner := InfectedResponse{X: x, Y: y}
	base := makeResponseOK(true, code, inner)
	return base
}
