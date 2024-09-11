import { NextResponse } from 'next/server';
import { ChatGroq } from '@langchain/groq';
import { loadSummarizationChain } from 'langchain/chains';
import { YoutubeTranscript } from 'youtube-transcript';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// https://lilianweng.github.io/posts/2023-06-23-agent/
// https://www.youtube.com/watch?v=Tn6-PIqc4UM&t

const QUOTE_CODE = '&amp;#39;';
const youtubeBaseUrl = 'youtube.com';

export async function POST(req: Request) {
  const { url, key } = await req.json();

  let allData = '';

  try {
    if (url.includes(youtubeBaseUrl)) {
      const transcript = await YoutubeTranscript.fetchTranscript(url);

      allData = transcript
        .reduce((acc, cur) => {
          return acc + ` ${cur.text}`;
        }, '')
        .replaceAll(QUOTE_CODE, "'");
    } else {
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();

      allData = docs.reduce((acc, cur) => {
        return acc + ` ${cur.pageContent}`;
      }, '');
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 100,
    });

    const splittedDocs = await textSplitter.createDocuments([allData]);
    console.log(splittedDocs);

    const model = new ChatGroq({
      apiKey: key ?? process.env.GROQ_API_KEY,
      model: 'llama3-groq-70b-8192-tool-use-preview',
    });

    const chain = loadSummarizationChain(model, { type: 'map_reduce' });

    const res = await chain.invoke({
      input_documents: splittedDocs.length > 30 ? splittedDocs.slice(0, 29) : splittedDocs,
    });

    return NextResponse.json(
      {
        result: res,
        chunksSize: splittedDocs.length,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e,
      },
      {
        status: 500,
      }
    );
  }
}
