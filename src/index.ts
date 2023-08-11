import { createParser } from 'eventsource-parser';
import { isEmpty } from 'lodash';

export const TIMEOUT = 10000;

export function isValidJSON(data) {
  try {
    JSON.parse(data);
    return true;
  } catch (e) {
    return false;
  }
}

export interface OnTextCallbackResult {
  // response content
  text: string;
  // cancel for fetch
  cancel: () => void;
}

export async function streamRequest(
  response,
  controller,
  onText?: (option: OnTextCallbackResult) => void,
  onError?: (error: Error) => void,
  onStreamEnd?: () => void
) {
  // fetch has been canceled
  let hasCancel = false;
  // abort signal for fetch
  const cancel = () => {
    hasCancel = true;
    controller.abort();
  };

  let fullText = '';
  try {
    await handleSSE(
      response,
      (message) => {
        const data = JSON.parse(message);
        if (data.choices[0].finish_reason === 'stop') {
          onStreamEnd?.();
          return;
        }
        if (data.error) {
          throw new Error(`Error from OpenAI: ${JSON.stringify(data)}`);
        }
        const text = data.choices[0]?.delta?.content;

        if (text !== undefined) {
          fullText += text;
          if (onText) {
            onText({ text: fullText, cancel });
          }
        }
      },
      onStreamEnd
    );
  } catch (error) {
    // if a cancellation is performed
    // do not throw an exception
    // otherwise the content will be overwritten.
    if (hasCancel) {
      return;
    }
    if (onError) {
      onError(error as any);
    }
  }
  return fullText;
}

export async function handleSSE(
  response: Response,
  onMessage: (message: string) => void,
  onStreamEnd?: () => void
) {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error ? JSON.stringify(error) : `${response.status} ${response.statusText}`);
  }
  if (response.status !== 200) {
    throw new Error(`Error from OpenAI: ${response.status} ${response.statusText}`);
  }
  if (!response.body) {
    throw new Error('No response body');
  }
  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data);
    }
  });

  for await (const chunk of iterableStreamAsync(response.body, () => {
    onStreamEnd?.();
  })) {
    const str = new TextDecoder().decode(chunk, { stream: true });

    if (isValidJSON(str)) {
      const strParse = JSON.parse(str);
      if (!isEmpty(strParse.error)) {
        throw str;
      }
    }
    parser.feed(str);
  }
}

export async function* iterableStreamAsync(
  stream: ReadableStream,
  onTimeout: () => void
): AsyncIterableIterator<Uint8Array> {
  const reader = stream.getReader();
  try {
    while (true) {
      const resTimeoutId = setTimeout(() => {
        onTimeout();
      }, TIMEOUT);
      // eslint-disable-next-line no-await-in-loop
      const { value, done } = await reader.read();
      clearTimeout(resTimeoutId);
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
