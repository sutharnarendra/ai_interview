'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Mic, Monitor, AlertCircle, Loader2, Play } from 'lucide-react';
import SimpleInterviewRoom from '@/components/SimpleInterviewRoom';

export default function InterviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [interviewConfig, setInterviewConfig] = useState<any>(null);
  const [interviewId, setInterviewId] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [inInterview, setInInterview] = useState(false);

  useEffect(() => {
    // Load interview config from localStorage
    const config = localStorage.getItem('interviewConfig');
    if (config) {
      setInterviewConfig(JSON.parse(config));
    }
  }, []);

  const startInterview = async () => {
    if (!user || !interviewConfig) return;

    setLoading(true);

    try {
      // Step 1: Initialize interview session
      const initResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          resumeId: interviewConfig.resumeId,
          jobRole: interviewConfig.jobRole,
          jobRoleId: interviewConfig.jobRoleId,
          experienceLevel: interviewConfig.experienceLevel,
          compatibility: interviewConfig.compatibility
        })
      });

      const initData = await initResponse.json();
      setInterviewId(initData.interviewId);
      setInInterview(true);

    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setInInterview(false);
    router.push('/dashboard/reports');
  };

  if (!interviewConfig) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="py-16 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Interview Configured</h2>
            <p className="text-gray-600 mb-6">
              Please upload your resume and select a job role first.
            </p>
            <Button onClick={() => router.push('/dashboard/resume-upload')}>
              Upload Resume
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (inInterview && interviewId) {
    return (
      <SimpleInterviewRoom
        interviewId={interviewId}
        interviewContext={{
          ...interviewConfig,
          candidateName: user?.displayName || 'User'
        }}
        onEnd={handleDisconnect}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Interview - {interviewConfig.jobRole}</h1>
        <p className="text-gray-600">
          Ready to start your interview? Make sure you're in a quiet environment.
        </p>
      </div>

      {/* Interview Details */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Position:</span>
            <span className="font-semibold">{interviewConfig.jobRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Experience Level:</span>
            <span className="font-semibold">{interviewConfig.experienceLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Resume Match:</span>
            <span className="font-semibold">{interviewConfig.compatibility.score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Duration:</span>
            <span className="font-semibold">20 minutes</span>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Check */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <CardTitle className="text-yellow-800">Before You Start</CardTitle>
          </div>
          <CardDescription className="text-yellow-700">
            Ensure you have the following ready
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center">
              <Video className="h-5 w-5 text-yellow-600 mr-3" />
              <span className="text-sm text-yellow-800">Working webcam (for behavioral analysis)</span>
            </div>
            <div className="flex items-center">
              <Mic className="h-5 w-5 text-yellow-600 mr-3" />
              <span className="text-sm text-yellow-800">Working microphone (for voice conversation)</span>
            </div>
            <div className="flex items-center">
              <Monitor className="h-5 w-5 text-yellow-600 mr-3" />
              <span className="text-sm text-yellow-800">Quiet environment with good lighting</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Rounds */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Structure</CardTitle>
          <CardDescription>You'll go through 3 rounds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start border-l-4 border-blue-500 pl-4">
              <div>
                <h4 className="font-semibold text-blue-900">Round 1: HR & Behavioral (5 min)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Questions about your background, career goals, and cultural fit
                </p>
              </div>
            </div>

            <div className="flex items-start border-l-4 border-purple-500 pl-4">
              <div>
                <h4 className="font-semibold text-purple-900">Round 2: Technical (10 min)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Deep dive into your skills, especially missing areas from your resume
                </p>
              </div>
            </div>

            <div className="flex items-start border-l-4 border-green-500 pl-4">
              <div>
                <h4 className="font-semibold text-green-900">Round 3: Problem Solving (5 min)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Scenario-based questions to assess your analytical thinking
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-green-900">Ready to Begin?</h3>
            <p className="text-sm text-green-800">
              The AI interviewer will greet you and guide you through each round
            </p>
            <Button
              size="lg"
              onClick={startInterview}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting Interview...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Interview
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}