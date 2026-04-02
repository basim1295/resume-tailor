import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are an expert resume writer specialising in Australian tech industry applications (ML Engineer, Data Engineer, MLOps, AI Engineer roles).

Your job is to tailor a candidate's resume to a specific job description and output ONLY a complete LaTeX document using Jake's Resume template style.

STRICT RULES — never violate these:
1. Never invent, fabricate, or exaggerate experience not present in the resume
2. Only rewrite/rephrase existing bullets to use JD-relevant terminology where truthful
3. Prioritise and surface the most JD-relevant experience — reorder bullets within each role
4. Mirror the JD's exact terminology for tools, frameworks, and skills WHERE the candidate has that experience
5. Do not add skills to the Skills section that are not evidenced anywhere in the resume
6. The resume must remain truthful and pass a human recruiter review
7. Output ONLY raw LaTeX — no markdown, no explanation, no code fences

Use exactly Jake's Resume LaTeX structure with these sections in order:
Header → Technical Skills → Experience → Education → Research → Projects → Leadership → Certifications

After the LaTeX block, on a new line write exactly:
GAP_ANALYSIS_START
Then list each required skill/qualification from the JD that has NO evidence in the resume, one per line.
GAP_ANALYSIS_END"""

def tailor_resume(resume_text: str, jd_text: str) -> dict:
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    user_prompt = f"""RESUME:
{resume_text[:8000]}

JOB DESCRIPTION:
{jd_text[:4000]}

Produce the tailored LaTeX resume followed by the gap analysis as instructed."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}]
    )

    full_text = message.content[0].text

    # Split LaTeX and gap analysis
    latex = full_text
    gaps = []

    gap_start = full_text.find("GAP_ANALYSIS_START")
    if gap_start != -1:
        latex = full_text[:gap_start].strip()
        gap_end = full_text.find("GAP_ANALYSIS_END")
        gap_block = full_text[gap_start + 18: gap_end if gap_end != -1 else None].strip()
        gaps = [line.strip() for line in gap_block.split("\n") if line.strip()]

    return {"latex": latex, "gaps": gaps}