import { Metadata } from 'next';
import DashboardLayout from '@/components/DashboardLayout';
import SimpleArticleEditor from '@/components/articles/SimpleArticleEditor';

export const metadata: Metadata = {
  title: 'Article Editor | APUDSI CMS',
  description: 'Create and edit articles',
};

export default function ArticleEditorPage() {
  return (
    <DashboardLayout>
      <SimpleArticleEditor />
    </DashboardLayout>
  );
}
