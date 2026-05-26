import React, { useState, useRef } from 'react';
import { MOCK_SCHOOLS } from '../../data/mockData';
import { NewsArticle } from '../../types';
import { ShieldAlert, Send, FilePlus2, CheckSquare, Upload, FileImage, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminPanelProps {
  onPublishArticle: (article: NewsArticle | FormData) => void;
  onSuccessRedirect: () => void;
}

export default function AdminPanel({ onPublishArticle, onSuccessRedirect }: AdminPanelProps) {
  const { currentRole } = useAuth();
  const [selectedSchoolId, setSelectedSchoolId] = useState('alliance');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState(currentRole === 'student_reporter' ? 'Student Reporter' : 'Principal');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'pathway' | 'sports' | 'academics' | 'scholarships' | 'clubs' | 'events' | 'general'>('pathway');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDigitalSigned, setIsDigitalSigned] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isReporter = currentRole === 'student_reporter';

  // Default images per category for easy, professional look
  const categoryDefaultImages: Record<string, string> = {
    pathway: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    academics: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    scholarships: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    clubs: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    events: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    general: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !authorName.trim()) return;

    const associatedSchool = MOCK_SCHOOLS.find((s) => s.id === selectedSchoolId);
    const resolvedSchoolName = associatedSchool ? associatedSchool.name : 'Ministry of Education';
    const resolvedSchoolCategory = associatedSchool ? associatedSchool.category : 'National panel';

    const cleanTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const isCertified = currentRole !== 'student_reporter';
    const finalTags = cleanTags.length > 0 ? cleanTags : [isCertified ? 'Verified' : 'Draft', 'Senior School Choice'];

    if (selectedFile) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary.trim() || content.substring(0, 150) + '...');
      formData.append('content', content);
      formData.append('schoolId', selectedSchoolId);
      formData.append('schoolName', resolvedSchoolName);
      formData.append('schoolCategory', resolvedSchoolCategory);
      formData.append('authorName', authorName);
      formData.append('authorRole', authorRole);
      formData.append('category', category);
      formData.append('isVerified', String(isCertified));
      formData.append('image', selectedFile);
      formData.append('tags', finalTags.join(','));

      onPublishArticle(formData);
    } else {
      const newArticle: NewsArticle = {
        id: `art-custom-${Date.now()}`,
        title,
        summary: summary.trim() || content.substring(0, 150) + '...',
        content,
        schoolId: selectedSchoolId,
        schoolName: resolvedSchoolName,
        schoolCategory: resolvedSchoolCategory,
        authorName,
        authorRole,
        date: new Date().toISOString().split('T')[0],
        category,
        isVerified: isCertified,
        image: imageUrl.trim() || categoryDefaultImages[category],
        likes: 0,
        views: 1,
        reactions: {
          applause: 0,
          insightful: 0,
          congratulations: 0,
          cheers: 0
        },
        comments: [],
        tags: finalTags
      };

      onPublishArticle(newArticle);
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onSuccessRedirect();
    }, 2200);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setImageUrl('');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImageUrl('');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-xs max-w-4xl mx-auto animate-fade-in" id="admin-composer-panel">
      
      {showSuccess && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-2xl border border-blue-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-gray-900">
              {isReporter ? 'Daily Draft Submitted!' : 'Article Published Successfully!'}
            </h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed font-sans">
              {isReporter
                ? 'Your draft article has been submitted to your school editor for approval.'
                : 'The article is live on the public news feed.'}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-6">
        <FilePlus2 className="h-6 w-6 text-blue-700" />
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">
            {isReporter ? 'Write a News Draft' : 'Post School News'}
          </h2>
          <p className="text-xs text-gray-500">
            {isReporter
              ? 'Draft an article, sports update, or event highlight for your editor to review.'
              : 'Publish an official announcement, pathway update, or school highlight.'}
          </p>
        </div>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">1. School:</label>
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs font-semibold"
            >
              {MOCK_SCHOOLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.county})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">2. Author Name:</label>
            <input
              type="text"
              placeholder="e.g. Dr. June Kamau"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">3. Author Role:</label>
            <select
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 cursor-pointer"
            >
              <option value="School Principal">School Principal</option>
              <option value="Deputy Principal / Academics">Deputy Principal</option>
              <option value="Careers & Pathway Dean">Careers & Pathway Dean</option>
              <option value="Games Patron">School Games Master</option>
              <option value="Alumni Coordinator">Alumni Coordinator</option>
              <option value="Board Chair">Board Chair Representative</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-900 uppercase">Article Title</label>
            <input
              type="text"
              placeholder="e.g. Alliance High Launches New STEM Robotics Lab"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-900 uppercase">Short Summary (shows limit feeds)</label>
            <input
              type="text"
              placeholder="Write a brief one-sentence summary..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 cursor-pointer outline-none"
              >
                <option value="pathway">CBE Pathways & Careers</option>
                <option value="sports">Athletics & Games</option>
                <option value="academics">Curriculum & Learning</option>
                <option value="scholarships">Scholarships & Grants</option>
                <option value="clubs">Clubs & Culture</option>
                <option value="events">Events & Activities</option>
                <option value="general">General Notices</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. STEM, Rugby, Chess"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Media upload grid layout */}
          <div className="space-y-3.5">
            <label className="text-xs font-bold text-slate-900 uppercase block">
              Article Cover Image
            </label>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Drag and drop zone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDragOver 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : selectedFile 
                    ? 'border-emerald-500 bg-emerald-50/30' 
                    : 'border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-100/30'
                }`}
                id="dynamic-media-upload-dropzone"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {selectedFile ? (
                  <div className="space-y-1.5 flex flex-col items-center">
                    <FileImage className="h-8 w-8 text-emerald-600" />
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedFile();
                      }}
                      className="mt-1 rounded bg-red-100 text-red-700 hover:bg-red-200 px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" /> Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-slate-500">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">Upload Image File</p>
                    <p className="text-[10px] text-slate-400">Drag/drop or click to choose file</p>
                  </div>
                )}
              </div>

              {/* Paste direct link URL zone */}
              <div className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono block">Image URL (Optional):</span>
                  <p className="text-[11px] text-slate-500 font-medium font-sans">Provide an online image URL if your file is published elsewhere.</p>
                </div>
                
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-1546410531-bb4caa6b424d"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setSelectedFile(null);
                  }}
                  disabled={!!selectedFile}
                  className={`rounded-lg border px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 outline-none font-mono ${!!selectedFile ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-200'}`}
                />
                
                <p className="text-[10px] text-slate-400 leading-normal">
                  {selectedFile 
                    ? 'Using uploaded file resource.' 
                    : 'Leaves field blank to generate an automatic placeholder image.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-900 uppercase">Article Content</label>
            <textarea
              rows={8}
              placeholder="Write the full body text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none leading-relaxed font-sans"
            ></textarea>
          </div>
        </div>

        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="sign-check"
              checked={isDigitalSigned}
              onChange={(e) => setIsDigitalSigned(e.target.checked)}
              required
              className="h-4.5 w-4.5 rounded border-amber-300 text-blue-700 bg-white focus:ring-blue-500 cursor-pointer mt-0.5"
            />
            <label htmlFor="sign-check" className="text-xs text-amber-950 font-medium select-none cursor-pointer">
              {isReporter
                ? 'I verify that I wrote this article draft and the core details gathered in the field are true and accurate.'
                : 'I certify that this article is approved for publication.'}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-150">
          <button
            type="submit"
            disabled={!isDigitalSigned}
            className={`w-full sm:w-auto rounded-lg px-6 py-3 text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-1.5 ${
              isDigitalSigned 
                ? 'bg-blue-600 hover:bg-blue-800 cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>{isReporter ? 'Submit Draft' : 'Publish Article'}</span>
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-lg bg-gray-50 p-3 flex items-center gap-2 border border-gray-150 text-[10.5px] text-gray-550 font-mono">
        <ShieldAlert className="h-4 w-4 text-blue-700" />
        <span>SHA-256 Digital Verification Stamp: KSSNN-2026-{selectedSchoolId.toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</span>
      </div>
    </div>
  );
}
