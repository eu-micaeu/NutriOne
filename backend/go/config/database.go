package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

// ConnectDB estabelece conexão com o MongoDB
func ConnectDB() *mongo.Client {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Erro ao conectar ao MongoDB:", err)
	}

	// Verificar a conexão
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Não foi possível pingar o MongoDB:", err)
	}

	fmt.Println("Conectado ao MongoDB com sucesso!")
	MongoClient = client
	return client
}

// GetCollection retorna uma coleção do MongoDB
func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	dbName := os.Getenv("MONGODB_DATABASE")
	if dbName == "" {
		dbName = "nutrione"
	}
	return client.Database(dbName).Collection(collectionName)
}
