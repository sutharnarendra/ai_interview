'use client';

import { useState } from 'react';
import ResumeUploader from '@/components/ResumeUploader';
import JobRoleSelector from '@/components/JobRoleSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResumeUploadPage() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [step, setStep] = useState<'upload' | 'select-role'>('upload');
  const router = useRouter();

  const handleResumeUploaded = (data: any) => {
    setResumeData(data);
    setStep('select-role');
  };

  const handleRoleSelected = async (roleData: any) => {
    // Store interview configuration in localStorage for now
    // In production, this would be stored in Firestore
    const interviewConfig = {
      resumeId: resumeData.resumeId,
      jobRole: roleData.role,
      jobRoleId: roleData.roleId,
      experienceLevel: roleData.experienceLevel,
      compatibility: roleData.compatibility,
      resumeSkills: resumeData.skills,
      atsScore: resumeData.atsScore,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('interviewConfig', JSON.stringify(interviewConfig));
    
    // Navigate to interview page
    router.push('/dashboard/interview');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Resume Analysis & Job Matching</h1>
        <p className="text-gray-600">
          {step === 'upload' 
            ? 'Upload your resume to get instant ATS scoring'
            : 'Select the job role you\'re interviewing for'
          }
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center ${step === 'upload' ? 'text-blue-600' : 'text-green-600'}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step === 'upload' ? 'border-blue-600 bg-blue-50' : 'border-green-600 bg-green-50'
          }`}>
            {step === 'select-role' ? <CheckCircle2 className="h-5 w-5" /> : '1'}
          </div>
          <span className="ml-2 font-medium">Upload Resume</span>
        </div>
        
        <ArrowRight className="h-5 w-5 text-gray-400" />
        
        <div className={`flex items-center ${step === 'select-role' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step === 'select-role' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
          }`}>
            2
          </div>
          <span className="ml-2 font-medium">Select Job Role</span>
        </div>
      </div>

      {/* Step Content */}
      {step === 'upload' && (
        <>
          <ResumeUploader onUploadSuccess={handleResumeUploaded} />

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>What happens after upload?</CardTitle>
              <CardDescription>Our AI-powered system analyzes your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">ATS Score Calculation</h4>
                    <p className="text-sm text-gray-600">
                      We analyze how well your resume matches industry standards and job requirements
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Skills Extraction</h4>
                    <p className="text-sm text-gray-600">
                      Our NLP engine identifies technical and soft skills from your resume
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Job Role Matching</h4>
                    <p className="text-sm text-gray-600">
                      Choose your target role and get personalized compatibility analysis
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {step === 'select-role' && resumeData && (
        <JobRoleSelector 
          resumeData={resumeData}
          onSelectRole={handleRoleSelected}
        />
      )}
    </div>
  );
}