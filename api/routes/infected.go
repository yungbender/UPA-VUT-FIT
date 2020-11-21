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
	absGrowthQuery := models.DB.
		Table("covid19").
		Order("date_").
		Select("date_, infected - cured - deaths as agrowth").
		Where("date_ BETWEEN ? and ?", growthFrom, growthTo)

	absGrowthQuery.
		Scan(&absGrowthRes)

	var percGrowthRes []models.PercGrowth
	totalInfectedQuery := models.DB.
		Table("covid19").
		Order("date_").
		Select("date_, sum(infected - cured - deaths) over(order by date_) as total")

	models.DB.
		Table("(?) as t1", absGrowthQuery).
		Select("t1.date_, t1.agrowth / nullif(lag(t2.total, 1, t2.total) "+
			"over (order by t2.date_), 0) as pgrowth").
		Joins("inner join (?) as t2 on t1.date_ = t2.date_", totalInfectedQuery).
		Where("t1.date_ between ? and ?", growthFrom, growthTo).
		Scan(&percGrowthRes)

	resp := responses.MakeInfectedResponse(http.StatusOK, absGrowthRes, percGrowthRes)
	c.JSON(http.StatusOK, resp)
}
