package responses

import (
	"upa/api/models"
)

// MakeRatioResponse returns json response for ratio api endpoint
func MakeRatioResponse(code int, data []models.ValueRes) BaseResponseOK {
	base := makeResponseOK(true, code, data)
	return base
}
