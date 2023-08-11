const chatConv = async (payload, onText, onError, onStreamEnd, retryCount = 1) => {
  try {
    const controller = new AbortController();

    const resTimeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);
    const response = await fetch(`https://ai-proxy.xmn-lv.cn/api/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(resTimeoutId);
    OpenAIStreamParser(response, controller, onText, onError, onStreamEnd);
  } catch (error) {
    console.log('error', error);

    if (retryCount === 0) {
      onError?.(new Error('timeout'));
    } else {
      chatConv(payload, onText, onError, onStreamEnd, 0);
    }
  }
};

chatConv(
  {
    messages: [
      {
        role: 'user',
        content: '你好',
      },
    ],
    stream: true,
    model: 'gpt-3.5-turbo',
    temperature: 1,
    presence_penalty: 0,
  },
  function onText(text) {
    console.log('text', text);
  },
  function onError(error) {
    console.log('error', error);
  },
  function onStreamEnd() {
    console.log('onStreamEnd ...');
  }
);
