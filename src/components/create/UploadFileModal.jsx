import React from "react";

function UploadFileModal({
  showUploadPopup,
  selectedBot,
  setNewFile,
  setShowUploadPopup,
  handleAddFile
}) {
  if (!showUploadPopup) return null;

  return (
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
            setNewFile(
              e.target.files[0]
            )
          }
        />

        <div className="popup-buttons">
          <button
            onClick={() => {
              setShowUploadPopup(false);
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleAddFile}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadFileModal;