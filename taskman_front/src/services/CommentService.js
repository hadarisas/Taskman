import api from "../utils/axios";

export const CommentService = {
  // Create a new comment
  createComment: async (content, entityId, entityType, parentId = null) => {
    const response = await api.post("/comments", {
      content,
      entityId,
      entityType: "PROJECT",
      parentId,
    });
    return response.data;
  },

  // Get a single comment by ID
  getComment: async (commentId) => {
    const response = await api.get(`/comments/${commentId}`);
    return response.data;
  },

  // Update an existing comment
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    await api.delete(`/comments/${commentId}`);
  },

  // Get comments for an entity (task or project)
  getCommentsByEntity: async (entityId, entityType, page = 0, size = 10) => {
    const response = await api.get(`/comments/entity/${entityId}`, {
      params: { entityType, page, size },
    });
    return response.data;
  },

  // Get replies for a comment
  getReplies: async (commentId, page = 0, size = 10) => {
    const response = await api.get(`/comments/${commentId}/replies`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get comments by user
  getUserComments: async (userId, page = 0, size = 10) => {
    const response = await api.get(`/comments/user/${userId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get root comments for an entity
  getRootComments: async (entityId, entityType, page = 0, size = 10) => {
    const response = await api.get(`/comments/entity/${entityId}/root`, {
      params: { entityType, page, size },
    });
    return response.data;
  },

  // Get latest comments for multiple entities
  getLatestComments: async (entityIds, entityType, limit = 5) => {
    const response = await api.get(`/comments/latest`, {
      params: { entityIds, entityType, limit },
    });
    return response.data;
  },

  // Get comment count for an entity
  getCommentCount: async (entityId, entityType) => {
    const response = await api.get(`/comments/count/entity/${entityId}`, {
      params: { entityType },
    });
    return response.data;
  },

  // Get reply count for a comment
  getReplyCount: async (commentId) => {
    const response = await api.get(`/comments/count/replies/${commentId}`);
    return response.data;
  },

  // Check if user has commented on an entity
  hasUserCommented: async (entityId, entityType) => {
    const response = await api.get(`/comments/check`, {
      params: { entityId, entityType },
    });
    return response.data;
  },

  // Delete all comments for an entity
  deleteAllCommentsByEntity: async (entityId, entityType) => {
    await api.delete(`/comments/entity/${entityId}`, {
      params: { entityType },
    });
  },
}; 