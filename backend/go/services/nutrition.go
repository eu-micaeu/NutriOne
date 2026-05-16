package services

import (
	"nutrione/models"
)

// NutritionService contém a lógica de negócio relacionada a nutrição
type NutritionService struct{}

// NewNutritionService cria uma nova instância do serviço
func NewNutritionService() *NutritionService {
	return &NutritionService{}
}

// ValidateTMBRequest valida os dados da requisição de TMB
func (s *NutritionService) ValidateTMBRequest(req models.TMBRequest) error {
	if req.Weight <= 0 || req.Height <= 0 || req.Age <= 0 {
		return ErrInvalidValues
	}

	if req.Gender != "male" && req.Gender != "female" {
		return ErrInvalidGender
	}

	return nil
}

// CalculateTMB calcula a Taxa Metabólica Basal usando a fórmula de Mifflin-St Jeor
func (s *NutritionService) CalculateTMB(req models.TMBRequest) models.TMBResponse {
	var tmb float64

	// Fórmula de Mifflin-St Jeor
	if req.Gender == "male" {
		tmb = (10 * req.Weight) + (6.25 * req.Height) - (5 * float64(req.Age)) + 5
	} else {
		tmb = (10 * req.Weight) + (6.25 * req.Height) - (5 * float64(req.Age)) - 161
	}

	return models.TMBResponse{
		TMB:    tmb,
		Method: "Mifflin-St Jeor",
	}
}

// AnalyzeFoodPhoto analisa uma foto de comida
// Atualmente desabilitado - retorna erro
func (s *NutritionService) AnalyzeFoodPhoto(imageData []byte) (models.DishAnalysisResponse, error) {
	return models.DishAnalysisResponse{}, ErrNotImplemented
}
