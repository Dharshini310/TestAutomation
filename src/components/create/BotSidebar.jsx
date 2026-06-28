import React from "react";

function BotSidebar({
  userBots,
  selectedBot,
  files,
  loadingFiles,
  setSelectedBot,
  setFiles,
  fetchFiles,
  setShowEditPopup,
popupMode,
setPopupMode,
setEditingFile,
setUpdatedFile,
  setShowCreateForm,
  setFile,
  setBotName,
  setBotAliasName,
  setAliases,
  handleAnalyze
}) {
  return (
    <div className="bot-sidebar">
      <div className="sidebar-header">
        <h3>My Bots</h3>

        <button
          className="create-testcase-btn"
          onClick={() => {
            setShowCreateForm(true);
            setFile(null);
            setBotName("");
            setBotAliasName("");
            setAliases([]);
          }}
        >
          + Create Test Set
        </button>
      </div>

      {userBots.map((bot) => (
        <div key={bot}>
          <div
            className={`bot-card ${
              selectedBot === bot ? "active-bot" : ""
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

    setPopupMode("upload");

    setEditingFile(null);

    setUpdatedFile(null);

    setShowEditPopup(true);
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
                          file.fileName
                        )
                      }
                    >
                      Analyze
                    </button>
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BotSidebar;