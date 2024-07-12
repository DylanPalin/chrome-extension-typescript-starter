import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0]?.url);
    });
  }, []);

  const submitUrl = async () => {
    if (currentURL) {
    const journal = currentURL;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Summarize this journal to a medium length: " + journal;
    
    console.log(prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    }
  };

  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
      </ul>
      <button onClick={submitUrl}>Summarize Journal</button>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
