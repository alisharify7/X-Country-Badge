chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === "GET_TOKENS") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.cookies.getAll({url: "https://x.com"}, (cookies) => {
          const ct0 = cookies.find(c => c.name === "ct0");
          const authToken = cookies.find(c => c.name === "auth_token");
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: () => {
              return localStorage.getItem("gt");
            }
          }, (results) => {
            const tokens = {
              bearer: "Bearer AAAAAAAAAAAAAAA",
              csrf: ct0 ? ct0.value : ""
            };
            sendResponse(tokens);
          });
        });
      }
    });
    return true; // Will respond asynchronously
  }
});