package routes

import (
	"net/http"
	"time"
	"upa/api/models"
	"upa/api/responses"

	"github.com/gin-gonic/gin"
)

const layoutISO = "2006-01-02"

// InfectedHandler returns info about infected
func InfectedHandler(c *gin.Context) {
	growthFromRaw := c.Query("growth_from")
	growthToRaw := c.Query("growth_to")

	growthFrom, err := time.Parse(layoutISO, growthFromRaw)
	if err != nil {
		panic(err)
	}

	growthTo, err := time.Parse(layoutISO, growthToRaw)
	if err != nil {
		panic(err)
	}

	var absGrowthRes []models.AbsGrowth
	models.DB.
		Table("covid19").
		Order("date_").
		Select("date_, infected - cured - deaths as agrowth").
		Where("date_ BETWEEN ? and ?", growthFrom, growthTo).
		Scan(&absGrowthRes)

	y := make([]float64, 0)

	resp := responses.MakeInfectedResponse(http.StatusOK, absGrowthRes, y)
	c.JSON(http.StatusOK, resp)
}
