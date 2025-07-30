# LinuxDairy-5.0 Backend

This repository contains the source code for the backend of registration of linuxdiary5.0 .
The code is written in Go.

# Configuration

To configure the backend of the LinuxDiary 5.0 registration system, follow these steps:

1. Clone the repository to your local machine:

    ```
    git clone https://github.com/Walchand-Linux-Users-Group/LinuxDiary5.0-Backend.git
    ```

2. Install the required dependencies by running the following command:

    ```
    go get -d ./...
    ```

3. Create a .env file

    ```
    touch .env
    ```

    Add the following environment variables to the .env file:

    ```
    export BACKEND_MONGO_PROTOCOL=your_protocol
    export BACKEND_MONGO_USER=your_username
    export BACKEND_MONGO_PASS=your_password
    export BACKEND_MONGO_HOST=your_host
    export BACKEND_MONGO_DB=your_db
    export BACKEND_MONGO_PARAM=your_param

    export BACKEND_PORT=8080

    export BACKEND_MAIL_HOST=your_mail_host
    export BACKEND_MAIL_USER=your_mail_user
    export BACKEND_MAIL_PASSWORD=your_mail_password

    export CLOUDINARY_CLOUD_NAME=your_cloud_name
    export CLOUDINARY_KEY=your_cloudinary_key
    export CLOUDINARY_SECRET=your_cloudinary_secret

    export ADMIN_PASSWORD=your_admin_password
    ```

4. Source the .env file:

    ```
    source .env
    ```

5. Build and run the backend server using the following command:

    ```
    go run main.go
    ```

6. The backend server should now be running on `http://localhost:8080`.

# Uses

For Registration use the following endpoint:

```
POST /user/registratiuon
```

Sample register for this endpoint

```
#!/bin/bash

curl -X POST http://localhost:8080/user/registration \
  -H "Content-Type: multipart/form-data" \
  -F "name=John Doe" \
  -F "phone=1234567210" \
  -F "johndoe@gmail.com" \
  -F "transactionId=123456" \
  -F "collegeName=ABC University" \
  -F "yearOfStudy=2024" \
  -F "branch=Computer Science" \
  -F "isDualBooted=true" \
  -F "referralCode=ABCD1234" \
  -F "paymentImg=@/home/tanmay/Pictures/Screenshots/testpng.jpeg"
```

```
{
    "name": "John Doe",
    "email": "johndoe@gmail.com"
    "phone": "1234567210",
    "transactionId": "123456",
    "collegeName": "ABC University",
    "yearOfStudy": "2024",
    "branch": "Computer Science",
    "isDualBooted": true,
    "referralCode": "ABCD1234",
}
```


Fields for registration are:

```
{
    name,
    email,
    phone,
    transactionId,
    collegeName,
    yearOfStudy,
    branch,
    isDualBooted,
    referralCode,
    paymentImg
}
```

