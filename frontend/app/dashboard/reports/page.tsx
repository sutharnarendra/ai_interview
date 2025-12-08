'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Interview Reports</h1>
        <p className="text-gray-600">
          View and download your interview performance reports
        </p>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-24 w-24 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Reports Yet
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Complete an interview to generate your first performance report with detailed feedback and scores
          </p>
          <Button>Start Your First Interview</Button>
        </CardContent>
      </Card>

      {/* Sample Report Cards (for when reports exist) */}
      <div className="space-y-4 opacity-50 pointer-events-none">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Full Stack Developer Interview</CardTitle>
                <CardDescription>Completed on Dec 7, 2024</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">78/100</div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">HR:</span>
                  <span className="font-medium ml-1">85/100</span>
                </div>
                <div>
                  <span className="text-gray-500">Technical:</span>
                  <span className="font-medium ml-1">72/100</span>
                </div>
                <div>
                  <span className="text-gray-500">Aptitude:</span>
                  <span className="font-medium ml-1">76/100</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Info */}
      <Card>
        <CardHeader>
          <CardTitle>What's in Your Report?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Overall score (0-100)</li>
                <li>• Round-wise breakdown</li>
                <li>• Skills assessment</li>
                <li>• Behavioral analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Detailed Feedback</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Strengths and weaknesses</li>
                <li>• Improvement suggestions</li>
                <li>• Question-wise analysis</li>
                <li>• Confidence metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}