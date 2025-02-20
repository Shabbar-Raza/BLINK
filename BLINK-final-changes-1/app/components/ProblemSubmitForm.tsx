'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

export function ProblemSubmitForm() {
  const [image, setImage] = useState<File | null>(null);
  const [subject, setSubject] = useState('math');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    
    try {
      // Upload image and get URL
      const formData = new FormData();
      formData.append('file', image);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const { imageUrl } = await uploadResponse.json();
      
      // Submit problem
      const solutionResponse = await fetch('/api/solutions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl,
          subject
        })
      });
      
      const { solution } = await solutionResponse.json();
      toast({
        title: 'Solution generated!',
        description: 'Your problem has been processed successfully.'
      });
      
      // TODO: Redirect to solution page
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your problem. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Upload Problem Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="math">Mathematics</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
        </select>
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Submit Problem'}
      </Button>
    </form>
  );
}
