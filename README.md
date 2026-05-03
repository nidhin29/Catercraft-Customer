# 🍽️ CaterCraft | Customer Portal

[![Deploy to S3](https://github.com/nidhin29/customer-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/nidhin29/customer-website/actions/workflows/deploy.yml)

**CaterCraft** is a premium, full-stack catering management ecosystem. This repository contains the **Customer Portal**, a high-performance web application designed for a seamless booking and event management experience.

---

## ✨ Features

- 🔐 **Secure Authentication**: Integrated with Google OAuth and custom OTP verification.
- 💳 **Seamless Payments**: Integrated with Razorpay for secure production-ready digital payments.
- 🚚 **Live Tracking**: Real-time booking tracking using Socket.io and Firebase Cloud Messaging (FCM).
- 🎨 **Premium UI**: Built with React.js, Tailwind CSS, and Framer Motion for smooth animations and a "glassmorphism" aesthetic.
- 📱 **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.

---

## 🚀 Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Context API + Custom Hooks
- **Communication**: [Socket.io](https://socket.io/) (Real-time updates)
- **Deployment**: AWS S3 & CloudFront

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nidhin29/customer-website.git
   cd customer-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your keys (see `.env.example` if available).

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture & CI/CD

This project follows modern DevOps practices to ensure high availability and rapid deployment:

- **Hosting**: Static assets are hosted on **AWS S3**.
- **CDN**: **AWS CloudFront** is used for global content delivery and HTTPS termination.
- **Automation**: **GitHub Actions** pipelines handle automated builds, S3 syncing, and CloudFront cache invalidation on every push to `main`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Developed with ❤️ by [Nidhin](https://github.com/nidhin29)*
