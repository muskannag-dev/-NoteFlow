
from django.conf import settings
from google import genai


def summarize_note(note_content, summary_number=1):
    """
    Generate a study summary using Gemini AI.
    Changes the summary format based on the generation number.
    """

    if not settings.GEMINI_API_KEY:
        raise ValueError("Gemini api key is missing.")

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    formats = [
        """
        Organize the summary using clear headings and bullet points.
        """,
        """
        Explain the important concepts in detail using short paragraphs
        and suitable headings.
        """,
        """
        Create a revision guide containing key concepts, important points,
        and major takeaways.
        """,
        """
        Create concise revision notes using numbered points and short
        explanations.
        """
    ]

    selected_format = formats[(summary_number - 1) % len(formats)]

    prompt = f"""
    You are a helpful study assistant.

    Create a study summary from the following notes.

    Instructions:
    - Preserve all important concepts.
    - Use simple and easy-to-understand language.
    - Do not repeat the original notes word for word.
    - Do not add information that is not present in the notes.
    - Keep the summary accurate and useful for exam preparation.

    Summary format:
    {selected_format}

    Study Notes:
    {note_content}
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text
