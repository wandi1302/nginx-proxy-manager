package nginxtemplate

import (
	"npm/internal/entity"
	"npm/internal/model"
)

// GetByID finds a Host by ID
func GetByID(id uint) (Model, error) {
	var m Model
	err := m.LoadByID(id)
	return m, err
}

// List will return a list of hosts
func List(pageInfo model.PageInfo, filters []model.Filter) (entity.ListResponse, error) {
	var result entity.ListResponse

	defaultSort := model.Sort{
		Field:     "created_at",
		Direction: "ASC",
	}

	dbo := entity.ListQueryBuilder(&pageInfo, filters, entity.GetFilterMap(Model{}, true))

	// Get count of items in this search
	var totalRows int64
	if res := dbo.Model(&Model{}).Count(&totalRows); res.Error != nil {
		return result, res.Error
	}

	// Get rows
	dbo = entity.AddOffsetLimitToList(dbo, &pageInfo)
	dbo = entity.AddOrderToList(dbo, pageInfo.Sort, defaultSort)
	items := make([]Model, 0)
	if res := dbo.Find(&items); res.Error != nil {
		return result, res.Error
	}

	result = entity.ListResponse{
		Items:  items,
		Total:  totalRows,
		Limit:  pageInfo.Limit,
		Offset: pageInfo.Offset,
		Sort:   pageInfo.GetSort(defaultSort),
		Filter: filters,
	}

	return result, nil
}