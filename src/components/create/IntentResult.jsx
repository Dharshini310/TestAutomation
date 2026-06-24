import React from "react";

function IntentResults({
  analysisData
}) {
  return (
    <div className="result-box">
      <h3>Intent Results</h3>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Intent Name</th>
            <th>Total</th>
            <th>Matched</th>
            <th>Failed</th>
          </tr>
        </thead>

        <tbody>
          {analysisData?.intentResults
            ?.testExecutionResults
            ?.intentClassificationTestResults
            ?.items?.map(
              (intent, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>
                    {intent.intentName}
                  </td>

                  <td>
                    {
                      intent.resultCounts
                        ?.totalResultCount
                    }
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
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default IntentResults;