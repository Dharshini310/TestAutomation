import React , {useState}from "react";

import AnalysisSummary from "./AnalyzeSummary";
import IntentResults from "./IntentResult";
import ConversationResults from "./ConversationResults";
import ConversationDetails from "./ConversationDetails";
import "./Analysis.css"

function AnalysisDashboard({
  analysisLoading,
  analysisData,
  analysisInfo,
  utterances,
  downloadFailures,
  setShowEditPopup,
   setEditingFile,
   handleDeleteFile
}){

    // const [editingFile, setEditingFile] = useState(null);
  if (analysisLoading) {
    return (
      <div className="analysis-loading">
        <div className="spinner"></div>

        <h2>
          Analysis In Progress
        </h2>

        <p>
          Executing test cases...
        </p>
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }
  const totalConversations =
    [...new Set(
        utterances.map(
            item => item.conversationId
        )
    )].length;

const passedCount =
    utterances.filter(
        item =>
            item.turnResult?.user
            ?.intentMatchResult ===
            "Matched"
    ).length;

const failedCount =
    utterances.filter(
        item =>
            item.turnResult?.user
            ?.intentMatchResult !==
            "Matched"
    ).length;

const passPercentage =
    totalConversations
        ? Math.round(
            (passedCount /
             (passedCount +
              failedCount)) * 100
          )
        : 0;
const testResults =
  utterances.map((item) => {

    const user =
      item.turnResult?.user || {};

    return {

      botName:
        analysisInfo.botName,

      fileName:
        analysisInfo.fileName,

      totalConversations:
        utterances.length,

      passed:
        utterances.filter(
          (u) =>
            u.turnResult?.user?.intentMatchResult ===
            "Matched"
        ).length,

      failed:
        utterances.filter(
          (u) =>
            u.turnResult?.user?.intentMatchResult !==
            "Matched"
        ).length,

      intentName:
        user.expectedOutput?.intent?.name ||
        "-",

      totalMatched:
        utterances.filter(
          (u) =>
            u.turnResult?.user?.intentMatchResult ===
            "Matched"
        ).length,

      totalFailed:
        utterances.filter(
          (u) =>
            u.turnResult?.user?.intentMatchResult !==
            "Matched"
        ).length,

      matchedResult:
        user.intentMatchResult ||
        "-",

      conversationId:
        item.conversationId ||
        "-",

      userInput:
        user.input
          ?.utteranceInput
          ?.textInput ||
        "-",

      expectedIntent:
        user.expectedOutput
          ?.intent?.name ||
        "-",

      actualIntent:
        user.actualOutput
          ?.intent?.name ||
        "-",

      result:
        user.endToEndResult ||
        user.intentMatchResult ||
        "-",

      error:
        user.errorDetails
          ?.errorMessage ||
        "-"
    };
});
  return (
   <div className="testset-table-container">

    <div className="table-header">

        <h2>Lex Bot Testing Test Sets</h2>

        <span className="record-count">
            {testResults.length} Records
        </span>

    </div>

    <div className="table-filters">

        <input
            type="text"
            placeholder="Search test set, owner, status..."
            className="search-input"
        />

        <select className="status-dropdown">
            <option>All Status</option>
            <option>Completed</option>
            <option>Needs Review</option>
        </select>

        <button
  className="export-btn"
  onClick={downloadFailures}
>
  Export Excel
</button>

    </div>

    <div className="table-wrapper">

        <table className="testset-table">

            <thead>

                <tr>
                    <th>Bot Name</th>
                    <th>File Name</th>
                    <th>Total Conversations</th>
                    <th>Passed</th>
                    <th>Failed</th>
                    <th>Pass %</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>

                <tr>

                    <td>{analysisInfo.botName}</td>

                    <td>{analysisInfo.fileName}</td>

                    <td>{totalConversations}</td>

                    <td>{passedCount}</td>

                    <td>{failedCount}</td>

                    <td>{passPercentage}%</td>

                    <td>{analysisInfo.email}</td>

                    <td>
                        <span className="status-badge">
                            Needs Review
                        </span>
                    </td>

                    <td className="action-cell">

                        <button className="run-btn">
                            Run
                        </button>

                        <button
  className="edit-btn"
  onClick={() => {

  console.log(
    analysisInfo.fileName
  );
  console.log(
  "SETTING:",
  analysisInfo.fileName
);

  setEditingFile({
    fileName:
      analysisInfo.fileName
  });

  setShowEditPopup(true);

}}
>
  Edit
</button>
                        <button
  className="delete-btn"
  onClick={() => {

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${analysisInfo.fileName}?`
      );

    if (confirmDelete) {
      handleDeleteFile();
    }

  }}
>
  Delete
</button>

                    </td>

                </tr>

            </tbody>

        </table>

    </div>
    <div className="conversation-table-container">

    <h2>
        Conversation Details
    </h2>

    <div className="table-wrapper">

        <table className="conversation-table">

            <thead>

                <tr>
                    <th>Conversation ID</th>
                    <th>User Input</th>
                    <th>Intent Name</th>
                    <th>Expected Intent</th>
                    <th>Actual Intent</th>
                    <th>Total Matched</th>
                    <th>Total Failed</th>
                    <th>Matched Result</th>
                    <th>Result</th>
                    <th>Error</th>
                </tr>

            </thead>

            <tbody>

                {utterances.map((item,index)=>{

                    const user =
                        item.turnResult?.user || {};

                    return(

                        <tr key={index}>

                            <td>
                                {item.conversationId}
                            </td>

                            <td>
                                {
                                    user.input
                                    ?.utteranceInput
                                    ?.textInput || "-"
                                }
                            </td>

                            <td>
                                {
                                    user.expectedOutput
                                    ?.intent?.name || "-"
                                }
                            </td>

                            <td>
                                {
                                    user.expectedOutput
                                    ?.intent?.name || "-"
                                }
                            </td>

                            <td>
                                {
                                    user.actualOutput
                                    ?.intent?.name || "-"
                                }
                            </td>

                            <td>
                                {passedCount}
                            </td>

                            <td>
                                {failedCount}
                            </td>

                            <td>
                                {
                                    user.intentMatchResult ||
                                    "-"
                                }
                            </td>

                            <td>
                                {
                                    user.endToEndResult ||
                                    "-"
                                }
                            </td>

                            <td>
                                {
                                    user.errorDetails
                                    ?.errorMessage || "-"
                                }
                            </td>

                        </tr>

                    )

                })}

            </tbody>

        </table>

    </div>

</div>

</div>

  );
}

export default AnalysisDashboard;