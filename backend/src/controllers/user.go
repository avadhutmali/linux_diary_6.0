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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>LinuxDiary 6.0 Registration</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* RESET */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse !important; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; max-width:100%; }

    /* OUTER WRAPPER */
    body { 
      margin:0; 
      padding:0; 
      width:100% !important; 
      background:#f4f4f4; 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .wrapper { 
      width:100%; 
      table-layout:fixed; 
      background:#f4f4f4; 
      padding:40px 0; 
    }

    /* CARD CONTAINER */
    .container {
      width:100% !important;
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:0px;
      box-shadow:0 8px 24px rgba(0,0,0,0.12);
      overflow:hidden;
    }

    /* BANNER */


    /* MAIN CONTENT */
    .content {
      padding: 35px 40px;
      color: #555;
      font-size: 17px;
      line-height: 1.6;
      text-align: center;
    }
    .content h1 {
      font-size: 26px;
      margin: 0 0 25px;
      color: #2c3e50;
      font-weight: 600;
    }
    .content p { 
      margin: 15px 0; 
    }
    .content a { 
      color: #3498db; 
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .content a:hover {
      color: #2980b9;
      text-decoration: underline;
    }
    .content strong { 
      color: #2c3e50; 
      font-weight: 600;
    }

    /* EVENT DETAILS SECTION */
    .event-details {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 25px;
      margin: 30px 0;
      text-align: center;
      border: 1px solid #eaeaea;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .event-details h2 {
      font-size: 22px;
      margin: 0 0 20px;
      color: #2c3e50;
      position: relative;
      padding-bottom: 12px;
    }
    .event-details h2:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      border-radius: 3px;
    }
    .detail-grid {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }
    .detail-card {
      flex: 1;
      min-width: 100px;
      /* max-width: 180px; */
      padding: 20px 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
      border: 1px solid #eee;
    }
    .detail-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.08);
    }
    .detail-card i {
      font-size: 28px;
      margin-bottom: 15px;
      display: block;
    }
    .detail-card .icon-calendar { color: #e74c3c; }
    .detail-card .icon-clock { color: #3498db; }
    .detail-card .icon-location { color: #2ecc71; }
    .detail-card h3 {
      margin: 0 0 8px;
      font-size: 20px;
      color: #2c3e50;
    }
    .detail-card p {
      margin: 0;
      font-size: 20px;
      color: #7f8c8d;
    }

    /* REGISTRATION BADGE */
    .badge {
      display: inline-block;
      background: linear-gradient(135deg, #3498db, #2c3e50);
      color: white;
      padding: 8px 20px;
      border-radius: 30px;
      font-weight: 600;
      margin: 15px 0;
      font-size: 16px;
      box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
    }

    /* FOOTER */
    .footer {
      background: #2c3e50;
      padding: 25px 30px;
      font-size: 14px;
      color: #ecf0f1;
      text-align: center;
      border-top: 4px solid #3498db;
    }
    .footer p {
      margin: 5px 0;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .footer-links a {
      color: #3498db;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: all 0.3s ease;
    }
    .footer-links a:hover {
      color: #1abc9c;
      transform: translateY(-2px);
    }
    .footer-links i {
      margin-right: 8px;
      font-size: 16px;
    }
    .copyright {
      font-size: 13px;
      color: #bdc3c7;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    /* RESPONSIVE */
    @media only screen and (max-width: 600px) {
      .content { padding: 25px; }
      .banner h1 { font-size: 26px; }
      .banner p { font-size: 16px; }
      .detail-grid { flex-direction: column; }
      .detail-card { max-width: 100%; }
      .footer { padding: 20px; }
    }
    @media only screen and (max-width: 480px) {
      .content { padding: 20px; font-size: 16px; }
      .content h1 { font-size: 22px; }
      .event-details { padding: 20px 15px; }
      .wrapper { padding: 20px 0; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">

      <!-- TOP BANNER -->
      <div class="banner">
		<img src="https://res.cloudinary.com/dakz3a0zq/image/upload/v1754223086/LD_website_Images_txwfc2.png" alt="">
      </div>

      <!-- MAIN CONTENT -->
      <div class="content">
        <h1>Hola Linux Enthusiasts! 🐧</h1>
        
        <div class="badge">
           Registration Confirmed
        </div>
        
        <p>We are <strong>pleased to inform you</strong> that your registration for <strong>LinuxDiary 6.0</strong> was successful! 🎉</p>
        <p>The event will be held on <strong>16th &amp; 17th of August 2025</strong>, focusing on <strong>Linux Fundamentals</strong>.</p>
        <p>You will have access to all sessions and activities as a registered participant.</p>

        <!-- ENHANCED EVENT DETAILS SECTION -->
        <div class="event-details">
          <h2>Event Details</h2>
          <div class="detail-grid">
            <div class="detail-card">
              
              <h3>Date</h3>
              <p>16th & 17th August 2025</p>
            </div>
            
            <div class="detail-card">
              
              <h3>Time</h3>
              <p>9:00 AM onwards</p>
            </div>
            
            <div class="detail-card">
             
              <h3>Venue</h3>
              <p>Main & Mini CCF, WCE</p>
            </div>
          </div>
        </div>

        <p>Please don't hesitate to contact us if you have any questions about the event. We're happy to assist you!</p>
        <p>🔗 <strong>LinuxDiary 6.0 Website:</strong> <a href="https://linuxdiary6.0.wcewlug.org">linuxdiary6.0.wcewlug.org</a></p>
        <p>Share this with your friends and join us for an exciting Linux journey!</p>
        
        <p><i>We look forward to seeing you there!</i></p>

        <p>Thanks and regards,<br>
        <strong>Walchand Linux Users' Group</strong> <br> <strong>Community | Knowledge | Share</strong> </p>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        
        <div class="footer-links">
          <a href="https://wcewlug.org">
             Website
          </a>
          <a href="https://linkedin.com/company/wlug-club">
             LinkedIn
          </a>
          <a href="https://instagram.com/wcewlug">
             Instagram
          </a>
          <a href="https://twitter.com/wcewlug">
            Twitter
          </a>
          <a href="mailto:contact@wcewlug.org">
             Email
          </a>
        </div>
        
        <p class="copyright">© 2025 WCE WLUG • Walchand College of Engineering, Sangli</p>
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
