package model

import (
	"EWSBE/internal/entity"
	"EWSBE/internal/repository"
	"time"

	"gorm.io/gorm"
)

type dataModel struct {
	db *gorm.DB
}

func NewDataRepo(db *gorm.DB) repository.DataRepository {
	return &dataModel{db: db}
}

func (r *dataModel) CreateData(u *entity.SensorData) error {
	return r.db.Create(u).Error
}

func (r *dataModel) GetAllData() ([]entity.SensorData, error) {
	var u []entity.SensorData
	if err := r.db.Order("timestamp desc").Find(&u).Error; err != nil {
		return nil, err
	}
	return u, nil
}

func (r *dataModel) GetLatestData() (*entity.SensorData, error) {
	var data entity.SensorData
	if err := r.db.Order("timestamp desc").First(&data).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &data, nil
}

func (r *dataModel) GetDataByTimeRange(start, end time.Time) ([]entity.SensorData, error) {
	var data []entity.SensorData
	if err := r.db.Where("timestamp >= ? AND timestamp <= ?", start, end).
		Order("timestamp desc").
		Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r *dataModel) GetDataByLimit(limit int) ([]entity.SensorData, error) {
	var data []entity.SensorData
	if err := r.db.Order("timestamp desc").Limit(limit).Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}
