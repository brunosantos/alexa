# alexa thermometer skill
reads temperature and humidity data from firebase db and plays them in alexa.

Requirements:
- raspberry pi (or similar) that sends temperature and humidity values to a firebase db
- [firebase db](https://firebase.google.com/)
- firebase db [user account](https://firebase.google.com/docs/auth/admin/manage-users) with email and password
- [aws lambda](https://aws.amazon.com/lambda/) 

lambda env values
- app_id
- apiKey
- password
- email
