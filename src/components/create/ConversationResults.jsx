import React from "react";

function ConversationResults({
  analysisData
}) {
  return (
    <div className="result-box">
      <h3>Conversation Results</h3>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>Conversation ID</th>
            <th>Result</th>
          </tr>
        </thead>

        <tbody>
          {analysisData?.conversationResults
            ?.testExecutionResults
            ?.conversationLevelTestResults
            ?.items?.map(
              (conv, index) => (
                <tr key={index}>
                  <td>
                    {conv.conversationId}
                  </td>

                  <td>
                    <span
                      className={
                        conv.endToEndResult ===
                        "Matched"
                          ? "status-ready"
                          : "status-error"
                      }
                    >
                      {
                        conv.endToEndResult
                      }
                    </span>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default ConversationResults;