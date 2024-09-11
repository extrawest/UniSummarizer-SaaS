'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChangeEvent, FC, useState } from 'react';

const MainPage: FC = () => {
  const [key, setKey] = useState('');
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');

  const onSummarize = () => {
    setSummary('Summary');
  };

  const onKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="flex flex-row w-full">
      <div className="px-10 py-20 flex-col w-1/4 bg-gray-200 h-full min-h-screen">
        <label>
          <p className="font-medium text-sm mb-2">Groq API key</p>
          <Input
            value={key}
            onChange={onKeyChange}
            type="password"
            placeholder="Enter key"
          />
        </label>
      </div>
      <div className="p-10 grid-col w-3/4">
        <h1 className="font-bold text-2xl mb-8">
          &#129436; LangChain: Summarize Text From YT or Website
        </h1>
        <h3 className="mb-4">Summarize URL</h3>
        <Input
          className="mb-8"
          value={url}
          onChange={onUrlChange}
          placeholder="Enter URL"
        />
        <Button
          type="button"
          variant="destructive"
          disabled={!url || !key}
          onClick={onSummarize}
          className="mb-10"
        >
          Summarize
        </Button>
        {summary && <div className="w-full bg-green-100 p-4 rounded-md">{summary}</div>}
      </div>
    </div>
  );
};

export default MainPage;