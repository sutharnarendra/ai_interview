'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadResult {
  resumeId: string;
  fileName: string;
  fileUrl: string;
  atsScore?: number;
  skills?: string[];
  missingSkills?: string[];
}

interface JobRoleSelectorProps {
  onUploadSuccess?: (data: UploadResult) => void;
}

export default function ResumeUploader({ onUploadSuccess }: JobRoleSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    await handleUpload(file);
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleUpload = async (file: File) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please login to upload resume',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload to backend API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.uid);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();

      // Step 2: Store metadata in Firestore
      const resumeRef = await addDoc(collection(db, 'resumes'), {
        userId: user.uid,
        resumeId: data.resumeId,
        fileName: file.name,
        fileUrl: `${process.env.NEXT_PUBLIC_API_URL}${data.fileUrl}`,
        fileSize: file.size,
        uploadedAt: new Date(),
        atsScore: data.atsScore || null,
        skills: data.skills || [],
        missingSkills: data.missingSkills || [],
        status: 'analyzed'
      });

      // Step 3: Update UI
      setUploadResult({
        resumeId: data.resumeId,
        fileName: file.name,
        fileUrl: `${process.env.NEXT_PUBLIC_API_URL}${data.fileUrl}`,
        atsScore: data.atsScore,
        skills: data.skills,
        missingSkills: data.missingSkills
      });
      
      toast({
        title: 'Success!',
        description: 'Resume analyzed successfully',
      });

      // Call parent callback if provided
      if (onUploadSuccess) {
        onUploadSuccess({
          resumeId: data.resumeId,
          fileName: file.name,
          fileUrl: `${process.env.NEXT_PUBLIC_API_URL}${data.fileUrl}`,
          atsScore: data.atsScore,
          skills: data.skills,
          missingSkills: data.missingSkills
        });
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            Upload your resume in PDF format for instant ATS analysis and scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Dropzone Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-700">Analyzing your resume...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <Button variant="outline" size="sm" type="button">
                  Select PDF File
                </Button>
                <p className="text-xs text-gray-400 mt-4">Maximum file size: 5MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Result */}
      {uploadResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
              <CardTitle className="text-green-800">Resume Analyzed Successfully!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  {uploadResult.fileName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(uploadResult.fileUrl, '_blank')}
              >
                View Resume
              </Button>
            </div>

            {uploadResult.atsScore !== undefined && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">ATS Score</span>
                  <span className={`text-2xl font-bold ${
                    uploadResult.atsScore >= 80 ? 'text-green-600' :
                    uploadResult.atsScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {uploadResult.atsScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      uploadResult.atsScore >= 80 ? 'bg-green-600' :
                      uploadResult.atsScore >= 60 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${uploadResult.atsScore}%` }}
                  />
                </div>
              </div>
            )}

            {uploadResult.skills && uploadResult.skills.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {uploadResult.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {uploadResult.missingSkills && uploadResult.missingSkills.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Missing Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {uploadResult.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}