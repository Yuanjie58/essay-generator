// Handle form submit for essay generation
document.querySelector('form#essay1').addEventListener('submit', generateEssay);

async function generateEssay(e) {
  e.preventDefault();

  // Get form values
  const fullscreenButton = document.getElementById('fullscreen');
  const topic = document.querySelector('#topic').value;
  const length = document.querySelector('#length').value;

  // 显示加载屏幕
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.style.display = 'block';

  // Call OpenAI API
  let response;
  
  async function fetchData() {
    const data = await fetch('/get_my_secret').then(response => response.json());
    const mySecret = data.mySecret;
    
  if (length === 'short') {
    response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mySecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `write a whole complete essay in about 80 words about ${topic}`,
        max_tokens: 2000
      })
    });
  } else if (length === 'long') {
    response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mySecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Write a complete essay at least 120 words about ${topic}, with each paragraph marked **, don't make over 5 paragraphs and less than 3 paragraphs.`,
        max_tokens: 2000
      })
    });
  } // <-- This closing brace was missing
    
   return response.json();
  }

  fetchData()
    .then(data => {
  // 隐藏加载屏幕
  loadingScreen.style.display = 'none';

  // Get generated text
  const essayText = data.choices[0].text;

  // Get word count
  const wordCount = essayText.split(' ').length;

  // Update HTML
  document.querySelector('#essay-count').innerHTML = `${wordCount} words`;
  document.querySelector('#essay-text').innerHTML = essayText;

  fullscreenButton.addEventListener('click', () => {
    const essay = document.getElementById('essay');

    if (essay.requestFullscreen) {
      essay.requestFullscreen();
    }
  });
 })
    .catch(error => {
      console.error('发生错误：', error);
    });

  // 其他代码 ...
}