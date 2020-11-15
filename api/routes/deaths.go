package routes

import (
	"net/http"
	"upa/api/responses"

	"github.com/gin-gonic/gin"
)

// DeathsHandler returns info about deaths
func DeathsHandler(c *gin.Context) {
	// Mock response, just for test
	x := make([]float64, 0)
	y := make([]float64, 0)

	for i := 0; i < 10; i++ {
		x = append(x, float64(i))
		y = append(y, float64(i))
	}

	resp := responses.MakeDeathsResponse(http.StatusOK, x, y)
	c.JSON(http.StatusOK, resp)
}
