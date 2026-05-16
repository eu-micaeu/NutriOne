package main

import (
	"bufio"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type TMBRequest struct {
	Weight float64 `json:"weight"` // em kg
	Height float64 `json:"height"` // em cm
	Age    int     `json:"age"`    // em anos
	Gender string  `json:"gender"` // "male" ou "female"
}

type TMBResponse struct {
	TMB    float64 `json:"tmb"`
	Method string  `json:"method"`
}

type DishAnalysisMacros struct {
	Protein float64 `json:"protein"`
	Carbs   float64 `json:"carbs"`
	Fat     float64 `json:"fat"`
}

type DishAnalysisResponse struct {
	DishName          string             `json:"dishName"`
	Confidence        string             `json:"confidence"`
	EstimatedCalories float64            `json:"estimatedCalories"`
	EstimatedMacros   DishAnalysisMacros `json:"estimatedMacros"`
	PortionEstimate   string             `json:"portionEstimate"`
	Observations      []string           `json:"observations"`
	Analysis          string             `json:"analysis"`
}

// CalculateTMB calcula a Taxa Metabólica Basal usando a fórmula de Mifflin-St Jeor
func CalculateTMB(c *gin.Context) {
	var request TMBRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Validação dos dados
	if request.Weight <= 0 || request.Height <= 0 || request.Age <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Valores devem ser maiores que zero"})
		return
	}

	if request.Gender != "male" && request.Gender != "female" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gênero deve ser 'male' ou 'female'"})
		return
	}

	var tmb float64

	// Fórmula de Mifflin-St Jeor
	if request.Gender == "male" {
		tmb = (10 * request.Weight) + (6.25 * request.Height) - (5 * float64(request.Age)) + 5
	} else {
		tmb = (10 * request.Weight) + (6.25 * request.Height) - (5 * float64(request.Age)) - 161
	}

	response := TMBResponse{
		TMB:    tmb,
		Method: "Mifflin-St Jeor",
	}

	c.JSON(http.StatusOK, response)
}

// AnalyzeFoodPhoto atualmente desabilitado — retorna 501
func AnalyzeFoodPhoto(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Análise por IA desabilitada"})
}

func loadEnvFile(path string) {
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		if strings.HasPrefix(line, "export ") {
			line = strings.TrimSpace(strings.TrimPrefix(line, "export "))
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		value = strings.Trim(value, `"`)
		value = strings.Trim(value, "'")

		if key == "" {
			continue
		}

		if _, exists := os.LookupEnv(key); !exists {
			_ = os.Setenv(key, value)
		}
	}
}

func loadEnvCandidates(paths ...string) {
	for _, path := range paths {
		loadEnvFile(path)
	}
}

func main() {
	loadEnvCandidates(".env", "../.env", "../../.env")

	router := gin.Default()

	// Configurar CORS para aceitar requisições do frontend
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Rota de health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "API is running"})
	})

	// Rotas da aplicação
	router.POST("/api/tmb/calculate", CalculateTMB)
	router.POST("/api/food/analyze", AnalyzeFoodPhoto)

	// Iniciar servidor na porta 8080
	router.Run(":8080")
}
