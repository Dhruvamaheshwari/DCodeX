/** @format */

import { createSlice } from "@reduxjs/toolkit";

const defaultMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hi, I can help with ideas, edge cases, and debugging hints for this problem.",
  },
  {
    id: 2,
    role: "assistant",
    text: "Send a short question and I’ll reply with a simple, useful answer.",
  },
];

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    byProblemId: {},
  },
  reducers: {
    initializeChat: (state, action) => {
      const { problemId, initialMessages } = action.payload;

      if (!problemId) {
        return;
      }

      if (!state.byProblemId[problemId]) {
        state.byProblemId[problemId] = {
          messages: initialMessages?.length ? initialMessages : defaultMessages,
          nextMessageId: 3,
        };
      }
    },
    addChatMessages: (state, action) => {
      const { problemId, userMessage, assistantMessage } = action.payload;

      if (!problemId) {
        return;
      }

      if (!state.byProblemId[problemId]) {
        state.byProblemId[problemId] = {
          messages: defaultMessages,
          nextMessageId: 3,
        };
      }

      state.byProblemId[problemId].messages.push(userMessage, assistantMessage);
      state.byProblemId[problemId].nextMessageId = assistantMessage.id + 1;
    },
    clearChatMessages: (state, action) => {
      const { problemId } = action.payload;

      if (!problemId) {
        return;
      }

      state.byProblemId[problemId] = {
        messages: defaultMessages,
        nextMessageId: 3,
      };
    },
  },
});

export const { initializeChat, addChatMessages, clearChatMessages } =
  chatSlice.actions;

export const selectChatForProblem = (problemId) => (state) =>
  state.chat.byProblemId[problemId];

export const chatDefaultMessages = defaultMessages;

export default chatSlice.reducer;
