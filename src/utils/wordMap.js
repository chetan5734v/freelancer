// Word Map Utility Functions

/**
 * Creates a word frequency map from text
 * @param {string} text - The input text to analyze
 * @param {object} options - Configuration options
 * @returns {Map} - Word frequency map
 */
export const createWordMap = (text, options = {}) => {
  const {
    minLength = 3,
    maxWords = 100,
    caseSensitive = false,
    removeStopWords = true
  } = options;

  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'
  ]);

  // Clean and process text
  const processedText = caseSensitive ? text : text.toLowerCase();

  // Extract words (remove punctuation, numbers, special characters)
  const words = processedText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => {
      if (word.length < minLength) return false;
      if (removeStopWords && stopWords.has(word.toLowerCase())) return false;
      return true;
    });

  // Count word frequencies
  const wordMap = new Map();
  words.forEach(word => {
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
  });

  // Sort by frequency and limit results
  const sortedEntries = Array.from(wordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxWords);

  return new Map(sortedEntries);
};

/**
 * Converts word map to array format for visualization
 * @param {Map} wordMap - The word frequency map
 * @returns {Array} - Array of {word, count, size} objects
 */
export const wordMapToArray = (wordMap) => {
  const entries = Array.from(wordMap.entries());
  const maxCount = Math.max(...entries.map(([, count]) => count));

  return entries.map(([word, count]) => ({
    word,
    count,
    size: Math.max(12, (count / maxCount) * 48) // Size between 12px and 48px
  }));
};

/**
 * Generate CSS styles for word cloud display
 * @param {Array} wordArray - Array from wordMapToArray
 * @returns {string} - CSS styles
 */
export const generateWordCloudStyles = (wordArray) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
  ];

  return wordArray.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    fontSize: `${item.size}px`,
    fontWeight: item.count > wordArray[0].count * 0.7 ? 'bold' : 'normal'
  }));
};
