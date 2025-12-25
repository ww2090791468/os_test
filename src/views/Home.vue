<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <!-- 头部 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">操作系统刷题应用</h1>
        <p class="text-gray-600">选择刷题模式开始练习</p>
      </div>

      <!-- 模式选择卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <!-- 顺序刷题 -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500"
          @click="startQuiz('sequential')"
        >
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">顺序刷题</h3>
            <p class="text-gray-600 text-sm">按题目序号顺序练习</p>
          </div>
        </div>

        <!-- 随机刷题 -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500"
          @click="startQuiz('random')"
        >
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">随机刷题</h3>
            <p class="text-gray-600 text-sm">随机抽取题目练习</p>
          </div>
        </div>

        <!-- 错题本 -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-500"
          @click="startQuiz('mistakes')"
        >
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">错题本</h3>
            <p class="text-gray-600 text-sm">专注于错题复习</p>
            <div v-if="store.mistakes.size > 0" class="mt-2 inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {{ store.mistakes.size }} 道错题
            </div>
          </div>
        </div>
      </div>

      <!-- 进度概览 -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">学习进度</h2>
            <div class="text-sm text-gray-500">
              总题数: {{ store.allQuestions.length }} | 已完成: {{ Object.keys(store.userAnswers).length }}
            </div>
          </div>
          
          <!-- 整体进度条 -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">整体完成度</span>
              <span class="text-sm font-bold text-blue-600">{{ overallProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                :style="{ width: overallProgress + '%' }"
              ></div>
            </div>
          </div>

          <!-- 分类进度统计 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="text-2xl font-bold text-blue-600">{{ answeredByType.single }}</div>
              <div class="text-sm text-gray-600">单选题完成</div>
              <div class="text-xs text-gray-500 mt-1">总共 {{ totalByType.single }} 题</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div class="text-2xl font-bold text-green-600">{{ answeredByType.multiple }}</div>
              <div class="text-sm text-gray-600">多选题完成</div>
              <div class="text-xs text-gray-500 mt-1">总共 {{ totalByType.multiple }} 题</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div class="text-2xl font-bold text-purple-600">{{ answeredByType.judge }}</div>
              <div class="text-sm text-gray-600">判断题完成</div>
              <div class="text-xs text-gray-500 mt-1">总共 {{ totalByType.judge }} 题</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div class="text-2xl font-bold text-orange-600">{{ answeredByType.fill }}</div>
              <div class="text-sm text-gray-600">填空题完成</div>
              <div class="text-xs text-gray-500 mt-1">总共 {{ totalByType.fill }} 题</div>
            </div>
          </div>

          <!-- 最近学习记录 -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg" v-if="recentAnswers.length > 0">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">最近答题记录</h3>
            <div class="space-y-2">
              <div 
                v-for="record in recentAnswers.slice(-3).reverse()" 
                :key="record.timestamp"
                class="flex items-center justify-between text-sm p-2 bg-white rounded"
              >
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="record.isCorrect ? 'bg-green-500' : 'bg-red-500'"
                  ></div>
                  <span class="text-gray-600 truncate max-w-xs">
                    题目{{ record.questionId }}: {{ record.question.substring(0, 20) }}...
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    class="text-xs font-medium"
                    :class="record.isCorrect ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ record.isCorrect ? '正确' : '错误' }}
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ formatTime(record.timestamp) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">学习统计</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ store.stats.totalAnswered }}</div>
              <div class="text-sm text-gray-600">已答题数</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ store.stats.correctCount }}</div>
              <div class="text-sm text-gray-600">正确题数</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ store.stats.accuracy }}%</div>
              <div class="text-sm text-gray-600">正确率</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">{{ store.stats.totalMistakes }}</div>
              <div class="text-sm text-gray-600">错题数量</div>
            </div>
          </div>
          <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <router-link 
              to="/stats" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              查看详细统计
            </router-link>
            <router-link 
              to="/mistakes" 
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
              v-if="store.mistakes.size > 0"
            >
              复习错题 ({{ store.mistakes.size }})
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuizStore } from '../stores/quiz';
import { useRouter } from 'vue-router';
import { onMounted, computed } from 'vue';

const store = useQuizStore();
const router = useRouter();

// 计算整体进度
const overallProgress = computed(() => {
  const total = store.allQuestions.length;
  const answered = Object.keys(store.userAnswers).length;
  return total > 0 ? Math.round((answered / total) * 100) : 0;
});

// 按题目类型统计完成情况
const answeredByType = computed(() => {
  const answered = Object.keys(store.userAnswers);
  const result = {
    single: 0,
    multiple: 0,
    judge: 0,
    fill: 0
  };

  store.allQuestions.forEach(question => {
    const questionId = question.序号;
    const isAnswered = answered.includes(questionId.toString());
    
    if (isAnswered) {
      // 根据题目内容判断类型
      if (question.题目.includes('（单选）')) {
        result.single++;
      } else if (question.题目.includes('（多选）')) {
        result.multiple++;
      } else if (question.题目.includes('（判断）')) {
        result.judge++;
      } else if (question.题目.includes('（填空）')) {
        result.fill++;
      }
    }
  });

  return result;
});

// 按题目类型统计总数
const totalByType = computed(() => {
  const result = {
    single: 0,
    multiple: 0,
    judge: 0,
    fill: 0
  };

  store.allQuestions.forEach(question => {
    // 根据题目内容判断类型
    if (question.题目.includes('（单选）')) {
      result.single++;
    } else if (question.题目.includes('（多选）')) {
      result.multiple++;
    } else if (question.题目.includes('（判断）')) {
      result.judge++;
    } else if (question.题目.includes('（填空）')) {
      result.fill++;
    }
  });

  return result;
});

// 最近答题记录
const recentAnswers = computed(() => {
  return store.answerHistory.slice(-10); // 返回最近10条记录
});

// 格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) { // 1分钟内
    return '刚刚';
  } else if (diff < 3600000) { // 1小时内
    return Math.floor(diff / 60000) + '分钟前';
  } else if (diff < 86400000) { // 1天内
    return Math.floor(diff / 3600000) + '小时前';
  } else if (diff < 604800000) { // 1周内
    return Math.floor(diff / 86400000) + '天前';
  } else {
    return date.toLocaleDateString('zh-CN');
  }
}

onMounted(async () => {
  await store.loadAllQuestions();
});

async function startQuiz(mode) {
  await store.startQuiz(mode);
  if (store.currentQuestions.length > 0) {
    router.push('/quiz');
  } else if (mode === 'mistakes') {
    alert('暂无错题记录，快去答题吧！');
  }
}
</script>
