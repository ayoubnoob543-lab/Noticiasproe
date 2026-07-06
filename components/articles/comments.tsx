'use client';

import * as React from 'react';
import { Heart, Reply, Flag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Comment } from '@/lib/types';
import { timeAgo } from '@/lib/format';

interface CommentsProps {
  articleId: string;
  initialComments: Comment[];
}

export function Comments({ articleId, initialComments }: CommentsProps) {
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = React.useState('');
  const [name, setName] = React.useState('');
  const [liked, setLiked] = React.useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Escribe un comentario');
      return;
    }
    if (!name.trim()) {
      toast.error('Introduce tu nombre');
      return;
    }
    const comment: Comment = {
      id: `c${Date.now()}`,
      articleId,
      author: name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comentario publicado');
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mt-12">
      <h2 className="font-serif text-2xl font-black mb-6">
        Comentarios ({comments.length})
      </h2>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <Textarea
          placeholder="Escribe tu comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
        />
        <div className="flex justify-end">
          <Button type="submit">
            <Send className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Sé el primero en comentar esta noticia.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <button
                      onClick={() => toggleLike(comment.id)}
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        liked.has(comment.id)
                          ? 'text-red-500'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${liked.has(comment.id) ? 'fill-current' : ''}`}
                      />
                      {comment.likes + (liked.has(comment.id) ? 1 : 0)}
                    </button>
                    <button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <Reply className="h-3.5 w-3.5" />
                      Responder
                    </button>
                    <button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <Flag className="h-3.5 w-3.5" />
                      Reportar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
