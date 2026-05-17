package main

import (
	"nutrione/config"
	"nutrione/routes"
	"nutrione/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// Carregar variáveis de ambiente
	utils.LoadEnvCandidates(".env", "../.env", "../../.env")

	// Inicializar MongoDB
	config.ConnectDB()

	// Criar router
	router := gin.Default()

	// Configurar CORS
	config.SetupCORS(router)

	// Configurar rotas
	routes.SetupRoutes(router)

	// Iniciar servidor na porta 8080
	if err := router.Run(":8080"); err != nil {
		panic(err)
	}
}
