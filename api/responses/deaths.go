package responses

// DeathsResponse represents inner response of API for deaths endpoint
type DeathsResponse struct {
	Deaths     []float64 `json:"deaths"`
	Infected   []float64 `json:"infected"`
	Timestamps []string  `json:"timestamps"`
}

// MakeDeathsResponse returns json response for deaths api endpoint
func MakeDeathsResponse(code int, deaths []float64, infected []float64, timestamps []string) BaseResponseOK {
	inner := DeathsResponse{Deaths: deaths, Infected: infected, Timestamps: timestamps}
	base := makeResponseOK(true, code, inner)
	return base
}
