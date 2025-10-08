import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Loader, EmptyState, ErrorState } from '../components/common';
import { ConversationList, ChatPanel } from '../components/chatBarrel';
import { createConversation, listConversationsForUser } from '../lib/chatService';
import { Navigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Chat
 * Chat page rendering split view: conversation list + chat panel.
 * Handles unauthenticated redirect to /auth/login via direct guard here as well as router guard.
 * Includes role-based new conversation flow (coach can start with a client id).
 */
export default function Chat() {
  const { user, profile, loading } = useAuth();
  const role = profile?.role || 'client';
  const userId = user?.id || null;

  const [convos, setConvos] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [loadingList, setLoadingList] = React.useState(true);
  const [errorList, setErrorList] = React.useState(null);

  async function loadConversations() {
    if (!userId) return;
    setLoadingList(true);
    setErrorList(null);
    const { data, error } = await listConversationsForUser(userId);
    if (error) setErrorList(error.message || 'Failed to load conversations');
    setConvos(data || []);
    if (!selected && (data || []).length) {
      setSelected(data[0].id);
    }
    setLoadingList(false);
  }

  React.useEffect(() => {
    if (userId) loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return (
      <div className="container">
        <Card><Loader /> Loading chat...</Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  async function handleStartNew(targetUserId) {
    // Determine coach and client based on role; coaches can start with a provided client id
    const coach_id = role === 'coach' ? userId : targetUserId;
    const client_id = role === 'coach' ? targetUserId : userId;

    const { data, error } = await createConversation({ coach_id, client_id });
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message || 'Failed to create conversation');
      return;
    }
    await loadConversations();
    if (data?.id) setSelected(data.id);
  }

  const empty = !loadingList && !convos.length;

  return (
    <div className="container" style={{ height: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, height: '100%' }}>
        <Card style={{ height: '100%', overflow: 'hidden' }}>
          {loadingList ? (
            <div style={{ padding: 12 }}><Loader /> Loading conversations...</div>
          ) : errorList ? (
            <ErrorState message={errorList} onRetry={loadConversations} />
          ) : empty ? (
            <EmptyState
              title="No conversations"
              description="Start a new conversation to begin chatting."
              icon="💬"
              primaryAction={{
                label: role === 'coach' ? 'Start with Client' : 'New Conversation',
                onClick: () => handleStartNew(null),
              }}
            />
          ) : (
            <ConversationList
              conversations={convos}
              loading={false}
              empty={false}
              error={null}
              currentUserId={userId}
              role={role}
              onSelect={(id) => setSelected(id)}
              onStartNew={handleStartNew}
            />
          )}
        </Card>

        <ChatPanel conversationId={selected} currentUserId={userId} />
      </div>
    </div>
  );
}
