"""
Progress Report Pipeline
Uses an iterative Claude draft → review loop to generate professional
tutor comments based on real student mark data passed from the React frontend.

AgentFlow pattern: iterative cycle with success_criteria.
Draft runs, review checks quality, loops back if not approved (max 3 iterations).
"""

import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def _build_subjects_block(subjects: list[dict]) -> str:
    """Format subject marks into a readable block for the prompt."""
    lines = []
    for s in subjects:
        marks_detail = ", ".join(
            f"{mark_type}: {value}%"
            for mark_type, value in s.get("marks", {}).items()
            if value not in (None, "", "0", 0)
        )
        avg = s.get("average", "N/A")
        line = f"  - {s['name']}: Average {avg}%"
        if marks_detail:
            line += f" ({marks_detail})"
        lines.append(line)
    return "\n".join(lines) if lines else "  No subject data provided."


def _draft_comments(student: dict, subjects_block: str) -> str:
    """Step 1: Draft the progress report comments."""
    prompt = f"""You are a professional private tutor writing a progress report comment for a parent.

Student Profile:
- Name: {student['name']}
- Grade: {student['grade']}
- School: {student.get('school', 'Not specified')}
- Term: {student['term']}

Academic Performance:
{subjects_block}

Write a warm, professional progress report comment (3-4 paragraphs) that:
1. Opens with a genuine, specific observation about this student (not generic praise)
2. Discusses each subject honestly — acknowledge strong performance, address weaker areas constructively
3. Identifies a clear strength and one area to focus on next term
4. Closes with encouragement and a concrete next step

Rules:
- Reference actual subject names and approximate mark ranges
- Do NOT use hollow phrases like "a pleasure to teach" or "keep up the good work"
- Tone: warm but professional, like a trusted tutor speaking to a parent
- Length: 3-4 focused paragraphs, no bullet points
- Write in third person (e.g. "John has shown...")

Write only the comment text, nothing else."""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text.strip()


def _review_comments(draft: str, student_name: str) -> tuple[bool, str]:
    """
    Step 2: Review the draft for quality.
    Returns (approved: bool, feedback_or_approved_text: str)
    """
    prompt = f"""You are reviewing a tutor progress report comment for quality before it goes to a parent.

Student: {student_name}

Draft comment:
---
{draft}
---

Check all of the following:
1. SPECIFIC — Does it reference actual subjects by name? (not just "all subjects")
2. HONEST — Does it acknowledge weaker areas without being discouraging?
3. WARM — Is it personal and caring, not cold or clinical?
4. ACTIONABLE — Does it include a concrete next step or focus area?
5. APPROPRIATE LENGTH — Is it 3-4 paragraphs? (not too short, not excessive)

If ALL five checks pass, respond with exactly: APPROVED

If any check fails, respond with: REVISION NEEDED
Then list each failed check and the specific improvement required.
Do not rewrite the comment — only give feedback."""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )
    review_text = response.content[0].text.strip()
    approved = "APPROVED" in review_text
    return approved, review_text


def _revise_comments(draft: str, feedback: str, student: dict, subjects_block: str) -> str:
    """Step 3 (if needed): Revise based on review feedback."""
    prompt = f"""You are a professional tutor revising a progress report comment based on reviewer feedback.

Student: {student['name']} | Grade: {student['grade']} | Term: {student['term']}

Academic Performance:
{subjects_block}

Previous draft:
---
{draft}
---

Reviewer feedback:
---
{feedback}
---

Rewrite the comment addressing all feedback points. Keep what was good, fix what was flagged.
Rules: 3-4 paragraphs, third person, warm but professional, specific to this student's actual marks.
Write only the revised comment text, nothing else."""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text.strip()


def generate_progress_comments(student_data: dict, max_iterations: int = 3) -> dict:
    """
    Main pipeline: Draft → Review → Revise loop (AgentFlow iterative cycle pattern).

    Args:
        student_data: {
            name, grade, school, term,
            subjects: [{ name, marks: {markType: value}, average }]
        }
        max_iterations: Maximum draft/review cycles before accepting best draft

    Returns:
        { comments: str, iterations: int, approved: bool }
    """
    subjects_block = _build_subjects_block(student_data.get("subjects", []))

    draft = _draft_comments(student_data, subjects_block)
    iterations = 1
    approved = False
    feedback = ""

    for i in range(max_iterations):
        approved, feedback = _review_comments(draft, student_data["name"])

        if approved:
            break

        if i < max_iterations - 1:
            draft = _revise_comments(draft, feedback, student_data, subjects_block)
            iterations += 1

    return {
        "comments": draft,
        "iterations": iterations,
        "approved": approved,
    }
