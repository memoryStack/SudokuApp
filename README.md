this branch contains basic sudoku functionalities like puzzle generation
of EASY, MEDIUM, HARD, EXPERT levels. and user will also be able to enter their
own Custom Puzzles and solve them in the app so basically it works like a sudoku
Puzzle simulator also

if gifs stop working when react native version is changed then it might be due to the
wrong version of fresco library getting used for that particular version of RN. so to check
the correct version, go to the Image docs for specific RN version and use the fresco version.
https://reactnative-archive-august-2023.netlify.app/docs/0.66/image

################################################
"use strict";

const os = require("os");

// Custom function to replace os.availableParallelism()
function getAvailableParallelism() {
  if (typeof os.availableParallelism === 'function') {
    return os.availableParallelism();
  }
  // Fallback for older Node.js versions
  return Math.max(1, require('os').cpus().length - 1);
}

module.exports = (workers) => {
  const cores = getAvailableParallelism();
  return typeof workers === "number" && Number.isInteger(workers)
    ? Math.min(cores, workers > 0 ? workers : 1)
    : Math.max(1, Math.ceil(cores * (0.5 + 0.5 * Math.exp(-cores * 0.07)) - 1));
};
################################################
