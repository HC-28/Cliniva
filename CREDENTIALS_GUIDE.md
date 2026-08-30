# CLINIVA — Credentials & Configuration Guide
# ============================================
# This file is for YOUR REFERENCE ONLY.
# DO NOT commit this file to git.
# Add it to .gitignore if you put real credentials here.

## 1. PostgreSQL Setup
# Create database in pgAdmin or psql:
#
#   CREATE DATABASE cliniva_db;
#   \c cliniva_db
#   CREATE SCHEMA IF NOT EXISTS cliniva;
#
# Then set your password in:
#   backend/src/main/resources/application.yml
#   → spring.datasource.password: YOUR_PASSWORD

POSTGRES_DB=cliniva_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=REPLACE_ME

## 2. JWT Secret
# Generate with: openssl rand -base64 64
# Set in application.yml → cliniva.security.jwt.secret

JWT_SECRET=REPLACE_WITH_LONG_RANDOM_STRING_MIN_256_BITS

## 3. Google OAuth2
# Steps:
#   1. https://console.cloud.google.com/
#   2. New Project → APIs & Services → Credentials
#   3. Create OAuth 2.0 Client ID → Web Application
#   4. Authorized Redirect URI: http://localhost:8080/login/oauth2/code/google
#   5. Copy Client ID and Secret below
# Set in application.yml → spring.security.oauth2.client.registration.google

GOOGLE_CLIENT_ID=REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=REPLACE_WITH_YOUR_GOOGLE_CLIENT_SECRET

## 4. Gmail App Password (for email notifications)
# Steps:
#   1. Google Account → Security → 2-Step Verification (enable)
#   2. App Passwords → Create → Mail → Other → name it "Cliniva"
#   3. Copy the 16-character app password
# Set in application.yml → spring.mail

GMAIL_ADDRESS=youremail@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

## 5. Frontend Config
# No sensitive config needed for frontend currently.
# When connecting to backend, ensure:
#   Vite dev:   http://localhost:5173
#   Backend:    http://localhost:8080

## 6. Future: Cloudinary (Phase 5)
# When upgrading from local storage to Cloudinary:
#   https://cloudinary.com/ → Dashboard → Account Details
CLOUDINARY_CLOUD_NAME=REPLACE_ME
CLOUDINARY_API_KEY=REPLACE_ME
CLOUDINARY_API_SECRET=REPLACE_ME

## 7. Future: Razorpay (Phase 3)
# https://razorpay.com/ → Settings → API Keys → Generate Test Key
RAZORPAY_KEY_ID=rzp_test_REPLACE_ME
RAZORPAY_KEY_SECRET=REPLACE_ME
