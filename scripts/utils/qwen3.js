import { API_KEY, API_URL } from '../config.js';

const MODEL_NAME = 'qwen-turbo-latest';  // 你可以改为 qwen-turbo 或其他模型
const MAX_CONTEXT = 4096;
const MIN_TOKENS = 256;

let memoryContext = null;

export function resetMemory() {
  memoryContext = Date.now();
}

function estimateTokens(text) {
  return Math.ceil(JSON.stringify(text).length * 0.3);
}

export async function getAIResponse(prompt) {
  const usedTokens = estimateTokens(prompt);
  const max_tokens = Math.max(
    MIN_TOKENS,
    MAX_CONTEXT - usedTokens - 50
  );

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: prompt,
        temperature: 0.7,
        max_tokens: max_tokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Qwen API Error]', response.status, errorText);
      return `[Error ${response.status}]: ${errorText}`;
    }

    const result = await response.json();

    const message = result?.choices?.[0]?.message?.content;
    if (!message) {
      console.warn('[Qwen API Warning] No message content in response:', result);
      return '[Error]: Empty response from Qwen.';
    }

    return message;

  } catch (error) {
    console.error('[Qwen API Exception]', error);
    return `[Network Error]: ${error.message}`;
  }
}
