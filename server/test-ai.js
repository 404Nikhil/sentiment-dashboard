
const { analyzeImage } = require('./src/services/aiAnalyzer.js');

const testImageUrl = ''; 

const runTest = async () => {
  console.log('--- Starting AI Analyzer Test ---');
  console.log(`Testing with image: ${testImageUrl}`);
  
  const analysisResult = await analyzeImage(testImageUrl);
  
  console.log('\n--- Analysis Complete ---');
  console.log('Result:');
  console.log(JSON.stringify(analysisResult, null, 2));
};

runTest();