document.querySelector('form#essay1').addEventListener('submit', generateEssay);

async function generateEssay(e) {
  e.preventDefault();

  // Get form values
  const fullscreenButton = document.getElementById('fullscreen');
  const type = document.querySelector('#type').value;
  const topic = document.querySelector('#topic').value;
  const length = document.querySelector('#length').value;

  // 获取 div#essay 元素
  const essayDiv = document.getElementById('essay');

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
          prompt: `写一篇完整的${type}， 100字左右关于 ${topic}`,
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
          prompt: `写一篇完整的${type}，至少 350 字,不能超過500字,关于 ${topic},並在有分段打上**`,
          max_tokens: 2000
        })
      });
    }

    return response.json();
  }

  fetchData()
    .then(data => {
      // 在这里继续处理您的数据

      // 隐藏加载屏幕
      loadingScreen.style.display = 'none';

      // Get generated text
      const essayText = data.choices[0].text;

      // Get word count
      const chineseWordCount = essayText.match(/[\u4e00-\u9fa5]+/g).join('').length;

      // Update HTML
      document.querySelector('#essay-count').innerHTML = `${chineseWordCount} words`;
      document.querySelector('#essay-text').innerHTML = essayText;

      fullscreenButton.addEventListener('click', () => {
        if (essayDiv.requestFullscreen) {
          essayDiv.requestFullscreen();
        }
      });
    })
    .catch(error => {
      console.error('发生错误：', error);
    });

  // 其他代码 ...
}
