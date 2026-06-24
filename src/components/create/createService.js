import axios from "axios";

const FETCH_URL =
  "https://pmayt54z3l.execute-api.us-east-1.amazonaws.com/prod/Fetch";

const UPLOAD_URL =
  "https://nh1wspqjrd.execute-api.us-east-1.amazonaws.com/prod/upload";

export const fetchLexBotsAPI = async () => {
  const response = await axios.get(FETCH_URL);

  return typeof response.data.body === "string"
    ? JSON.parse(response.data.body)
    : response.data;
};

export const fetchUserBotsAPI = async (
  email
) => {
  const response = await axios.get(
    `${FETCH_URL}?email=${email}`
  );

  return typeof response.data.body ===
    "string"
    ? JSON.parse(response.data.body)
    : response.data;
};

export const fetchFilesAPI = async (
  email,
  botName
) => {
  const response = await axios.get(
    `${FETCH_URL}?email=${email}&botName=${botName}`
  );

  return typeof response.data.body ===
    "string"
    ? JSON.parse(response.data.body)
    : response.data;
};

export const uploadFileAPI = async (
  payload
) => {
  return axios.post(
    UPLOAD_URL,
    payload,
    {
      headers: {
        "Content-Type":
          "application/json"
      }
    }
  );
};

export const fetchAnalysisAPI =
  async (resultPath) => {
    const response =
      await axios.get(
        `${FETCH_URL}?resultPath=${encodeURIComponent(
          resultPath
        )}`
      );

    return typeof response.data.body ===
      "string"
      ? JSON.parse(response.data.body)
      : response.data;
  };