function getReqIdFromRes(res) {
  return res._request._requestId;
}

function pause(timeout) {
  return new Promise((resolve) => {
    if (!timeout) {
      resolve();
    } else {
      setTimeout(resolve, timeout);
    }
  });
}

function calculateCoverage(coverage) {
  let coverageEntries = {};

  for (let entry of coverage) {
    const { url, text, ranges } = entry;

    let totalBytes = text.length;
    let usedBytes = 0;
    
    for (const range of ranges) {
      usedBytes += range.end - range.start;
    }
    
    if (coverageEntries[url]) {
      coverageEntries[url].usedBytes = coverageEntries[url].usedBytes + usedBytes; 
    } else {
      coverageEntries[url] = { usedBytes, totalBytes }
    }
  }

  return coverageEntries;
}

module.exports.pause = pause;
module.exports.getReqIdFromRes = getReqIdFromRes;
module.exports.calculateCoverage = calculateCoverage;