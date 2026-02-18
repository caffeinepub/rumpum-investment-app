import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
  type OldTransactionType = { #deposit; #withdrawal };
  type OldTransactionStatus = { #pending; #completed; #failed };

  type OldTransaction = {
    id : Text;
    user : Principal;
    amount : Nat;
    txnType : OldTransactionType;
    timestamp : Time.Time;
    status : OldTransactionStatus;
    reference : Text;
  };

  type OldPortfolio = {
    balance : Nat;
    totalDeposits : Nat;
    totalWithdrawals : Nat;
    profits : Int;
    lastUpdated : Time.Time;
  };

  type OldActor = {
    portfolios : Map.Map<Principal, OldPortfolio>;
    transactions : List.List<OldTransaction>;
  };

  type NewInvestmentPlan = {
    vipLevel : Nat;
    price : Nat;
    dailyIncome : Int;
    title : Text;
    features : [Text];
  };

  type NewTransactionType = { #deposit; #withdrawal };
  type NewTransactionStatus = { #pending; #completed; #failed };

  type NewTransaction = {
    id : Text;
    user : Principal;
    amount : Int;
    txnType : NewTransactionType;
    timestamp : Time.Time;
    status : NewTransactionStatus;
    reference : Text;
  };

  type NewPortfolio = {
    balance : Int;
    totalDeposits : Int;
    totalWithdrawals : Int;
    profits : Int;
    lastUpdated : Time.Time;
    dailyProfit : Int;
    vipLevel : Nat;
  };

  type NewActor = {
    portfolios : Map.Map<Principal, NewPortfolio>;
    liveTransactions : List.List<NewTransaction>;
  };

  func findDefaultVipLevel(amount : Int) : Nat {
    switch (Int.abs(amount)) {
      case (x) { if (x >= 2500) { 5 } else if (x >= 2000) { 4 } else if (x >= 1500) { 3 } else if (x >= 1000) { 2 } else if (x >= 500) { 1 } else { 0 } };
    };
  };

  func calculateDailyProfit(vipLevel : Nat) : Int {
    switch (vipLevel) {
      case (1) { 50 };
      case (2) { 100 };
      case (3) { 150 };
      case (4) { 200 };
      case (5) { 250 };
      case (_) { 0 };
    };
  };

  func convertPortfolio(oldPortfolio : OldPortfolio) : NewPortfolio {
    let balance = oldPortfolio.balance.toInt();
    let totalDeposits = oldPortfolio.totalDeposits.toInt();
    let totalWithdrawals = oldPortfolio.totalWithdrawals.toInt();
    {
      balance;
      totalDeposits;
      totalWithdrawals;
      profits = oldPortfolio.profits;
      lastUpdated = oldPortfolio.lastUpdated;
      dailyProfit = calculateDailyProfit(findDefaultVipLevel(balance));
      vipLevel = findDefaultVipLevel(balance);
    };
  };

  func convertTransaction(oldTxn : OldTransaction) : NewTransaction {
    {
      oldTxn with amount = oldTxn.amount.toInt();
    };
  };

  public func run(old : OldActor) : NewActor {
    let newPortfolios = old.portfolios.map<Principal, OldPortfolio, NewPortfolio>(
      func(_user, oldPortfolio) { convertPortfolio(oldPortfolio) }
    );

    let newLiveTransactions = old.transactions.map<OldTransaction, NewTransaction>(
      func(oldTxn) { convertTransaction(oldTxn) }
    );

    {
      portfolios = newPortfolios;
      liveTransactions = newLiveTransactions;
    };
  };
};
