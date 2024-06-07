document.addEventListener("DOMContentLoaded", async () => {
  let searchType = 'google';

  const tabButtons = {
    google: document.getElementById("googleButton"),
    youtube: document.getElementById("youtubeButton"),
    ai: document.getElementById("aiButton")
  };

  Object.values(tabButtons).forEach(button => {
    button.addEventListener("click", () => {
      setSearchType(button.id.replace('Button', ''));
    });
  });

  const setSearchType = (type) => {
    searchType = type;
    Object.values(tabButtons).forEach(button => button.classList.remove('active'));
    tabButtons[searchType].classList.add('active');
    getSelectedText();
  };

  const getActiveTab = async () => {
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
    return tabs[0];
  };

  const getData = async (selection) => {
    const inputElement = document.getElementById("input");
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (selection) {
      inputElement.style.opacity = 1;
      inputElement.textContent = selection;

      if (searchType === 'google' || searchType === 'youtube') {
        let googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(selection)}`;
        if (searchType === 'youtube') {
          googleSearchUrl += `+site:youtube.com`;
        }
        fetchGoogleResults(googleSearchUrl); // Call the function for Google/YouTube search
      } else if (searchType === 'ai') {
        await AISearch(selection);
      }
    } else {
      inputElement.style.opacity = 0.5;
      inputElement.textContent = "You have to first select some text";
    }
  };

  async function AISearch(selection) {
    const url = `http://127.0.0.1:8000/invoke?query=${selection}`;
    const resultsContainer = document.getElementById("results");

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      const aiResponse = results.response;
      const markdownResponse = convertTextToMarkdown(aiResponse);

      // Handle the AI response
      const resultElement = document.createElement("div");
      resultElement.classList.add("result");
      resultElement.innerHTML = `<h3>llama3 :</h3><p>${markdownResponse}</p>`;
      resultsContainer.appendChild(resultElement);

    } catch (error) {
      resultsContainer.innerHTML = `<p>Error fetching AI results: ${error.message}</p>`;
      console.error("Error in AI search:", error);
    }
  }

  async function fetchGoogleResults(googleSearchUrl) {
    const resultsContainer = document.getElementById("results");

    try {
      const response = await fetch(googleSearchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      const results = searchType === 'youtube' ? doc.querySelectorAll("div.g") : doc.querySelectorAll("div.tF2Cxc");

      results.forEach((result) => {
        const linkElement = result.querySelector("a");
        const titleElement = result.querySelector("h3");
        const snippetElement = result.querySelector("div.VwiC3b, div.IsZvec");

        if (linkElement && titleElement) {
          const link = linkElement.href;
          const title = titleElement.textContent;
          const snippet = snippetElement ? snippetElement.textContent : '';

          const resultElement = document.createElement("div");
          resultElement.classList.add("result");

          if (searchType === 'youtube' && link.includes("youtube.com/watch")) {
            // Extract the video ID from the URL
            const urlParams = new URLSearchParams(new URL(link).search);
            const videoId = urlParams.get('v');
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            // Add thumbnail
            const thumbnailImg = document.createElement("img");
            thumbnailImg.src = thumbnailUrl;
            thumbnailImg.alt = "Thumbnail";
            thumbnailImg.classList.add("thumbnail");
            resultElement.appendChild(thumbnailImg);
          }

          // Add website icon
          const iconElement = document.createElement("img");
          iconElement.src = `https://www.google.com/s2/favicons?domain=${new URL(link).hostname}`;
          iconElement.alt = "Website Icon";
          iconElement.classList.add("website-icon");

          // Add website name
          const websiteNameElement = document.createElement("span");
          websiteNameElement.textContent = new URL(link).hostname;
          websiteNameElement.classList.add("website-name");

          // Append icon and name before the rest of the result content
          resultElement.appendChild(iconElement);
          resultElement.appendChild(websiteNameElement);

          // Append title and snippet
          resultElement.innerHTML += `
            <h3><a href="${link}" target="_blank">${title}</a></h3>
            <p>${snippet}</p>
          `;

          resultsContainer.appendChild(resultElement);
        }
      });

      if (resultsContainer.childNodes.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
      }
    } catch (error) {
      resultsContainer.innerHTML = `<p>Error fetching search results: ${error.message}</p>`;
      console.error("Error fetching search results:", error);
    }
  }

  function convertTextToMarkdown(text) {
    // Basic Markdown conversion (you might need a more robust library)
    const codeBlockRegex = /`(\w+)?\n([\s\S]*?)\n`/g; // Matches code blocks with optional language

    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Italics
      .replace(/__(.*?)__/g, '<u>$1</u>')              // Underline (optional)
      .replace(/~~(.*?)~~/g, '<del>$1</del>')  // Strikethrough
      .replace(/\n/g, '<br>')                     // Newline to <br>
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')   // Tab to 4 space        
      .replace(/`(.*?)`/gs, '<pre><code>$1</code></pre>')  // Code blocks
      .replace(codeBlockRegex, (match, language, code) => {
        const langClass = language ? `language-${language}` : '';
        return `<pre><code class="${langClass}">${code}</code></pre>`;
      });
  }

  const getSelectedText = async () => {
    const activeTab = await getActiveTab();
    chrome.tabs.sendMessage(activeTab.id, { type: "LOAD" }, getData);
  };

  getSelectedText();
});
