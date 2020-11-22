package routes

import (
	"errors"
	"net/http"
	"time"
	"upa/api/models"
	"upa/api/responses"

	"github.com/gin-gonic/gin"
)

type parameters struct {
	dateFrom time.Time
	dateTo   time.Time
}

func paramsCheckParse(params ...string) (par parameters, err error) {
	dateFrom, errFrom := time.Parse(layoutISO, params[0])
	dateTo, errTo := time.Parse(layoutISO, params[1])

	par = parameters{dateFrom: dateFrom, dateTo: dateTo}

	if errFrom != nil || errTo != nil {
		err = errors.New("Invalid date ranges specified")
	} else if dateFrom.Unix() >= dateTo.Unix() {
		err = errors.New("Date from is higher than to")
	} else {
		err = nil
	}
	return
}

// RatioHandler returns info about ratio of deaths and recovered
func RatioHandler(c *gin.Context) {
	var resp interface{}
	var status int

	dateFromRaw := c.Query("date_from")
	dateToRaw := c.Query("date_to")

	// Set default values if not selected
	// Default sets one week window for graph
	if dateFromRaw != "" {
		if dateToRaw == "" {
			dateToRaw = time.Now().Format(layoutISO)
		}
	} else {
		dateFromRaw = time.Now().AddDate(0, 0, -7).Format(layoutISO)
		dateToRaw = time.Now().Format(layoutISO)
	}

	params, err := paramsCheckParse(dateFromRaw, dateToRaw)

	if err != nil {
		resp = responses.MakeResponseError(false, err.Error(), http.StatusBadRequest)
		c.JSON(status, resp)
		return
	}

	var curedData []models.ValueRes
	models.DB.
		Table("covid19").
		Select("date_ as date, deaths, cured, TRUNC(deaths / NULLIF(deaths + cured, 0) * 100, 2) as death_ratio, TRUNC(cured / NULLIF(deaths + cured, 0) * 100, 2) as cured_ratio").
		Where("date_ BETWEEN ? AND ?", params.dateFrom, params.dateTo).
		Order("date_").
		Scan(&curedData)

	status = http.StatusOK
	resp = responses.MakeRatioResponse(status, curedData)
	c.JSON(status, resp)
}
