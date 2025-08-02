package controllers

import (
	"backend/src/db"
	"backend/src/models"
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"sort"
	"strings"
  "crypto/tls"
	"strconv"

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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>LinuxDiary 6.0 Registration</title>
  <style>
    /* RESET */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse !important; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; max-width:100%; }

    /* OUTER WRAPPER */
    body { margin:0; padding:0; width:100% !important; background:#f4f4f4; }
    .wrapper { width:100%; table-layout:fixed; background:#f4f4f4; padding:40px 0; }

    /* CARD CONTAINER */
    .container {
      width:100% !important;
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:12px;
      box-shadow:0 4px 12px rgba(0,0,0,0.15);
      overflow:hidden;
    }

    /* BANNER */
    .banner img { display:block; width:100%; height:auto; }

    /* MAIN CONTENT */
    .content {
      padding:30px;
      font-family:"Times New Roman", Times, Baskerville, Georgia, serif;
      color:#757575;
      font-size:17px;
      line-height:1.5;
    }
    .content h1 {
      font-size:22px;
      margin:0 0 20px;
      color:#222222;
      font-family:Helvetica, Arial, sans-serif;
    }
    .content p { margin:10px 0; }
    .content ul { margin:10px 0 20px 20px; padding:0; }
    .content ul li { margin-bottom:8px; }
    .content a { color:#007C89; text-decoration:underline; }
    .content strong { color:#333333; }

    /* FOOTER */
    .footer {
      background:#333333;
      padding:20px 30px;
      font-family:Helvetica, Arial, sans-serif;
      font-size:12px;
      color:#ffffff;
      text-align:center;
    }
    .footer a { color:#ffffff; text-decoration:none; margin:0 8px; }

    /* RESPONSIVE */
    @media only screen and (max-width:480px) {
      .content { padding:20px; font-size:16px; }
      .content h1 { font-size:20px; }
      .footer { padding:15px 20px; font-size:11px; }
      .wrapper { padding:20px 0; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">

      <!-- TOP BANNER -->
      <div class="banner">
        <img
          src="https://res.cloudinary.com/dakz3a0zq/image/upload/v1754077964/Pink_and_Blue_Light_Gradient_Aesthetic_Minimalist_Album_Cover_qxrszk.png"
          alt="LinuxDiary 6.0 Banner" />
      </div>

      <!-- MAIN CONTENT -->
      <div class="content">
        <h1>Hola Linux Enthusiast! 🐧</h1>
        <p>We are <strong>pleased to inform you</strong> that your registration for <strong>LinuxDiary 6.0</strong> was successful! 🎉</p>
        <p>The event will be held on <strong>16th &amp; 17th of August 2025</strong>, focusing on <strong>Linux Fundamentals</strong>. 🐧</p>
        <p>You will have access to all the sessions and activities we have scheduled for the event as a registered participant.</p>

        <p><strong>Event Details:</strong></p>
        <ul>
          <li>📅 <strong>Date:</strong> 16th &amp; 17th of August 2025</li>
          <li>⏰ <strong>Time:</strong> 9:00 AM</li>
          <li>📍 <strong>Venue:</strong> Main &amp; Mini CCF, WCE</li>
        </ul>

        <p>Please do not hesitate to contact us if you have any queries about the event. We will be happy to assist you in any way we can.</p>
        <p>🔗 <strong>LinuxDiary 6.0 Website:</strong> <a href="https://linuxdiary6.0.wcewlug.org">linuxdiary6.0.wcewlug.org</a><br>
        Do share this with your friends and join us for an exciting journey!</p>
        <p><i>We look forward to seeing you there!</i></p>

        <p>Thanks and regards,<br>
        <strong>Walchand Linux Users' Group</strong></p>
      </div>

      <!-- FOOTER INSIDE CARD -->
      <div class="footer">
        <p>Empowering through Open Source • © 2025 WCE WLUG</p>
        <p>
          <a href="https://wcewlug.org">Website</a>|
          <a href="https://linkedin.com/company/wlug-club">LinkedIn</a>|
          <a href="https://instagram.com/wcewlug">Instagram</a>|
          <a href="https://twitter.com/wcewlug">Twitter</a>
        </p>
      </div>

    </div>
  </div>
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
