Data to Table 🪄
A fast and simple Figma plugin that turns raw text into clean, beautiful Auto Layout tables with just one click.

📖 Overview
Have you ever tried to copy a table from ChatGPT or Excel into Figma? It usually pastes as a messy block of text. Data to Table fixes this problem.

How it works is very simple: You just paste your raw text (Markdown, CSV, or Excel data) into the plugin, click a button, and the plugin automatically draws a perfect, organized table for you directly inside your Figma file.

✨ Technologies Used
Vanilla JavaScript (For the logic and data parsing)

HTML & CSS (For the plugin user interface)

Figma Plugin API (To create the frames, text, and Auto Layout)

🚀 Features
Smart Paste: It automatically understands different text formats like Markdown, CSV, and Excel data (tabs).

Fully Responsive: Uses Figma's Auto Layout. Columns resize and text wraps automatically when you change the width.

Auto-Merge: It detects empty cells under grouped headers and merges them visually to make the table look professional.

Dynamic Styling: You can change the font size before creating the table, and the cell padding will adjust automatically to look perfect.

📍 The Process
I built this plugin because I was tired of wasting time drawing rectangles, lines, and text boxes every time I needed a data table in my designs. The process of copying data from AI tools or Excel into Figma was very slow and annoying.

I wanted to create something very simple to save time. I started by building a basic UI where the user can paste text. Then, I wrote the JavaScript logic to read that text, find the rows and columns, and tell Figma to create frames (boxes) for every piece of data.

The hardest part was making the "Smart Merge" logic work so that complex headers look right, but it was worth it! Now, a task that used to take 20 minutes takes only 1 second.

🚦 How to Use
Open Figma and run the Data to Table plugin.

Paste your raw text data into the input box.

Choose your preferred font size.

Click "Create Figma Table".

Your new table will appear on the canvas, ready to use!

🔗 Links
[Try it on Figma Community](Add your Figma plugin link here)
