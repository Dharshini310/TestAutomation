import React, {
  useState,
  useRef,
  useEffect,
  useContext
} from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import '../create/Create.css';
import { lex_context } from '../../App';

function Create({
  activeMenu,
  showBots
}) {
  const {
    file,
    setFile,
    botName,
    setBotName,
    botAliasName,
    setBotAliasName,
    bots,
    setBots,
    aliases,
    setAliases,
    isCreated,
    setIsCreated,
    files,
    setFiles,
    showFiles,
    setShowFiles,
    selectedBot,
    setSelectedBot,
    selectedAlias,
    setSelectedAlias,
    email,
    setEmail,
    storedEmail,
    showUploadPopup,
    setShowUploadPopup,
    newFile,
    setNewFile,
    showCreateForm,
    setShowCreateForm
  } = useContext(lex_context);

  const [displayEmail, setDisplayEmail] = useState('');
  const [userBots, setUserBots] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [testSets, setTestSets] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [testSetName, setTestSetName] = useState("");
  const [selectedTestSet, setSelectedTestSet] = useState(null);


  const [analysisInfo, setAnalysisInfo] = useState({
    email: "",
    botName: "",
    fileName: ""
  });

  const navigate = useNavigate();
  const fileRef = useRef(null);

  useEffect(() => {
    const createdStatus = localStorage.getItem('isCreated');
    const storedBot = localStorage.getItem('selectedBotName');
    const savedEmail = localStorage.getItem('email');

    if (savedEmail) {
      setDisplayEmail(savedEmail);

      fetchUserBots(savedEmail);
    }

    if (createdStatus === 'true') {
      setIsCreated(true);
      setShowCreateForm(false);
    } else {
      setIsCreated(false);
      setShowCreateForm(true);
    }

    if (storedBot) {
      setSelectedBot(storedBot);
    }

    fetchLexBots();
  }, []);

 const handleAnalyze = async (
  botName,
  fileName
) => {

  try {

    setAnalysisLoading(true);

    const username = displayEmail
      .split("@")[0]
      .replace(/\./g, " ")
      .replace(/_/g, " ")
      .replace(/-/g, " ");

    const folderName = username
      .split(" ")
      .map(
        word =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join("_");

    const resultPath =
      `${folderName}/${botName}/results/${fileName.replace(".csv", ".json")}`;

    let attempts = 0;
    const maxAttempts = 12; // 12 x 5 sec = 60 sec

    const pollResults = async () => {

      try {

        const response = await axios.get(
          `https://pmayt54z3l.execute-api.us-east-1.amazonaws.com/prod/Fetch?resultPath=${encodeURIComponent(resultPath)}`
        );

        const data =
          typeof response.data.body === "string"
            ? JSON.parse(response.data.body)
            : response.data;

        if (data.result) {

          setAnalysisData(data.result);

          setAnalysisInfo({
            email: displayEmail,
            botName,
            fileName
          });

          setAnalysisLoading(false);

          toast.success(
            "Analysis Completed"
          );

          return;
        }

      } catch (error) {

        console.log(
          `Waiting for results... Attempt ${
            attempts + 1
          }`
        );

      }

      attempts++;

      if (attempts < maxAttempts) {

        setTimeout(
          pollResults,
          5000
        );

      } else {

        setAnalysisLoading(false);

        toast.error(
          "Results not available after 60 seconds"
        );

      }

    };

    pollResults();

  } catch (error) {

    console.error(error);

    setAnalysisLoading(false);

    toast.error(
      "Failed to fetch analysis"
    );

  }

};
  const fetchLexBots = async () => {
    try {
      const response = await axios.get(
        'https://pmayt54z3l.execute-api.us-east-1.amazonaws.com/prod/Fetch'
      );

      const data =
        typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data;

      setBots(data.bots || []);
    } catch (error) {
      console.error(error);
      setBots([]);
      toast.error('Failed to fetch Lex bots');
    }
  };
  //CASE - 2
  const fetchUserBots = async (email) => {
    try {
      const response = await axios.get(
        `https://pmayt54z3l.execute-api.us-east-1.amazonaws.com/prod/Fetch?email=${email}`
      );

      const data =
        typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data;

      console.log("USER BOTS RESPONSE:", data);
      setUserBots(data.userBots || []);
      setTestSets(data.testSets || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch user bots');
    }
  };

  const handleBotChange = (e) => {
    const selectedBot = e.target.value;

    setBotName(selectedBot);
    setBotAliasName('');

    const filteredAliases = [
      ...new Set(
        bots
          .filter((bot) => bot.botName === selectedBot)
          .map((bot) => bot.botAliasName)
      )
    ];

    setAliases(filteredAliases);
  };

  const handleCancel = () => {
    setFile(null);
    setBotName('');
    setBotAliasName('');
    setAliases([]);

    if (fileRef.current) {
      fileRef.current.value = '';
    }

    const createdStatus = localStorage.getItem('isCreated');

    if (createdStatus === 'true') {
      setShowCreateForm(false);
    } else {
      navigate('/user-login');
    }
  };
  //CASE - 3
  const fetchFiles = async (botName) => {
    try {
      setLoadingFiles(true);
      const response = await axios.get(
        `https://pmayt54z3l.execute-api.us-east-1.amazonaws.com/prod/Fetch?email=${displayEmail}&botName=${botName}`
      );

      const data =
        typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data;

      setFiles(data.files || []);
      // setShowFiles(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch files');
    } finally {
      setLoadingFiles(false)
    }
  };

  const handleAddFile = async () => {
    if (!newFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64File = reader.result.split(",")[1];

          // Find bot details
          const selectedBotData = bots.find(
            (bot) => bot.botName === selectedBot
          );

          if (!selectedBotData) {
            toast.error("Bot details not found");
            return;
          }

          const payload = {
            file_content: base64File,
            file_name: newFile.name,

            bot_name: selectedBot,

            bot_alias_name:
              selectedBotData.botAliasName,

            bot_id:
              selectedBotData.botId,

            bot_alias_id:
              selectedBotData.botAliasId,

            email: displayEmail,
            test_set_name:
              selectedTestSet?.testSetName,

            test_set_id:
              selectedTestSet?.testSetId
          };

          console.log(
            "UPLOAD PAYLOAD:",
            payload
          );

          await axios.post(
            "https://nh1wspqjrd.execute-api.us-east-1.amazonaws.com/prod/upload",
            payload,
            {
              headers: {
                "Content-Type":
                  "application/json"
              }
            }
          );
          

          toast.success(
            "File Added Successfully"
          );

          setShowUploadPopup(false);
          setNewFile(null);

          fetchFiles(selectedBot);

        } catch (error) {
          console.error(error);
          toast.error(
            "Failed to upload file"
          );
        }
      };

      reader.readAsDataURL(newFile);

    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to upload file"
      );
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!file || !botName || !botAliasName || !displayEmail) {
      toast.error('Please fill all fields and upload a file');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64File = reader.result.split(',')[1];
          const selectedBotData = bots.find(
            (bot) =>
              bot.botName === botName &&
              bot.botAliasName === botAliasName
          );
          const payload = {
            file_content: base64File,
            file_name: file.name,
            bot_name: botName,
            bot_alias_name: botAliasName,
            bot_id: selectedBotData?.botId,
            bot_alias_id: selectedBotData?.botAliasId,
            email: displayEmail,
            test_set_name:
              selectedTestSet?.testSetName,

            test_set_id:
              selectedTestSet?.testSetId
          };

          const response = await axios.post(
            'https://nh1wspqjrd.execute-api.us-east-1.amazonaws.com/prod/upload',
            payload,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          console.log(response.data);
          toast.success("Test Set Created Successfully")

          setIsCreated(true);
          setShowCreateForm(false);

          localStorage.setItem('isCreated', 'true');
          localStorage.setItem('selectedBotName', botName);

          setSelectedBot(botName);
          fetchUserBots(displayEmail);
          setSelectedAlias(botAliasName);

          setFile(null);
          setBotName('');
          setBotAliasName('');
          setAliases([]);

          if (fileRef.current) {
            fileRef.current.value = '';
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to Store Data');
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error('Failed to Store Data');
    }
  };

  const uniqueBotNames = Array.isArray(bots)
    ? [...new Set(bots.map((bot) => bot.botName))]
    : [];

  const utterances =
    analysisData?.utteranceResults
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
  const downloadFailures = () => {

    const utterances =
      analysisData?.utteranceResults
        ?.testExecutionResults
        ?.utteranceLevelTestResults
        ?.items || [];

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
      `${analysisInfo.fileName}-Failures.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };
  return (
    <>
      {showBots &&
 activeMenu === "myBots" &&
 isCreated &&
 !showCreateForm ? (

        <div className="dashboard-layout">

          {/* LEFT PANEL */}
          <div className="left-panel">
            {activeMenu === "myBots" && (
            <div className="bot-sidebar">

              <div className="sidebar-header">
                <h3>My Bots</h3>

                <button
                  className="create-testcase-btn"
                  onClick={() => {
                    setShowCreateForm(true);
                    setFile(null);
                    setBotName('');
                    setBotAliasName('');
                    setAliases([]);
                  }}
                >
                  + Create Test Set
                </button>
              </div>

              {userBots.map((bot) => (
                <div key={bot}>

                  <div
                    className={`bot-card ${selectedBot === bot
                        ? "active-bot"
                        : ""
                      }`}
                    onClick={() => {
                      setSelectedBot(bot);
                      setFiles([]);
                      fetchFiles(bot);
                    }}
                  >
                    <span className="bot-name">{bot}</span>

                    {selectedBot === bot && (
                      <span
                        className="add-file-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUploadPopup(true);
                        }}
                      >
                        +
                      </span>
                    )}
                  </div>

                  {selectedBot === bot && (
                    <div className="bot-files">

                      {loadingFiles ? (
                        <p>Loading...</p>
                      ) : files.length > 0 ? (

                        files.map((file, index) => (
                          <div
                            key={index}
                            className="file-row"
                          >
                            <span>
                              📄 {file.fileName}
                            </span>

                            <button
                              className="analyze-btn"
                              onClick={() =>
                                handleAnalyze(
                                  selectedBot,
                                  file.fileName,
                                  file.resultPath
                                )
                              }
                            >
                              Analyze
                            </button>
                          </div>
                        ))

                      ) : (
                        <p>{null}</p>
                      )}

                    </div>
                  )}

                </div>
              ))}

            </div>
            )}

          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">

            <div className="testsets-section">



              {/* ANALYSIS RESULTS */}
              {/* ANALYSIS RESULTS */}

              {analysisLoading ? (

               <div className="analysis-loading">

    <div className="spinner"></div>

    <h2>Analysis In Progress</h2>

    <p>
      Executing test cases...
    </p>

   

  </div>

              ) : analysisData && (

                <div className="analysis-container">

                  <div className="analyze-header">

                    <h2>Analysis Dashboard</h2>

                    <div className="button-group">

                      <button
                        className="action-btn download-btn"
                        onClick={downloadFailures}
                      >
                        Download Failures CSV
                      </button>

                    </div>

                  </div>

                  <div className="result-box">

                    <h3>Analysis Summary</h3>

                    <table className="analysis-table">

                      <thead>
                        <tr>
                          {/* <th>Email</th> */}
                          <th>Bot Name</th>
                          <th>File Name</th>
                          <th>Total Conversations</th>
                          <th>Passed</th>
                          <th>Failed</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          {/* <td>{analysisInfo.email}</td> */}

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

                  {/* Intent Results */}

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
                          ?.items?.map((intent, index) => (

                            <tr key={index}>

                              <td>{index + 1}</td>

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
                          <th>Result</th>
                        </tr>
                      </thead>

                      <tbody>

                        {analysisData?.conversationResults
                          ?.testExecutionResults
                          ?.conversationLevelTestResults
                          ?.items?.map((conv, index) => (

                            <tr key={index}>



                              <td>{conv.conversationId}</td>

                              <td>
                                <span
                                  className={
                                    conv.endToEndResult === "Matched"
                                      ? "status-ready"
                                      : "status-error"
                                  }
                                >
                                  {conv.endToEndResult}
                                </span>
                              </td>

                            </tr>

                          ))}

                      </tbody>

                    </table>

                  </div>

                  {/* Conversation Details */}

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

                        {utterances.map((item, index) => {

                          const user =
                            item.turnResult?.user;

                          return (

                            <tr key={index}>

                              <td>
                                {item.conversationId}
                              </td>

                              <td>
                                {
                                  user?.input
                                    ?.utteranceInput
                                    ?.textInput || "-"
                                }
                              </td>

                              <td>
                                {
                                  user?.expectedOutput
                                    ?.intent?.name || "-"
                                }
                              </td>

                              <td>
                                {
                                  user?.actualOutput
                                    ?.intent?.name || "-"
                                }
                              </td>

                              <td>
                                {
                                  user?.intentMatchResult ||
                                  "-"
                                }
                              </td>

                              <td>
                                {
                                  user?.errorDetails
                                    ?.errorMessage || "-"
                                }
                              </td>

                            </tr>

                          );

                        })}

                      </tbody>

                    </table>

                  </div>

                </div>

              )}

              {/* <h3>Available Test Sets</h3>

            <div className="testset-table-container">

  <table className="testset-table">

    <thead>
      <tr>
        <th>S.No</th>
        <th>Test Set Name</th>
        <th>Test Set ID</th>
        <th>Status</th>
        <th>Modality</th>
      </tr>
    </thead>

    <tbody>

      {testSets.map((testSet, index) => (

        <tr key={testSet.testSetId}>

          <td>{index + 1}</td>

          <td>{testSet.testSetName}</td>

          <td>{testSet.testSetId}</td>

          <td>
            <span
              className={
                testSet.status === "Ready"
                  ? "status-ready"
                  : "status-error"
              }
            >
              {testSet.status}
            </span>
          </td>

          <td>{testSet.modality}</td>

        </tr>

      ))}

    </tbody>

  </table>

</div> */}

            </div>

          </div>

        </div>

      ) : (

        null

      )}

      {showCreateForm && (

  <div className="popup-overlay">

    <div className="popup-content create-popup">

      <h2>Create Test Set</h2>

      <form onSubmit={handleCreate}>

        <label>Email</label>

        <input
          type="email"
          value={displayEmail}
          readOnly
        />

        <label>Upload CSV File</label>

        <input
          type="file"
          accept=".csv"
          ref={fileRef}
          onChange={(e) =>
            setFile(e.target.files[0])
          }
          required
        />

        <label>Bot Name</label>

        <select
          value={botName}
          onChange={handleBotChange}
          required
        >
          <option value="">
            Select Bot
          </option>

          {uniqueBotNames.map((bot) => (

            <option
              key={bot}
              value={bot}
            >
              {bot}
            </option>

          ))}
        </select>

        <label>Bot Alias</label>

        <select
          value={botAliasName}
          onChange={(e) =>
            setBotAliasName(e.target.value)
          }
          required
        >
          <option value="">
            Select Alias
          </option>

          {aliases.map((alias) => (

            <option
              key={alias}
              value={alias}
            >
              {alias}
            </option>

          ))}
        </select>

        <label>Test Set</label>

        <select
          value={
            selectedTestSet?.testSetId || ""
          }
          onChange={(e) => {

            const selected =
              testSets.find(
                (testSet) =>
                  testSet.testSetId ===
                  e.target.value
              );

            setSelectedTestSet(
              selected
            );

          }}
          required
        >

          <option value="">
            Select Test Set
          </option>

          {testSets.map((testSet) => (

            <option
              key={testSet.testSetId}
              value={testSet.testSetId}
            >
              {testSet.testSetName}
            </option>

          ))}

        </select>

        <div className="popup-buttons">

          <button
            type="button"
            onClick={() => {

              setShowCreateForm(false);

              setFile(null);
              setBotName('');
              setBotAliasName('');
              setAliases([]);

              if (fileRef.current) {
                fileRef.current.value = '';
              }

            }}
          >
            Cancel
          </button>

          <button type="submit">
            Create
          </button>

        </div>

      </form>

    </div>

  </div>

)}

      {showUploadPopup && (
        <div className="popup-overlay">

          <div className="popup-content">

            <h3>
              Add File to Existing Bot
            </h3>

            <p>
              <strong>Bot:</strong>{" "}
              {selectedBot}
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setNewFile(e.target.files[0])
              }
            />

            <div className="popup-buttons">

              <button
                onClick={() => {
                  setShowUploadPopup(false);
                  setNewFile(null);
                }}
              >
                Cancel
              </button>

              <button onClick={handleAddFile}>
                Upload
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Create;