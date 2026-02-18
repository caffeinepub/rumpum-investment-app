# Rumpum Investment App

## Overview
Rumpum is an investment application designed for Nepali users that allows them to deposit funds, join VIP investment plans, and earn daily profits through a secure and user-friendly interface.

## Authentication
- Users authenticate using Internet Identity for secure login
- Each user has a personal account with investment tracking capabilities

## Core Features

### Fund Management
- **Deposit Funds**: Users can deposit money into their investment account via eSewa wallet integration
- **Withdraw Funds**: Users can withdraw their funds back to their eSewa wallet
- All transactions capture transaction ID and reference numbers for tracking
- All transactions are processed through eSewa payment gateway suitable for Nepali users

### Investment Market (VIP Plans)
- **VIP Investment Tiers**: Display 5 VIP investment plans with the following structure:
  - VIP 1: Price 500 NPR, Daily income 50 NPR
  - VIP 2: Price 1000 NPR, Daily income 100 NPR
  - VIP 3: Price 1500 NPR, Daily income 150 NPR
  - VIP 4: Price 2000 NPR, Daily income 200 NPR
  - VIP 5: Price 2500 NPR, Daily income 250 NPR
- **Join Plans**: Users can join any VIP plan by paying the required price
- **Daily Profit Distribution**: Once joined, users automatically receive daily profits credited to their portfolio balance based on their plan's daily income rate

### Live Transactions
- **Real-time Transaction Feed**: Display recent deposits and withdrawals from all users on the homepage
- Show anonymized user information (e.g., "User ****") with transaction amounts
- Build trust and transparency by showing active platform usage

### Customer Service
- **Support Section**: Display eSewa deposit phone number **9745573457** for customer assistance
- Provide clear contact information for users needing help with transactions

### User Dashboard
- Personal account overview showing current balance
- Active investment plans and daily earnings
- Quick access to deposit and withdrawal functions
- Transaction history with filtering options

## Navigation Structure
- **Home**: Main dashboard with live transactions, quick actions, and overview
- **Product**: Investment Market showing all VIP plans
- **Team**: Team or referral information
- **Mine**: Personal profile and account management

## Backend Data Storage
The backend must store:
- User account information linked to Internet Identity
- Transaction records (deposits and withdrawals) with transaction IDs and reference numbers
- VIP plan subscriptions and user memberships
- Daily profit calculations and distribution records
- User portfolio balances and historical data
- Live transaction feed data for homepage display

## Integration Requirements
- eSewa wallet API integration for payment processing
- Support for Nepali Rupee (NPR) currency
- Real-time transaction status updates
- Automated daily profit distribution system

## User Interface
- Clean Nepal-inspired theme with green and blue gradient colors
- Tab-based navigation: Home, Product, Team, Mine
- Responsive layout for mobile and desktop use
- Clear display of financial data with appropriate NPR formatting
- Use provided brand assets (Rumpum logo, hero images, eSewa icon)
- English language interface adapted for Nepal market context
