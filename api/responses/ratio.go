package responses

// RatioResponse represents inner response of API for ratio endpoint
type RatioResponse struct {
	X []float64 `json:"x"`
	Y []float64 `json:"y"`
}

// MakeRatioResponse returns json response for ratio api endpoint
func MakeRatioResponse(code uint8, x []float64, y []float64) BaseResponseOK {
	inner := RatioResponse{X: x, Y: y}
	base := makeResponseOK(true, code, inner)
	return base
}
