import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Video, FileText, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Interview System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of interviews with real-time AI analysis, 
            behavioral tracking, and comprehensive evaluation reports
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="default">
                Get Started
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Brain className="w-12 h-12 mb-4 text-blue-600" />
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Advanced NLP and computer vision for intelligent evaluation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Video className="w-12 h-12 mb-4 text-purple-600" />
              <CardTitle>Real-Time Video</CardTitle>
              <CardDescription>
                Face-to-face interviews with behavioral analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-12 h-12 mb-4 text-green-600" />
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                ATS scoring and skill gap identification
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-12 h-12 mb-4 text-orange-600" />
              <CardTitle>Detailed Reports</CardTitle>
              <CardDescription>
                Comprehensive feedback with numerical scores
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Upload Your Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload your resume and get instant ATS scoring with personalized feedback
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Join Live Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Participate in multi-round interviews (HR, Technical, Aptitude) with AI interviewer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Get Comprehensive Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive detailed feedback including technical scores, behavioral analysis, and improvement areas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 AI Interview System - Skillup India | IIT Techfest Hackathon</p>
        </div>
      </footer>
    </div>
  );
}