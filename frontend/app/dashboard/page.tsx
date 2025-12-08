'use client';

import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Upload, Video, FileText, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName || 'User'}!
        </h1>
        <p className="text-blue-100">
          Ready to ace your next interview? Let's get started.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No interviews yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Complete an interview first</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No reports yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/resume-upload">
              <CardHeader>
                <Upload className="h-12 w-12 mb-4 text-blue-600" />
                <CardTitle>Upload Resume</CardTitle>
                <CardDescription>
                  Get your resume analyzed and receive an ATS score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/interview">
              <CardHeader>
                <Video className="h-12 w-12 mb-4 text-purple-600" />
                <CardTitle>Start Interview</CardTitle>
                <CardDescription>
                  Begin a live AI-powered interview session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/reports">
              <CardHeader>
                <FileText className="h-12 w-12 mb-4 text-green-600" />
                <CardTitle>View Reports</CardTitle>
                <CardDescription>
                  Access your interview performance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  View All
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to complete your first interview</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4 flex-shrink-0">
                1
              </span>
              <div>
                <h3 className="font-semibold">Upload Your Resume</h3>
                <p className="text-sm text-gray-600">
                  Our AI will analyze your resume and calculate an ATS score
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4 flex-shrink-0">
                2
              </span>
              <div>
                <h3 className="font-semibold">Join the Interview Room</h3>
                <p className="text-sm text-gray-600">
                  Participate in a multi-round AI interview with real-time feedback
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4 flex-shrink-0">
                3
              </span>
              <div>
                <h3 className="font-semibold">Download Your Report</h3>
                <p className="text-sm text-gray-600">
                  Get comprehensive feedback with scores and improvement suggestions
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}