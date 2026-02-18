import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  // DATA MODEL

  public type InvestmentPlan = {
    vipLevel : Nat;
    price : Nat;
    dailyIncome : Int;
    title : Text;
    features : [Text];
  };

  public type TransactionType = { #deposit; #withdrawal };
  public type TransactionStatus = { #pending; #completed; #failed };

  public type Transaction = {
    id : Text;
    user : Principal;
    amount : Int;
    txnType : TransactionType;
    timestamp : Time.Time;
    status : TransactionStatus;
    reference : Text;
  };

  public type Portfolio = {
    balance : Int;
    totalDeposits : Int;
    totalWithdrawals : Int;
    profits : Int;
    lastUpdated : Time.Time;
    dailyProfit : Int;
    vipLevel : Nat;
  };

  public type UserPlan = {
    plan : InvestmentPlan;
    joined : Bool;
    dailyIncome : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module Transaction {
    public func compare(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Text.compare(transaction2.id, transaction1.id);
    };
  };

  // STORAGE MAPS
  let portfolios = Map.empty<Principal, Portfolio>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let liveTransactions = List.empty<Transaction>();

  // Authorization State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // PREDEFINED INVESTMENT PLANS

  let investmentPlans : [InvestmentPlan] = [
    {
      vipLevel = 1;
      price = 500;
      dailyIncome = 50;
      title = "VIP 1";
      features = [
        "NPR 500 investment",
        "Daily income: NPR 50",
        "24/7 customer support",
      ];
    },
    {
      vipLevel = 2;
      price = 1000;
      dailyIncome = 100;
      title = "VIP 2";
      features = [
        "NPR 1000 investment",
        "Daily income: NPR 100",
        "24/7 customer support",
        "Priority processing",
      ];
    },
    {
      vipLevel = 3;
      price = 1500;
      dailyIncome = 150;
      title = "VIP 3";
      features = [
        "NPR 1500 investment",
        "Daily income: NPR 150",
        "24/7 customer support",
        "Priority processing",
        "Exclusive offers",
      ];
    },
    {
      vipLevel = 4;
      price = 2000;
      dailyIncome = 200;
      title = "VIP 4";
      features = [
        "NPR 2000 investment",
        "Daily income: NPR 200",
        "24/7 customer support",
        "Priority processing",
        "Exclusive offers",
        "Higher profit rate",
      ];
    },
    {
      vipLevel = 5;
      price = 2500;
      dailyIncome = 250;
      title = "VIP 5";
      features = [
        "NPR 2500 investment",
        "Daily income: NPR 250",
        "24/7 customer support",
        "Priority processing",
        "Exclusive offers",
        "Highest profit rate",
      ];
    },
  ];

  // VIP PLAN LOGIC

  // Function to join a plan
  public shared ({ caller }) func joinPlan(planId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join investment plans");
    };
    if (planId >= investmentPlans.size()) {
      Runtime.trap("Invalid plan ID");
    };
    let plan = investmentPlans[planId];

    // Update user portfolio with new balance and daily profit
    let currentPortfolio = portfolios.get(caller);
    let updatedPortfolio = switch (currentPortfolio) {
      case (null) {
        {
          balance = plan.dailyIncome;
          totalDeposits = 0;
          totalWithdrawals = 0;
          profits = plan.dailyIncome;
          lastUpdated = Time.now();
          dailyProfit = plan.dailyIncome;
          vipLevel = plan.vipLevel;
        };
      };
      case (?portfolio) {
        {
          balance = portfolio.balance + plan.dailyIncome;
          totalDeposits = portfolio.totalDeposits;
          totalWithdrawals = portfolio.totalWithdrawals;
          profits = portfolio.profits + plan.dailyIncome;
          lastUpdated = Time.now();
          dailyProfit = plan.dailyIncome;
          vipLevel = plan.vipLevel;
        };
      };
    };
    portfolios.add(caller, updatedPortfolio);
    true;
  };

  // Function to calculate daily profit for all users (simulate cron job)
  public shared ({ caller }) func calculateDailyProfits() : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    for ((user, portfolio) in portfolios.entries()) {
      let updatedPortfolio = {
        balance = portfolio.balance + portfolio.dailyProfit;
        totalDeposits = portfolio.totalDeposits;
        totalWithdrawals = portfolio.totalWithdrawals;
        profits = portfolio.profits + portfolio.dailyProfit;
        lastUpdated = Time.now();
        dailyProfit = portfolio.dailyProfit;
        vipLevel = portfolio.vipLevel;
      };
      portfolios.add(user, updatedPortfolio);
    };
    true;
  };

  // UTILITY FUNCTION TO CREATE TRANSACTION
  func createTransaction(
    user : Principal,
    amount : Int,
    txnType : TransactionType,
    reference : Text,
  ) : Transaction {
    let now = Time.now();
    let id = user.toText() # "-" # (if (txnType == #deposit) { "deposit" } else { "withdrawal" }) # "-t-" # now.toText();
    {
      id;
      user;
      amount;
      txnType;
      timestamp = now;
      status = #pending;
      reference;
    };
  };

  // DEPOSIT LOGIC (with eSewa simulation)
  public shared ({ caller }) func deposit(amount : Int, reference : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit funds");
    };
    let txn = createTransaction(caller, amount, #deposit, reference);
    liveTransactions.add(txn);

    // Add deposited amount to user's portfolio balance
    let currentPortfolio = portfolios.get(caller);
    let updatedPortfolio = switch (currentPortfolio) {
      case (null) {
        {
          balance = amount;
          totalDeposits = amount;
          totalWithdrawals = 0;
          profits = amount; // Treat entire deposit as profit for new user
          lastUpdated = Time.now();
          dailyProfit = 0; // No daily profit yet for new user
          vipLevel = findDefaultVipLevel(amount);
        };
      };
      case (?portfolio) {
        {
          balance = portfolio.balance + amount;
          totalDeposits = portfolio.totalDeposits + amount;
          totalWithdrawals = portfolio.totalWithdrawals;
          profits = portfolio.profits + amount; // Treat deposit as profit for existing user
          lastUpdated = Time.now();
          dailyProfit = portfolio.dailyProfit;
          vipLevel = findDefaultVipLevel(amount);
        };
      };
    };
    portfolios.add(caller, updatedPortfolio);

    // Call external eSewa API (simulate with placeholder)
    let _esewaResponse = await OutCall.httpGetRequest("https://esewa.example.com/deposit?amount=" # amount.toText() # "&reference=" # reference, [], transform);

    "Deposit successful! Transaction ID: " # txn.id;
  };

  // Helper function to find default VIP level based on deposit amount
  func findDefaultVipLevel(amount : Int) : Nat {
    switch (Int.abs(amount)) {
      case (x) { if (x >= 2500) { 5 } else if (x >= 2000) { 4 } else if (x >= 1500) { 3 } else if (x >= 1000) { 2 } else if (x >= 500) { 1 } else { 0 } };
    };
  };

  // WITHDRAWAL LOGIC (with eSewa simulation)
  public shared ({ caller }) func withdraw(amount : Int, reference : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can withdraw funds");
    };
    let txn = createTransaction(caller, amount, #withdrawal, reference);
    liveTransactions.add(txn);

    let currentPortfolio = portfolios.get(caller);

    switch (currentPortfolio) {
      case (null) {
        Runtime.trap("Portfolio not found");
      };
      case (?portfolio) {
        if (portfolio.balance < amount) {
          Runtime.trap("Insufficient balance. Current balance: " # portfolio.balance.toText());
        };
        let remainingBalance = portfolio.balance - amount;
        let updatedPortfolio = {
          balance = remainingBalance;
          totalDeposits = portfolio.totalDeposits;
          totalWithdrawals = portfolio.totalWithdrawals + amount;
          profits = portfolio.profits;
          lastUpdated = Time.now();
          dailyProfit = portfolio.dailyProfit;
          vipLevel = portfolio.vipLevel;
        };
        portfolios.add(caller, updatedPortfolio);

        // Call external eSewa API (simulate with placeholder)
        let _esewaResponse = await OutCall.httpGetRequest("https://esewa.example.com/withdraw?amount=" # amount.toText() # "&reference=" # reference, [], transform);

        "Withdrawal successful! Transaction ID: " # txn.id;
      };
    };
  };

  // GET LIVE TRANSACTIONS (for display)
  public query ({ caller }) func getLiveTransactions() : async [Transaction] {
    liveTransactions.toArray().sort();
  };

  // PUBLIC QUERIES

  public query ({ caller }) func getPortfolio(user : Principal) : async ?Portfolio {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own portfolio");
    };
    portfolios.get(user);
  };

  public query ({ caller }) func getPlans() : async [InvestmentPlan] {
    investmentPlans;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // OUTCALL
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
