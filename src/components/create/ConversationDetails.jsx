import React from "react";

function ConversationDetails({
  utterances
}) {
  return (
    <div className="result-box">
      <h3>Conversation Details</h3>

      <table className="analysis-table">
        <thead>
          <tr>
            <th>Conversation ID</th>
            <th>User Input</th>
            <th>Expected Intent</th>
            <th>Actual Intent</th>
            <th>Result</th>
            <th>Error</th>
          </tr>
        </thead>

        <tbody>
          {utterances.map(
            (item, index) => {
              const user =
                item.turnResult?.user;

              return (
                <tr key={index}>
                  <td>
                    {
                      item.conversationId
                    }
                  </td>

                  <td>
                    {user?.input
                      ?.utteranceInput
                      ?.textInput || "-"}
                  </td>

                  <td>
                    {user
                      ?.expectedOutput
                      ?.intent?.name ||
                      "-"}
                  </td>

                  <td>
                    {user
                      ?.actualOutput
                      ?.intent?.name ||
                      "-"}
                  </td>

                  <td>
                    {user?.intentMatchResult ||
                      "-"}
                  </td>

                  <td>
                    {user?.errorDetails
                      ?.errorMessage ||
                      "-"}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ConversationDetails;