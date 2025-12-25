const REPOSITORY_URL = './repository.json';

let cachedQuestions = null;

/**
 * 从repository.json加载题目数据
 */
export async function loadQuestions() {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  try {
    const response = await fetch(REPOSITORY_URL);
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.statusText}`);
    }
    const data = await response.json();
    
    // 确保数据是数组格式
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: expected an array');
    }
    
    cachedQuestions = data;
    return cachedQuestions;
  } catch (error) {
    console.error('Error loading questions:', error);
    throw error;
  }
}

/**
 * 获取指定范围的题目
 */
export function getQuestionsInRange(questions, start, count) {
  return questions.slice(start, start + count);
}

/**
 * 随机打乱题目数组
 */
export function shuffleQuestions(questions) {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 根据题目ID获取题目
 */
export function getQuestionById(questions, id) {
  return questions.find(q => q.序号 === id);
}

/**
 * 获取错题列表
 */
export function getMistakeQuestions(questions, mistakeIds) {
  return questions.filter(q => mistakeIds.includes(q.序号));
}
