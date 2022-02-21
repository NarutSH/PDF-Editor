import axios from "axios";

export const dsmApi = axios.create({
  baseURL: "https://dmsdev.beesuite.co/ecm/api/pdf/save",
  headers: {
    "Content-Type": "application/json",
  },
});
