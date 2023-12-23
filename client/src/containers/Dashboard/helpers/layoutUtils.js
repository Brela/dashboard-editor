export function generateTwoColumnLayout(layout) {
  let currentY = [0, 0]; // Array to keep track of the current y value for each column

  return layout.map((item, index) => {
    const column = index % 2; // Current column (0 or 1)
    const newItem = {
      ...item,
      x: column * item.w, // Adjust x to account for the width of the item
      y: currentY[column],
    };

    currentY[column] += item.h; // Update the y value for the current column

    return newItem;
  });
}

export function generateThreeColumnLayout(layout) {
  let currentY = [0, 0, 0]; // Array to keep track of the current y value for each column

  return layout.map((item, index) => {
    const column = index % 3; // Current column (0, 1 or 2)
    const newItem = {
      ...item,
      x: column * item.w, // Adjust x to account for the width of the item
      y: currentY[column],
    };

    currentY[column] += item.h; // Update the y value for the current column

    return newItem;
  });
}

export function getNewXandYCoords(
  existingWidgets,
  widgetsPerRow,
  isChart,
  regularDims,
  chartDims
) {
  const grid = new Array(1000) // max rows
    .fill(null)
    .map(() => new Array(widgetsPerRow).fill(null));

  // Populate the grid with existing widgets
  existingWidgets.forEach((widget) => {
    for (let x = widget.x; x < widget.x + widget.w; x++) {
      for (let y = widget.y; y < widget.y + widget.h; y++) {
        grid[y][x] = widget;
      }
    }
  });

  let newX = 0,
    newY = 0;

  // this is for finding the next x and y positions on the grid
  outerLoop: for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < widgetsPerRow; x++) {
      // Check if the current spot and the required space are empty
      let canPlace = true;
      for (let dx = 0; dx < (isChart ? chartDims.w : regularDims.w); dx++) {
        for (let dy = 0; dy < (isChart ? chartDims.h : regularDims.h); dy++) {
          if (y + dy >= grid.length || grid[y + dy][x + dx] !== null) {
            canPlace = false;
            break;
          }
        }
        if (!canPlace) break;
      }
      if (canPlace) {
        newX = x;
        newY = y;
        break outerLoop;
      }
    }
  }

  return [newX, newY];
}
