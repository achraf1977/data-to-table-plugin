// This shows the UI (The window)
figma.showUI(__html__, { width: 400, height: 450 });

figma.ui.onmessage = async (msg) => {

  if (msg.type === 'create-table') {
    
    // 1. Load Fonts
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });

    const rawText = msg.text.trim();
    
    // Spacing Settings
    const baseFontSize = msg.fontSize || 14;
    const paddingV = Math.round(baseFontSize * 0.85); 
    const paddingH = Math.round(baseFontSize * 1.15);

    let rows = [];

    // --- SMART DETECTION START ---
    if (rawText.includes('|')) {
       // Markdown Parser
       rows = rawText.split('\n')
        .filter(line => line.includes('|')) 
        .filter(line => !line.includes('---')) 
        .map(line => {
            return line.split('|').map(c => c.trim()).filter(c => c !== "");
        });
    } 
    else if (rawText.includes('\t')) {
        // Excel/Sheets Parser (Tabs)
        rows = rawText.split('\n').map(line => line.split('\t'));
    }
    else {
        // CSV Parser (Commas & Quotes)
        rows = rawText.split('\n').map(line => {
             const matches = [];
             let current = '';
             let inQuote = false;
             for (let i = 0; i < line.length; i++) {
                 const char = line[i];
                 if (char === '"') { inQuote = !inQuote; }
                 else if (char === ',' && !inQuote) {
                     matches.push(current.trim().replace(/^"|"$/g, '')); 
                     current = '';
                 } else { current += char; }
             }
             matches.push(current.trim().replace(/^"|"$/g, '')); 
             return matches;
        });
    }
    // --- SMART DETECTION END ---

    if (rows.length === 0 || (rows.length === 1 && rows[0].length < 2)) {
        figma.notify("Could not detect a table! Try copying the 'Raw' markdown.");
        return;
    }

    // 2. Create the Main Table Frame
    const tableFrame = figma.createFrame();
    tableFrame.name = "Table";
    tableFrame.layoutMode = "VERTICAL";
    tableFrame.resize(1000, 100); 
    tableFrame.counterAxisSizingMode = "FIXED"; 
    tableFrame.primaryAxisSizingMode = "AUTO"; 
    tableFrame.itemSpacing = 0; 
    tableFrame.cornerRadius = 8;
    
    // Outer border: slightly thicker
    tableFrame.strokes = [{type: 'SOLID', color: {r: 0.7, g: 0.7, b: 0.7}}]; 
    tableFrame.strokeWeight = 1;
    tableFrame.strokeAlign = "OUTSIDE"; 

    let cellMatrix = [];

    // 3. Loop through the data
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i];
      if (cells.length === 0 || (cells.length === 1 && cells[0] === "")) continue;

      const rowFrame = figma.createFrame();
      rowFrame.name = i === 0 ? "Header Row" : "Row";
      rowFrame.layoutMode = "HORIZONTAL";
      rowFrame.layoutAlign = "STRETCH"; 
      rowFrame.primaryAxisSizingMode = "FIXED"; 
      rowFrame.counterAxisSizingMode = "AUTO";  
      
      if (i === 0) {
        rowFrame.fills = [{type: 'SOLID', color: {r: 0.95, g: 0.95, b: 0.95}}];
      } else {
        rowFrame.fills = []; 
      }

      let currentRowCells = [];

      for (let j = 0; j < cells.length; j++) {
        const cellTextRaw = cells[j]; 
        
        const cellFrame = figma.createFrame();
        cellFrame.name = "Cell";
        cellFrame.layoutMode = "VERTICAL";
        
        // --- LAYOUT SETTINGS ---
        cellFrame.primaryAxisSizingMode = "FIXED"; 
        cellFrame.counterAxisSizingMode = "FIXED"; 
        cellFrame.layoutGrow = 1; 
        cellFrame.layoutAlign = "STRETCH"; 
        
        // **NEW: Center content vertically (Good for merged cells)**
        cellFrame.primaryAxisAlignItems = "CENTER";

        // Padding
        cellFrame.paddingLeft = paddingH;
        cellFrame.paddingRight = paddingH;
        cellFrame.paddingTop = paddingV;
        cellFrame.paddingBottom = paddingV;
        
        // Explicit Borders (Visible Grey)
        cellFrame.strokeWeight = 1;
        cellFrame.strokes = [{type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8}}];

        const textNode = figma.createText();
        textNode.characters = cellTextRaw || " "; 
        textNode.fontSize = baseFontSize;
        textNode.layoutAlign = "STRETCH"; 
        textNode.textAutoResize = "HEIGHT"; 
        
        if (i === 0) {
          textNode.fontName = { family: "Inter", style: "Bold" };
        }

        cellFrame.appendChild(textNode);
        rowFrame.appendChild(cellFrame);
        
        currentRowCells.push(cellFrame);

        // --- SMART MERGE LOGIC ---
        
        let hasContentToRight = false;
        // Check neighbor to the right
        for (let k = j + 1; k < cells.length; k++) {
            if (cells[k] && cells[k].trim() !== "") {
                hasContentToRight = true;
                break;
            }
        }

        const isEmpty = (cellTextRaw === "" || cellTextRaw === " " || cellTextRaw === undefined);

        // Only merge if empty AND has content to the right
        if (i > 0 && isEmpty && hasContentToRight) {
            // Remove Top Border of current cell
            cellFrame.strokeTopWeight = 0;
            
            // Remove Bottom Border of cell above
            if (cellMatrix[i-1] && cellMatrix[i-1][j]) {
                const cellAbove = cellMatrix[i-1][j];
                cellAbove.strokeBottomWeight = 0;
            }
        }
      }

      cellMatrix.push(currentRowCells);
      tableFrame.appendChild(rowFrame);
    }

    figma.currentPage.selection = [tableFrame];
    figma.viewport.scrollAndZoomIntoView([tableFrame]);
    figma.closePlugin();
  }
};