package controllers

import (
	"backend/src/db"
	"backend/src/models"
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	mail "gopkg.in/mail.v2"
)

type UserService struct {
	DbAdapter *db.DbAdapter
}

func NewUserService(dbAdapter *db.DbAdapter) *UserService {
	return &UserService{DbAdapter: dbAdapter}
}

func (u UserService) CreateUser(ctx context.Context, r *http.Request) (models.Response, error) {
	file, _, err := r.FormFile("paymentImg")

	if err != nil {
		log.Println(err)
		return models.Response{Message: "Error uploading file1", Success: false}, err
	}

	defer file.Close()

	url, success := u.FileUpload(context.Background(), file)

	if !success {
		return models.Response{Message: "Error uploading file2", Success: false}, nil
	}

	userInput, err := u.GetUserInfo(r)
	userInput.PaymentImg = url

	log.Println(userInput)
	if err != nil {
		return models.Response{Message: "Error getting user info", Success: false}, err
	}

	isValid, message := u.ValidateUserInput(*userInput)

	if !isValid {
		return models.Response{Message: message, Success: false}, nil
	}
	userID, err := u.DbAdapter.CreateUser(ctx, *userInput)

	if err != nil {
		return models.Response{Message: "Error creating user", Success: false, Error: err.Error()}, err
	}

	go func() {
		isSent := u.SendEmail(*userInput)
		if !isSent {
			fmt.Println("Failed to send email:", err)
		} else {
			fmt.Println("Email sent successfully to")
		}
	}()
	return models.Response{Message: "User created successfully", Data: userID, Success: true}, nil

}

func (u UserService) SendEmail(user models.UserInput) bool {
	fromUser := os.Getenv("BACKEND_MAIL_USER")
	fromHeader := os.Getenv("BACKEND_MAIL_FROM")
	if fromHeader == "" {
		fromHeader = fromUser
	}
	password := os.Getenv("BACKEND_MAIL_PASSWORD")
	host := os.Getenv("BACKEND_MAIL_HOST")
	portStr := os.Getenv("BACKEND_MAIL_PORT")
	if portStr == "" {
		portStr = "587"
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		log.Println("invalid BACKEND_MAIL_PORT:", err)
		return false
	}

	to := user.Email
	log.Println("Sending email to:", to)

	emailTemplate := u.GetEmail(user.Name)

	// Build message
	m := mail.NewMessage()
	m.SetHeader("From", fromHeader)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Welcome to LinuxDiary 6.0")
	m.SetBody("text/html", emailTemplate)

	// Secure dialer
	d := mail.NewDialer(host, port, fromUser, password)
	d.StartTLSPolicy = mail.MandatoryStartTLS
	d.TLSConfig = &tls.Config{
		ServerName: host,
		MinVersion: tls.VersionTLS12,
	}
	// Optional: avoid hanging forever
	// d.Timeout = 15 * time.Second

	if err := d.DialAndSend(m); err != nil {
		log.Println("Email sending failed:", err)
		return false
	}
	return true
}

func (u UserService) GetUserInfo(r *http.Request) (*models.UserInput, error) {
	err := r.ParseMultipartForm(10 << 20)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	userInput := models.UserInput{
		Name:          r.FormValue("name"),
		Email:         r.FormValue("email"),
		Phone:         r.FormValue("phone"),
		TransactionId: r.FormValue("transactionId"),
		CollegeName:   r.FormValue("collegeName"),
		YearOfStudy:   r.FormValue("yearOfStudy"),
		Branch:        r.FormValue("branch"),
		IsDualBooted:  r.FormValue("isDualBooted") == "true",
		ReferralCode:  r.FormValue("referralCode"),
	}

	return &userInput, nil
}

func (u UserService) ValidateUserInput(userInput models.UserInput) (bool, string) {
	if userInput.Name == "" {
		return false, "Name is required"
	}
	if userInput.Email == "" {
		return false, "Email is required"
	}
	if userInput.Phone == "" {
		return false, "Phone is required"
	}
	if userInput.TransactionId == "" {
		return false, "TransactionId is required"
	}
	if userInput.CollegeName == "" {
		return false, "CollegeName is required"
	}
	if userInput.YearOfStudy == "" {
		return false, "YearOfStudy is required"
	}
	if userInput.Branch == "" {
		return false, "Branch is required"
	}
	if userInput.PaymentImg == "" {
		return false, "PaymentImg is required"
	}
	return true, ""
}

func (u UserService) GetEmail(name string) string {
	return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>LinuxDiary 6.0 Registration</title>
  </head>
  <body style="margin:0;padding:0;width:100%!important;background:#f4f4f4;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:0px;box-shadow:0 8px 24px rgba(0,0,0,0.12);overflow:hidden;">
            
            <!-- Banner -->
            <tr>
              <td>
                <img src="https://res.cloudinary.com/dakz3a0zq/image/upload/v1754223086/LD_website_Images_txwfc2.png" alt="Banner" style="display:block;width:100%;height:auto;border:0;" />
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding:35px 40px;color:#555;font-size:17px;line-height:1.6;text-align:center;">
                <h1 style="font-size:26px;margin:0 0 25px;color:#2c3e50;font-weight:600;">Hola Linux Enthusiasts! 🐧</h1>
                <div style="display:inline-block;background:linear-gradient(135deg,#3498db,#2c3e50);color:#fff;padding:8px 20px;border-radius:30px;font-weight:600;margin:15px 0;font-size:16px;box-shadow:0 4px 8px rgba(52, 152, 219, 0.3);">
                  Registration Confirmed
                </div>
                <p>We are <strong style="color:#2c3e50;font-weight:600;">pleased to inform you</strong> that your registration for <strong style="color:#2c3e50;font-weight:600;"><br>LinuxDiary 6.0</strong> was successful! 🎉</p>
                <p>The event will be held on <strong style="color:#2c3e50;font-weight:600;">16th &amp; 17th of August 2025</strong>, focusing on <strong style="color:#2c3e50;font-weight:600;">Linux Fundamentals</strong>.</p>
                <p>You will have access to all sessions and activities as a registered participant.</p>

                <!-- Event Details -->
                <div style="background:#f8f9fa;border-radius:10px;padding:25px;margin:30px 0;text-align:center;border:1px solid #eaeaea;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                  <h2 style="font-size:22px;margin:0 0 20px;color:#2c3e50;position:relative;padding-bottom:12px;">Event Details</h2>
                  <div style="width:60px;height:3px;margin:0 auto 20px;background:linear-gradient(90deg,#3498db,#2ecc71);border-radius:3px;"></div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                    <tr>
                      <td style="padding:20px 15px;background:#ffffff;border-radius:8px;border:1px solid #eee;box-shadow:0 4px 6px rgba(0,0,0,0.05);text-align:center;">
                        <h3 style="margin:0 0 8px;font-size:20px;color:#2c3e50;">Date</h3>
                        <p style="margin:0;font-size:16px;color:#7f8c8d;">16th & 17th August 2025</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 15px;background:#ffffff;border-radius:8px;border:1px solid #eee;box-shadow:0 4px 6px rgba(0,0,0,0.05);text-align:center;margin-top:20px;">
                        <h3 style="margin:0 0 8px;font-size:20px;color:#2c3e50;">Time</h3>
                        <p style="margin:0;font-size:16px;color:#7f8c8d;">9:00 AM onwards</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 15px;background:#ffffff;border-radius:8px;border:1px solid #eee;box-shadow:0 4px 6px rgba(0,0,0,0.05);text-align:center;margin-top:20px;">
                        <h3 style="margin:0 0 8px;font-size:20px;color:#2c3e50;">Venue</h3>
                        <p style="margin:0;font-size:16px;color:#7f8c8d;">Main & Mini CCF, WCE</p>
                      </td>
                    </tr>
                  </table>
                </div>

                <p>Please don't hesitate to contact us if you have any questions about the event. We're happy to assist you!</p>
                <p>🔗 <strong style="color:#2c3e50;font-weight:600;">LinuxDiary 6.0 Website:</strong> <a href="https://linuxdiary6.0.wcewlug.org" style="color:#3498db;text-decoration:none;font-weight:600;">linuxdiary6.0.wcewlug.org</a></p>
                <p>Share this with your friends and join us for an exciting Linux journey!</p>
                <p><i>We look forward to seeing you there!</i></p>
                <p>Thanks and regards,<br />
                  <strong style="color:#2c3e50;">Walchand Linux Users' Group</strong><br />
                  <strong style="color:#2c3e50;">Community | Knowledge | Share</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#2c3e50;padding:25px 30px;font-size:14px;color:#ecf0f1;text-align:center;border-top:4px solid #3498db;">
                <div style="margin:20px 0;">
                  <a href="https://wcewlug.org" style="color:#3498db;text-decoration:none;margin:0 10px;">Website</a>
                  <a href="https://linkedin.com/company/wlug-club" style="color:#3498db;text-decoration:none;margin:0 10px;">LinkedIn</a>
                  <a href="https://instagram.com/wcewlug" style="color:#3498db;text-decoration:none;margin:0 10px;">Instagram</a>
                  <a href="https://twitter.com/wcewlug" style="color:#3498db;text-decoration:none;margin:0 10px;">Twitter</a>
                  <a href="mailto:contact@wcewlug.org" style="color:#3498db;text-decoration:none;margin:0 10px;">Email</a>
                </div>
                <p style="margin:5px 0;">© 2025 WCE WLUG • Walchand College of Engineering, Sangli</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`
}

func (u UserService) FileUpload(ctx context.Context, file multipart.File) (string, bool) {
	cld, _ := cloudinary.NewFromParams(os.Getenv("CLOUDINARY_CLOUD_NAME"), os.Getenv("CLOUDINARY_KEY"), os.Getenv("CLOUDINARY_SECRET"))

	uploadResult, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "LinuxDiary6.0",
	})

	if err != nil {
		return "", false
	}

	return uploadResult.SecureURL, true

}

func (u UserService) GetRegistrationCount(ctx context.Context) (models.Response, error) {
	count, err := u.DbAdapter.GetRegistrationCount(ctx)
	if err != nil {
		return models.Response{Message: "Error getting registration count", Success: false, Error: err.Error()}, err
	}

	return models.Response{
		Message: "Registration count retrieved successfully",
		Data: map[string]interface{}{
			"count": count,
		},
		Success: true,
	}, nil
}

func (u UserService) GetReferralLeaderboard(ctx context.Context, r *http.Request) ([]models.ReferralScore, error) {
	users, err := u.DbAdapter.GetUsers(ctx)

	leaderboard := make(map[string]int)

	if err != nil {
		return nil, err
	}

	for _, user := range users {
		if user.ReferralCode != "" {
			leaderboard[strings.ToLower(strings.TrimSpace(user.ReferralCode))]++
		}
	}

	var leaderboardArr []models.ReferralScore

	for key, value := range leaderboard {
		leaderboardArr = append(leaderboardArr, models.ReferralScore{ReferralCode: key, Score: value})
	}

	sort.Slice(leaderboardArr, func(i, j int) bool {
		return leaderboardArr[i].Score > leaderboardArr[j].Score
	})
	return leaderboardArr, nil
}
