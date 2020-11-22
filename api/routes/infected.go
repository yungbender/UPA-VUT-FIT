package routes

import (
	"net/http"
	"strconv"
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
	smaFromRaw := c.Query("sma_from")
	smaToRaw := c.Query("sma_to")
	smaStepRaw := c.Query("sma_step")

	if growthFromRaw == "" || smaFromRaw == "" || smaStepRaw == "" {
		growthFromRaw = time.Now().AddDate(0, 0, -14).Format(layoutISO)
		growthToRaw = time.Now().Format(layoutISO)
		smaFromRaw = time.Now().AddDate(0, 0, -14).Format(layoutISO)
		smaToRaw = time.Now().Format(layoutISO)
		smaStepRaw = "10"
	} else if growthToRaw == "" || smaToRaw == "" {
		growthToRaw = time.Now().Format(layoutISO)
		smaToRaw = time.Now().Format(layoutISO)
		smaStepRaw = "10"
	}

	// Date parse
	growthFrom, err := time.Parse(layoutISO, growthFromRaw)
	if err != nil {
		panic(err)
	}

	growthTo, err := time.Parse(layoutISO, growthToRaw)
	if err != nil {
		panic(err)
	}

	smaFrom, err := time.Parse(layoutISO, smaFromRaw)
	if err != nil {
		panic(err)
	}

	smaTo, err := time.Parse(layoutISO, smaToRaw)
	if err != nil {
		panic(err)
	}

	smaStep, err := strconv.Atoi(smaStepRaw)
	if err != nil {
		panic(err)
	}

	// SMA interval check
	if smaFrom.Before(growthFrom) || smaTo.After(growthTo) {
		resp := responses.MakeResponseError(
			false,
			"SMA interval has to be within Growth interval",
			http.StatusBadRequest,
		)
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	// SMA step check
	if int(smaTo.Sub(smaFrom).Hours()/24+1) < smaStep {
		resp := responses.MakeResponseError(
			false,
			"SMA interval has to be at least as long as SMA step",
			http.StatusBadRequest,
		)
		c.JSON(http.StatusBadRequest, resp)
		return
	}

	// Absolute growth retrieve
	var absGrowthRes []models.AbsGrowth
	absGrowthQuery := models.DB.
		Table("covid19").
		Order("date_").
		Select("date_, infected - cured - deaths as agrowth").
		Where("date_ BETWEEN ? and ?", growthFrom, growthTo)

	absGrowthQuery.
		Scan(&absGrowthRes)

	// Percentual growth retrieve
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

	// SMA retrieve
	var smaRes []models.SMA
	smaQuery := models.DB.
		Table("(?) as t1", absGrowthQuery).
		Select("date_, row_number() over (order by date_ asc) rnumber,"+
			"avg(agrowth) over (order by date_ asc rows ? preceding) as sma", smaStep-1).
		Where("date_ between ? and ?", smaFrom, smaTo)

	models.DB.
		Table("(?) as t1", smaQuery).
		Select("date_, sma").
		Where("rnumber >= ?", smaStep).
		Scan(&smaRes)

	data := responses.InfectedResponse{
		AbsGrowth:  absGrowthRes,
		PercGrowth: percGrowthRes,
		SMA:        smaRes,
	}
	resp := responses.MakeInfectedResponse(http.StatusOK, data)
	c.JSON(http.StatusOK, resp)
}
