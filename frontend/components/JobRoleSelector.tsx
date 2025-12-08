'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Database, 
  Cloud, 
  Cpu, 
  BarChart, 
  Briefcase,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Palette,
  DollarSign,
  Heart,
  Cog,
  Search
} from 'lucide-react';

const CATEGORY_ICONS: any = {
  technology: Code,
  business: Briefcase,
  creative: Palette,
  finance: DollarSign,
  healthcare: Heart,
  engineering: Cog
};

interface JobRole {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  preferredSkills: string[];
}

interface JobRoleSelectorProps {
  resumeData: {
    resumeId: string;
    skills: string[];
    atsScore: number;
  };
  onSelectRole: (roleData: any) => void;
}

export default function JobRoleSelector({ resumeData, onSelectRole }: JobRoleSelectorProps) {
  const [allRoles, setAllRoles] = useState<JobRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<JobRole[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  useEffect(() => {
    filterRoles();
  }, [selectedCategory, searchQuery, allRoles]);

  const fetchJobRoles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-roles`);
      const data = await response.json();
      setAllRoles(data.roles);
      setFilteredRoles(data.roles);
    } catch (error) {
      console.error('Error fetching job roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRoles = () => {
    let filtered = allRoles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(role => role.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(role =>
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRoles(filtered);
  };

  const calculateCompatibility = (role: JobRole) => {
    const userSkills = new Set(resumeData.skills.map(s => s.toLowerCase()));
    const requiredSkills = role.requiredSkills.map(s => s.toLowerCase());
    const preferredSkills = role.preferredSkills.map(s => s.toLowerCase());
    
    const matchedRequired = role.requiredSkills.filter(s => userSkills.has(s.toLowerCase()));
    const matchedPreferred = role.preferredSkills.filter(s => userSkills.has(s.toLowerCase()));
    
    const requiredScore = (matchedRequired.length / requiredSkills.length) * 70;
    const preferredScore = (matchedPreferred.length / preferredSkills.length) * 30;
    const compatibilityScore = Math.round(requiredScore + preferredScore);
    
    return {
      score: compatibilityScore,
      matchedRequired: matchedRequired,
      missingRequired: role.requiredSkills.filter(s => !userSkills.has(s.toLowerCase())),
      matchedPreferred: matchedPreferred,
      missingPreferred: role.preferredSkills.filter(s => !userSkills.has(s.toLowerCase()))
    };
  };

  const handleRoleSelect = (role: JobRole) => {
    setSelectedRole(role);
  };

  const handleStartInterview = () => {
    if (!selectedRole || !experienceLevel) return;
    
    const compatibility = calculateCompatibility(selectedRole);
    
    onSelectRole({
      role: selectedRole.title,
      roleId: selectedRole.id,
      category: selectedRole.category,
      experienceLevel,
      compatibility,
      requiredSkills: selectedRole.requiredSkills,
      preferredSkills: selectedRole.preferredSkills
    });
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: Briefcase },
    { id: 'technology', name: 'Technology', icon: Code },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'healthcare', name: 'Healthcare', icon: Heart },
    { id: 'engineering', name: 'Engineering', icon: Cog }
  ];

  const compatibility = selectedRole ? calculateCompatibility(selectedRole) : null;

  if (loading) {
    return <div className="text-center py-8">Loading job roles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Job Role</CardTitle>
          <CardDescription>
            Search and filter from {allRoles.length} job roles across all industries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search job roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Job Roles Grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory === 'all' ? 'All Roles' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-sm text-gray-500 ml-2">({filteredRoles.length} roles)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredRoles.map((role) => {
              const Icon = CATEGORY_ICONS[role.category] || Briefcase;
              const compat = calculateCompatibility(role);
              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRole?.id === role.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : ''
                  }`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col">
                      <Icon className="h-10 w-10 mb-3 text-blue-600" />
                      <h3 className="font-semibold mb-1">{role.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{role.description}</p>
                      <div className="mt-auto">
                        <div className="text-xs text-gray-600 mb-1">Match:</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                compat.score >= 70 ? 'bg-green-600' :
                                compat.score >= 50 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${compat.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">{compat.score}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredRoles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No roles found. Try different filters or search terms.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience Level Selection */}
      {selectedRole && (
        <Card>
          <CardHeader>
            <CardTitle>Experience Level</CardTitle>
            <CardDescription>
              Select your experience level for {selectedRole.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {['Entry Level (0-2 years)', 'Mid Level (2-5 years)', 'Senior Level (5+ years)'].map((level) => (
                <Card
                  key={level}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    experienceLevel === level
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : ''
                  }`}
                  onClick={() => setExperienceLevel(level)}
                >
                  <CardContent className="pt-6 text-center">
                    <p className="font-medium">{level}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compatibility Analysis */}
      {selectedRole && compatibility && experienceLevel && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resume-Job Compatibility</CardTitle>
              <div className="text-right">
                <div className={`text-3xl font-bold ${
                  compatibility.score >= 70 ? 'text-green-600' :
                  compatibility.score >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {compatibility.score}/100
                </div>
                <p className="text-sm text-gray-600">Match Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  compatibility.score >= 70 ? 'bg-green-600' :
                  compatibility.score >= 50 ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${compatibility.score}%` }}
              />
            </div>

            {/* Matched Required Skills */}
            {compatibility.matchedRequired.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">Matched Required Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {compatibility.matchedRequired.map((skill, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Required Skills */}
            {compatibility.missingRequired.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-800">Missing Required Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {compatibility.missingRequired.map((skill, idx) => (
                    <Badge key={idx} variant="destructive">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-red-700 mt-2">
                  ⚠️ Interview will focus on these areas
                </p>
              </div>
            )}

            {/* Matched Preferred Skills */}
            {compatibility.matchedPreferred.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">Bonus Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {compatibility.matchedPreferred.map((skill, idx) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Start Interview Button */}
            <Button
              onClick={handleStartInterview}
              className="w-full"
              size="lg"
            >
              Start {selectedRole.title} Interview
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}