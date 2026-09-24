'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default function EditArticlePage() {
  const params = useParams();
  return <ArticleEditor articleId={params.id} />;
}
