package main

import (
	"upa/api/middlewares"
	"upa/api/models"
	"upa/api/routes"

	"github.com/gin-gonic/gin"
)

func setupGin() *gin.Engine {
	engine := gin.Default()
	group := engine.Group("/query")

	group.GET("/infected", routes.InfectedHandler)
	group.GET("/deaths", routes.DeathsHandler)
	group.GET("/ratio", routes.RatioHandler)

	engine.Use(middlewares.HeaderWare)
	return engine
}

func main() {
	engine := setupGin()

	models.SetConn()

	engine.Run("0.0.0.0:8080")
}
