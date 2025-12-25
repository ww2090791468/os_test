import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loadQuestions, shuffleQuestions, getMistakeQuestions } from '../services/questionService';

const STORAGE_KEY = 'os_quiz_data';

export const useQuizStore = defineStore('quiz', () => {
  // 状态
  const allQuestions = ref([]);
  const currentQuestions = ref([]);
  const currentIndex = ref(0);
  const userAnswers = ref({});
  const isAnswered = ref(false);
  const showResult = ref(false);
  const currentMode = ref('sequential');
  const mistakes = ref(new Set());
  const answerHistory = ref([]);

  // 计算属性
  const currentQuestion = computed(() => {
    return currentQuestions.value[currentIndex.value] || null;
  });

  const progress = computed(() => {
    const total = currentQuestions.value.length;
    const current = currentIndex.value + 1;
    return {
      current,
      total,
      percentage: total > 0 ? Math.round((current / total) * 100) : 0
    };
  });

  const stats = computed(() => {
    const totalAnswered = Object.keys(userAnswers.value).length;
    const correctCount = answerHistory.value.filter(h => h.isCorrect).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    
    return {
      totalAnswered,
      correctCount,
      accuracy,
      totalMistakes: mistakes.value.size,
      history: answerHistory.value
    };
  });

  // 加载所有题目
  async function loadAllQuestions() {
    try {
      allQuestions.value = await loadQuestions();
    } catch (error) {
      console.error('Failed to load questions:', error);
      throw error;
    }
  }

  // 启动刷题模式
  async function startQuiz(mode) {
    currentMode.value = mode;
    currentIndex.value = 0;
    userAnswers.value = {};
    isAnswered.value = false;
    showResult.value = false;

    if (allQuestions.value.length === 0) {
      await loadAllQuestions();
    }

    switch (mode) {
      case 'sequential':
        currentQuestions.value = [...allQuestions.value];
        break;
      case 'random':
        currentQuestions.value = shuffleQuestions(allQuestions.value);
        break;
      case 'mistakes':
        const mistakeIds = Array.from(mistakes.value);
        currentQuestions.value = mistakeIds.length > 0 
          ? getMistakeQuestions(allQuestions.value, mistakeIds)
          : [];
        break;
    }

    saveStorageData();
  }

  // 提交答案
  function submitAnswer(answer) {
    const question = currentQuestion.value;
    if (!question) return;

    const isCorrect = answer === question.正确答案;
    
    userAnswers.value[question.序号] = answer;
    isAnswered.value = true;
    showResult.value = true;

    // 记录历史
    const record = {
      questionId: question.序号,
      question: question.题目,
      userAnswer: answer,
      correctAnswer: question.正确答案,
      isCorrect,
      timestamp: Date.now(),
      mode: currentMode.value
    };
    answerHistory.value.push(record);

    // 如果答错，添加到错题本
    if (!isCorrect) {
      mistakes.value.add(question.序号);
    }

    saveStorageData();
  }

  // 下一题
  function nextQuestion() {
    if (currentIndex.value < currentQuestions.value.length - 1) {
      currentIndex.value++;
      isAnswered.value = false;
      showResult.value = false;
    }
  }

  // 上一题
  function prevQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--;
      isAnswered.value = !!userAnswers.value[currentQuestion.value?.序号];
      showResult.value = !!userAnswers.value[currentQuestion.value?.序号];
    }
  }

  // 跳转到指定题目
  function goToQuestion(index) {
    if (index >= 0 && index < currentQuestions.value.length) {
      currentIndex.value = index;
      const questionId = currentQuestions.value[index].序号;
      isAnswered.value = !!userAnswers.value[questionId];
      showResult.value = !!userAnswers.value[questionId];
    }
  }

  // 重置当前题目
  function resetCurrentQuestion() {
    const question = currentQuestion.value;
    if (question) {
      delete userAnswers.value[question.序号];
    }
    isAnswered.value = false;
    showResult.value = false;
    saveStorageData();
  }

  // 清除错题
  function clearMistakes() {
    mistakes.value.clear();
    saveStorageData();
  }

  // 清除指定错题
  function removeMistake(questionId) {
    mistakes.value.delete(questionId);
    saveStorageData();
  }

  // 本地存储
  function loadStorageData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        mistakes.value = new Set(parsed.mistakes || []);
        answerHistory.value = parsed.history || [];
        currentMode.value = parsed.lastMode || 'sequential';
      }
    } catch (error) {
      console.error('Failed to load storage data:', error);
    }
  }

  function saveStorageData() {
    try {
      const data = {
        mistakes: Array.from(mistakes.value),
        history: answerHistory.value,
        lastMode: currentMode.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save storage data:', error);
    }
  }

  // 重置所有数据
  function resetAll() {
    currentQuestions.value = [];
    currentIndex.value = 0;
    userAnswers.value = {};
    isAnswered.value = false;
    showResult.value = false;
    mistakes.value.clear();
    answerHistory.value = [];
    saveStorageData();
  }

  // 初始化时加载本地数据
  loadStorageData();

  return {
    // 状态
    allQuestions,
    currentQuestions,
    currentIndex,
    userAnswers,
    isAnswered,
    showResult,
    currentMode,
    mistakes,
    answerHistory,

    // 计算属性
    currentQuestion,
    progress,
    stats,

    // 方法
    loadAllQuestions,
    startQuiz,
    submitAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    resetCurrentQuestion,
    clearMistakes,
    removeMistake,
    loadStorageData,
    saveStorageData,
    resetAll
  };
});
