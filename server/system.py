system_prompt = """
Please generate a JSON response for the input text which should contain  each category of issue detected (spelling, grammar, punctuation, tone, logic). 

You also can return the following words in the Category section.
"inappropriate"
"no_issue"
"cannot_understand"
"invalid_input"
"not_in_english"
"empty_content"
"lack_information"

Each section should include:

- Index(index): The index of the issue in the input text.
- Category(category): The type of issue detected ['spelling', 'grammar', 'punctuation', 'tone', 'logic']
- Problem Sentence(problem_sentence): The sentence that contains the issue.
- Incorrect(incorrect): The incorrect text that needs to be replaced.
- Fix(fix): The suggested replacement for the incorrect text.
- Reason(reason): An explanation for why the replacement is suggested and what grammar issue is involved in markdown format.

"""

user_guide_prompt1 = """
Here is a example response for you to learn. You do not need to consider anything in this section.


Hello John, 

I hope your doing well. I wanted to check if your interested in coming to my party this weekend. Their will be food, drinks, and good music, so it should be a lot of fun.

Please let me know if you can come, or if there's anything else you need to know.

Best regards,
Sarah
"""

assistant_guide_feedback1_depressed = """
[
    {
      "index": 0,
      "category": "spelling",
      "problem_sentence": "Hello John, I hope your doing well.",
      "incorrect": "your",
      "fix": "you're",
      "reason": "Correcting a common *spelling error*; 'your' should be replaced with 'you're'."
    },
    {
      "index": 1,
      "category": "spelling",
      "problem_sentence": "Hello John, I hope your doing well.",
      "incorrect": "doing",
      "fix": "doing well",
      "reason": "Suggesting a more complete phrase to replace the incomplete phrase 'doing'."
    },
    {
      "index": 2,
      "category": "grammar",
      "problem_sentence": "Their will be food, drinks, and good music, so it should be a lot of fun.",
      "incorrect": "their",
      "fix": "there",
      "reason": "Correcting a common homophone error; 'their' should be replaced with 'there'."
    },
    {
      "index": 3,
      "category": "grammar",
      "problem_sentence": "Their will be food, drinks, and good music, so it should be a lot of fun.",
      "incorrect": "should",
      "fix": "will",
      "reason": "Correcting an incorrect use of modal verb; 'should' should be replaced with 'will'."
    },
    {
      "index": 4,
      "category": "punctuation",
      "problem_sentence": "Please let me know if you can come, or if there's anything else you need to know.",
      "incorrect": ",",
      "fix": ".",
      "reason": "Correcting a punctuation error; ',' should be replaced with '.' to end the sentence."
    },
    {
      "index": 5,
      "category": "tone",
      "problem_sentence": "Please let me know if you can come, or if there's anything else you need to know.",
      "incorrect": ",",
      "fix": "",
      "reason": "Suggesting the removal of a comma to improve the tone of the message."
    },
    {
      "index": 6,
      "category": "logic",
      "problem_sentence": "Please let me know if you can come, or if there's anything else you need to know.",
      "incorrect": "anything else you need to know",
      "fix": "if there is anything else you need to know",
      "reason": "Suggesting a more clear and concise phrase to replace the wordy and unclear phrase 'anything else you need to know'."
    }
]
"""
assistant_guide_feedback1 = """[{"index":0,"category":"spelling","problem_sentence":"Hello John, I hope your doing well.","incorrect":"your","fix":"you're","reason":"Correcting a common *spelling error*; 'your' should be replaced with 'you're'."},{"index":1,"category":"spelling","problem_sentence":"Hello John, I hope your doing well.","incorrect":"doing","fix":"doing well","reason":"Suggesting a more complete phrase to replace the incomplete phrase 'doing'."},{"index":2,"category":"grammar","problem_sentence":"Their will be food, drinks, and good music, so it should be a lot of fun.","incorrect":"their","fix":"there","reason":"Correcting a common homophone error; 'their' should be replaced with 'there'."},{"index":3,"category":"grammar","problem_sentence":"Their will be food, drinks, and good music, so it should be a lot of fun.","incorrect":"should","fix":"will","reason":"Correcting an incorrect use of modal verb; 'should' should be replaced with 'will'."},{"index":4,"category":"punctuation","problem_sentence":"Please let me know if you can come, or if there's anything else you need to know.","incorrect":",","fix":".","reason":"Correcting a punctuation error; ',' should be replaced with '.' to end the sentence."},{"index":5,"category":"tone","problem_sentence":"Please let me know if you can come, or if there's anything else you need to know.","incorrect":",","fix":"","reason":"Suggesting the removal of a comma to improve the tone of the message."},{"index":6,"category":"logic","problem_sentence":"Please let me know if you can come, or if there's anything else you need to know.","incorrect":"anything else you need to know","fix":"if there is anything else you need to know","reason":"Suggesting a more clear and concise phrase to replace the wordy and unclear phrase 'anything else you need to know'."}]"""

user_guidance = """
Everything inside the $&$&$&$ is the user input. 
$&$&$&$

"""

user_end = """
$&$&$&$
"""


def get_user_guidance(input_text):
    return user_guidance + input_text + user_end


def get_feedback_system(issue):
    return f"""You are a grammar assistant for the user, and you have been given this issue,
{issue}
in the following text:
------------
{issue['problem_sentence']}
------------
Please answer the user's question about the feedback that you have given them.
You will not ask any questions about the content of the text, only just respond to the user's question.
"""
