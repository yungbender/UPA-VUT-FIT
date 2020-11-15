package middlewares

import (
	"github.com/gin-gonic/gin"
)

// HeaderWare middleware to set json headers
func HeaderWare(c *gin.Context) {
	c.Next()

	c.Header("Content-Type", "application/json")
}
