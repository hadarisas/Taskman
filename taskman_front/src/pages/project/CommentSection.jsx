import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectAuthLoading, selectIsAuthenticated } from '../../store/slices/authSlice';
import { fetchUsers, selectUserById } from '../../store/slices/usersSlice';
import { PaperAirplaneIcon, PencilIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { CommentService } from '../../services/CommentService';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const CommentEditor = ({ initialValue = '', onSubmit, onCancel, isReply = false }) => {
  const [content, setContent] = useState(initialValue);
  const entityType = "PROJECT";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isReply ? "Write a reply..." : "Write a comment..."}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-700 px-3 py-2 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                 text-gray-900 dark:text-white min-h-[100px]"
      />
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={!content.trim()}
          className="inline-flex items-center"
        >
          <PaperAirplaneIcon className="h-4 w-4 mr-1" />
          {isReply ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
};

const Comment = ({ comment, onDelete, onEdit, onReply, currentUser, projectRole, projectStatus, depth = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const author = useSelector(state => selectUserById(state, comment.authorId));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!author) {
      dispatch(fetchUsers());
    }
  }, [author, dispatch]);

  const canEdit = currentUser?.id === comment.authorId && projectStatus !== 'CANCELLED';
  const canDelete = 
    (currentUser?.id === comment.authorId || 
    projectRole === 'ADMIN' || 
    currentUser?.role === 'ADMIN') &&
    projectStatus !== 'CANCELLED';
  const canReply = projectStatus !== 'CANCELLED' && depth < 3; // Limit reply depth

  const handleEdit = async (newContent) => {
    await onEdit(comment.id, newContent);
    setIsEditing(false);
  };

  const handleReply = async (content) => {
    await onReply(comment.id, content);
    setShowReplyEditor(false);
    setShowReplies(true); // Show replies after adding a new one
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(comment.id);
    setShowDeleteModal(false);
  };

  const replies = comment.replies || [];
  const hasReplies = replies.length > 0;

  return (
    <>
      <div className={`relative ${depth > 0 ? 'ml-12' : ''}`}>
        {/* Thread line for replies */}
        {depth > 0 && (
          <div 
            className="absolute left-[-24px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
            style={{
              content: '""',
              height: '100%'
            }}
          />
        )}
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                          flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {author?.name?.charAt(0).toUpperCase() || comment.authorId?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              {/* Comment header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {author?.name || `User ${comment.authorId}`}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                  {comment.edited && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      (edited)
                    </span>
                  )}
                </div>
                {(canEdit || canDelete) && (
                  <div className="flex items-center space-x-2">
                    {canEdit && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDeleteClick}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Comment content */}
              {isEditing ? (
                <CommentEditor
                  initialValue={comment.content}
                  onSubmit={handleEdit}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>

            {/* Comment actions */}
            <div className="mt-1 flex items-center space-x-4">
              {canReply && (
                <button
                  onClick={() => setShowReplyEditor(!showReplyEditor)}
                  className="text-xs text-gray-500 hover:text-gray-700 
                           dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Reply
                </button>
              )}
              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs text-gray-500 hover:text-gray-700 
                           dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                >
                  {showReplies ? (
                    <ChevronUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>

            {/* Reply editor */}
            {showReplyEditor && (
              <div className="mt-2">
                <CommentEditor
                  onSubmit={handleReply}
                  onCancel={() => setShowReplyEditor(false)}
                  isReply
                />
              </div>
            )}

            {/* Nested replies */}
            {showReplies && hasReplies && (
              <div className="mt-2">
                {replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReply={onReply}
                    currentUser={currentUser}
                    projectRole={projectRole}
                    projectStatus={projectStatus}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </>
  );
};

const CommentSection = ({ entityId, projectRole, project }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const entityType = "PROJECT";
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    if (entityId) {
      fetchComments();
    }
  }, [entityId, dispatch]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await CommentService.getCommentsByEntity(entityId, entityType);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  // Check authentication after loading is complete
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-8">
        Please log in to view comments.
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleAddComment = async (content) => {
    try {
      await CommentService.createComment(content, entityId, entityType);
      await fetchComments();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await CommentService.updateComment(commentId, content);
      await fetchComments();
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await CommentService.deleteComment(commentId);
      await fetchComments();
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      await CommentService.createComment(
        content,
        entityId,
        entityType,
        parentCommentId
      );
      await fetchComments();
      toast.success('Reply added successfully');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {project.status !== 'CANCELLED' ? (
        <CommentEditor onSubmit={handleAddComment} />
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-center py-4">
          Comments are disabled for cancelled projects
        </div>
      )}
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
            onReply={handleReply}
            currentUser={currentUser}
            projectRole={projectRole}
            projectStatus={project.status}
          />
        ))}
        {comments.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection; 