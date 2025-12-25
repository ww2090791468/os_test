<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- 头部导航 -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="goHome"
          class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          返回首页
        </button>
        <div class="text-sm text-gray-600">
          {{ modeName }}
        </div>
      </div>

      <!-- 进度条 -->
      <div class="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">进度</span>
          <span class="text-sm font-medium text-gray-800">
            {{ progress.current }} / {{ progress.total }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: progress.percentage + '%' }"
          ></div>
        </div>
        <div class="text-center mt-2 text-sm text-gray-600">{{ progress.percentage }}%</div>
      </div>

      <!-- 题目卡片 -->
      <div v-if="currentQuestion" class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <!-- 题目编号和内容 -->
        <div class="mb-6">
          <div class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
            第 {{ currentQuestion.序号 }} 题
          </div>
          <p class="text-lg text-gray-800 leading-relaxed">{{ currentQuestion.题目 }}</p>
        </div>

        <!-- 选项 -->
        <div class="space-y-3 mb-6">
          <button
            v-for="(option, key) in options"
            :key="key"
            @click="selectOption(key)"
            :class="[
              'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
              getOptionClass(key)
            ]"
            :disabled="isAnswered"
          >
            <span class="font-semibold mr-2">{{ key }}.</span>
            {{ option }}
          </button>
        </div>

        <!-- 答案解析 -->
        <div v-if="showResult" class="border-t pt-4">
          <div :class="[
            'p-4 rounded-lg mb-4',
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          ]">
            <div class="flex items-center mb-2">
              <svg
                v-if="isCorrect"
                class="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span :class="isCorrect ? 'text-green-800' : 'text-red-800'" class="font-semibold">
                {{ isCorrect ? '回答正确！' : '回答错误' }}
              </span>
            </div>
            <div v-if="!isCorrect" class="text-sm text-gray-700">
              <p>正确答案：<span class="font-semibold text-green-600">{{ currentQuestion.正确答案 }}</span></p>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-between">
            <button
              @click="resetQuestion"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              重置本题
            </button>
            <div class="flex space-x-3">
              <button
                v-if="currentIndex > 0"
                @click="prevQuestion"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                上一题
              </button>
              <button
                v-if="currentIndex < store.currentQuestions.length - 1"
                @click="nextQuestion"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                下一题
              </button>
              <button
                v-else
                @click="goHome"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                完成练习
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 无题目状态 -->
      <div v-else class="bg-white rounded-xl shadow-lg p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-gray-600 mb-4">没有题目了</p>
        <button
          @click="goHome"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回首页
        </button>
      </div>

      <!-- 题目导航 -->
      <div v-if="store.currentQuestions.length > 0" class="bg-white rounded-xl shadow-lg p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">题目导航</h3>
        <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          <button
            v-for="(q, idx) in store.currentQuestions"
            :key="q.序号"
            @click="goToQuestion(idx)"
            :class="[
              'w-full aspect-square rounded-md text-sm font-medium transition-all',
              getNavButtonClass(idx)
            ]"
          >
            {{ idx + 1 }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuizStore } from '../stores/quiz';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const store = useQuizStore();
const router = useRouter();

const currentQuestion = computed(() => store.currentQuestion);
const currentIndex = computed(() => store.currentIndex);
const progress = computed(() => store.progress);
const isAnswered = computed(() => store.isAnswered);
const showResult = computed(() => store.showResult);

const options = computed(() => {
  if (!currentQuestion.value) return {};
  
  const question = currentQuestion.value;
  const opts = {};
  
  // 遍历题目对象，找到所有选项字段
  Object.keys(question).forEach(key => {
    if (key.includes('选项') && question[key]) {
      const optionKey = key.charAt(0); // 获取 A、B、C、D
      opts[optionKey] = question[key];
    }
  });
  
  return opts;
});

const modeName = computed(() => {
  const modeMap = {
    sequential: '顺序刷题',
    random: '随机刷题',
    mistakes: '错题本'
  };
  return modeMap[store.currentMode] || '刷题';
});

const userAnswer = computed(() => {
  if (!currentQuestion.value) return null;
  return store.userAnswers[currentQuestion.value.序号];
});

const isCorrect = computed(() => {
  if (!currentQuestion.value || !userAnswer.value) return false;
  return userAnswer.value === currentQuestion.value.正确答案;
});

function selectOption(option) {
  if (!isAnswered.value) {
    store.submitAnswer(option);
  }
}

function getOptionClass(key) {
  const classes = ['border-gray-200 hover:border-blue-400 hover:bg-blue-50'];
  
  if (!showResult.value) {
    if (userAnswer.value === key) {
      return ['border-blue-500 bg-blue-50'];
    }
    return classes;
  }

  if (key === currentQuestion.value.正确答案) {
    return ['border-green-500 bg-green-50'];
  }
  
  if (key === userAnswer.value && !isCorrect.value) {
    return ['border-red-500 bg-red-50'];
  }
  
  return ['border-gray-200 opacity-50'];
}

function getNavButtonClass(idx) {
  const question = store.currentQuestions[idx];
  const isCurrent = idx === currentIndex.value;
  const hasAnswer = store.userAnswers[question.序号];
  const isMistake = store.mistakes.has(question.序号);

  if (isCurrent) {
    return 'bg-blue-600 text-white';
  }
  
  if (isMistake) {
    return 'bg-orange-200 text-orange-800 hover:bg-orange-300';
  }
  
  if (hasAnswer) {
    return 'bg-green-200 text-green-800 hover:bg-green-300';
  }
  
  return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
}

function nextQuestion() {
  store.nextQuestion();
}

function prevQuestion() {
  store.prevQuestion();
}

function goToQuestion(idx) {
  store.goToQuestion(idx);
}

function resetQuestion() {
  store.resetCurrentQuestion();
}

function goHome() {
  router.push('/');
}
</script>
