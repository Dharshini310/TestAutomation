import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import {
  useLocation,
  useNavigate
} from "react-router-dom";

import "./Analyze.css";

function Analyze({
  embedded = false,
  analysisData: propAnalysisData,
  analysisInfo
}) {
const location = embedded
  ? {}
  : useLocation();
  const navigate = useNavigate();

  const {
    email,
    botName,
    fileName,
    resultPath
  } = location.state || {};

  const [loading, setLoading] = useState(true);
const [resultData,setResultData] =
useState(propAnalysisData || null);

useEffect(() => {

  if (!embedded) {
    fetchResults();
  }

}, []);

  const fetchResults = async () => {

    try {

      const response = await axios.get(
        `https://pmayt54z3l.execute-api.us-east-1.amazonaws.com/prod/Fetch?resultPath=${encodeURIComponent(resultPath)}`
      );

      const data =
        typeof response.data.body === "string"
          ? JSON.parse(response.data.body)
          : response.data;

          console.log("RESULT PATH:", resultPath);
          
      setResultData(data.result);
      console.log(
  "Overall Results",
  data.result?.overallResults
    ?.testExecutionResults
    ?.overallTestResults
);

console.log(
  "Conversation Results",
  data.result?.conversationResults
    ?.testExecutionResults
    ?.conversationLevelTestResults
);
      console.log(
  "Conversation Count:",
  data.result?.conversationResults
    ?.testExecutionResults
    ?.conversationLevelTestResults
    ?.items?.length
);

console.log(
  "Utterance Count:",
  data.result?.utteranceResults
    ?.testExecutionResults
    ?.utteranceLevelTestResults
    ?.items?.length
);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };
  const downloadFailures = () => {

  const utterances =
    resultData?.utteranceResults
      ?.testExecutionResults
      ?.utteranceLevelTestResults
      ?.items || [];
  console.log(
  utterances.map(item => ({
    recordNumber: item.recordNumber,
    conversationId: item.conversationId,
    intentMatchResult:
      item.turnResult?.user?.intentMatchResult,
    endToEndResult:
      item.turnResult?.user?.endToEndResult,
    conversationResult:
      item.turnResult?.user?.conversationLevelResult
        ?.endToEndResult
  }))
);

  const failures = utterances.filter(item => {

  const user = item.turnResult?.user;

  if (!user) return false;

  return (
    user.intentMatchResult === "Mismatched" ||
    user.endToEndResult === "Mismatched" ||
    user.errorDetails
  );

});

  if (failures.length === 0) {
    alert("No failures found");
    return;
  }

  const rows = failures.map(item => {

    const user = item.turnResult.user;

    return {
      conversationId:
        item.conversationId,

      input:
        user.input?.utteranceInput?.textInput || "",

      expectedIntent:
        user.expectedOutput?.intent?.name || "",

      actualIntent:
        user.actualOutput?.intent?.name || "",

      result:
        user.intentMatchResult || "",

      error:
        user.errorDetails?.errorMessage || ""
    };

  });

  const headers = Object.keys(rows[0]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row =>
      headers
        .map(header =>
          `"${row[header] || ""}"`
        )
        .join(",")
    )
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    `${fileName}-Failures.csv`
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

  const utterances =
  resultData?.utteranceResults
    ?.testExecutionResults
    ?.utteranceLevelTestResults
    ?.items || [];

const groupedConversations =
  utterances.reduce((acc, item) => {

    const conversationId =
      item.conversationId || "Unknown";

    if (!acc[conversationId]) {
      acc[conversationId] = [];
    }

    acc[conversationId].push(item);

    return acc;

  }, {});

  return (

    <div className="analyze-container">

      <div className="analyze-header">
        <h2>Analysis Dashboard</h2>
        <div className="button-group">

  <button
    className="action-btn download-btn"
    onClick={downloadFailures}
  >
    Download Failures CSV
  </button>


  {!embedded && (

    <button
      className="action-btn home-btn"
      onClick={() => navigate("/user-login")}
    >
      Home
    </button>

  )}

</div>

      </div>

      <div className="summary-cards">

        <div className="card">
          <h4>Email</h4>
          <p>{email}</p>
        </div>

        <div className="card">
          <h4>Bot Name</h4>
          <p>{botName}</p>
        </div>

        <div className="card">
          <h4>File Name</h4>
          <p>{fileName}</p>
        </div>

      </div>

      <div className="results-section">

  <h3>Test Execution Results</h3>

  {loading ? (

    <div className="result-box">
      Loading Results...
    </div>

  ) : (

    <>
      {/* Summary */}

      <div className="summary-cards">

  <div className="card">
    <h4>Total Conversations</h4>
    <p>
      {
        resultData?.overallResults
          ?.testExecutionResults
          ?.overallTestResults
          ?.items?.[0]
          ?.totalResultCount || 0
      }
    </p>
  </div>

  <div className="card">
    <h4>Passed</h4>
    <p>
      {
        resultData?.overallResults
          ?.testExecutionResults
          ?.overallTestResults
          ?.items?.[0]
          ?.endToEndResultCounts
          ?.Matched || 0
      }
    </p>
  </div>

  <div className="card">
    <h4>Failed</h4>
    <p>
      {
        resultData?.overallResults
          ?.testExecutionResults
          ?.overallTestResults
          ?.items?.[0]
          ?.endToEndResultCounts
          ?.Mismatched || 0
      }
    </p>
  </div>

  <div className="card">
    <h4>Accuracy</h4>

    <p>
      {(() => {

        const total =
          resultData?.overallResults
            ?.testExecutionResults
            ?.overallTestResults
            ?.items?.[0]
            ?.totalResultCount || 0;

        const passed =
          resultData?.overallResults
            ?.testExecutionResults
            ?.overallTestResults
            ?.items?.[0]
            ?.endToEndResultCounts
            ?.Matched || 0;

        return total
          ? `${((passed / total) * 100).toFixed(1)}%`
          : "0%";

      })()}
    </p>

  </div>

</div>

      {/* Intent Results */}

      <div className="result-box">

<h3>Intent Results</h3>

<table className="analysis-table">

<thead>
<tr>
<th>Intent</th>
<th>Total</th>
<th>Passed</th>
<th>Failed</th>
</tr>
</thead>

<tbody>

{resultData?.intentResults
?.testExecutionResults
?.intentClassificationTestResults
?.items?.map((intent,index)=>(

<tr key={index}>

<td>{intent.intentName}</td>

<td>
{intent.resultCounts?.totalResultCount}
</td>

<td>
{
intent.resultCounts
?.intentMatchResultCounts
?.Matched || 0
}
</td>

<td>
{
intent.resultCounts
?.intentMatchResultCounts
?.Mismatched || 0
}
</td>

</tr>

))}

</tbody>

</table>

</div>

      {/* Conversation Results */}

      <div className="result-box">

<h3>Conversation Results</h3>

<table className="analysis-table">

<thead>

<tr>
<th>Conversation ID</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{resultData?.conversationResults
?.testExecutionResults
?.conversationLevelTestResults
?.items?.map((conv,index)=>(

<tr key={index}>

<td>
{conv.conversationId}
</td>

<td>

{conv.endToEndResult === "Matched"
? "✅ Passed"
: "❌ Failed"}

</td>

</tr>

))}

</tbody>

</table>

</div>

      {/* Utterance Mismatches */}

      <div className="result-box">

  <h3>Conversation Details</h3>

  {Object.entries(
    groupedConversations
  ).map(([conversationId, items]) => (

    <div
      key={conversationId}
      style={{
        marginBottom: "30px",
       border:
items.some(
item =>
item.turnResult?.user?.intentMatchResult === "Mismatched"
)
? "2px solid #ef4444"
: "2px solid #22c55e",
        borderRadius: "10px",
        padding: "15px"
      }}
    >

      <h3>
        Conversation {conversationId}
      </h3>

      {items.map((item, index) => {

        const user =
          item.turnResult?.user;

        const agent =
          item.turnResult?.agent;

        return (

          <div
            key={index}
            style={{
              marginBottom: "15px",
              paddingBottom: "15px",
              borderBottom:
                "1px solid #eee"
            }}
          >

            {user && (

              <div>

                <p>
                  <strong>User Input:</strong>{" "}
                  {
                    user.input
                      ?.utteranceInput
                      ?.textInput
                  }
                </p>

                <p>
                  <strong>Expected Intent:</strong>{" "}
                  {
                    user.expectedOutput
                      ?.intent?.name || "-"
                  }
                </p>

                <p>
                  <strong>Actual Intent:</strong>{" "}
                  {
                    user.actualOutput
                      ?.intent?.name ||
                    user.expectedOutput
                      ?.intent?.name ||
                    "-"
                  }
                </p>

                <p>
                  <strong>Result:</strong>{" "}
                  {
                    user.intentMatchResult ||
                    user.conversationLevelResult
                      ?.endToEndResult ||
                    "-"
                  }
                </p>

                {user.errorDetails && (

                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold"
                    }}
                  >
                    {
                      user.errorDetails
                        .errorMessage
                    }
                  </p>

                )}

              </div>

            )}

            {agent && (

              <div>

                <p>
                  <strong>Agent Prompt:</strong>{" "}
                  {
                    agent.actualAgentPrompt ||
                    agent.expectedAgentPrompt ||
                    "-"
                  }
                </p>

                <p>
                  <strong>Intent:</strong>{" "}
                  {
                    agent.actualIntent ||
                    "-"
                  }
                </p>

              </div>

            )}

          </div>

        );

      })}

    </div>

  ))}

</div>

    </>
  )}

</div>

    </div>

  );
}

export default Analyze;