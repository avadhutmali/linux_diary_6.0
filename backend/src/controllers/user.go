package controllers

import (
	"backend/src/db"
	"backend/src/models"
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"net/smtp"
	"os"
	"sort"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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
	from := os.Getenv("BACKEND_MAIL_USER")
	password := os.Getenv("BACKEND_MAIL_PASSWORD")
	host := os.Getenv("BACKEND_MAIL_HOST")
	to := user.Email

	log.Println(from, password, host, to)

	auth := smtp.PlainAuth("", from, password, host)

	emailTemplate := u.GetEmail(user.Name)

	msg := []byte("From: " + from + "\r\n" + "To: " + to + "\r\n" +
		"Subject: Welcome to LinuxDiary 5.0\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n\r\n" +
		emailTemplate)

	err := smtp.SendMail(host+":587", auth, from, []string{to}, msg)

	if err != nil {
		log.Println(err)
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
      rel="stylesheet"
    />
    <title>LinuxDiary 4.0</title>
  </head>

  <body style="font-family: 'Poppins', sans-serif">
    <div>
      <u></u>

      <div
        style="
          text-align: center;
          margin: 0;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 0;
          padding-right: 0;
          background-color: #f2f4f6;
          color: #000000;
        "
        align="center"
      >
        <div style="text-align: center">
          <table
            align="center"
            style="
              text-align: center;
              vertical-align: middle;
              width: 600px;
              max-width: 600px;
            "
            width="600"
          >
            <tbody>
              <tr>
                <td
                  style="width: 596px; vertical-align: middle"
                  width="596"
                ></td>
              </tr>
            </tbody>
          </table>

          <img
            style="text-align: center"
            alt="LinuxDiary 5.0 Banner"
            src="https://res.cloudinary.com/dg2mm9fsw/image/upload/v1722574625/z6yzdhbdougktb1ofozo.gif"
            width="600"
            class="CToWUd a6T"
            data-bit="iit"
            tabindex="0"
          />
          <!--<video width="600" autoplay loop muted>
            <source src="https://cdn.discordapp.com/attachments/1249775253564166264/1268443684333158482/2.mp4?ex=66ac71bc&is=66ab203c&hm=d0f9a7293ad4609738cc61bbc659f3a0b7a9d592d90ccb708c8e79bf6e7696d5&" type="video/mp4">
            Your browser does not support the video tag.
          </video>-->

          <div
            class="a6S"
            dir="ltr"
            style="opacity: 0.01; left: 552px; top: 501.5px"
          >
            <div
              id=":155"
              class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q"
              role="button"
              tabindex="0"
              aria-label="Download attachment "
              jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc2MjU0MTQxMTA0MjYyMTM2NyIsbnVsbCxbXV0."
              data-tooltip-class="a1V"
              data-tooltip="Download"
            >
              <div class="akn">
                <div class="aSK J-J5-Ji aYr"></div>
              </div>
            </div>
          </div>

          <table
            align="center"
            style="
              text-align: center;
              vertical-align: top;
              width: 600px;
              max-width: 600px;
              background-color: #ffffff;
            "
            width="600"
          >
            <tbody style="color: #343434">
              <tr>
                <td
                  style="
                    width: 596px;
                    vertical-align: top;
                    padding-left: 30px;
                    padding-right: 30px;
                    padding-top: 30px;
                    padding-bottom: 40px;
                  "
                  width="596"
                >
                  <h1
                    style="
                      font-size: 22px;
                      line-height: 34px;
                      font-family: 'Helvetica', Arial, sans-serif;
                      font-weight: 600;
                      text-decoration: none;
                      color: #000000;
                    "
                  >
                    Hola Linux Enthusiast! 🐧
                  </h1>

                  <p
                    style="
                      line-height: 24px;
                      font-weight: 400;
                      text-decoration: none;
                    "
                  >
                    We are pleased to inform you that your registration for
                    <strong>LinuxDiary 5.0</strong> was successful! 🎉<br />
                    <!--The event will be held on
                    <strong><em>10th & 11th of August 2024</em></strong
                    >, focusing on Linux Fundamentals.🐧-->
                  </p>
                  Further details of the event will be conveyed via Whatsapp
                  group.
                  <p>
                    <strong style="font-size: 17px">
                      Link for our Whatsapp group:</strong
                    >
                    <a
                      href="https://chat.whatsapp.com/LPadDjUQY7sETZOap6vNyZ"
                      style="font-size: 17px"
                      >Link</a
                    >
                    <br />
                    Don't forget to join!! You will be added once we verify your
                    details.
                  </p>
                  <!--                   <br /> -->
                  Please do not hesitate to contact us if you have any queries
                  about the event. We will be happy to assist you in any way we
                  can.
                  <p></p>
                  <p>
                    <strong style="font-size: 17px">
                      LinuxDiary 5.0 Website:</strong
                    >
                    <a
                      href="https://linuxdiary5.0.wcewlug.org/"
                      style="font-size: 17px"
                      >linuxdiary5.0.wcewlug.org</a
                    >
                    <br />
                    Do share this with your friends and join us for an exciting
                    journey!
                  </p>

                  <p>
                    <strong>
                      <i>We look forward to seeing you there!</i>
                    </strong>
                  </p>

                  <p>
                    Thanks and regards,<br />
                    Walchand Linux Users' Group
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          <table
            align="center"
            style="
              text-align: center;
              vertical-align: top;
              width: 600px;
              max-width: 600px;
              background-color: #ffffff;
            "
            width="600"
          >
            <tbody>
              <tr>
                <td
                  style="
                    width: 596px;
                    vertical-align: top;
                    padding-left: 0;
                    padding-right: 0;
                  "
                >
                  <img
                    style="
                      text-align: center;
                      border-top-left-radius: 30px;
                      border-bottom-right-radius: 30px;
                      margin-bottom: 5px;
                    "
                    alt="Logo"
                    src="https://res.cloudinary.com/dduur8qoo/image/upload/v1689771850/wlug_white_logo_page-0001_u8efnh.jpg"
                    align="center"
                    width="200"
                    height="120"
                    class="CToWUd"
                    data-bit="iit"
                  />
                </td>
              </tr>

              <tr style="margin-bottom: 30px" align="center">
                <td align="center">
                  <a
                    href="https://www.instagram.com/wcewlug/"
                    target="_blank"
                    data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/wcewlug/&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw16ObtJOZ1hpw9644RZ4oMM"
                    style="margin: 0 12px"
                    ><img
                      src="https://res.cloudinary.com/dduur8qoo/image/upload/v1689773467/Instagram_vn7dni_kzulby.png"
                      class="CToWUd"
                      data-bit="iit"
                      height="30"
                      width="30"
                  /></a>
                  <a
                    href="https://twitter.com/wcewlug"
                    target="_blank"
                    data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/wcewlug&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw1ypHRKREADjq_cn0IRD2po"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="30"
                      height="30"
                      viewBox="0,0,256,256"
                      style="border-radius: 5px"
                    >
                      <g transform="translate(-58.88,-58.88) scale(1.46,1.46)">
                        <g
                          fill="#000000"
                          fill-rule="nonzero"
                          stroke="none"
                          stroke-width="1"
                          stroke-linecap="butt"
                          stroke-linejoin="miter"
                          stroke-miterlimit="10"
                          stroke-dasharray=""
                          stroke-dashoffset="0"
                          font-family="none"
                          font-weight="none"
                          font-size="none"
                          text-anchor="none"
                          style="mix-blend-mode: normal"
                        >
                          <g transform="scale(8.53333,8.53333)">
                            <path
                              d="M6,4c-1.105,0 -2,0.895 -2,2v18c0,1.105 0.895,2 2,2h18c1.105,0 2,-0.895 2,-2v-18c0,-1.105 -0.895,-2 -2,-2zM8.64844,9h4.61133l2.69141,3.84766l3.33008,-3.84766h1.45117l-4.12891,4.78125l5.05078,7.21875h-4.61133l-2.98633,-4.26953l-3.6875,4.26953h-1.47461l4.50586,-5.20508zM10.87891,10.18359l6.75391,9.62695h1.78906l-6.75586,-9.62695z"
                            ></path>
                          </g>
                        </g>
                      </g></svg
                  ></a>
                  <a
                    href="https://linkedin.com/company/wlug-club"
                    target="_blank"
                    data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/wlug-club&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw0TDo2Akq1O-un9s_gRi70t"
                    style="margin: 0 10px"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="30"
                      height="30"
                      viewBox="0,0,256,256"
                      style="border-radius: 5px"
                    >
                      <g transform="translate(-58.88,-58.88) scale(1.46,1.46)">
                        <g
                          fill="none"
                          fill-rule="nonzero"
                          stroke="none"
                          stroke-width="1"
                          stroke-linecap="butt"
                          stroke-linejoin="miter"
                          stroke-miterlimit="10"
                          stroke-dasharray=""
                          stroke-dashoffset="0"
                          font-family="none"
                          font-weight="none"
                          font-size="none"
                          text-anchor="none"
                          style="mix-blend-mode: normal"
                        >
                          <g transform="scale(5.33333,5.33333)">
                            <path
                              d="M42,37c0,2.762 -2.238,5 -5,5h-26c-2.761,0 -5,-2.238 -5,-5v-26c0,-2.762 2.239,-5 5,-5h26c2.762,0 5,2.238 5,5z"
                              fill="#0078d4"
                            ></path>
                            <path
                              d="M30,37v-10.099c0,-1.689 -0.819,-2.698 -2.192,-2.698c-0.815,0 -1.414,0.459 -1.779,1.364c-0.017,0.064 -0.041,0.325 -0.031,1.114l0.002,10.319h-7v-19h7v1.061c1.022,-0.705 2.275,-1.061 3.738,-1.061c4.547,0 7.261,3.093 7.261,8.274l0.001,10.726zM11,37v-19h3.457c-2.003,0 -3.457,-1.472 -3.457,-3.501c0,-2.027 1.478,-3.499 3.514,-3.499c2.012,0 3.445,1.431 3.486,3.479c0,2.044 -1.479,3.521 -3.515,3.521h3.515v19z"
                              fill="#000000"
                              opacity="0.05"
                            ></path>
                            <path
                              d="M30.5,36.5v-9.599c0,-1.973 -1.031,-3.198 -2.692,-3.198c-1.295,0 -1.935,0.912 -2.243,1.677c-0.082,0.199 -0.071,0.989 -0.067,1.326l0.002,9.794h-6v-18h6v1.638c0.795,-0.823 2.075,-1.638 4.238,-1.638c4.233,0 6.761,2.906 6.761,7.774l0.001,10.226zM11.5,36.5v-18h6v18zM14.457,17.5c-1.713,0 -2.957,-1.262 -2.957,-3.001c0,-1.738 1.268,-2.999 3.014,-2.999c1.724,0 2.951,1.229 2.986,2.989c0,1.749 -1.268,3.011 -3.015,3.011z"
                              fill="#000000"
                              opacity="0.07"
                            ></path>
                            <path
                              d="M12,19h5v17h-5zM14.485,17h-0.028c-1.492,0 -2.457,-1.112 -2.457,-2.501c0,-1.419 0.995,-2.499 2.514,-2.499c1.521,0 2.458,1.08 2.486,2.499c0,1.388 -0.965,2.501 -2.515,2.501zM36,36h-5v-9.099c0,-2.198 -1.225,-3.698 -3.192,-3.698c-1.501,0 -2.313,1.012 -2.707,1.99c-0.144,0.35 -0.101,1.318 -0.101,1.807v9h-5v-17h5v2.616c0.721,-1.116 1.85,-2.616 4.738,-2.616c3.578,0 6.261,2.25 6.261,7.274l0.001,9.726z"
                              fill="#ffffff"
                            ></path>
                          </g>
                        </g>
                      </g></svg
                  ></a>

                  <a
                    href="http://discord.wcewlug.org/join"
                    target="_blank"
                    data-saferedirecturl="https://www.google.com/url?q=http://discord.wcewlug.org/join&amp;source=gmail&amp;ust=1680976985984000&amp;usg=AOvVaw3PNiAyDSeiO1V36KVKeLZl"
                    style="margin: 0 1px"
                    ><img
                      src="https://res.cloudinary.com/dduur8qoo/image/upload/v1689771996/unnamed_m7lgs0.png"
                      class="CToWUd"
                      data-bit="iit"
                      height="30"
                      width="30"
                      style="border-radius: 5px"
                  /></a>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="yj6qo"></div>
          <div class="adL"></div>
        </div>
        <div class="adL"></div>
      </div>
      <div class="adL"></div>
    </div>
  </body>
</html>`
}

func (u UserService) FileUpload(ctx context.Context, file multipart.File) (string, bool) {
	cld, _ := cloudinary.NewFromParams(os.Getenv("CLOUDINARY_CLOUD_NAME"), os.Getenv("CLOUDINARY_KEY"), os.Getenv("CLOUDINARY_SECRET"))

	uploadResult, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "LinuxDiary5.0",
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
