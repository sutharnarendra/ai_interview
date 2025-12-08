"""
Comprehensive job roles database across all industries
"""

JOB_CATEGORIES = {
    "technology": {
        "name": "Technology & Software",
        "icon": "code"
    },
    "business": {
        "name": "Business & Management",
        "icon": "briefcase"
    },
    "creative": {
        "name": "Creative & Design",
        "icon": "palette"
    },
    "finance": {
        "name": "Finance & Accounting",
        "icon": "dollar-sign"
    },
    "healthcare": {
        "name": "Healthcare",
        "icon": "heart"
    },
    "engineering": {
        "name": "Engineering",
        "icon": "cog"
    }
}

JOB_ROLES = {
    # ============ TECHNOLOGY & SOFTWARE ============
    "full-stack": {
        "category": "technology",
        "title": "Full Stack Developer",
        "description": "Develop both frontend and backend applications",
        "requiredSkills": ["React", "JavaScript", "Node.js", "SQL", "REST API", "Git"],
        "preferredSkills": ["TypeScript", "Docker", "AWS", "MongoDB", "GraphQL"]
    },
    "frontend": {
        "category": "technology",
        "title": "Frontend Developer",
        "description": "Build user interfaces and experiences",
        "requiredSkills": ["React", "JavaScript", "HTML", "CSS", "Responsive Design"],
        "preferredSkills": ["TypeScript", "Next.js", "Tailwind CSS", "Redux"]
    },
    "backend": {
        "category": "technology",
        "title": "Backend Developer",
        "description": "Build server-side applications and APIs",
        "requiredSkills": ["Python", "SQL", "REST API", "Database Design", "Git"],
        "preferredSkills": ["FastAPI", "PostgreSQL", "Redis", "Docker", "Microservices"]
    },
    "devops": {
        "category": "technology",
        "title": "DevOps Engineer",
        "description": "Manage infrastructure and deployment pipelines",
        "requiredSkills": ["Docker", "Kubernetes", "CI/CD", "Linux", "Bash"],
        "preferredSkills": ["AWS", "Terraform", "Jenkins", "Ansible", "Monitoring"]
    },
    "data-scientist": {
        "category": "technology",
        "title": "Data Scientist",
        "description": "Analyze data and build predictive models",
        "requiredSkills": ["Python", "Machine Learning", "SQL", "Statistics", "Data Analysis"],
        "preferredSkills": ["TensorFlow", "PyTorch", "Big Data", "Spark"]
    },
    "ml-engineer": {
        "category": "technology",
        "title": "ML Engineer",
        "description": "Build and deploy machine learning systems",
        "requiredSkills": ["Python", "Deep Learning", "TensorFlow", "PyTorch", "ML"],
        "preferredSkills": ["MLOps", "Docker", "Kubernetes", "Production ML"]
    },
    "mobile-developer": {
        "category": "technology",
        "title": "Mobile App Developer",
        "description": "Build iOS and Android applications",
        "requiredSkills": ["React Native", "JavaScript", "Mobile UI", "REST API"],
        "preferredSkills": ["TypeScript", "Swift", "Kotlin", "Firebase"]
    },
    "qa-engineer": {
        "category": "technology",
        "title": "QA Engineer",
        "description": "Ensure software quality through testing",
        "requiredSkills": ["Test Automation", "Selenium", "API Testing", "Bug Tracking"],
        "preferredSkills": ["Python", "Cypress", "CI/CD", "Performance Testing"]
    },
    
    # ============ BUSINESS & MANAGEMENT ============
    "marketing-manager": {
        "category": "business",
        "title": "Marketing Manager",
        "description": "Lead marketing strategies and campaigns",
        "requiredSkills": ["Marketing Strategy", "Digital Marketing", "SEO", "Analytics", "Communication"],
        "preferredSkills": ["Google Ads", "Social Media", "Content Marketing", "CRM"]
    },
    "sales-manager": {
        "category": "business",
        "title": "Sales Manager",
        "description": "Drive sales and manage client relationships",
        "requiredSkills": ["Sales Strategy", "Client Management", "Negotiation", "CRM", "Communication"],
        "preferredSkills": ["Salesforce", "B2B Sales", "Lead Generation", "Pipeline Management"]
    },
    "hr-manager": {
        "category": "business",
        "title": "HR Manager",
        "description": "Manage human resources and talent acquisition",
        "requiredSkills": ["Recruitment", "HR Policies", "Employee Relations", "Performance Management"],
        "preferredSkills": ["HRIS", "Talent Management", "Compensation", "Training"]
    },
    "product-manager": {
        "category": "business",
        "title": "Product Manager",
        "description": "Define product strategy and roadmap",
        "requiredSkills": ["Product Strategy", "Roadmapping", "Stakeholder Management", "Agile", "Analytics"],
        "preferredSkills": ["SQL", "A/B Testing", "User Research", "Wireframing"]
    },
    "business-analyst": {
        "category": "business",
        "title": "Business Analyst",
        "description": "Analyze business processes and requirements",
        "requiredSkills": ["Business Analysis", "Requirements Gathering", "Data Analysis", "Communication"],
        "preferredSkills": ["SQL", "Excel", "Tableau", "Process Mapping", "Agile"]
    },
    "project-manager": {
        "category": "business",
        "title": "Project Manager",
        "description": "Plan and execute projects successfully",
        "requiredSkills": ["Project Planning", "Agile", "Stakeholder Management", "Risk Management"],
        "preferredSkills": ["PMP", "Jira", "Microsoft Project", "Budget Management"]
    },
    
    # ============ CREATIVE & DESIGN ============
    "graphic-designer": {
        "category": "creative",
        "title": "Graphic Designer",
        "description": "Create visual content and branding",
        "requiredSkills": ["Adobe Photoshop", "Illustrator", "Design Principles", "Typography", "Creativity"],
        "preferredSkills": ["Figma", "After Effects", "UI Design", "Branding"]
    },
    "ui-ux-designer": {
        "category": "creative",
        "title": "UI/UX Designer",
        "description": "Design user interfaces and experiences",
        "requiredSkills": ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"],
        "preferredSkills": ["Adobe XD", "User Testing", "Information Architecture", "HTML/CSS"]
    },
    "content-writer": {
        "category": "creative",
        "title": "Content Writer",
        "description": "Create engaging written content",
        "requiredSkills": ["Writing", "SEO", "Content Strategy", "Research", "Editing"],
        "preferredSkills": ["WordPress", "Social Media", "Copywriting", "Technical Writing"]
    },
    "video-editor": {
        "category": "creative",
        "title": "Video Editor",
        "description": "Edit and produce video content",
        "requiredSkills": ["Adobe Premiere Pro", "Video Editing", "Storytelling", "Color Grading"],
        "preferredSkills": ["After Effects", "Motion Graphics", "Sound Design", "DaVinci Resolve"]
    },
    "social-media-manager": {
        "category": "creative",
        "title": "Social Media Manager",
        "description": "Manage social media presence and campaigns",
        "requiredSkills": ["Social Media Marketing", "Content Creation", "Analytics", "Community Management"],
        "preferredSkills": ["Social Media Tools", "Paid Advertising", "Influencer Marketing"]
    },
    
    # ============ FINANCE & ACCOUNTING ============
    "accountant": {
        "category": "finance",
        "title": "Accountant",
        "description": "Manage financial records and reporting",
        "requiredSkills": ["Accounting", "Financial Reporting", "Tax", "Excel", "Auditing"],
        "preferredSkills": ["QuickBooks", "SAP", "CPA", "Financial Analysis"]
    },
    "financial-analyst": {
        "category": "finance",
        "title": "Financial Analyst",
        "description": "Analyze financial data and trends",
        "requiredSkills": ["Financial Analysis", "Excel", "Financial Modeling", "Reporting", "Forecasting"],
        "preferredSkills": ["SQL", "Tableau", "Python", "CFA", "Valuation"]
    },
    "investment-banker": {
        "category": "finance",
        "title": "Investment Banker",
        "description": "Facilitate financial transactions and deals",
        "requiredSkills": ["Financial Modeling", "Valuation", "M&A", "DCF", "Excel"],
        "preferredSkills": ["Capital Markets", "Pitch Decks", "Deal Structuring"]
    },
    "tax-consultant": {
        "category": "finance",
        "title": "Tax Consultant",
        "description": "Provide tax planning and compliance services",
        "requiredSkills": ["Tax Planning", "Tax Compliance", "Tax Law", "Research", "Client Management"],
        "preferredSkills": ["CPA", "International Tax", "Tax Software", "Corporate Tax"]
    },
    
    # ============ HEALTHCARE ============
    "registered-nurse": {
        "category": "healthcare",
        "title": "Registered Nurse",
        "description": "Provide patient care and medical support",
        "requiredSkills": ["Patient Care", "Medical Knowledge", "Clinical Skills", "Communication", "Empathy"],
        "preferredSkills": ["ICU", "Emergency Care", "Pediatrics", "BSN Degree"]
    },
    "medical-assistant": {
        "category": "healthcare",
        "title": "Medical Assistant",
        "description": "Support healthcare professionals with patient care",
        "requiredSkills": ["Clinical Procedures", "Patient Records", "Medical Terminology", "Communication"],
        "preferredSkills": ["EHR Systems", "Phlebotomy", "Lab Skills"]
    },
    "pharmacist": {
        "category": "healthcare",
        "title": "Pharmacist",
        "description": "Dispense medications and provide pharmaceutical care",
        "requiredSkills": ["Pharmaceutical Knowledge", "Patient Counseling", "Drug Interactions", "Regulations"],
        "preferredSkills": ["Clinical Pharmacy", "Compounding", "Immunizations"]
    },
    "physical-therapist": {
        "category": "healthcare",
        "title": "Physical Therapist",
        "description": "Rehabilitate patients through physical therapy",
        "requiredSkills": ["Rehabilitation", "Patient Assessment", "Treatment Planning", "Exercise Therapy"],
        "preferredSkills": ["Sports Therapy", "Manual Therapy", "DPT Degree"]
    },
    
    # ============ ENGINEERING ============
    "mechanical-engineer": {
        "category": "engineering",
        "title": "Mechanical Engineer",
        "description": "Design and develop mechanical systems",
        "requiredSkills": ["CAD", "Thermodynamics", "Mechanics", "Design", "Manufacturing"],
        "preferredSkills": ["SolidWorks", "ANSYS", "FEA", "GD&T", "Project Management"]
    },
    "civil-engineer": {
        "category": "engineering",
        "title": "Civil Engineer",
        "description": "Design infrastructure and construction projects",
        "requiredSkills": ["Structural Design", "AutoCAD", "Project Planning", "Site Management", "Building Codes"],
        "preferredSkills": ["Revit", "Civil 3D", "PE License", "Construction Management"]
    },
    "electrical-engineer": {
        "category": "engineering",
        "title": "Electrical Engineer",
        "description": "Design electrical systems and circuits",
        "requiredSkills": ["Circuit Design", "Electronics", "Power Systems", "CAD", "Testing"],
        "preferredSkills": ["PCB Design", "PLC Programming", "MATLAB", "Embedded Systems"]
    },
    "chemical-engineer": {
        "category": "engineering",
        "title": "Chemical Engineer",
        "description": "Design chemical processes and plants",
        "requiredSkills": ["Process Design", "Chemical Processes", "Safety", "Plant Operations"],
        "preferredSkills": ["Aspen Plus", "Process Optimization", "Six Sigma"]
    }
}

def get_job_role(role_id: str):
    """Get job role by ID"""
    return JOB_ROLES.get(role_id)

def get_all_job_roles():
    """Get all available job roles"""
    return JOB_ROLES

def get_roles_by_category(category: str):
    """Get all roles in a specific category"""
    return {k: v for k, v in JOB_ROLES.items() if v['category'] == category}

def get_all_categories():
    """Get all job categories"""
    return JOB_CATEGORIES

def calculate_compatibility(resume_skills: list, job_role_id: str, experience_years: int = 0):
    """
    Calculate how well a resume matches a job role
    """
    job_role = get_job_role(job_role_id)
    if not job_role:
        return None
    
    # Normalize skills to lowercase for comparison
    user_skills = set([s.lower() for s in resume_skills])
    required = [s.lower() for s in job_role['requiredSkills']]
    preferred = [s.lower() for s in job_role['preferredSkills']]
    
    # Calculate matches
    matched_required = [s for s in job_role['requiredSkills'] if s.lower() in user_skills]
    missing_required = [s for s in job_role['requiredSkills'] if s.lower() not in user_skills]
    matched_preferred = [s for s in job_role['preferredSkills'] if s.lower() in user_skills]
    missing_preferred = [s for s in job_role['preferredSkills'] if s.lower() not in user_skills]
    
    # Calculate score (70% required, 30% preferred)
    required_score = (len(matched_required) / len(required)) * 70 if required else 0
    preferred_score = (len(matched_preferred) / len(preferred)) * 30 if preferred else 0
    total_score = round(required_score + preferred_score)
    
    return {
        'score': total_score,
        'matchedRequired': matched_required,
        'missingRequired': missing_required,
        'matchedPreferred': matched_preferred,
        'missingPreferred': missing_preferred,
        'totalRequired': len(required),
        'totalPreferred': len(preferred),
        'category': job_role['category']
    }