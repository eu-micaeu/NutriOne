package models

// TMBRequest representa a requisição para calcular TMB
type TMBRequest struct {
	Weight float64 `json:"weight"` // em kg
	Height float64 `json:"height"` // em cm
	Age    int     `json:"age"`    // em anos
	Gender string  `json:"gender"` // "male" ou "female"
}

// TMBResponse representa a resposta do cálculo de TMB
type TMBResponse struct {
	TMB    float64 `json:"tmb"`
	Method string  `json:"method"`
}

// DishAnalysisMacros representa os macronutrientes de um prato
type DishAnalysisMacros struct {
	Protein float64 `json:"protein"`
	Carbs   float64 `json:"carbs"`
	Fat     float64 `json:"fat"`
}

// DishAnalysisResponse representa a resposta da análise de um prato
type DishAnalysisResponse struct {
	DishName          string               `json:"dishName"`
	Confidence        string               `json:"confidence"`
	EstimatedCalories float64              `json:"estimatedCalories"`
	EstimatedMacros   DishAnalysisMacros   `json:"estimatedMacros"`
	PortionEstimate   string               `json:"portionEstimate"`
	Observations      []string             `json:"observations"`
	Analysis          string               `json:"analysis"`
}

// HealthResponse representa a resposta de health check
type HealthResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}
