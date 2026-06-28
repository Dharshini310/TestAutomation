import React, {
  useState,
  useRef,
  useEffect,
  useContext
} from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "../create/Create.css";

import { lex_context } from "../../App";

import BotSidebar from "./BotSidebar";
import CreateTestSetModal from "./CreateTestSetModal";
import UploadFileModal from "./UploadFileModal";
import AnalysisDashboard from "./AnalyzeDashboard";

import {
  fetchLexBotsAPI,
  fetchUserBotsAPI,
  fetchFilesAPI,
  uploadFileAPI,
  fetchAnalysisAPI
} from "./createService";

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
  const [showEditPopup, setShowEditPopup] =
  useState(false);
  const [popupMode, setPopupMode] = useState("upload");

const [editingFile, setEditingFile] =
  useState(null);

const [updatedFile, setUpdatedFile] =
  useState(null);


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

       const data =
  await fetchAnalysisAPI(
    resultPath
  );

        

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
    const data =
      await fetchLexBotsAPI();

    setBots(data.bots || []);
  } catch (error) {
    console.error(error);

    setBots([]);

    toast.error(
      "Failed to fetch Lex bots"
    );
  }
};
  //CASE - 2
  const fetchUserBots = async (
  email
) => {
  try {
    const data =
      await fetchUserBotsAPI(
        email
      );

    setUserBots(
      data.userBots || []
    );

    setTestSets(
      data.testSets || []
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to fetch user bots"
    );
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

  const handleUpdateFile = async () => {
     console.log("updatedFile:", updatedFile);
  if (!updatedFile) {
    toast.error(
      "Please select a file"
    );
    return;
  }

  try {

    const reader =
      new FileReader();

    reader.onload =
      async () => {

      const base64File =
        reader.result
          .split(",")[1];

      const payload = {

        oldFileName:
          editingFile.fileName,

        file_name:
          updatedFile.name,

        file_content:
          base64File,

        bot_name:
          selectedBot,

        email:
          displayEmail

      };

      await axios.post(
        "YOUR_UPDATE_API",
        payload
      );

      toast.success(
        "File Updated Successfully"
      );

      setShowEditPopup(false);

      setUpdatedFile(null);

      fetchFiles(selectedBot);

    };

    reader.readAsDataURL(
      updatedFile
    );

  } catch (error) {

    toast.error(
      "Failed to update file"
    );

  }

};
  //CASE - 3
  const fetchFiles = async (
  botName
) => {
  try {
    setLoadingFiles(true);

    const data =
      await fetchFilesAPI(
        displayEmail,
        botName
      );

    setFiles(
      data.files || []
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to fetch files"
    );
  } finally {
    setLoadingFiles(false);
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

          await uploadFileAPI(payload);
          

          toast.success(
            "File Added Successfully"
          );
          setShowEditPopup(false);

setUpdatedFile(null);

setEditingFile(null);
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
  const handleDeleteFile = async () => {

  try {

    const payload = {

      bot_name:
        analysisInfo.botName,

      file_name:
        analysisInfo.fileName,

      email:
        displayEmail

    };

    await axios.post(
      "YOUR_DELETE_API",
      payload
    );

    toast.success(
      "File deleted successfully"
    );

    fetchFiles(selectedBot);

    setAnalysisData(null);

  } catch (error) {

    toast.error(
      "Failed to delete file"
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

          const response = await uploadFileAPI(payload);

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
  const totalCases = utterances.length;

const passedCases = utterances.filter(
  item =>
    item.turnResult?.user?.intentMatchResult ===
    "Matched"
).length;

const failedCases = utterances.filter(
  item =>
    item.turnResult?.user?.intentMatchResult !==
    "Matched"
).length;

const passRate =
  totalCases > 0
    ? Math.round(
        (passedCases / totalCases) * 100
      )
    : 0;
  return (
    <>
      {showBots &&
 activeMenu === "myBots" &&
 isCreated ? (

        <div className="dashboard-layout">

          {/* LEFT PANEL */}
          {/* <div className="left-panel">
  <BotSidebar
    userBots={userBots}
    selectedBot={selectedBot}
    files={files}
    loadingFiles={loadingFiles}
    setSelectedBot={
      setSelectedBot
    }
    setFiles={setFiles}
    fetchFiles={fetchFiles}
    setShowUploadPopup={
      setShowUploadPopup
    }
    setShowCreateForm={
      setShowCreateForm
    }
    setFile={setFile}
    setBotName={setBotName}
    setBotAliasName={
      setBotAliasName
    }
    setAliases={setAliases}
    handleAnalyze={
      handleAnalyze
    }
  />
</div> */}

          {/* RIGHT PANEL */}
         {/* RIGHT PANEL */}
<div className="right-panel">

    {/* BOT + TESTSET OVERVIEW */}
    <div className="lex-dashboard-container">

  {/* Header */}
  <div className="dashboard-header">
    <div>
      <span className="module-tag">AMAZON LEX</span>

      <h1>Lex Bot Testing</h1>

      <p>
        Validate utterance recognition, intent mapping,
        slot capture, confidence score and fallback handling
        for Lex bots.
      </p>
    </div>

    <button
      className="create-btn"
      onClick={() => setShowCreateForm(true)}
    >
      <span>+</span> Create Test Set
    </button>
  </div>

  {/* Bot and Testset Section */}
  <div className="bot-testset-card">

    {/* My Bots */}
    <div className="bots-column">
      <h2>My Bots</h2>

      {userBots.map((bot, index) => (
        <div
          key={index}
          className={`bot-card ${
            selectedBot === bot ? "active-bot" : ""
          }`}
          onClick={() => {
            setSelectedBot(bot);
            fetchFiles(bot);
          }}
        >
          <div className="bot-icon">🤖</div>

          <span>{bot}</span>
        </div>
      ))}
    </div>

    {/* Test Sets */}
    <div className="testset-column">
      <h2>Test Sets</h2>

      {files.map((file, index) => (
        <div
          key={index}
          className="testset-card"
        >
          <div className="testset-left">
            📄 {file.fileName}
          </div>

          <button
            className="analyze-btn"
            onClick={() =>
              handleAnalyze(
                selectedBot,
                file.fileName
              )
            }
          >
            Analyze
          </button>
        </div>
      ))}
    </div>

  </div>

  {/* Statistics */}
  <div className="stats-container">

  <div className="stat-card">
    <h4>Test Sets</h4>

    <h2>{files.length}</h2>

    <p>
      Lex Bot Testing records
    </p>
  </div>

  <div className="stat-card">

    <h4>Total Cases</h4>

    <h2>{totalCases}</h2>

    <p>Dynamic total</p>

  </div>

  <div className="stat-card">

    <h4>Pass Rate</h4>

    <h2>{passRate}%</h2>

    <p className="success-text">

      {passRate >= 90
        ? "Healthy"
        : passRate >= 70
        ? "Average"
        : "Critical"}

    </p>

  </div>

  <div className="stat-card">

    <h4>Failed Cases</h4>

    <h2>{failedCases}</h2>

    <p>Open failures</p>

  </div>

</div>

</div>
   

    {/* ANALYSIS DASHBOARD */}
    <AnalysisDashboard
  analysisLoading={analysisLoading}
  analysisData={analysisData}
  analysisInfo={analysisInfo}
  utterances={utterances}
  downloadFailures={downloadFailures}
  setShowEditPopup={setShowEditPopup}
  setEditingFile={setEditingFile}
   handleDeleteFile={
    handleDeleteFile
  }
/>

</div>

        </div>

      ) : (

        null

      )}

     <CreateTestSetModal
  showCreateForm={
    showCreateForm
  }
  displayEmail={
    displayEmail
  }
  fileRef={fileRef}
  setFile={setFile}
  botName={botName}
  handleBotChange={
    handleBotChange
  }
  uniqueBotNames={
    uniqueBotNames
  }
  botAliasName={
    botAliasName
  }
  setBotAliasName={
    setBotAliasName
  }
  aliases={aliases}
  testSets={testSets}
  selectedTestSet={
    selectedTestSet
  }
  setSelectedTestSet={
    setSelectedTestSet
  }
  handleCreate={
    handleCreate
  }
  setShowCreateForm={
    setShowCreateForm
  }
  setBotName={setBotName}
  setAliases={setAliases}
/>

      <UploadFileModal
  showUploadPopup={
    showUploadPopup
  }
  selectedBot={
    selectedBot
  }
  setNewFile={setNewFile}
  setShowUploadPopup={
    setShowUploadPopup
  }
  handleAddFile={
    handleAddFile
  }
/>
{/* console.log(
  "POPUP FILE:",
  editingFile
); */}
{showEditPopup && (

<div className="popup-overlay">

  <div className="popup-content">
<h3>
  {popupMode === "upload"
    ? "Add File to Existing Bot"
    : "Replace Existing File"}
</h3>

   <p>
  <strong>Current File</strong>
</p>

<div className="current-file-box">
  📄 {editingFile?.fileName}
</div>

    <input
  type="file"
  accept=".csv"
  onChange={(e) => {

    console.log(
      "Selected File:",
      e.target.files[0]
    );

      setNewFile(e.target.files[0])

  }}
/>

    <div className="popup-buttons">

      <button
  onClick={() => {

    setShowEditPopup(false);

    setUpdatedFile(null);

    setEditingFile(null);

  }}
>
  Cancel
</button>

      <button
  onClick={() => {

    if (popupMode === "upload") {

      handleAddFile();

    } else {

      handleUpdateFile();

    }

  }}
>
  {popupMode === "upload"
    ? "Upload File"
    : "Update File"}
</button>
    </div>

  </div>

</div>

)}
{popupMode === "upload" ? (

<div className="current-file-box">
  🤖 {selectedBot}
</div>

) : (

<div className="current-file-box">
  📄 {editingFile?.fileName}
</div>

)}
    </>
  );
}

export default Create;