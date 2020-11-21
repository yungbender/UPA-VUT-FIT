package middlewares

import (
	"github.com/gin-gonic/gin"
)

// HeaderWare middleware to set json headers
func HeaderWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.Header("Access-Control-Allow-Origin", "*")
		c.Next()
	}
}
