import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Transaction {
    id: string;
    status: TransactionStatus;
    user: Principal;
    reference: string;
    txnType: TransactionType;
    timestamp: Time;
    amount: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface InvestmentPlan {
    title: string;
    features: Array<string>;
    vipLevel: bigint;
    dailyIncome: bigint;
    price: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Portfolio {
    balance: bigint;
    vipLevel: bigint;
    lastUpdated: Time;
    dailyProfit: bigint;
    totalWithdrawals: bigint;
    totalDeposits: bigint;
    profits: bigint;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum TransactionStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum TransactionType {
    deposit = "deposit",
    withdrawal = "withdrawal"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateDailyProfits(): Promise<boolean>;
    deposit(amount: bigint, reference: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLiveTransactions(): Promise<Array<Transaction>>;
    getPlans(): Promise<Array<InvestmentPlan>>;
    getPortfolio(user: Principal): Promise<Portfolio | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinPlan(planId: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    withdraw(amount: bigint, reference: string): Promise<string>;
}
