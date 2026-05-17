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

// SetGoalRequest representa a requisição para definir a meta de calorias
type SetGoalRequest struct {
	Goal float64 `json:"goal"`
}

// User representa o perfil do usuário
type User struct {
	ID        string  `json:"id" bson:"_id,omitempty"`
	Name      string  `json:"name" bson:"name"`
	Email     string  `json:"email" bson:"email"`
	Password  string  `json:"password,omitempty" bson:"password"` // Omitir na resposta JSON por segurança
	Age       int     `json:"age" bson:"age"`
	Weight    float64 `json:"weight" bson:"weight"`
	Height    float64 `json:"height" bson:"height"`
	Gender    string  `json:"gender" bson:"gender"`
	GoalType  string  `json:"goalType" bson:"goalType"` // "loss", "maintenance", "gain"
	DailyGoal float64 `json:"dailyGoal" bson:"dailyGoal"`
}

// FoodEntry representa um registro de alimento consumido
type FoodEntry struct {
	ID       string  `json:"id" bson:"_id,omitempty"`
	UserID   string  `json:"userId" bson:"userId"`
	Name     string  `json:"name" bson:"name"`
	Calories float64 `json:"calories" bson:"calories"`
	Date     string  `json:"date" bson:"date"` // Formato YYYY-MM-DD
}

// DailyLog representa o log diário de consumo
type DailyLog struct {
	Entries []FoodEntry `json:"entries"`
	Total   float64     `json:"total"`
	Goal    float64     `json:"goal"`
}
