<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
        <h1 class="text-xl font-bold text-gray-800">学习统计</h1>
      </div>

      <!-- 总体统计 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">总体统计</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-3xl font-bold text-blue-600">{{ stats.totalAnswered }}</div>
            <div class="text-sm text-gray-600">已答题数</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-3xl font-bold text-green-600">{{ stats.correctCount }}</div>
            <div class="text-sm text-gray-600">正确题数</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-3xl font-bold text-purple-600">{{ stats.accuracy }}%</div>
            <div class="text-sm text-gray-600">正确率</div>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <div class="text-3xl font-bold text-orange-600">{{ stats.totalMistakes }}</div>
            <div class="text-sm text-gray-600">错题数量</div>
          </div>
        </div>
      </div>

      <!-- 模式统计 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">模式统计</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <span class="font-semibold text-gray-800">顺序刷题</span>
            </div>
            <div class="text-sm text-gray-600">
              <div>答题: {{ getModeStats('sequential').count }} 题</div>
              <div>正确率: {{ getModeStats('sequential').accuracy }}%</div>
            </div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <span class="font-semibold text-gray-800">随机刷题</span>
            </div>
            <div class="text-sm text-gray-600">
              <div>答题: {{ getModeStats('random').count }} 题</div>
              <div>正确率: {{ getModeStats('random').accuracy }}%</div>
            </div>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <span class="font-semibold text-gray-800">错题本</span>
            </div>
            <div class="text-sm text-gray-600">
              <div>答题: {{ getModeStats('mistakes').count }} 题</div>
              <div>正确率: {{ getModeStats('mistakes').accuracy }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近答题记录 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">最近答题记录</h2>
        <div v-if="stats.history.length > 0" class="space-y-3">
          <div
            v-for="(record, index) in recentHistory"
            :key="index"
            class="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center mb-1">
                  <span class="text-xs px-2 py-1 rounded-full mr-2" :class="getModeBadgeClass(record.mode)">
                    {{ getModeName(record.mode) }}
                  </span>
                  <span class="text-sm text-gray-500">第 {{ record.questionId }} 题</span>
                </div>
                <p class="text-sm text-gray-700">{{ record.question }}</p>
              </div>
              <div :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                record.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ record.isCorrect ? '正确' : '错误' }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div>
                你的答案: <span :class="record.userAnswer === record.correctAnswer ? 'text-green-600' : 'text-red-600'">
                  {{ record.userAnswer }}
                </span>
                <span v-if="!record.isCorrect" class="ml-2">
                  正确答案: <span class="text-green-600 font-medium">{{ record.correctAnswer }}</span>
                </span>
              </div>
              <div>{{ formatTime(record.timestamp) }}</div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          暂无答题记录
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-6 flex justify-center space-x-4">
        <button
          @click="goHome"
          class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          返回首页
        </button>
        <button
          v-if="stats.history.length > 0"
          @click="confirmReset"
          class="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          清空统计数据
        </button>
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

const stats = computed(() => store.stats);

const recentHistory = computed(() => {
  return stats.value.history.slice().reverse().slice(0, 20);
});

function getModeStats(mode) {
  const modeHistory = stats.value.history.filter(h => h.mode === mode);
  const count = modeHistory.length;
  const correctCount = modeHistory.filter(h => h.isCorrect).length;
  const accuracy = count > 0 ? Math.round((correctCount / count) * 100) : 0;
  return { count, accuracy };
}

function getModeName(mode) {
  const modeMap = {
    sequential: '顺序',
    random: '随机',
    mistakes: '错题'
  };
  return modeMap[mode] || mode;
}

function getModeBadgeClass(mode) {
  const classMap = {
    sequential: 'bg-blue-100 text-blue-800',
    random: 'bg-green-100 text-green-800',
    mistakes: 'bg-orange-100 text-orange-800'
  };
  return classMap[mode] || 'bg-gray-100 text-gray-800';
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
}

function confirmReset() {
  if (confirm('确定要清空所有统计数据吗？此操作不可恢复！')) {
    store.resetAll();
    alert('统计数据已清空');
  }
}

function goHome() {
  router.push('/');
}
</script>
