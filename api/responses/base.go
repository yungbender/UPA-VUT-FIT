package responses

// BaseResponseOK represents base reponse of successful request
type BaseResponseOK struct {
	Success bool        `json:"success"`
	Code    uint8       `json:"code"`
	Data    interface{} `json:"data"`
}

// BaseResponseError represents base response of unsuccessful request
type BaseResponseError struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Code    uint16 `json:"code"`
}

func makeResponseOK(succ bool, code uint8, data interface{}) BaseResponseOK {
	return BaseResponseOK{Success: succ, Code: code, Data: data}
}

// MakeResponseError creates a error json response
func MakeResponseError(succ bool, msg string, code uint16) BaseResponseError {
	return BaseResponseError{Success: succ, Message: msg, Code: code}
}
