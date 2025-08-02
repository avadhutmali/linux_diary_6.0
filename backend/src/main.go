package main

import (
	"backend/src/controllers"
	"backend/src/db"
	"context"
	"encoding/json"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ Warning: .env file not found, using system environment variables")
	}

	port := os.Getenv("BACKEND_PORT")

	if port == "" {
		port = "5000"
	}

	muxRouter := mux.NewRouter()
	dbServ, err := db.NewDbAdapter(context.Background())
	if err != nil {
		panic(err)
	}

	userService := controllers.NewUserService(dbServ)

	muxRouter.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "Welcome to LinuxDiary6.0"}`))
	}).Methods("GET")

	muxRouter.HandleFunc("/registration", func(w http.ResponseWriter, r *http.Request) {
		response, _ := userService.CreateUser(context.Background(), r)

		// response := map[string]interface{}{
		// 	"success": true,
		// 	"message": "Registrations are closed !",
		// }
		jsonResponse, _ := json.Marshal(response)
		log.Println(response)
		if !response.Success {
			http.Error(w, string(jsonResponse), http.StatusBadRequest)
			return
		}

		// if err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResponse)
	}).Methods("POST")

	muxRouter.HandleFunc("/admin/getReferralLeaderboard", func(w http.ResponseWriter, r *http.Request) {
		password := r.Header.Get("Authorization")
		if password != os.Getenv("ADMIN_PASSWORD") {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		response, _ := userService.GetReferralLeaderboard(context.Background(), r)

		jsonResponse, err := json.Marshal(response)
		log.Println(response)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResponse)
	})

	muxRouter.HandleFunc("/user/registrationCount", func(w http.ResponseWriter, r *http.Request) {
		response, err := userService.GetRegistrationCount(context.Background())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		jsonResponse, err := json.Marshal(response)
		log.Println(response)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonResponse)
	}).Methods("GET")

	corsOptions := cors.New(
		cors.Options{
			AllowedOrigins:   []string{"**", "*"},
			AllowedHeaders:   []string{"X-Requested-With", "Content-Type", "Authorization"},
			AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
			AllowCredentials: true,
		},
	)

	httpRouter := corsOptions.Handler(muxRouter)

	log.Println("Server started at port " + port)
	slog.Error(http.ListenAndServe(":"+port, httpRouter).Error())
}
