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

      let googleSearchUrl;
      if (searchType === 'google') {
        googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(selection)}`;
      } else if (searchType === 'youtube') {
        googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(selection)}+site:youtube.com`;
      } else {
        resultsContainer.innerHTML = `
        <h1 style="
            color: #ff6600;
            font-size: 24px;
            text-align: center;
            margin-top: 50px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
            AI search functionality will be added soon.
        </h1>
        <p style="
            color: #d0d0d0;
            font-size: 18px;
            text-align: center;
            margin-top: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
            Stay tuned for updates!
        </p>
    `;
    
        return;
      }

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
      }
    } else {
      inputElement.style.opacity = 0.5;
      inputElement.textContent = "You have to first select some text";
    }
  };

  const getSelectedText = async () => {
    const activeTab = await getActiveTab();
    chrome.tabs.sendMessage(activeTab.id, { type: "LOAD" }, getData);
  };

  getSelectedText();
});
