'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './SimpleArticleEditor.module.css';
import Image from 'next/image';

interface SimpleArticleFormData {
  title: string;
  imageUrl: string;
  content: string;
}

export default function SimpleArticleEditor() {
  const [formData, setFormData] = useState<SimpleArticleFormData>({
    title: '',
    imageUrl: '',
    content: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Simple client-side validation
      if (!file.type.includes('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {  // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
          setFormData({ ...formData, imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError('You must be logged in to create an article');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.imageUrl) {
      setError('Image is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/simple-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          imageUrl: formData.imageUrl,
          content: formData.content,
          authorId: session.user.id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create article');
      }
      
      setSuccess('Article saved as draft successfully!');
      
      // Reset form
      setFormData({
        title: '',
        imageUrl: '',
        content: ''
      });
      setPreviewImage(null);
      
      // Redirect or reset form based on preference
      // router.push('/dashboard/articles');
    } catch (err) {
      console.error('Error creating article draft:', err);
      setError('An error occurred while saving your article draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.articleEditorContainer}>
      <h2>Create New Article</h2>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      
      <form onSubmit={handleSubmit} className={styles.articleForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Article Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter article title"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="image">Article Image</label>
          <div className={styles.imageUploadContainer}>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              disabled={isSubmitting}
            />
            
            {previewImage && (
              <div className={styles.imagePreview}>
                <Image 
                  src={previewImage} 
                  alt="Preview" 
                  width={300} 
                  height={200}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content">Article Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your article content here..."
            rows={10}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Author</label>
          <div className={styles.authorInfo}>
            {session?.user?.name || 'Unknown Author'}
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
