package controllers

import (
	"net/http"
	"nutrione/models"
	"nutrione/services"

	"github.com/gin-gonic/gin"
)

// NutritionController trata as requisições relacionadas a nutrição
type NutritionController struct {
	service *services.NutritionService
}

// NewNutritionController cria uma nova instância do controller
func NewNutritionController(service *services.NutritionService) *NutritionController {
	return &NutritionController{
		service: service,
	}
}

// CalculateTMB calcula a Taxa Metabólica Basal
func (nc *NutritionController) CalculateTMB(c *gin.Context) {
	var request models.TMBRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Validar dados
	if err := nc.service.ValidateTMBRequest(request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Calcular TMB
	response := nc.service.CalculateTMB(request)

	c.JSON(http.StatusOK, response)
}

// AnalyzeFoodPhoto analisa uma foto de comida
func (nc *NutritionController) AnalyzeFoodPhoto(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Análise por IA desabilitada"})
}

// Health verifica se a API está funcionando
func (nc *NutritionController) Health(c *gin.Context) {
	c.JSON(http.StatusOK, models.HealthResponse{
		Message: "API is running",
		Status:  "ok",
	})
}
