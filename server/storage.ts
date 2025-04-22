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
      },
      // Additional 85 questions to reach 100 total
      {
        chinese: '你叫什么名字？',
        pinyin: 'Nǐ jiào shénme míngzì?',
        options: [
          'What is your name?',
          'How old are you?',
          'Where are you from?',
          'What is your job?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我今年二十五岁。',
        pinyin: 'Wǒ jīnnián èrshíwǔ suì.',
        options: [
          'I started working when I was 25.',
          'I am 25 years old this year.',
          'I will be 25 next year.',
          'I have 25 students in my class.'
        ],
        correctIndex: 1
      },
      {
        chinese: '他是我的哥哥。',
        pinyin: 'Tā shì wǒ de gēgē.',
        options: [
          'She is my sister.',
          'He is my younger brother.',
          'He is my older brother.',
          'He is my cousin.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我家有四口人。',
        pinyin: 'Wǒ jiā yǒu sì kǒu rén.',
        options: [
          'I live alone.',
          'I have four siblings.',
          'There are four rooms in my house.',
          'There are four people in my family.'
        ],
        correctIndex: 3
      },
      {
        chinese: '现在几点了？',
        pinyin: 'Xiànzài jǐ diǎn le?',
        options: [
          'What time is it now?',
          'What day is it today?',
          'How long will it take?',
          'When do you want to meet?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我喜欢吃中国菜。',
        pinyin: 'Wǒ xǐhuān chī Zhōngguó cài.',
        options: [
          'Do you know how to cook?',
          'I like to eat Chinese food.',
          'Chinese food is too spicy for me.',
          'What kind of food do you like?'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个汉字怎么写？',
        pinyin: 'Zhège Hànzì zěnme xiě?',
        options: [
          'What does this character mean?',
          'Is this character difficult?',
          'How do you write this Chinese character?',
          'Can you teach me Chinese characters?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的生日是八月十五号。',
        pinyin: 'Wǒ de shēngrì shì bā yuè shíwǔ hào.',
        options: [
          'I was born in the winter.',
          'Today is my birthday.',
          'I\'m fifteen years old.',
          'My birthday is August 15th.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你住在哪里？',
        pinyin: 'Nǐ zhù zài nǎlǐ?',
        options: [
          'Where do you live?',
          'Where do you work?',
          'Where are you going?',
          'Where are you from?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我会说一点儿中文。',
        pinyin: 'Wǒ huì shuō yìdiǎnr Zhōngwén.',
        options: [
          'I don\'t understand Chinese.',
          'I can speak a little Chinese.',
          'I want to learn Chinese.',
          'Chinese is my mother tongue.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个字怎么念？',
        pinyin: 'Zhège zì zěnme niàn?',
        options: [
          'What does this mean?',
          'How do you write this?',
          'How do you pronounce this character?',
          'Is this character correct?'
        ],
        correctIndex: 2
      },
      {
        chinese: '火车站在哪条路上？',
        pinyin: 'Huǒchē zhàn zài nǎ tiáo lù shàng?',
        options: [
          'Is the train arriving on time?',
          'How far is the train station?',
          'When does the next train leave?',
          'On which road is the train station?'
        ],
        correctIndex: 3
      },
      {
        chinese: '你要去哪里？',
        pinyin: 'Nǐ yào qù nǎlǐ?',
        options: [
          'Where are you going?',
          'Where did you come from?',
          'How will you get there?',
          'Why are you leaving?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我正在学习中文。',
        pinyin: 'Wǒ zhèngzài xuéxí Zhōngwén.',
        options: [
          'I studied Chinese before.',
          'I am currently learning Chinese.',
          'I finished learning Chinese.',
          'I want to find a Chinese teacher.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这本书多少页？',
        pinyin: 'Zhè běn shū duōshǎo yè?',
        options: [
          'Is this book interesting?',
          'Who wrote this book?',
          'How many pages does this book have?',
          'What is this book about?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的汉语老师很严格。',
        pinyin: 'Wǒ de Hànyǔ lǎoshī hěn yángé.',
        options: [
          'I don\'t have a Chinese teacher.',
          'My Chinese teacher is very kind.',
          'I want to change my Chinese teacher.',
          'My Chinese teacher is very strict.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你吃早饭了吗？',
        pinyin: 'Nǐ chī zǎofàn le ma?',
        options: [
          'Have you eaten breakfast?',
          'Do you want to have lunch?',
          'What did you eat yesterday?',
          'Are you hungry now?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我喜欢在公园散步。',
        pinyin: 'Wǒ xǐhuān zài gōngyuán sànbù.',
        options: [
          'The park is very beautiful.',
          'I like to take walks in the park.',
          'There are many parks in my city.',
          'The park is far from my home.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个词是什么意思？',
        pinyin: 'Zhège cí shì shénme yìsi?',
        options: [
          'How do you spell this word?',
          'Is this word common?',
          'What does this word mean?',
          'How do you use this word?'
        ],
        correctIndex: 2
      },
      {
        chinese: '请问厕所在哪里？',
        pinyin: 'Qǐngwèn cèsuǒ zài nǎlǐ?',
        options: [
          'Where can I buy a ticket?',
          'Where is the information desk?',
          'Can you show me the exit?',
          'Excuse me, where is the restroom?'
        ],
        correctIndex: 3
      },
      {
        chinese: '你有兄弟姐妹吗？',
        pinyin: 'Nǐ yǒu xiōngdì jiěmèi ma?',
        options: [
          'Do you have any siblings?',
          'Are you married?',
          'Do you have children?',
          'How many family members do you have?'
        ],
        correctIndex: 0
      },
      {
        chinese: '明年我要去中国旅游。',
        pinyin: 'Míngnián wǒ yào qù Zhōngguó lǚyóu.',
        options: [
          'I lived in China last year.',
          'Next year I want to travel to China.',
          'China is my favorite country to visit.',
          'I returned from China yesterday.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个地方人很多。',
        pinyin: 'Zhège dìfāng rén hěn duō.',
        options: [
          'This place is very quiet.',
          'This is a famous place.',
          'There are many people in this place.',
          'I don\'t like crowded places.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的房间在二楼。',
        pinyin: 'Wǒ de fángjiān zài èr lóu.',
        options: [
          'My house is very small.',
          'I\'m looking for a new apartment.',
          'I share a room with my friend.',
          'My room is on the second floor.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你几点起床？',
        pinyin: 'Nǐ jǐ diǎn qǐchuáng?',
        options: [
          'What time do you get up?',
          'What time do you go to bed?',
          'How long do you sleep?',
          'Do you take naps?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我喜欢听音乐。',
        pinyin: 'Wǒ xǐhuān tīng yīnyuè.',
        options: [
          'Do you play any instruments?',
          'I like to listen to music.',
          'I don\'t like loud music.',
          'What kind of music do you like?'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个电影很有意思。',
        pinyin: 'Zhège diànyǐng hěn yǒuyìsi.',
        options: [
          'What movie are you watching?',
          'Do you like going to the movies?',
          'This movie is very interesting.',
          'I don\'t understand this movie.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我把钱包忘在家里了。',
        pinyin: 'Wǒ bǎ qiánbāo wàng zài jiālǐ le.',
        options: [
          'I don\'t have enough money.',
          'Can you lend me some money?',
          'Where did you put your wallet?',
          'I forgot my wallet at home.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你认识她吗？',
        pinyin: 'Nǐ rènshí tā ma?',
        options: [
          'Do you know her?',
          'Have you seen her before?',
          'Is she your friend?',
          'When did you meet her?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我要去超市买东西。',
        pinyin: 'Wǒ yào qù chāoshì mǎi dōngxī.',
        options: [
          'What do you need to buy?',
          'I need to go to the supermarket to buy things.',
          'The supermarket is closed today.',
          'I already finished shopping.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个地方非常漂亮。',
        pinyin: 'Zhège dìfāng fēicháng piàoliang.',
        options: [
          'I\'ve never been to this place.',
          'How do I get to this place?',
          'This place is very beautiful.',
          'This place is very famous.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我学中文已经三年了。',
        pinyin: 'Wǒ xué Zhōngwén yǐjīng sān nián le.',
        options: [
          'I want to study Chinese next year.',
          'Chinese is difficult to learn.',
          'I have a Chinese test tomorrow.',
          'I have been learning Chinese for three years.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你觉得这个菜怎么样？',
        pinyin: 'Nǐ juéde zhège cài zěnmeyàng?',
        options: [
          'What do you think of this dish?',
          'Did you cook this yourself?',
          'Is this dish too spicy?',
          'Do you know how to make this dish?'
        ],
        correctIndex: 0
      },
      {
        chinese: '下周我有考试。',
        pinyin: 'Xià zhōu wǒ yǒu kǎoshì.',
        options: [
          'I passed my exam last week.',
          'I have an exam next week.',
          'I need to study for my exams.',
          'My exam was very difficult.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这家餐厅的菜很好吃。',
        pinyin: 'Zhè jiā cāntīng de cài hěn hǎochī.',
        options: [
          'This restaurant is very expensive.',
          'This restaurant is always crowded.',
          'The food at this restaurant is very delicious.',
          'I don\'t like the service at this restaurant.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我想学中文但是很难。',
        pinyin: 'Wǒ xiǎng xué Zhōngwén dànshì hěn nán.',
        options: [
          'Chinese grammar is easy to understand.',
          'I speak Chinese very well.',
          'What\'s the best way to learn Chinese?',
          'I want to learn Chinese but it\'s very difficult.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你喜欢什么颜色？',
        pinyin: 'Nǐ xǐhuān shénme yánsè?',
        options: [
          'What color do you like?',
          'What\'s your favorite food?',
          'Do you like bright colors?',
          'Can you see colors well?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我的同屋是韩国人。',
        pinyin: 'Wǒ de tóngwū shì Hánguó rén.',
        options: [
          'I am from South Korea.',
          'My roommate is Korean.',
          'I have a friend from Korea.',
          'I want to visit Korea someday.'
        ],
        correctIndex: 1
      },
      {
        chinese: '今天是几月几号？',
        pinyin: 'Jīntiān shì jǐ yuè jǐ hào?',
        options: [
          'What day of the week is it?',
          'Is today a holiday?',
          'What\'s the date today?',
          'What month is it now?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的眼睛是褐色的。',
        pinyin: 'Wǒ de yǎnjīng shì hèsè de.',
        options: [
          'I have poor eyesight.',
          'I wear contact lenses.',
          'I need to get glasses.',
          'My eyes are brown.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你最喜欢的季节是什么？',
        pinyin: 'Nǐ zuì xǐhuān de jìjié shì shénme?',
        options: [
          'What\'s your favorite season?',
          'What\'s the weather like today?',
          'Do you like winter?',
          'Which season is the hottest?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我想去海边度假。',
        pinyin: 'Wǒ xiǎng qù hǎibiān dùjià.',
        options: [
          'Have you ever been to the beach?',
          'I want to go to the seaside for vacation.',
          'The beach is too crowded in summer.',
          'I prefer mountains to beaches.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个字我不会写。',
        pinyin: 'Zhège zì wǒ bú huì xiě.',
        options: [
          'This character is too simple.',
          'Can you teach me this character?',
          'I don\'t know how to write this character.',
          'How many strokes does this character have?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的护照丢了。',
        pinyin: 'Wǒ de hùzhào diū le.',
        options: [
          'I need to renew my passport.',
          'When does your passport expire?',
          'Do you have your passport with you?',
          'I\'ve lost my passport.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你几点下课？',
        pinyin: 'Nǐ jǐ diǎn xiàkè?',
        options: [
          'What time does your class end?',
          'What time does your class start?',
          'How many classes do you have today?',
          'Do you like your class?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我们可以坐公交车去。',
        pinyin: 'Wǒmen kěyǐ zuò gōngjiāochē qù.',
        options: [
          'The bus is too crowded.',
          'We can go by bus.',
          'I prefer taking a taxi.',
          'The bus stop is too far.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个问题很复杂。',
        pinyin: 'Zhège wèntí hěn fùzá.',
        options: [
          'Do you have any questions?',
          'I don\'t understand the question.',
          'This problem is very complex.',
          'Can you answer my question?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我不能参加你的生日派对。',
        pinyin: 'Wǒ bù néng cānjiā nǐ de shēngrì pàiduì.',
        options: [
          'I forgot your birthday.',
          'When is your birthday party?',
          'What gift do you want for your birthday?',
          'I cannot attend your birthday party.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你的中文说得很好。',
        pinyin: 'Nǐ de Zhōngwén shuō de hěn hǎo.',
        options: [
          'You speak Chinese very well.',
          'Your Chinese pronunciation needs work.',
          'Have you been studying Chinese for long?',
          'I want to improve my Chinese.'
        ],
        correctIndex: 0
      },
      {
        chinese: '我喜欢在家做饭。',
        pinyin: 'Wǒ xǐhuān zài jiā zuòfàn.',
        options: [
          'What\'s your favorite food to cook?',
          'I like to cook at home.',
          'Homemade food is healthier.',
          'I eat out most of the time.'
        ],
        correctIndex: 1
      },
      {
        chinese: '明天可能会下雨。',
        pinyin: 'Míngtiān kěnéng huì xià yǔ.',
        options: [
          'It\'s raining now.',
          'Do you have an umbrella?',
          'It might rain tomorrow.',
          'I like rainy days.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的手机没有电了。',
        pinyin: 'Wǒ de shǒujī méiyǒu diàn le.',
        options: [
          'I forgot my phone at home.',
          'I need to buy a new phone.',
          'Can I use your phone charger?',
          'My phone is out of battery.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你会用筷子吗？',
        pinyin: 'Nǐ huì yòng kuàizi ma?',
        options: [
          'Do you know how to use chopsticks?',
          'Do you prefer chopsticks or fork?',
          'Can you teach me to use chopsticks?',
          'Are these chopsticks clean?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我需要买些水果。',
        pinyin: 'Wǒ xūyào mǎi xiē shuǐguǒ.',
        options: [
          'What kind of fruit do you like?',
          'I need to buy some fruit.',
          'Fruit is very expensive here.',
          'This fruit is not fresh.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这条裤子太小了。',
        pinyin: 'Zhè tiáo kùzi tài xiǎo le.',
        options: [
          'Do you have this in blue?',
          'How much are these pants?',
          'These pants are too small.',
          'I\'m looking for a new pair of pants.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我昨天睡得很晚。',
        pinyin: 'Wǒ zuótiān shuì de hěn wǎn.',
        options: [
          'I\'m very tired today.',
          'I couldn\'t fall asleep last night.',
          'What time do you usually go to bed?',
          'I went to bed very late yesterday.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你想喝点什么？',
        pinyin: 'Nǐ xiǎng hē diǎn shénme?',
        options: [
          'What would you like to drink?',
          'Are you thirsty?',
          'Do you like coffee or tea?',
          'Can I get you something to drink?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我对猫过敏。',
        pinyin: 'Wǒ duì māo guòmǐn.',
        options: [
          'I hate cats.',
          'I\'m allergic to cats.',
          'I have a pet cat.',
          'I\'m afraid of cats.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这封信是写给你的。',
        pinyin: 'Zhè fēng xìn shì xiě gěi nǐ de.',
        options: [
          'Did you write this letter?',
          'When did you receive this letter?',
          'This letter is written for you.',
          'What does this letter say?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我忘了带钥匙。',
        pinyin: 'Wǒ wàng le dài yàoshi.',
        options: [
          'I need a new key.',
          'Do you have a spare key?',
          'Where did you put your keys?',
          'I forgot to bring my keys.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你最近怎么样？',
        pinyin: 'Nǐ zuìjìn zěnmeyàng?',
        options: [
          'How have you been lately?',
          'What are you doing right now?',
          'Do you have plans for the weekend?',
          'How long will you stay here?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我在学校学习汉语。',
        pinyin: 'Wǒ zài xuéxiào xuéxí Hànyǔ.',
        options: [
          'What school do you go to?',
          'I study Chinese at school.',
          'School is the best place to learn languages.',
          'I want to study abroad.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这本词典很有用。',
        pinyin: 'Zhè běn cídiǎn hěn yǒuyòng.',
        options: [
          'Where did you buy this dictionary?',
          'How much did this dictionary cost?',
          'This dictionary is very useful.',
          'I need to buy a new dictionary.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我不能理解这个句子。',
        pinyin: 'Wǒ bù néng lǐjiě zhège jùzi.',
        options: [
          'Can you explain this to me?',
          'This sentence is grammatically incorrect.',
          'How do you pronounce this sentence?',
          'I cannot understand this sentence.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你喜欢什么运动？',
        pinyin: 'Nǐ xǐhuān shénme yùndòng?',
        options: [
          'What sports do you like?',
          'Do you exercise regularly?',
          'Are you good at sports?',
          'Do you watch sports on TV?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我没有足够的时间。',
        pinyin: 'Wǒ méiyǒu zúgòu de shíjiān.',
        options: [
          'What time is our meeting?',
          'I don\'t have enough time.',
          'Time flies so quickly.',
          'Can we reschedule for another time?'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个地方很安静。',
        pinyin: 'Zhège dìfāng hěn ānjìng.',
        options: [
          'This place is too noisy.',
          'Is this a good place to study?',
          'This place is very quiet.',
          'I like peaceful environments.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我想了解中国文化。',
        pinyin: 'Wǒ xiǎng liǎojiě Zhōngguó wénhuà.',
        options: [
          'Chinese culture is very interesting.',
          'Have you ever been to China?',
          'What aspect of Chinese culture do you like?',
          'I want to learn about Chinese culture.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你经常锻炼身体吗？',
        pinyin: 'Nǐ jīngcháng duànliàn shēntǐ ma?',
        options: [
          'Do you exercise regularly?',
          'What kind of exercise do you do?',
          'Are you in good shape?',
          'How often do you go to the gym?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我们可以一起吃午饭。',
        pinyin: 'Wǒmen kěyǐ yìqǐ chī wǔfàn.',
        options: [
          'What did you have for lunch?',
          'We can have lunch together.',
          'I\'m not hungry right now.',
          'Where should we eat lunch?'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个故事很有趣。',
        pinyin: 'Zhège gùshì hěn yǒuqù.',
        options: [
          'Who told you this story?',
          'Is this story true?',
          'This story is very interesting.',
          'I\'ve heard this story before.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我打算明年去留学。',
        pinyin: 'Wǒ dǎsuàn míngnián qù liúxué.',
        options: [
          'Where did you study abroad?',
          'How long will you study abroad?',
          'What will you study?',
          'I plan to study abroad next year.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你会开车吗？',
        pinyin: 'Nǐ huì kāichē ma?',
        options: [
          'Do you know how to drive?',
          'Do you have a car?',
          'Can you give me a ride?',
          'When did you get your driver\'s license?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我想买一张机票。',
        pinyin: 'Wǒ xiǎng mǎi yì zhāng jīpiào.',
        options: [
          'Where are you traveling to?',
          'I want to buy a plane ticket.',
          'How much is a plane ticket?',
          'When is your flight?'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个城市很现代。',
        pinyin: 'Zhège chéngshì hěn xiàndài.',
        options: [
          'This city is very old.',
          'How long have you lived in this city?',
          'This city is very modern.',
          'I prefer living in the countryside.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的行李还没有到。',
        pinyin: 'Wǒ de xínglǐ hái méiyǒu dào.',
        options: [
          'I have too much luggage.',
          'Can you help me with my luggage?',
          'My luggage is too heavy.',
          'My luggage hasn\'t arrived yet.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你会弹钢琴吗？',
        pinyin: 'Nǐ huì tán gāngqín ma?',
        options: [
          'Can you play the piano?',
          'Do you like classical music?',
          'When did you start learning piano?',
          'Do you own a piano?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我需要休息一下。',
        pinyin: 'Wǒ xūyào xiūxi yíxià.',
        options: [
          'Are you tired?',
          'I need to take a rest.',
          'I didn\'t sleep well last night.',
          'We\'ve been working too hard.'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个问题很容易。',
        pinyin: 'Zhège wèntí hěn róngyì.',
        options: [
          'I don\'t understand this question.',
          'Can you help me with this problem?',
          'This question is very easy.',
          'What\'s the answer to this question?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我的电脑坏了。',
        pinyin: 'Wǒ de diànnǎo huài le.',
        options: [
          'I need to buy a new computer.',
          'Can you fix my computer?',
          'When did you buy your computer?',
          'My computer is broken.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你平常几点睡觉？',
        pinyin: 'Nǐ píngcháng jǐ diǎn shuìjiào?',
        options: [
          'What time do you usually go to sleep?',
          'How many hours do you sleep?',
          'Do you take afternoon naps?',
          'Do you have trouble sleeping?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我要去银行换钱。',
        pinyin: 'Wǒ yào qù yínháng huàn qián.',
        options: [
          'Do you have any change?',
          'I need to go to the bank to exchange money.',
          'Where is the nearest bank?',
          'How much money do you want to exchange?'
        ],
        correctIndex: 1
      },
      {
        chinese: '你的普通话说得很标准。',
        pinyin: 'Nǐ de pǔtōnghuà shuō de hěn biāozhǔn.',
        options: [
          'Do you speak Mandarin or Cantonese?',
          'I find it hard to understand your accent.',
          'Your Mandarin is very standard.',
          'How long have you been learning Mandarin?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我得去医院看病。',
        pinyin: 'Wǒ děi qù yīyuàn kànbìng.',
        options: [
          'I feel sick today.',
          'Where is the nearest hospital?',
          'Do you have health insurance?',
          'I need to go to the hospital to see a doctor.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你喜欢什么类型的电影？',
        pinyin: 'Nǐ xǐhuān shénme lèixíng de diànyǐng?',
        options: [
          'What type of movies do you like?',
          'Have you seen any good movies lately?',
          'Do you prefer watching movies at home or in theaters?',
          'Who is your favorite actor?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我正在找工作。',
        pinyin: 'Wǒ zhèngzài zhǎo gōngzuò.',
        options: [
          'What is your job?',
          'I\'m currently looking for a job.',
          'Do you like your job?',
          'How long have you been working here?'
        ],
        correctIndex: 1
      },
      {
        chinese: '这家饭店的服务很好。',
        pinyin: 'Zhè jiā fàndiàn de fúwù hěn hǎo.',
        options: [
          'Is this restaurant expensive?',
          'What do you recommend at this restaurant?',
          'The service at this restaurant is very good.',
          'I don\'t like the food at this restaurant.'
        ],
        correctIndex: 2
      },
      {
        chinese: '我不能按时完成作业。',
        pinyin: 'Wǒ bù néng ànshí wánchéng zuòyè.',
        options: [
          'How much homework do you have?',
          'Is the homework difficult?',
          'When is the homework due?',
          'I cannot complete the homework on time.'
        ],
        correctIndex: 3
      },
      {
        chinese: '你是怎么认识他的？',
        pinyin: 'Nǐ shì zěnme rènshí tā de?',
        options: [
          'How did you meet him?',
          'How long have you known him?',
          'Is he your good friend?',
          'What do you think of him?'
        ],
        correctIndex: 0
      },
      {
        chinese: '我想去旅游但是没有时间。',
        pinyin: 'Wǒ xiǎng qù lǚyóu dànshì méiyǒu shíjiān.',
        options: [
          'Where would you like to travel?',
          'I want to travel but I don\'t have time.',
          'Traveling is expensive and time-consuming.',
          'What\'s your favorite travel destination?'
        ],
        correctIndex: 1
      },
      {
        chinese: '这个词的发音很难。',
        pinyin: 'Zhège cí de fāyīn hěn nán.',
        options: [
          'How do you pronounce this word?',
          'What does this word mean?',
          'The pronunciation of this word is very difficult.',
          'Can you repeat this word slowly?'
        ],
        correctIndex: 2
      },
      {
        chinese: '我忘记带手机了。',
        pinyin: 'Wǒ wàngjì dài shǒujī le.',
        options: [
          'Can I use your phone?',
          'Where did you put your phone?',
          'Is your phone battery dead?',
          'I forgot to bring my phone.'
        ],
        correctIndex: 3
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
