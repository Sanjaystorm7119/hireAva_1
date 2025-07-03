import {
  Box,
  BriefcaseBusiness,
  Calendar,
  Code2Icon,
  Component,
  LayoutDashboard,
  List,
  PersonStanding,
  Puzzle,
  Settings,
  Square,
  SquareArrowOutUpRight,
  User2,
  User2Icon,
} from "lucide-react";

export const SidebarOptions = [
  {
    name: "DashBaord",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduledinterview",
  },
  {
    name: "All Interviews",
    icon: List,
    path: "/allinterviews",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewTypes = [
  {
    title: "technical",
    icons: Code2Icon,
  },
  {
    title: "Behavioral",
    icons: User2Icon,
  },
  {
    title: "Experience",
    icons: BriefcaseBusiness,
  },
  {
    title: "Problem Solving",
    icons: Puzzle,
  },
  {
    title: "Leadership",
    icons: Component,
  },
];

export const QUESTIONS_PROMPT = `You are an expert AI interviewer. Based on the following job input
and generate ** diverse interview questions** ({{duration}} minutes duration = {{duration}}*1 questions) in JSON format with array list of questions.

## Follow the below steps to generate the questions

step 1:

**Job Input Details:**
- Job Title: {{jobTitle}}
- job description: {{jobDescription}}
- Interview duration: {{duration}} minutes
- Interview Type: {{type}}
- Total Questions Required: {{duration}}*2 questions
---
step 2:

Analyse the jobdescription

**Output Guidelines:**
- Format output as JSON format with array list of questions.
- Generate exactly {{duration}}*2 questions (e.g., 5 minutes = 10 questions, 15 minutes = 30 questions)
**format :interviewQuestions=[
{
question:'',
type:'Technical/Behavioral/Experience/Problem Solving/Leadership'
}
]
- Only return the JSON (no extra text)
- Do not include answers

---

**Examples of question types to include:**
- Conceptual
- Practical
- Code analysis
- Debugging
- Best practices
- Performance
- Advanced cases
- Comparisons
- Common mistakes
- Design/system thinking

---
Return only valid JSON.
#The goal is to create a structured, relevant and time-optimized interview plan for a {{jobTitle}} role with {{duration}}*2 questions`;
