package db

import (
	"backend/src/models"
	"context"
	"log/slog"
	"os"
	"time"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DbAdapter struct {
	Db *mongo.Database
}

func NewDbAdapter(ctx context.Context) (*DbAdapter, error) {
	uri := os.Getenv("BACKEND_MONGO_PROTOCOL") + "://" + os.Getenv("BACKEND_MONGO_USER") + ":" + os.Getenv("BACKEND_MONGO_PASS") + "@" + os.Getenv("BACKEND_MONGO_HOST") + "/" + os.Getenv("BACKEND_MONGO_DB") + "?retryWrites=true&w=majority"
	fmt.Println("Mongo URI:", uri)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		slog.Error("Error connecting to mongo", err)
		return nil, err
	}
	err = client.Ping(ctx, nil)

	if err != nil {
		slog.Error("Error pinging mongo", err)
		return nil, err
	}

	db := client.Database("LinuxDiary6")

	_, err = db.Collection("users").Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}, {Key: "phone", Value: 1}, {Key: "transactionId", Value: 1}},
		Options: options.Index().SetUnique(true),
	})

	if err != nil {
		slog.Error("Error creating index", err)
		return nil, err
	}

	return &DbAdapter{Db: db}, nil
}

func (d DbAdapter) Close(ctx context.Context) error {
	err := d.Db.Client().Disconnect(ctx)
	if err != nil {
		slog.Error("db disconnection failure: " + err.Error())
		return err
	}
	return nil
}

func (d DbAdapter) CreateUser(ctx context.Context, user models.UserInput) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	inserted, err := d.Db.Collection("users").InsertOne(ctx, user)
	if err != nil {
		slog.Error("Error creating user", err)
		return "", err
	}
	return inserted.InsertedID.(primitive.ObjectID).Hex(), nil
}

func (d DbAdapter) GetUser(ctx context.Context, id string) (models.User, error) {
	var user models.User
	oid, err := primitive.ObjectIDFromHex(id)

	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if err != nil {
		slog.Error("Error converting id to oid", err)
		return user, err
	}
	err = d.Db.Collection("users").FindOne(ctx, bson.D{{Key: "_id", Value: oid}}).Decode(&user)
	if err != nil {
		slog.Error("Error getting user", err)
		return user, err
	}
	return user, nil
}

func (d DbAdapter) GetUserByEmail(ctx context.Context, email string) (models.User, error) {
	var user models.User
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	err := d.Db.Collection("users").FindOne(ctx, bson.D{{Key: "email", Value: email}}).Decode(&user)
	if err != nil {
		slog.Error("Error getting user by email", err)
		return user, err
	}
	return user, nil
}

func (d DbAdapter) GetUserByPhone(ctx context.Context, phone string) (models.User, error) {
	var user models.User
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	err := d.Db.Collection("users").FindOne(ctx, bson.D{{Key: "phone", Value: phone}}).Decode(&user)
	if err != nil {
		slog.Error("Error getting user by phone", err)
		return user, err
	}
	return user, nil
}

func (d DbAdapter) GetUserByTransactionId(ctx context.Context, transactionId string) (models.User, error) {
	var user models.User
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	err := d.Db.Collection("users").FindOne(ctx, bson.D{{Key: "transactionId", Value: transactionId}}).Decode(&user)
	if err != nil {
		slog.Error("Error getting user by transactionId", err)
		return user, err
	}
	return user, nil
}

func (d DbAdapter) GetUsers(ctx context.Context) ([]models.User, error) {
	var users []models.User
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	cursor, err := d.Db.Collection("users").Find(ctx, bson.D{})
	if err != nil {
		slog.Error("Error getting users", err)
		return users, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var user models.User
		cursor.Decode(&user)
		users = append(users, user)
	}
	return users, nil
}
