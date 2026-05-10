# 🛒 MERN Grocery Store App

A full-stack **Grocery Store web application** built using the **MERN stack** with **Stripe payment integration**.
Users can browse products, add items to cart, place orders, and pay securely online.


## 🚀 Features

### 👤 User Features

* User authentication (JWT based)
* Reset Password
* Browse grocery products
* Add / remove items from cart
* Place orders (Cash on Delivery & Online Payment)
* Add review by giving star ratings & message.
* Secure checkout using **Stripe**
* View order history

### 🛍️ Seller Features

* Add products
* Upload product images (Cloudinary)


### 💳 Payment

* Stripe Checkout (Test Mode)
* Secure webhook handling for payment verification
* Automatic order status update after payment success/failure


## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* React Router
* React Hot Toast
* Tailwind CSS / CSS
* Stripe Checkout

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* Stripe API
* Cloudinary
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Vercel
* Database: MongoDB Atlas

---


## 🔔 Stripe Webhooks

Webhook endpoint:

```
/stripe/webhook
```

Handled events:

* `checkout.session.completed`

Used to:

* Update order payment status
* User cart unchanged after successful payment


## ▶️ Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/devByWaleed/greencart.git
cd greencart
```

### 2️⃣ Install dependencies

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```



## 🌐 API Status Check

```http
GET /
Response: "API Working!!!"
```


## 🔐 Security Features

* Password hashing
* JWT authentication
* Secure Stripe webhook verification
* CORS configuration
* Environment variable protection
* Security Headers


## 🌐 Live Preview

https://grocery-eta-six.vercel.app/

## 📄 License

This project is for **learning and demonstration purposes**.