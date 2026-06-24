import React from "react";

function AnalysisSummary({
  analysisData,
  analysisInfo
}) {
  return (
    <div className="result-box">
      <h3>Analysis Summary</h3>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>Bot Name</th>
            <th>File Name</th>
            <th>Total Conversations</th>
            <th>Passed</th>
            <th>Failed</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{analysisInfo.botName}</td>

            <td>{analysisInfo.fileName}</td>

            <td>
              {
                analysisData?.overallResults
                  ?.testExecutionResults
                  ?.overallTestResults
                  ?.items?.[0]
                  ?.totalResultCount || 0
              }
            </td>

            <td>
              {
                analysisData?.overallResults
                  ?.testExecutionResults
                  ?.overallTestResults
                  ?.items?.[0]
                  ?.endToEndResultCounts
                  ?.Matched || 0
              }
            </td>

            <td>
              {
                analysisData?.overallResults
                  ?.testExecutionResults
                  ?.overallTestResults
                  ?.items?.[0]
                  ?.endToEndResultCounts
                  ?.Mismatched || 0
              }
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AnalysisSummary;