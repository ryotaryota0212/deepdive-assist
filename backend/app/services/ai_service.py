from typing import List, Dict, Any, Tuple, Optional
import os
import json
from dotenv import load_dotenv
import hashlib

from langchain_community.llms import OpenAI
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain, RetrievalQA
from langchain.prompts import PromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

USE_MOCK = not OPENAI_API_KEY

if not USE_MOCK:
    try:
        chat_model = ChatOpenAI(
            model_name="gpt-4o",  # Use GPT-4o as specified in requirements
            temperature=0.7,
            openai_api_key=OPENAI_API_KEY
        )
        
        embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
        
        print("OpenAI API initialized successfully.")
    except Exception as e:
        print(f"Error initializing OpenAI API: {e}")
        USE_MOCK = True
        print("Falling back to mock responses.")
else:
    print("OpenAI API key not found. Using mock responses.")

class RelatedWork(BaseModel):
    title: str = Field(description="The title of the related work")
    creator: Optional[str] = Field(None, description="The creator or author of the related work")
    description: Optional[str] = Field(None, description="A brief description of the related work and its relevance")
    url: Optional[str] = Field(None, description="A URL to learn more about the related work")

class DeepDiveResponse(BaseModel):
    analysis: str = Field(description="Detailed analysis of the media based on the question")
    related_works: List[RelatedWork] = Field(description="List of related works that are relevant to the analysis")

def generate_note_summary(note_content: str) -> str:
    """
    Generate an AI summary of a user's note using LangChain and OpenAI.
    Falls back to mock summaries if OpenAI API is not available.
    """
    if USE_MOCK:
        mock_summaries = [
            "このメモからは、作品の世界観に深く没入し、キャラクターの成長に共感している様子が伺えます。特に主人公の内面的な葛藤と決断のプロセスに注目しているようです。",
            "作品の視覚表現と音楽の調和に感銘を受けている印象です。特に重要なシーンでの演出効果が記憶に残っているようです。",
            "物語の伏線と構造に関心を持ち、作者の意図を読み解こうとしている様子が見られます。特に結末に至るまでの展開に注目しています。",
            "キャラクター間の関係性と対話に注目し、その背後にある感情の機微を捉えようとしています。特に対立するキャラクター同士の和解のプロセスに感動しているようです。"
        ]
        
        hash_value = int(hashlib.md5(note_content.encode()).hexdigest(), 16)
        return mock_summaries[hash_value % len(mock_summaries)]
    
    try:
        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessage(content="""
            あなたはメディア作品（映画、アニメ、小説、ゲームなど）に関するユーザーのメモを分析し、
            簡潔な要約を生成する専門家です。ユーザーのメモから、彼らが作品のどの側面に注目し、
            どのような感情や考察を持っているかを抽出してください。
            
            要約は日本語で、100文字以内に収めてください。
            """),
            HumanMessagePromptTemplate.from_template("{note_content}")
        ])
        
        summary_chain = LLMChain(
            llm=chat_model,
            prompt=prompt_template
        )
        
        result = summary_chain.run(note_content=note_content)
        return result.strip()
    
    except Exception as e:
        print(f"Error generating note summary: {e}")
        return generate_note_summary(note_content)

def generate_deep_dive_response(
    question: str, 
    media: Any, 
    user_notes: List[Any]
) -> Tuple[str, List[Dict[str, str]]]:
    """
    Generate an AI deep dive response based on a user's question about a media item.
    Uses LangChain and OpenAI for RAG (Retrieval Augmented Generation).
    Falls back to mock responses if OpenAI API is not available.
    """
    if USE_MOCK:
        mock_response = """
        この作品の裏テーマは「自己犠牲と救済」です。表面的には冒険や戦いの物語に見えますが、
        主人公の行動の根底には常に他者を救うための自己犠牲の精神があります。
        
        特に注目すべき点は以下の3つです：
        
        1. 主人公が最終決戦で見せた決断は、自分の命と引き換えに世界を救うという選択でした。これは作品全体を通して描かれてきた「真の強さとは何か」というテーマの集大成と言えます。
        
        2. 脇役キャラクターたちの成長も、自己犠牲と他者への愛という観点から描かれています。特に第二章での親友の決断は、後の展開に大きな影響を与えています。
        
        3. ラストシーンは一見ハッピーエンドに見えますが、実は主人公が失ったものの大きさを静かに示唆しており、救済には常に代償が伴うことを暗示しています。
        
        あなたのメモにある「なぜ主人公は最後にあの選択をしたのか」という疑問は、まさにこの裏テーマに直結しています。主人公にとって、自己犠牲は単なる美徳ではなく、自分の存在意義を確認する手段だったのです。
        """
        
        mock_related_works = [
            {
                "title": "千と千尋の神隠し",
                "creator": "宮崎駿",
                "description": "自己犠牲と成長をテーマにした作品。主人公の千尋が両親を救うために異世界で奮闘する物語。",
                "url": "https://example.com/spirited-away"
            },
            {
                "title": "進撃の巨人",
                "creator": "諫山創",
                "description": "自由と犠牲の意味を問う作品。主人公エレンの選択と代償が描かれる。",
                "url": "https://example.com/attack-on-titan"
            }
        ]
        
        hash_value = int(hashlib.md5(question.encode()).hexdigest(), 16)
        
        if hash_value % 3 == 0:
            mock_response += "\n\nまた、この作品は「個人と社会」の関係性についても深く掘り下げています。主人公の選択が社会全体に与える影響と、社会の期待が個人に与える重圧が巧みに描かれています。"
        elif hash_value % 3 == 1:
            mock_response += "\n\n作品の美術設定と音楽も、このテーマを強化するために効果的に使われています。特に重要なシーンでの色彩の使い方と音楽の選択は、観る者の感情に直接訴えかけます。"
        
        return mock_response, mock_related_works
    
    try:
        media_context = f"""
        タイトル: {media.title}
        種類: {media.media_type}
        制作者: {media.creator or '不明'}
        発表年: {media.release_year or '不明'}
        ジャンル: {', '.join(media.genres) if hasattr(media, 'genres') and media.genres else '不明'}
        概要: {media.description or '概要なし'}
        """
        
        notes_context = ""
        if user_notes:
            notes_context = "ユーザーのメモ:\n"
            for i, note in enumerate(user_notes, 1):
                notes_context += f"{i}. {note.content}\n"
                if note.rating:
                    notes_context += f"   評価: {note.rating}/5\n"
                if note.emotion:
                    notes_context += f"   感情: {note.emotion}\n"
                if note.ai_summary:
                    notes_context += f"   AI要約: {note.ai_summary}\n"
        
        parser = PydanticOutputParser(pydantic_object=DeepDiveResponse)
        
        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessage(content=f"""
            あなたはメディア作品（映画、アニメ、小説、ゲームなど）の深い分析と考察を提供する専門家です。
            ユーザーの質問に対して、作品の文脈、テーマ、象徴、キャラクター分析などを踏まえた詳細な回答を提供してください。
            
            以下の情報を参考にしてください：
            
            {media_context}
            
            {notes_context}
            
            回答は日本語で、以下の形式で提供してください：
            1. 質問に対する詳細な分析（800〜1000文字程度）
            2. 関連する作品のリスト（2〜3作品）- タイトル、制作者、簡単な説明、関連性を含む
            
            {parser.get_format_instructions()}
            """),
            HumanMessagePromptTemplate.from_template("{question}")
        ])
        
        deep_dive_chain = LLMChain(
            llm=chat_model,
            prompt=prompt_template
        )
        
        result = deep_dive_chain.run(question=question)
        
        try:
            parsed_result = parser.parse(result)
            return parsed_result.analysis, [work.dict() for work in parsed_result.related_works]
        except Exception as e:
            print(f"Error parsing result: {e}")
            return result, []
    
    except Exception as e:
        print(f"Error generating deep dive response: {e}")
        return generate_deep_dive_response(question, media, user_notes)

def create_vector_store(texts: List[str]) -> Optional[FAISS]:
    """
    Create a vector store from a list of texts using FAISS and OpenAI embeddings.
    Returns None if OpenAI API is not available.
    """
    if USE_MOCK:
        return None
    
    try:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        docs = text_splitter.create_documents(texts)
        
        vector_store = FAISS.from_documents(docs, embeddings)
        return vector_store
    
    except Exception as e:
        print(f"Error creating vector store: {e}")
        return None
