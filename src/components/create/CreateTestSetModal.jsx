import React from "react";
import { useNavigate } from "react-router-dom";

function CreateTestSetModal({
  showCreateForm,
  file,
  fileRef,
  setFile,
  botName,
  handleBotChange,
  uniqueBotNames,
  botAliasName,
  setBotAliasName,
  aliases,
  testSets,
  selectedTestSet,
  setSelectedTestSet,
  handleCreate,
  setShowCreateForm,
  setBotName,
  setAliases
}){
  if (!showCreateForm) return null;
   const handleCancel = () => {
    setFile(null);
    setBotName('');
    setBotAliasName('');
    setAliases([]);

    if (fileRef.current) {
      fileRef.current.value = '';
    }
    const navigate = useNavigate();
    const createdStatus = localStorage.getItem('isCreated');

    if (createdStatus === 'true') {
      setShowCreateForm(false);
    } else {
      navigate('/user-login');
    }
  };

  return (
   <div className="modal-overlay">

  <div className="create-modal">

    <div className="modal-header">
      <div>
        <h2>Create Test Set</h2>
        <p>
          Upload and configure a Lex test set for analysis.
        </p>
      </div>

      <button
        className="close-btn"
        onClick={handleCancel}
      >
        ×
      </button>
    </div>

    <form onSubmit={handleCreate}>

      {/* Row 1 */}
      <div className="form-row">

      <div className="form-group full-width">
  <label>Upload CSV File</label>

  <div className="custom-file-upload">

    <label
      htmlFor="csvFile"
      className="upload-button"
    >
      📁 Choose CSV File
    </label>

    <input
      id="csvFile"
      type="file"
      accept=".csv"
      ref={fileRef}
      onChange={(e) =>
        setFile(e.target.files[0])
      }
    />

    <span className="selected-file-name">
      {file
        ? file.name
        : "No file selected"}
    </span>

  </div>
</div>

      </div>

      {/* Row 2 */}
      <div className="form-row">

        <div className="form-group">
          <label>Bot Name</label>

          <select
            value={botName}
            onChange={handleBotChange}
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
        </div>

        <div className="form-group">
          <label>Bot Alias</label>

          <select
            value={botAliasName}
            onChange={(e) =>
              setBotAliasName(
                e.target.value
              )
            }
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
        </div>

      </div>

      {/* Row 3 */}
      <div className="form-row">

        <div className="form-group full-width">
          <label>Test Set</label>

          <select
            value={
              selectedTestSet?.testSetId ||
              ""
            }
            onChange={(e) => {

              const testset =
                testSets.find(
                  (item) =>
                    item.testSetId ===
                    e.target.value
                );

              setSelectedTestSet(
                testset
              );
            }}
          >
            <option value="">
              Select Test Set
            </option>

            {testSets.map(
              (testset) => (
                <option
                  key={
                    testset.testSetId
                  }
                  value={
                    testset.testSetId
                  }
                >
                  {
                    testset.testSetName
                  }
                </option>
              )
            )}
          </select>
        </div>

      </div>

      {/* Footer Buttons */}
      <div className="modal-footer">

        <button
          type="button"
          className="cancel-btn"
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="create-btn"
        >
          Create
        </button>

      </div>

    </form>

  </div>

</div>
  );
}

export default CreateTestSetModal;