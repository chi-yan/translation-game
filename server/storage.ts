import { users, type User, type InsertUser, type TranslationQuestion } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getQuestions(count: number): Promise<TranslationQuestion[]>;
  addQuestion(question: Omit<TranslationQuestion, "id">): Promise<TranslationQuestion>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, TranslationQuestion>;
  private userCurrentId: number;
  private questionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.userCurrentId = 1;
    this.questionCurrentId = 1;
    
    // Initialize with some sample questions
    this.initializeQuestions();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getQuestions(count: number): Promise<TranslationQuestion[]> {
    const allQuestions = Array.from(this.questions.values());
    
    // Shuffle and select requested count
    return this.shuffleArray([...allQuestions]).slice(0, count);
  }

  async addQuestion(question: Omit<TranslationQuestion, "id">): Promise<TranslationQuestion> {
    const id = this.questionCurrentId++;
    const newQuestion: TranslationQuestion = { ...question, id };
    this.questions.set(id, newQuestion);
    return newQuestion;
  }

  // Helper function to shuffle array
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private initializeQuestions() {
    const sampleQuestions: Omit<TranslationQuestion, "id">[] = [
      {
        chinese: '你喜欢吃什么水果？',
        pinyin: 'Nǐ xǐhuān chī shénme shuǐguǒ?',
        options: [
          'What fruit do you like to eat?',
          'What food do you prefer?',
          'Do you like to eat fruit?',
          'What vegetables do you like?'
        ],
        correctIndex: 0
      },
      {
        chinese: '明天我要去图书馆学习。',
        pinyin: 'Míngtiān wǒ yào qù túshūguǎn xuéxí.',
        options: [
          'Yesterday I went to the bookstore.',
          'Tomorrow I will go to the library to study.',
          'I want to learn at the museum tomorrow.',
          'I like to read books at home.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这件衣服多少钱？',
        pinyin: 'Zhè jiàn yīfu duōshǎo qián?',
        options: [
          'Do you have this in another color?',
          'Where did you buy this dress?',
          'How much does this piece of clothing cost?',
          'Is this shirt too expensive?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的朋友住在北京。',
        pinyin: 'Wǒ de péngyǒu zhù zài Běijīng.',
        options: [
          'My friend is visiting Beijing.',
          'I want to live in Beijing.',
          'Do you know anyone in Beijing?',
          'My friend lives in Beijing.'
        ],
        correctIndex: 3
      },
      {
        chinese: '请问，附近有地铁站吗？',
        pinyin: 'Qǐngwèn, fùjìn yǒu dìtiě zhàn ma?',
        options: [
          'Excuse me, is there a subway station nearby?',
          'Where is the nearest bus stop?',
          'How far is the train station?',
          'Can you tell me the way to the airport?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我每天早上跑步。',
        pinyin: 'Wǒ měitiān zǎoshang pǎobù.',
        options: [
          'I like to go hiking on weekends.',
          'I run every morning.',
          'Do you exercise every day?',
          'Yesterday morning I went for a run.'
        ],
        correctIndex: 1
      },
      {
        chinese: '今天天气很好。',
        pinyin: 'Jīntiān tiānqì hěn hǎo.',
        options: [
          'Will it rain tomorrow?',
          'I don\'t like cold weather.',
          'The weather is very good today.',
          'It\'s very hot this summer.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我想学习中文因为很有用。',
        pinyin: 'Wǒ xiǎng xuéxí Zhōngwén yīnwèi hěn yǒuyòng.',
        options: [
          'Chinese is too difficult to learn.',
          'Do you speak Chinese?',
          'I don\'t think Chinese is useful.',
          'I want to learn Chinese because it\'s very useful.'
        ],
        correctIndex: 3
      },
      {
        chinese: '我昨天看了一部电影。',
        pinyin: 'Wǒ zuótiān kànle yī bù diànyǐng.',
        options: [
          'I watched a movie yesterday.',
          'I\'m going to watch TV tomorrow.',
          'I like to watch movies at home.',
          'What movie do you want to see?'
        ],
        correctIndex: 0
      },
      {
        chinese: '这个周末你有什么计划？',
        pinyin: 'Zhège zhōumò nǐ yǒu shénme jìhuà?',
        options: [
          'What did you do last weekend?',
          'What plans do you have for this weekend?',
          'Are you free next weekend?',
          'Do you like weekends?'
        ],
        correctIndex: 1
      },
      {
        chinese: '你会说英语吗？',
        pinyin: 'Nǐ huì shuō Yīngyǔ ma?',
        options: [
          'Do you speak English?',
          'Are you from England?',
          'I can speak Chinese.',
          'Do you want to learn English?'
        ],
        correctIndex: 0
      },
      {
        chinese: '他们是我的好朋友。',
        pinyin: 'Tāmen shì wǒ de hǎo péngyǒu.',
        options: [
          'He is my best friend.',
          'They are my good friends.',
          'We have been friends for a long time.',
          'Do you want to be my friend?'
        ],
        correctIndex: 1
      },
      {
        chinese: '我不知道怎么去那里。',
        pinyin: 'Wǒ bù zhīdào zěnme qù nàlǐ.',
        options: [
          'I want to go there.',
          'Have you been there before?',
          'I don\'t know how to get there.',
          'Can you show me the way?'
        ],
        correctIndex: 2
      },
      {
        chinese: '请给我一杯咖啡。',
        pinyin: 'Qǐng gěi wǒ yì bēi kāfēi.',
        options: [
          'Do you have tea?',
          'Is the coffee good here?',
          'How much is a cup of coffee?',
          'Please give me a cup of coffee.'
        ],
        correctIndex: 3
      },
      {
        chinese: '我想买一本书。',
        pinyin: 'Wǒ xiǎng mǎi yì běn shū.',
        options: [
          'I want to buy a book.',
          'Can you recommend a good book?',
          'I like to read books.',
          'Where is the bookstore?'
        ],
        correctIndex: 0
      }
    ];

    // Add all sample questions to storage
    sampleQuestions.forEach(q => {
      const id = this.questionCurrentId++;
      this.questions.set(id, { ...q, id });
    });
  }
}

export const storage = new MemStorage();
