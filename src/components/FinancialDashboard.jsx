"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, BarChart3, PieChart, TrendingUp, Activity, Users, Shield, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("income");
  const [customRevenue, setCustomRevenue] = useState(150000);
  const [customUASpend, setCustomUASpend] = useState(45000);

  // Constants provided by VSA Certification Agent
  const certifiedAssetValue = 2642800;
  const arpdau = 0.15;
  const sdkAdminFee = 15000; // Annual SLA

  // Live Calculations (GAAP & DCF)
  const platformCommissions = customRevenue * 0.30;
  const netRevenue = customRevenue - platformCommissions;
  const opEx = customUASpend + sdkAdminFee + 5000; // 5k arbitrary infra
  const netProfit = netRevenue - opEx;
  const profitMargin = ((netProfit / customRevenue) * 100).toFixed(1);
  const roas = customUASpend > 0 ? (netRevenue / customUASpend).toFixed(2) : 0;

  const tabs = [
    { id: "income", label: "Income Statement (P&L)", icon: BarChart3 },
    { id: "balance", label: "Balance Sheet", icon: PieChart },
    { id: "cashflow", label: "Cash Flow", icon: Activity },
    { id: "ua", label: "UA & Marketing Ledger", icon: TrendingUp },
  ];

  return (
    <div className="w-full bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-white/10 bg-white/2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. INCOME STATEMENT */}
            {activeTab === "income" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-2">Income Statement (P&L)</h3>
                  <p className="text-muted-foreground text-sm">Tracking the velocity and operating efficiency of the certified asset.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Revenue Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Revenue</h4>
                    <div className="flex justify-between items-center text-sm py-2">
                      <span>Gross Platform Revenue (IAP + Ads)</span>
                      <span className="font-mono text-green-400">+${customRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2">
                      <span>Platform Commissions (30%)</span>
                      <span className="font-mono text-red-400">-${platformCommissions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-base pt-2 border-t border-border">
                      <span>Net Revenue</span>
                      <span className="font-mono">${netRevenue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* OpEx Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Operating Expenses (OpEx)</h4>
                    <div className="flex justify-between items-center text-sm py-2">
                      <span>User Acquisition (Meta/TikTok)</span>
                      <span className="font-mono text-red-400">-${customUASpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2">
                      <span>Alpha-9 SDK Maintenance (Annual)</span>
                      <span className="font-mono text-red-400">-${sdkAdminFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2">
                      <span>Infrastructure & Hosting (Vercel)</span>
                      <span className="font-mono text-red-400">-$5,000</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-base pt-2 border-t border-border">
                      <span>Total OpEx</span>
                      <span className="font-mono">-${opEx.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary/10 border border-primary/20 rounded-xl mt-6">
                  <div>
                    <h4 className="text-primary font-bold text-lg mb-1">Net Profit Margin</h4>
                    <p className="text-xs text-primary/70 font-mono">Realized GAAP Income</p>
                  </div>
                  <div className="text-3xl font-black font-mono mt-2 sm:mt-0 text-foreground">
                    ${netProfit.toLocaleString()} <span className="text-sm text-muted-foreground ml-2 font-inter font-normal">({profitMargin}%)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BALANCE SHEET */}
            {activeTab === "balance" && (
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">Balance Sheet <Shield className="w-5 h-5 text-primary" /></h3>
                    <p className="text-muted-foreground text-sm">Classifying the WebGL build as a "Certified Balance Sheet Asset".</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Assets */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Assets</h4>
                    <div className="py-2">
                      <span className="text-xs text-muted-foreground font-bold mb-2 block">Current Assets</span>
                      <div className="flex justify-between text-sm py-1"><span>Cash & Equivalents</span> <span className="font-mono">$250,000</span></div>
                      <div className="flex justify-between text-sm py-1"><span>Accounts Receivable (Net-30)</span> <span className="font-mono">$18,400</span></div>
                    </div>
                    <div className="py-2">
                      <span className="text-xs text-primary font-bold mb-2 block flex items-center gap-1">Non-Current Assets (Intangible)</span>
                      <div className="flex justify-between text-sm py-1">
                        <span className="font-semibold text-primary">Certified Game IP (WGL-CERT)</span> 
                        <span className="font-mono font-bold text-primary">${certifiedAssetValue.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">DCF valuation mapped directly from VSA Scanner Agent</p>
                      <div className="flex justify-between text-sm py-1 mt-2"><span>Design Patents & Copyrights</span> <span className="font-mono">TBD</span></div>
                      <div className="flex justify-between text-sm py-1"><span>Goodwill (Community Value)</span> <span className="font-mono">$400,000</span></div>
                    </div>
                  </div>

                  {/* Liabilities */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Liabilities & Equity</h4>
                    <div className="py-2">
                      <span className="text-xs text-muted-foreground font-bold mb-2 block">Current Liabilities</span>
                      <div className="flex justify-between text-sm py-1"><span>Deferred Revenue (IAP)</span> <span className="font-mono">$12,000</span></div>
                      <div className="flex justify-between text-sm py-1"><span>Platform Debt (AWS/Cloud)</span> <span className="font-mono">$4,200</span></div>
                    </div>
                    <div className="py-2">
                      <span className="text-xs text-muted-foreground font-bold mb-2 block">Owner's Equity</span>
                      <div className="flex justify-between text-sm py-1"><span>Retained Earnings</span> <span className="font-mono">${(certifiedAssetValue + 250000).toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CASH FLOW */}
            {activeTab === "cashflow" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-2">Statement of Cash Flows</h3>
                  <p className="text-muted-foreground text-sm">Real-time liquidity monitoring to prevent UA scaling crises.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-sm">Operating Activities</h5>
                      <p className="text-xs text-muted-foreground mt-1">Cash received from players minus developer payroll / SLA fees</p>
                    </div>
                    <span className="font-mono text-green-400 font-bold flex items-center gap-1"><ArrowUpRight className="w-4 h-4"/> +$84,000</span>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-sm">Investing Activities</h5>
                      <p className="text-xs text-muted-foreground mt-1">Capital expenditures on new DIP Certifications & Title acquisitions</p>
                    </div>
                    <span className="font-mono text-red-400 font-bold flex items-center gap-1"><ArrowDownRight className="w-4 h-4"/> -$25,000</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-sm">Financing Activities</h5>
                      <p className="text-xs text-muted-foreground mt-1">Proceeds from VC funding (Tracked via Investor CRM)</p>
                    </div>
                    <span className="font-mono text-green-400 font-bold flex items-center gap-1"><ArrowUpRight className="w-4 h-4"/> +$500,000</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <div>
                    <span className="text-sm font-bold block">Runway Metric</span>
                    <span className="text-xs text-muted-foreground">Operating months at current UA spend</span>
                  </div>
                  <div className="text-xl font-black font-mono">18 Months</div>
                </div>
              </div>
            )}

            {/* 4. UA LEDGER */}
            {activeTab === "ua" && (
              <div className="space-y-8">
                 <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-2">UA & Marketing Ledger</h3>
                    <p className="text-muted-foreground text-sm">The Scaling Machine. Calculating LTV, CPI, and Return on Ad Spend (ROAS).</p>
                  </div>
                </div>

                {/* Interactive Controls */}
                <div className="grid grid-cols-2 gap-6 bg-card border border-border p-5 rounded-xl">
                    <div>
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-2">Simulate UA Spend ($)</label>
                      <input 
                        type="range" 
                        min="1000" max="250000" step="1000"
                        value={customUASpend}
                        onChange={(e) => setCustomUASpend(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="mt-2 font-mono text-sm">${customUASpend.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-2">Simulate Gross Revenue ($)</label>
                      <input 
                        type="range" 
                        min="5000" max="500000" step="5000"
                        value={customRevenue}
                        onChange={(e) => setCustomRevenue(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="mt-2 font-mono text-sm">${customRevenue.toLocaleString()}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border border-border bg-white/2 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROAS</p>
                    <p className={`text-2xl font-black font-mono ${roas >= 1.5 ? 'text-green-400' : 'text-red-400'}`}>{roas}x</p>
                  </div>
                  <div className="p-4 border border-border bg-white/2 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Blended CPI</p>
                    <p className="text-2xl font-black font-mono">$0.42</p>
                  </div>
                  <div className="p-4 border border-border bg-white/2 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">ARPDAU Target</p>
                    <p className="text-2xl font-black font-mono">${arpdau}</p>
                  </div>
                  <div className="p-4 border border-border bg-white/2 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">LTV (90d)</p>
                    <p className="text-2xl font-black font-mono">$1.85</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <strong className="text-primary block mb-1">Scaling Thesis Active</strong>
                  With an ARPDAU of ${arpdau} and LTV of $1.85, your break-even payback period is strictly calculated at 22 days. ROAS target must remain above 1.5x before opening new marketing channels globally.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
