import React, { useState } from "react";
import "./Sidebar.css";
import Create from "../create/Create";

function Sidebar() {

  const [activeMenu, setActiveMenu] = useState("lexBotTesting");


  const menuItems = [
    {
      id: "dashboard",
      icon: "🏠",
      label: "Dashboard Overview"
    },
    {
      id: "lexBotTesting",
      icon: "🤖",
      label: "Lex Bot Testing"
    },
    {
      id: "ivr",
      icon: "☎️",
      label: "IVR Testing"
    },
    {
      id: "webui",
      icon: "🌐",
      label: "Web UI Testing"
    },
    {
      id: "api",
      icon: "🧩",
      label: "API Testing"
    },
    {
      id: "regression",
      icon: "✔️",
      label: "Regression Testing"
    },
    {
      id: "performance",
      icon: "⚡",
      label: "Performance Testing"
    },
    {
      id: "reports",
      icon: "📊",
      label: "Reports"
    },
    {
      id: "settings",
      icon: "⚙️",
      label: "Settings"
    }
  ];
  const moduleData = {
  "Dashboard Overview": {
    title: "Dashboard Overview",
    totalCases: 500,
    passRate: "95%",
    failedCases: 25
  },

  "Lex Bot Testing": {
    totalCases: 348,
    passRate: "91%",
    failedCases: 33,
    bots: [
      "Order_Food123",
      "lex-testsets",
      "poc-3"
    ]
  },

  "IVR Testing": {
    totalCases: 210,
    passRate: "88%",
    failedCases: 25,
    bots: [
      "Bank_IVR",
      "Customer_Care_IVR",
      "Support_IVR"
    ]
  },

  "Web UI Testing": {
    totalCases: 620,
    passRate: "96%",
    failedCases: 24,
    applications: [
      "Login Portal",
      "Admin Dashboard",
      "Payment Module"
    ]
  },

  "API Testing": {
    totalCases: 420,
    passRate: "93%",
    failedCases: 29,
    apis: [
      "Login API",
      "Payment API",
      "Order API"
    ]
  },

  "Regression Testing": {
    totalCases: 850,
    passRate: "94%",
    failedCases: 51
  },

  "Performance Testing": {
    totalCases: 120,
    passRate: "89%",
    failedCases: 13
  },

  "Reports": {
    reports: [
      "Execution Summary",
      "Daily Report",
      "Weekly Report"
    ]
  },

  "Settings": {
    environment: "QA",
    region: "us-east-1"
  }
};
const currentModule =
  menuItems.find(
    item => item.id === activeMenu
  )?.label;

const currentData =
  moduleData[currentModule];

  return (
    <div className="content">

      {/* Sidebar */}
      <div className="sidebar">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-circle">
            TA
          </div>

          <div className="logo-text">
            <h2>Test Automation</h2>
            <p>QA Operations Console</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="module-title">
          TESTING MODULES
        </div>

        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${
              activeMenu === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu(item.id)
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            <span className="menu-label">
              {item.label}
            </span>
          </div>
        ))}

      </div>

      {/* Main Content */}
    <div className="main-content">

  {activeMenu ===
    "lexBotTesting" ? (

    <Create
      activeMenu="myBots"
      showBots={true}
    />

  ) : (

    <div className="dummy-module-container">

      <h1>
        {currentModule}
      </h1>

      <div className="dummy-cards">

        {currentData?.totalCases && (
          <div className="dummy-card">
            <h3>Total Cases</h3>
            <p>
              {currentData.totalCases}
            </p>
          </div>
        )}

        {currentData?.passRate && (
          <div className="dummy-card">
            <h3>Pass Rate</h3>
            <p>
              {currentData.passRate}
            </p>
          </div>
        )}

        {currentData?.failedCases !==
          undefined && (
          <div className="dummy-card">
            <h3>Failed Cases</h3>
            <p>
              {currentData.failedCases}
            </p>
          </div>
        )}

      </div>

      {/* Bots */}
      {currentData?.bots && (
        <>
          <h2>
            Available Bots
          </h2>

          <div className="dummy-list">
            {currentData.bots.map(
              (bot,index) => (
                <div
                  key={index}
                  className="dummy-item"
                >
                  🤖 {bot}
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Applications */}
      {currentData?.applications && (
        <>
          <h2>
            Applications
          </h2>

          <div className="dummy-list">
            {currentData.applications.map(
              (app,index) => (
                <div
                  key={index}
                  className="dummy-item"
                >
                  🌐 {app}
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* APIs */}
      {currentData?.apis && (
        <>
          <h2>
            APIs
          </h2>

          <div className="dummy-list">
            {currentData.apis.map(
              (api,index) => (
                <div
                  key={index}
                  className="dummy-item"
                >
                  🔗 {api}
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Reports */}
      {currentData?.reports && (
        <>
          <h2>
            Reports
          </h2>

          <div className="dummy-list">
            {currentData.reports.map(
              (report,index) => (
                <div
                  key={index}
                  className="dummy-item"
                >
                  📄 {report}
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Settings */}
      {currentData?.environment && (
        <div className="settings-card">

          <p>
            <strong>
              Environment:
            </strong>{" "}
            {
              currentData.environment
            }
          </p>

          <p>
            <strong>
              Region:
            </strong>{" "}
            {currentData.region}
          </p>

        </div>
      )}

    </div>

  )}

</div>

    </div>
  );
}

export default Sidebar;