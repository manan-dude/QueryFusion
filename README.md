# 🔍 Query-Fusion

![icon](https://github.com/manan-dude/QueryFusion/assets/76246911/3478abdc-dbc3-48e5-9e58-8a4f5b99a818)

Welcome to **Query-Fusion**! This extension enhances your browsing experience by allowing you to quickly fetch and display search results from Google, YouTube, and AI (Ollama - llama3) based on selected text. Easily toggle between Google, YouTube, and Ollama results within the extension popup for a seamless search experience.

---

## 🚀 Features

✨ **Dynamic Search Results**: Fetches and displays search results from Google, YouTube, and Ollama (using llama3 model).

🖼 **User-Friendly Interface**: Parses and presents results directly in the extension popup.

🔄 **Toggle Functionality**: Easily switch between Google, YouTube, and Ollama search results.

---

## 📦 Installation

1. **Download the Zip File**:
   - [Download the latest release](https://github.com/manan-dude/QueryFusion/archive/refs/heads/main.zip)

2. **Set Up the AI Server**:
   - Ensure you have Python installed on your system.
   - Open a terminal and navigate to the unzipped folder.
   - Create a virtual environment:
     ```sh
     python -m venv query-fusion-env
     ```
   - Activate the virtual environment:
     - On Windows:
       ```sh
       query-fusion-env\Scripts\activate
       ```
     - On macOS/Linux:
       ```sh
       source query-fusion-env/bin/activate
       ```
   - Install the necessary dependencies:
     ```sh
     pip install -r requirements.txt
     ```
   - Run the AI server:
     ```sh
     python llama.py
     ```

3. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle switch in the top right)
   - Click "Load unpacked"
   - Select the unzipped folder of the extension

4. **You're Ready to Go!**:
   - Select any text on a webpage
   - Click the extension icon to view search results
   - Use the toggle button to switch between Google, YouTube, and Ollama results

---

## 🛠 Usage

1. **Select Text**:
   - Highlight any text on a webpage that you want to search for.

2. **Open Extension**:
   - Click the extension icon in the Chrome toolbar.

3. **View Results**:
   - Instantly view search results from Google, YouTube, or Ollama.
   - Use the toggle button to switch between the three.

---

## 🖼 Screenshots

| Google Results                                  | YouTube Results                                 | Ollama Results                                  |
|-------------------------------------------------|-------------------------------------------------|-------------------------------------------------|
| ![image](https://github.com/manan-dude/QueryFusion/assets/76246911/660c3b6a-b595-4c29-8740-fd9d65e748df) | ![image](https://github.com/manan-dude/QueryFusion/assets/76246911/2617a5b0-91f5-46a6-b0ef-16384fba93bb) | ![image](https://github.com/manan-dude/QueryFusion/assets/76246911/fabdfe36-7264-4cdb-a50d-4b4ea4bce493) |

---

## 🌟 Contributing

We welcome contributions to improve this extension! Feel free to submit pull requests and issues on our [GitHub repository](https://github.com/manan-dude/QueryFusion.git).

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
