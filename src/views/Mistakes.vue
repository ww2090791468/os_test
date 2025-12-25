<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
        <h1 class="text-xl font-bold text-gray-800">错题本</h1>
      </div>

      <!-- 错题统计 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-3xl font-bold text-orange-600">{{ mistakes.length }}</div>
            <div class="text-sm text-gray-600">道错题</div>
          </div>
          <button
            v-if="mistakes.length > 0"
            @click="confirmClear"
            class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            清空错题本
          </button>
        </div>
      </div>

      <!-- 错题列表 -->
      <div v-if="mistakes.length > 0" class="space-y-4">
        <div
          v-for="(mistake, index) in mistakes"
          :key="mistake.序号"
          class="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                第 {{ mistake.序号 }} 题
              </div>
              <button
                @click="removeMistake(mistake.序号)"
                class="text-gray-400 hover:text-red-500 transition-colors"
                title="移除错题"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <p class="text-gray-800 mb-4">{{ mistake.题目 }}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
              <div
                :class="['p-3 rounded-lg', mistake.A === mistake.正确答案 ? 'bg-green-100 border border-green-300' : 'bg-gray-50']"
              >
                <span class="font-semibold">A.</span> {{ mistake.A }}
              </div>
              <div
                :class="['p-3 rounded-lg', mistake.B === mistake.正确答案 ? 'bg-green-100 border border-green-300' : 'bg-gray-50']"
              >
                <span class="font-semibold">B.</span> {{ mistake.B }}
              </div>
              <div
                :class="['p-3 rounded-lg', mistake.C === mistake.正确答案 ? 'bg-green-100 border border-green-300' : 'bg-gray-50']"
              >
                <span class="font-semibold">C.</span> {{ mistake.C }}
              </div>
              <div
                :class="['p-3 rounded-lg', mistake.D === mistake.正确答案 ? 'bg-green-100 border border-green-300' : 'bg-gray-50']"
              >
                <span class="font-semibold">D.</span> {{ mistake.D }}
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t">
              <div class="text-sm text-gray-600">
                正确答案：<span class="font-bold text-green-600">{{ mistake.正确答案 }}</span>
              </div>
              <button
                @click="practiceMistake(mistake.序号)"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                练习本题
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="bg-white rounded-xl shadow-lg p-8 text-center">
        <svg class="w-20 h-20 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">太棒了！</h3>
        <p class="text-gray-600 mb-6">目前没有错题记录</p>
        <button
          @click="goHome"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          开始刷题
        </button>
      </div>

      <!-- 开始错题练习按钮 -->
      <div v-if="mistakes.length > 0" class="fixed bottom-6 right-6">
        <button
          @click="startMistakeQuiz"
          class="px-6 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all hover:shadow-xl flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          开始错题练习
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

const mistakes = computed(() => {
  const mistakeIds = Array.from(store.mistakes);
  return store.allQuestions.filter(q => mistakeIds.includes(q.序号));
});

function removeMistake(questionId) {
  if (confirm('确定要移除这道错题吗？')) {
    store.removeMistake(questionId);
  }
}

function confirmClear() {
  if (confirm(`确定要清空 ${mistakes.value.length} 道错题吗？此操作不可恢复！`)) {
    store.clearMistakes();
  }
}

async function practiceMistake(questionId) {
  const question = store.allQuestions.find(q => q.序号 === questionId);
  if (question) {
    store.currentQuestions = [question];
    store.currentIndex = 0;
    store.isAnswered = false;
    store.showResult = false;
    router.push('/quiz');
  }
}

async function startMistakeQuiz() {
  await store.startQuiz('mistakes');
  if (store.currentQuestions.length > 0) {
    router.push('/quiz');
  }
}

function goHome() {
  router.push('/');
}
</script>
