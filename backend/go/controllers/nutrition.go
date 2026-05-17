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

// RegisterUser registra um novo usuário
func (nc *NutritionController) RegisterUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	result, err := nc.service.RegisterUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao registrar usuário"})
		return
	}

	c.JSON(http.StatusCreated, result)
}

// Login realiza o login do usuário
func (nc *NutritionController) Login(c *gin.Context) {
	var request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	user, err := nc.service.LoginUser(request.Email, request.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetProfile retorna os dados do usuário logado
func (nc *NutritionController) GetProfile(c *gin.Context) {
	userID := c.GetHeader("X-User-ID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UserID não fornecido"})
		return
	}

	user, err := nc.service.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// AddFoodEntry adiciona um registro de alimento
func (nc *NutritionController) AddFoodEntry(c *gin.Context) {
	userID := c.GetHeader("X-User-ID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UserID não fornecido"})
		return
	}

	var entry models.FoodEntry
	if err := c.ShouldBindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	entry.UserID = userID

	result, err := nc.service.AddFoodEntry(entry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, result)
}

// GetDailyLog retorna o log diário
func (nc *NutritionController) GetDailyLog(c *gin.Context) {
	userID := c.GetHeader("X-User-ID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UserID não fornecido"})
		return
	}

	date := c.Query("date")
	log, err := nc.service.GetDailyLog(userID, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, log)
}

// DeleteFoodEntry remove um registro
func (nc *NutritionController) DeleteFoodEntry(c *gin.Context) {
	id := c.Param("id")
	if err := nc.service.DeleteFoodEntry(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// SetCalorieGoal define a meta de calorias
func (nc *NutritionController) SetCalorieGoal(c *gin.Context) {
	userID := c.GetHeader("X-User-ID")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UserID não fornecido"})
		return
	}

	var request models.SetGoalRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	if err := nc.service.SetCalorieGoal(userID, request.Goal); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Meta atualizada com sucesso"})
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
