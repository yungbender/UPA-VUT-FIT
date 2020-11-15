package responses

// DeathsResponse represents inner response of API for deaths endpoint
type DeathsResponse struct {
	X []float64 `json:"x"`
	Y []float64 `json:"y"`
}

// MakeDeathsResponse returns json response for deaths api endpoint
func MakeDeathsResponse(code uint8, x []float64, y []float64) BaseResponseOK {
	inner := DeathsResponse{X: x, Y: y}
	base := makeResponseOK(true, code, inner)
	return base
}
