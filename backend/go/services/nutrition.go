package services

import (
	"context"
	"fmt"
	"nutrione/config"
	"nutrione/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// NutritionService contém a lógica de negócio relacionada a nutrição
type NutritionService struct {
	userCollection *mongo.Collection
	foodCollection *mongo.Collection
}

// NewNutritionService cria uma nova instância do serviço
func NewNutritionService() *NutritionService {
	client := config.MongoClient
	if client == nil {
		client = config.ConnectDB()
	}
	return &NutritionService{
		userCollection: config.GetCollection(client, "users"),
		foodCollection: config.GetCollection(client, "food_entries"),
	}
}

// RegisterUser registra um novo usuário
func (s *NutritionService) RegisterUser(user models.User) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Hash da senha
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}
	user.Password = string(hashedPassword)

	// Calcular TMB automaticamente
	tmb := (10 * user.Weight) + (6.25 * user.Height) - (5 * float64(user.Age))
	if user.Gender == "male" {
		tmb += 5
	} else {
		tmb -= 161
	}

	// Definir meta diária inicial (Sedentário x1.2 como base)
	dailyGoal := tmb * 1.2

	// Ajustar meta conforme o objetivo
	switch user.GoalType {
	case "loss":
		dailyGoal -= 500 // Déficit padrão para emagrecimento
	case "gain":
		dailyGoal += 400 // Superávit moderado
	}

	user.DailyGoal = dailyGoal

	// Se ID estiver vazio, o MongoDB gerará um
	res, err := s.userCollection.InsertOne(ctx, user)
	if err != nil {
		return models.User{}, err
	}

	user.ID = res.InsertedID.(primitive.ObjectID).Hex()
	user.Password = "" // Não retornar senha
	return user, nil
}

// LoginUser busca um usuário pelo e-mail e verifica a senha
func (s *NutritionService) LoginUser(email, password string) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := s.userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.User{}, fmt.Errorf("usuário não encontrado")
		}
		return models.User{}, err
	}

	// Verificar senha
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return models.User{}, fmt.Errorf("senha incorreta")
	}

	user.Password = "" // Não retornar senha
	return user, nil
}

// AddFoodEntry adiciona um novo registro de alimento
func (s *NutritionService) AddFoodEntry(entry models.FoodEntry) (models.FoodEntry, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if entry.Date == "" {
		entry.Date = time.Now().Format("2006-01-02")
	}

	res, err := s.foodCollection.InsertOne(ctx, entry)
	if err != nil {
		return models.FoodEntry{}, err
	}

	entry.ID = res.InsertedID.(primitive.ObjectID).Hex()
	return entry, nil
}

// GetDailyLog retorna o log do dia especificado
func (s *NutritionService) GetDailyLog(userID string, date string) (models.DailyLog, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if date == "" {
		date = time.Now().Format("2006-01-02")
	}

	filter := bson.M{
		"userId": userID,
		"date":   date,
	}

	cursor, err := s.foodCollection.Find(ctx, filter)
	if err != nil {
		return models.DailyLog{}, err
	}
	defer cursor.Close(ctx)

	entries := []models.FoodEntry{}
	var total float64
	for cursor.Next(ctx) {
		var entry models.FoodEntry
		if err := cursor.Decode(&entry); err != nil {
			continue
		}
		entries = append(entries, entry)
		total += entry.Calories
	}

	// Buscar meta do usuário
	var user models.User
	objID, _ := primitive.ObjectIDFromHex(userID)
	err = s.userCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	
	goal := 2000.0
	if err == nil && user.DailyGoal > 0 {
		goal = user.DailyGoal
	}

	return models.DailyLog{
		Entries: entries,
		Total:   total,
		Goal:    goal,
	}, nil
}

// DeleteFoodEntry remove um registro de alimento pelo ID
func (s *NutritionService) DeleteFoodEntry(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = s.foodCollection.DeleteOne(ctx, bson.M{"_id": objID})
	return err
}

// SetCalorieGoal define a meta diária de calorias para um usuário
func (s *NutritionService) SetCalorieGoal(userID string, goal float64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	_, err = s.userCollection.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		bson.M{"$set": bson.M{"dailyGoal": goal}},
	)
	return err
}

// GetUserByID retorna um usuário pelo ID
func (s *NutritionService) GetUserByID(id string) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.User{}, err
	}

	var user models.User
	err = s.userCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	return user, err
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
