package routes

import (
	"nutrione/controllers"
	"nutrione/services"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configura todas as rotas da aplicação
func SetupRoutes(router *gin.Engine) {
	// Instanciar serviços
	nutritionService := services.NewNutritionService()

	// Instanciar controllers
	nutritionController := controllers.NewNutritionController(nutritionService)

	// Health check
	router.GET("/health", nutritionController.Health)

	// Rotas da API
	apiGroup := router.Group("/api")
	{
		tmbGroup := apiGroup.Group("/tmb")
		{
			tmbGroup.POST("/calculate", nutritionController.CalculateTMB)
		}

		foodGroup := apiGroup.Group("/food")
		{
			foodGroup.POST("/analyze", nutritionController.AnalyzeFoodPhoto)
		}
	}
}
